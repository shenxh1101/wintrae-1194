import React, { useState, useMemo } from 'react';
import { View, Text, Image, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { useFoodStore } from '@/store/useFoodStore';
import { Order } from '@/types/food';
import EmptyState from '@/components/EmptyState';

const OrdersPage: React.FC = () => {
  const { orders } = useFoodStore();
  const [activeTab, setActiveTab] = useState<'all' | 'reserved' | 'picked'>('all');

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

  const handleContact = (order: Order) => {
    Taro.showModal({
      title: '联系发布者',
      content: `是否拨打 ${order.publisherName} 的电话？`,
      success: (res) => {
        if (res.confirm) {
          console.log('[Orders] 拨打电话', order.publisherName);
          Taro.showToast({
            title: '正在拨打...',
            icon: 'none'
          });
        }
      }
    });
  };

  const handleShowCode = (order: Order) => {
    console.log('[Orders] 显示领取码', order.pickupCode);
    Taro.showModal({
      title: '领取码',
      content: `请向发布者出示领取码：${order.pickupCode}`,
      showCancel: false
    });
  };

  const handleCancelOrder = (orderId: string) => {
    Taro.showModal({
      title: '取消领取',
      content: '确定要取消本次领取吗？',
      success: (res) => {
        if (res.confirm) {
          console.log('[Orders] 取消订单', orderId);
          Taro.showToast({
            title: '已取消',
            icon: 'success'
          });
        }
      }
    });
  };

  const handleReview = (orderId: string) => {
    console.log('[Orders] 去评价', orderId);
    Taro.navigateTo({
      url: '/pages/reviews/index'
    });
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
                <View className={styles.pickupCodeSection}>
                  <Text className={styles.pickupCodeTitle}>领取码</Text>
                  <Text className={styles.pickupCode}>{order.pickupCode}</Text>
                  <Text className={styles.pickupCodeTip}>
                    向发布者出示此领取码核销
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
                      className={classnames(styles.actionBtn, styles.btnPrimary)}
                      onClick={() => handleContact(order)}
                    >
                      联系发布者
                    </Button>
                  </>
                )}
                {order.status === 'picked' && (
                  <>
                    <Button
                      className={classnames(styles.actionBtn, styles.btnSecondary)}
                      onClick={() => handleContact(order)}
                    >
                      再次联系
                    </Button>
                    <Button
                      className={classnames(styles.actionBtn, styles.btnPrimary)}
                      onClick={() => handleReview(order.id)}
                    >
                      去评价
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
    </View>
  );
};

export default OrdersPage;
