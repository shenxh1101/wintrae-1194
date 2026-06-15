import React from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { useFoodStore } from '@/store/useFoodStore';
import FoodCard from '@/components/FoodCard';
import EmptyState from '@/components/EmptyState';

const FavoritesPage: React.FC = () => {
  const { favorites, toggleFavorite } = useFoodStore();

  const handleRemoveFavorite = (foodId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    Taro.showModal({
      title: '取消收藏',
      content: '确定要取消收藏吗？',
      success: (res) => {
        if (res.confirm) {
          toggleFavorite(foodId);
          Taro.showToast({
            title: '已取消收藏',
            icon: 'success'
          });
        }
      }
    });
  };

  return (
    <View className={styles.favoritesPage}>
      {favorites.length > 0 ? (
        favorites.map(food => (
          <View key={food.id} className={styles.favoriteItem}>
            <FoodCard food={food} />
            <View
              className={styles.removeBtn}
              onClick={(e) => handleRemoveFavorite(food.id, e as any)}
            >
              <Text>取消收藏</Text>
            </View>
          </View>
        ))
      ) : (
        <EmptyState
          icon="❤️"
          title="暂无收藏"
          description="看到喜欢的食物，记得点收藏哦"
        />
      )}
    </View>
  );
};

export default FavoritesPage;
