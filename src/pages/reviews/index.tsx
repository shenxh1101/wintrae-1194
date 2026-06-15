import React, { useMemo, useState } from 'react';
import { View, Text, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { useFoodStore } from '@/store/useFoodStore';
import { useUserStore } from '@/store/useUserStore';
import EmptyState from '@/components/EmptyState';

const ReviewsPage: React.FC = () => {
  const { reviews } = useFoodStore();
  const { user } = useUserStore();
  const [activeTab, setActiveTab] = useState<'received' | 'given'>('received');

  const myReviews = useMemo(() => {
    if (activeTab === 'received') {
      return reviews.filter(r => r.targetUserId === user.id);
    } else {
      return reviews.filter(r => r.userId === user.id);
    }
  }, [reviews, user.id, activeTab]);

  const stats = useMemo(() => {
    const relatedReviews = reviews.filter(r => r.targetUserId === user.id || r.userId === user.id);
    const total = relatedReviews.length;
    const avgRating = total > 0
      ? (relatedReviews.reduce((sum, r) => sum + r.rating, 0) / total).toFixed(1)
      : '0.0';
    const fiveStarCount = relatedReviews.filter(r => r.rating === 5).length;
    const fiveStarRate = total > 0 ? Math.round((fiveStarCount / total) * 100) : 0;
    return { total, avgRating, fiveStarCount, fiveStarRate };
  }, [reviews, user.id]);

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Text
          key={i}
          className={classnames(
            styles.star,
            i < rating ? styles.starFilled : styles.starEmpty
          )}
        >
          ★
        </Text>
      );
    }
    return stars;
  };

  const handleReport = (reviewId: string) => {
    Taro.showActionSheet({
      itemList: ['举报此评价', '复制评价内容'],
      success: (res) => {
        if (res.tapIndex === 0) {
          Taro.navigateTo({
            url: `/pages/report/index?targetId=${reviewId}&targetType=review`
          });
        } else if (res.tapIndex === 1) {
          const review = myReviews.find(r => r.id === reviewId);
          if (review) {
            Taro.setClipboardData({
              data: review.content,
              success: () => Taro.showToast({ title: '已复制', icon: 'success' })
            });
          }
        }
      }
    });
  };

  return (
    <View className={styles.reviewsPage}>
      <View className={styles.statsCard}>
        <View className={styles.statsHeader}>
          <Image
            className={styles.statsAvatar}
            src={user.avatar}
            mode="aspectFill"
          />
          <View className={styles.statsInfo}>
            <Text className={styles.statsName}>{user.name}</Text>
            <View className={styles.statsMeta}>
              <Text className={styles.creditBadge}>⭐ {user.creditScore} 信用分</Text>
            </View>
          </View>
        </View>

        <View className={styles.statsMain}>
          <View className={styles.statsAvg}>
            <Text className={styles.avgNumber}>{stats.avgRating}</Text>
            <View className={styles.avgStars}>{renderStars(Math.round(Number(stats.avgRating)))}</View>
          </View>
          <View className={styles.statsDivider} />
          <View className={styles.statsDetail}>
            <View className={styles.statsRow}>
              <Text className={styles.statsLabel}>累计评价</Text>
              <Text className={styles.statsValue}>{stats.total}条</Text>
            </View>
            <View className={styles.statsRow}>
              <Text className={styles.statsLabel}>5星好评</Text>
              <Text className={styles.statsValue}>{stats.fiveStarCount}条</Text>
            </View>
            <View className={styles.statsRow}>
              <Text className={styles.statsLabel}>好评率</Text>
              <Text className={classnames(styles.statsValue, styles.highlight)}>{stats.fiveStarRate}%</Text>
            </View>
          </View>
        </View>
      </View>

      <View className={styles.tabBar}>
        <View
          className={classnames(styles.tabItem, activeTab === 'received' && styles.active)}
          onClick={() => setActiveTab('received')}
        >
          收到的评价
        </View>
        <View
          className={classnames(styles.tabItem, activeTab === 'given' && styles.active)}
          onClick={() => setActiveTab('given')}
        >
          发出的评价
        </View>
      </View>

      <View className={styles.reviewList}>
        {myReviews.length > 0 ? (
          myReviews.map(review => (
            <View key={review.id} className={styles.reviewCard}>
              <View className={styles.reviewHeader}>
                <Image
                  className={styles.userAvatar}
                  src={review.userAvatar}
                  mode="aspectFill"
                />
                <View className={styles.userInfo}>
                  <View className={styles.userRow}>
                    <Text className={styles.userName}>{review.userName}</Text>
                    {activeTab === 'given' && review.userId === user.id && (
                      <Text className={styles.selfBadge}>我</Text>
                    )}
                  </View>
                  <View className={styles.ratingRow}>
                    <View className={styles.rating}>{renderStars(review.rating)}</View>
                    <Text className={styles.ratingText}>
                      {['', '非常差', '比较差', '一般', '比较好', '非常棒'][review.rating]}
                    </Text>
                  </View>
                </View>
              </View>

              <View className={styles.foodInfo}>
                <Text className={styles.foodLabel}>评价食物</Text>
                <Text className={styles.foodName}>{review.foodTitle}</Text>
              </View>

              <Text className={styles.reviewContent}>{review.content}</Text>

              <View className={styles.reviewFooter}>
                <Text className={styles.reviewTime}>{review.createdAt}</Text>
                <Text
                  className={styles.moreBtn}
                  onClick={() => handleReport(review.id)}
                >
                  ⋯
                </Text>
              </View>
            </View>
          ))
        ) : (
          <EmptyState
            icon="⭐"
            title={activeTab === 'received' ? '暂无收到的评价' : '暂无发出的评价'}
            description={
              activeTab === 'received'
                ? '完成更多分享后，这里会显示邻居对你的评价'
                : '去评价页面给你的领取体验打个分吧'
            }
          />
        )}
      </View>
    </View>
  );
};

export default ReviewsPage;
