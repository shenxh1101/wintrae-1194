import React from 'react';
import { View, Text, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { FoodItem } from '@/types/food';
import { categories } from '@/data/mockFoods';

interface FoodCardProps {
  food: FoodItem;
  onClick?: () => void;
}

const FoodCard: React.FC<FoodCardProps> = ({ food, onClick }) => {
  const category = categories.find(c => c.id === food.category);

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      Taro.navigateTo({
        url: `/pages/detail/index?id=${food.id}`
      });
    }
  };

  const getRemainingPercent = () => {
    if (food.quantity === 0) return 0;
    return (food.remaining / food.quantity) * 100;
  };

  const getRemainingStatus = () => {
    const percent = getRemainingPercent();
    if (percent <= 20) return 'urgent';
    if (percent <= 50) return 'low';
    return 'normal';
  };

  const status = getRemainingStatus();

  return (
    <View
      className={styles.foodCard}
      onClick={handleClick}
    >
      <View className={styles.imageWrap}>
        <Image
          className={styles.foodImage}
          src={food.images[0]}
          mode="aspectFill"
        />
        <View className={styles.distanceBadge}>
          <Text className={styles.distanceText}>📍 {food.distance}km</Text>
        </View>
        {food.allergens.length > 0 && (
          <View className={styles.allergenBadge}>
            <Text className={styles.allergenText}>⚠️ 含过敏原</Text>
          </View>
        )}
      </View>

      <View className={styles.content}>
        <View className={styles.header}>
          <Text className={styles.title}>{food.title}</Text>
          {category && (
            <View className={styles.categoryTag}>
              <Text className={styles.categoryText}>{category.icon} {category.name}</Text>
            </View>
          )}
        </View>

        <Text className={styles.description}>{food.description}</Text>

        <View className={styles.publisherRow}>
          <Image
            className={styles.avatar}
            src={food.publisher.avatar}
            mode="aspectFill"
          />
          <Text className={styles.publisherName}>{food.publisher.name}</Text>
          <View
            className={classnames(
              styles.publisherType,
              food.publisher.type === 'merchant' && styles.merchantType
            )}
          >
            <Text className={styles.typeText}>
              {food.publisher.type === 'merchant' ? '商户' : '住户'}
            </Text>
          </View>
          <View className={styles.creditScore}>
            <Text className={styles.creditText}>⭐ {food.publisher.creditScore}</Text>
          </View>
        </View>

        <View className={styles.footer}>
          <View className={styles.remainingInfo}>
            <View className={styles.remainingBar}>
              <View
                className={classnames(
                  styles.remainingProgress,
                  styles[`progress-${status}`]
                )}
                style={{ width: `${getRemainingPercent()}%` }}
              />
            </View>
            <Text
              className={classnames(
                styles.remainingText,
                styles[`text-${status}`]
              )}
            >
              剩余 {food.remaining}/{food.quantity} {food.unit}
            </Text>
          </View>

          <View className={styles.pickupTime}>
            <Text className={styles.timeText}>🕐 {food.pickupStartTime}-{food.pickupEndTime}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default FoodCard;
