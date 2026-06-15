import React, { useState, useMemo } from 'react';
import { View, Text, Image, Button } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { useFoodStore } from '@/store/useFoodStore';
import EmptyState from '@/components/EmptyState';

const DetailPage: React.FC = () => {
  const router = useRouter();
  const { foods, toggleFavorite, createOrder, favorites } = useFoodStore();
  const [quantity, setQuantity] = useState(1);

  const foodId = router.params.id;

  const food = useMemo(() => {
    return foods.find(f => f.id === foodId);
  }, [foods, foodId]);

  const isFavorite = useMemo(() => {
    return favorites.some(f => f.id === foodId);
  }, [favorites, foodId]);

  if (!food) {
    return (
      <View className={styles.detailPage}>
        <EmptyState
          icon="🍽️"
          title="食物不存在"
          description="该食物可能已被删除或过期"
        />
      </View>
    );
  }

  const handleToggleFavorite = () => {
    toggleFavorite(food.id);
    Taro.showToast({
      title: isFavorite ? '已取消收藏' : '已收藏',
      icon: 'success'
    });
  };

  const handleContact = () => {
    Taro.showModal({
      title: '联系发布者',
      content: `是否拨打 ${food.publisher.name} 的电话？`,
      success: (res) => {
        if (res.confirm) {
          console.log('[Detail] 拨打电话', food.publisher.phone);
          Taro.showToast({
            title: '正在拨打...',
            icon: 'none'
          });
        }
      }
    });
  };

  const handleClaim = () => {
    if (food.remaining < quantity) {
      Taro.showToast({
        title: '剩余数量不足',
        icon: 'none'
      });
      return;
    }

    Taro.showModal({
      title: '确认领取',
      content: `确定要领取 ${quantity} ${food.unit} ${food.title} 吗？`,
      success: (res) => {
        if (res.confirm) {
          const order = createOrder(food.id, quantity);
          if (order) {
            console.log('[Detail] 领取成功', order);
            Taro.showModal({
              title: '领取成功',
              content: `领取码：${order.pickupCode}\n请在领取时段内向发布者出示此码`,
              showCancel: false,
              confirmText: '查看订单',
              success: () => {
                Taro.switchTab({
                  url: '/pages/orders/index'
                });
              }
            });
          } else {
            Taro.showToast({
              title: '领取失败',
              icon: 'error'
            });
          }
        }
      }
    });
  };

  const handleReport = () => {
    Taro.navigateTo({
      url: `/pages/report/index?targetId=${food.id}&targetType=food`
    });
  };

  return (
    <View className={styles.detailPage}>
      <View className={styles.imageSection}>
        <Image
          className={styles.mainImage}
          src={food.images[0]}
          mode="aspectFill"
        />
        <View className={styles.favoriteBtn} onClick={handleToggleFavorite}>
          {isFavorite ? '❤️' : '🤍'}
        </View>
      </View>

      <View className={styles.content}>
        <View className={styles.infoCard}>
          <Text className={styles.title}>{food.title}</Text>

          <View className={styles.metaRow}>
            <View className={classnames(styles.metaTag, styles.tagPrimary)}>
              🏷️ 分类
            </View>
            <View className={classnames(styles.metaTag, styles.tagWarning)}>
              ⏰ {food.expireTime} 到期
            </View>
            {food.allergens.length > 0 && (
              <View className={classnames(styles.metaTag, styles.tagError)}>
                ⚠️ 含过敏原
              </View>
            )}
          </View>

          <View className={styles.remainingSection}>
            <Text className={styles.remainingText}>剩余可领取</Text>
            <Text className={styles.remainingNumber}>
              {food.remaining}/{food.quantity} {food.unit}
            </Text>
          </View>

          <Text className={styles.description}>{food.description}</Text>
        </View>

        <View className={styles.infoCard}>
          <Text className={styles.sectionTitle}>
            <Text className={styles.sectionIcon}>👤</Text>
            发布者信息
          </Text>
          <View className={styles.publisherInfo}>
            <Image
              className={styles.publisherAvatar}
              src={food.publisher.avatar}
              mode="aspectFill"
            />
            <View className={styles.publisherDetail}>
              <Text className={styles.publisherName}>{food.publisher.name}</Text>
              <View className={styles.publisherMeta}>
                <Text className={styles.metaItem}>
                  {food.publisher.type === 'merchant' ? '🏪 商户' : '🏠 住户'}
                </Text>
                <Text className={styles.metaItem}>⭐ {food.publisher.creditScore} 信用分</Text>
              </View>
            </View>
          </View>
        </View>

        <View className={styles.infoCard}>
          <Text className={styles.sectionTitle}>
            <Text className={styles.sectionIcon}>📍</Text>
            领取信息
          </Text>
          <View className={styles.infoRow}>
            <Text className={styles.infoLabel}>领取地点</Text>
            <Text className={styles.infoValue}>{food.location.address}</Text>
          </View>
          <View className={styles.infoRow}>
            <Text className={styles.infoLabel}>领取时间</Text>
            <Text className={styles.infoValue}>
              每日 {food.pickupStartTime} - {food.pickupEndTime}
            </Text>
          </View>
          <View className={styles.infoRow}>
            <Text className={styles.infoLabel}>过期时间</Text>
            <Text className={styles.infoValue}>{food.expireTime}</Text>
          </View>
        </View>

        {food.allergens.length > 0 && (
          <View className={styles.infoCard}>
            <Text className={styles.sectionTitle}>
              <Text className={styles.sectionIcon}>⚠️</Text>
              过敏原提示
            </Text>
            <View className={styles.allergenList}>
              {food.allergens.map((allergen, index) => (
                <View key={index} className={styles.allergenTag}>
                  {allergen}
                </View>
              ))}
            </View>
          </View>
        )}

        <View className={styles.infoCard} onClick={handleReport}>
          <Text className={styles.sectionTitle}>
            <Text className={styles.sectionIcon}>📢</Text>
            违规举报
            <Text style={{ marginLeft: 'auto', fontSize: '24rpx', color: '#86909C' }}>›</Text>
          </Text>
        </View>
      </View>

      <View className={styles.bottomBar}>
        <Button className={styles.btnSecondary} onClick={handleContact}>
          📞 联系
        </Button>
        <Button
          className={classnames(
            styles.btnPrimary,
            food.remaining <= 0 && styles.disabled
          )}
          onClick={handleClaim}
          disabled={food.remaining <= 0}
        >
          {food.remaining > 0 ? '立即领取' : '已领完'}
        </Button>
      </View>
    </View>
  );
};

export default DetailPage;
