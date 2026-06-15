import React, { useState, useMemo } from 'react';
import { View, Text, Image, Button, Textarea } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { useFoodStore } from '@/store/useFoodStore';
import { useUserStore } from '@/store/useUserStore';
import { Order } from '@/types/food';
import EmptyState from '@/components/EmptyState';

const OrdersPage: React.FC = () => {
  const { orders, cancelOrder, verifyPickup, addReview } = useFoodStore();
  const { user, updateUser } = useUserStore();
  const [activeTab, setActiveTab] = useState<'all' | 'reserved' | 'picked'>('all');

  const [reviewModal, setReviewModal] = useState<{ order: Order; targetUserId: string } | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewContent, setReviewContent] = useState('');

  const tabs = [
    { key: 'all', label: '全部' },
    { key: 'reserved', label: '待领取' },
    { key: 'picked', label: '已完成' }
  ];

  const filteredOrders = useMemo(() => {
    if (activeTab === 'all') return orders;
    return orders.filter(o => {
      if (activeTab === 'reserved') return o.status === 'reserved';
      if (activeTab === 'picked') return o.status === 'picked' || o.status === 'cancelled' || o.status === 'expired';
      return true;
    });
  }, [orders, activeTab]);

  const getStatusLabel = (status: Order['status']) => {
    const map = {
      reserved: '待领取',
      picked: '已领取',
      cancelled: '已取消',
      expired: '已过期'
    };
    return map[status];
  };

  const getStatusClass = (status: Order['status']) => {
    const map = {
      reserved: styles.statusReserved,
      picked: styles.statusPicked,
      cancelled: styles.statusCancelled,
      expired: styles.statusExpired
    };
    return map[status];
  };

  const formatPhone = (phone: string) => {
    if (phone.length === 11) {
      return phone.slice(0, 3) + '-' + phone.slice(3, 7) + '-' + phone.slice(7);
    }
    return phone;
  };

  const handleContact = (order: Order) => {
    Taro.showActionSheet({
      itemList: [
        `拨打电话：${formatPhone(order.publisherPhone)}`,
        `复制号码：${order.publisherPhone}`
      ],
      success: (res) => {
        if (res.tapIndex === 0) {
          Taro.makePhoneCall({
            phoneNumber: order.publisherPhone,
            fail: () => {
              Taro.showModal({
                title: '联系方式',
                content: `发布者电话：${order.publisherPhone}\n\n请手动拨打此号码联系发布者。`,
                showCancel: false,
                confirmText: '我知道了'
              });
            }
          });
        } else if (res.tapIndex === 1) {
          Taro.setClipboardData({
            data: order.publisherPhone,
            success: () => {
              Taro.showToast({ title: '号码已复制', icon: 'success' });
            }
          });
        }
      }
    });
  };

  const handleShowCode = (order: Order) => {
    Taro.showModal({
      title: '领取码',
      content: `请向发布者出示领取码：\n\n【${order.pickupCode}】\n\n或点击下方确认按钮完成核销。`,
      confirmText: '确认核销',
      cancelText: '知道了',
      success: (res) => {
        if (res.confirm) {
          handleVerify(order.id);
        }
      }
    });
  };

  const handleVerify = (orderId: string) => {
    Taro.showLoading({ title: '核销中...' });
    setTimeout(() => {
      Taro.hideLoading();
      const success = verifyPickup(orderId);
      if (success) {
        Taro.showToast({ title: '核销成功', icon: 'success' });
        const newClaimCount = user.claimCount + 1;
        updateUser({ claimCount: newClaimCount });
      } else {
        Taro.showToast({ title: '核销失败', icon: 'error' });
      }
    }, 500);
  };

  const handleCancelOrder = (orderId: string) => {
    Taro.showModal({
      title: '取消领取',
      content: '确定要取消本次领取吗？取消后份数将退回。',
      success: (res) => {
        if (res.confirm) {
          const success = cancelOrder(orderId);
          if (success) {
            Taro.showToast({ title: '已取消', icon: 'success' });
          } else {
            Taro.showToast({ title: '取消失败', icon: 'error' });
          }
        }
      }
    });
  };

  const handleOpenReview = (order: Order) => {
    const foods = useFoodStore.getState().foods;
    const food = foods.find(f => f.id === order.foodId);
    const targetUserId = food?.publisher.id || 'u1';

    setReviewModal({ order, targetUserId });
    setReviewRating(5);
    setReviewContent('');
  };

  const handleSubmitReview = () => {
    if (!reviewModal) return;
    if (!reviewContent.trim()) {
      Taro.showToast({ title: '请填写评价内容', icon: 'none' });
      return;
    }

    const result = addReview(
      {
        orderId: reviewModal.order.id,
        foodId: reviewModal.order.foodId,
        foodTitle: reviewModal.order.foodTitle,
        rating: reviewRating,
        content: reviewContent,
        targetUserId: reviewModal.targetUserId
      },
      user
    );

    if (result) {
      const newReviewCount = user.reviewCount + 1;
      const newTotalRating = user.totalRating + reviewRating;
      const avgRating = newTotalRating / newReviewCount;
      const newCreditScore = Math.min(100, Math.round(90 + avgRating * 2));
      updateUser({
        reviewCount: newReviewCount,
        totalRating: newTotalRating,
        creditScore: newCreditScore
      });

      Taro.showToast({ title: '评价成功', icon: 'success' });
      setReviewModal(null);
    } else {
      Taro.showToast({ title: '评价失败', icon: 'error' });
    }
  };

  const renderStars = (rating: number, interactive = false) => {
    return (
      <View className={styles.starRow}>
        {[1, 2, 3, 4, 5].map(i => (
          <Text
            key={i}
            className={classnames(styles.star, i <= rating ? styles.starFilled : styles.starEmpty)}
            onClick={interactive ? () => setReviewRating(i) : undefined}
          >
            ★
          </Text>
        ))}
      </View>
    );
  };

  return (
    <View className={styles.ordersPage}>
      <View className={styles.tabBar}>
        {tabs.map(tab => (
          <View
            key={tab.key}
            className={classnames(
              styles.tabItem,
              activeTab === tab.key && styles.active
            )}
            onClick={() => setActiveTab(tab.key as typeof activeTab)}
          >
            {tab.label}
          </View>
        ))}
      </View>

      <View className={styles.orderList}>
        {filteredOrders.length > 0 ? (
          filteredOrders.map(order => (
            <View key={order.id} className={styles.orderCard}>
              <View className={styles.orderHeader}>
                <View
                  className={classnames(
                    styles.orderStatus,
                    getStatusClass(order.status)
                  )}
                >
                  {getStatusLabel(order.status)}
                </View>
                <Text className={styles.orderTime}>{order.createdAt}</Text>
              </View>

              <View className={styles.orderContent}>
                <Image
                  className={styles.foodImage}
                  src={order.foodImage}
                  mode="aspectFill"
                />
                <View className={styles.orderInfo}>
                  <Text className={styles.foodTitle}>{order.foodTitle}</Text>
                  <Text className={styles.orderQuantity}>
                    数量：{order.quantity} 份
                  </Text>
                  <View className={styles.publisherInfo}>
                    <Image
                      className={styles.publisherAvatar}
                      src={order.publisherAvatar}
                      mode="aspectFill"
                    />
                    <Text className={styles.publisherName}>
                      {order.publisherName}
                    </Text>
                    <Text className={styles.publisherPhone}>
                      📞 {formatPhone(order.publisherPhone)}
                    </Text>
                  </View>
                </View>
              </View>

              <View className={styles.pickupInfo}>
                <View className={styles.pickupRow}>
                  <Text className={styles.pickupLabel}>📍 地址</Text>
                  <Text className={styles.pickupValue}>{order.pickupAddress}</Text>
                </View>
                <View className={styles.pickupRow}>
                  <Text className={styles.pickupLabel}>🕐 时间</Text>
                  <Text className={styles.pickupValue}>
                    {order.pickupStartTime} - {order.pickupEndTime}
                  </Text>
                </View>
              </View>

              {order.status === 'reserved' && (
                <View className={styles.pickupCodeSection} onClick={() => handleShowCode(order)}>
                  <Text className={styles.pickupCodeTitle}>领取码（点击核销）</Text>
                  <Text className={styles.pickupCode}>{order.pickupCode}</Text>
                  <Text className={styles.pickupCodeTip}>
                    向发布者出示或点击确认核销
                  </Text>
                </View>
              )}

              <View className={styles.orderActions}>
                {order.status === 'reserved' && (
                  <>
                    <Button
                      className={classnames(styles.actionBtn, styles.btnOutline)}
                      onClick={() => handleCancelOrder(order.id)}
                    >
                      取消领取
                    </Button>
                    <Button
                      className={classnames(styles.actionBtn, styles.btnSecondary)}
                      onClick={() => handleContact(order)}
                    >
                      📞 联系
                    </Button>
                    <Button
                      className={classnames(styles.actionBtn, styles.btnPrimary)}
                      onClick={() => handleVerify(order.id)}
                    >
                      确认核销
                    </Button>
                  </>
                )}
                {order.status === 'picked' && (
                  <>
                    <Button
                      className={classnames(styles.actionBtn, styles.btnSecondary)}
                      onClick={() => handleContact(order)}
                    >
                      📞 再次联系
                    </Button>
                    <Button
                      className={classnames(styles.actionBtn, styles.btnPrimary)}
                      onClick={() => handleOpenReview(order)}
                      disabled={order.reviewed}
                    >
                      {order.reviewed ? '已评价' : '去评价'}
                    </Button>
                  </>
                )}
                {(order.status === 'cancelled' || order.status === 'expired') && (
                  <Button
                    className={classnames(styles.actionBtn, styles.btnSecondary)}
                    onClick={() => Taro.switchTab({ url: '/pages/home/index' })}
                  >
                    去看看其他食物
                  </Button>
                )}
              </View>
            </View>
          ))
        ) : (
          <EmptyState
            icon="📦"
            title="暂无领取记录"
            description="快去首页看看有什么好吃的吧"
          />
        )}
      </View>

      {reviewModal && (
        <View className={styles.modalOverlay} onClick={() => setReviewModal(null)}>
          <View className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <View className={styles.modalHeader}>
              <Text className={styles.modalTitle}>
                评价「{reviewModal.order.foodTitle}」
              </Text>
              <Text className={styles.modalClose} onClick={() => setReviewModal(null)}>✕</Text>
            </View>

            <View className={styles.modalBody}>
              <View className={styles.ratingSection}>
                <Text className={styles.ratingLabel}>评分</Text>
                {renderStars(reviewRating, true)}
                <Text className={styles.ratingText}>
                  {['', '非常差', '比较差', '一般般', '比较好', '非常棒'][reviewRating]}
                </Text>
              </View>

              <View className={styles.reviewSection}>
                <Text className={styles.reviewLabel}>评价内容 *</Text>
                <Textarea
                  className={styles.reviewInput}
                  placeholder="分享你的体验和感受..."
                  value={reviewContent}
                  onInput={(e) => setReviewContent(e.detail.value)}
                  maxlength={500}
                />
                <Text className={styles.charCount}>{reviewContent.length}/500</Text>
              </View>
            </View>

            <View className={styles.modalFooter}>
              <Button
                className={classnames(styles.modalBtn, styles.modalBtnSecondary)}
                onClick={() => setReviewModal(null)}
              >
                取消
              </Button>
              <Button
                className={classnames(styles.modalBtn, styles.modalBtnPrimary)}
                onClick={handleSubmitReview}
              >
                提交评价
              </Button>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default OrdersPage;
