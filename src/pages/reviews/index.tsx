import React from 'react';
import { View, Text, Image } from '@tarojs/components';
import styles from './index.module.scss';
import EmptyState from '@/components/EmptyState';

const ReviewsPage: React.FC = () => {
  const mockReviews = [
    {
      id: 'r1',
      userName: '李阿姨',
      userAvatar: 'https://picsum.photos/id/64/200/200',
      rating: 5,
      content: '食物很新鲜，发布人也很热情，下次还会领！',
      foodName: '手工全麦面包',
      time: '2026-06-14 20:30'
    },
    {
      id: 'r2',
      userName: '张奶奶',
      userAvatar: 'https://picsum.photos/id/1027/200/200',
      rating: 4,
      content: '牛奶很新鲜，就是稍微晚了点到。',
      foodName: '鲜牛奶临期特惠',
      time: '2026-06-13 15:00'
    }
  ];

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Text
          key={i}
          className={i < rating ? styles.star : styles.starEmpty}
        >
          ★
        </Text>
      );
    }
    return stars;
  };

  return (
    <View className={styles.reviewsPage}>
      {mockReviews.length > 0 ? (
        mockReviews.map(review => (
          <View key={review.id} className={styles.reviewCard}>
            <View className={styles.reviewHeader}>
              <Image
                className={styles.userAvatar}
                src={review.userAvatar}
                mode="aspectFill"
              />
              <View className={styles.userInfo}>
                <Text className={styles.userName}>{review.userName}</Text>
                <View className={styles.rating}>
                  {renderStars(review.rating)}
                </View>
              </View>
            </View>
            <Text className={styles.reviewContent}>{review.content}</Text>
            <View className={styles.reviewFooter}>
              <Text className={styles.foodName}>{review.foodName}</Text>
              <Text className={styles.reviewTime}>{review.time}</Text>
            </View>
          </View>
        ))
      ) : (
        <EmptyState
          icon="⭐"
          title="暂无评价"
          description="快去领取食物并留下你的评价吧"
        />
      )}
    </View>
  );
};

export default ReviewsPage;
