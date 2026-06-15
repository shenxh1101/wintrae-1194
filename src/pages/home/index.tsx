import React, { useState, useMemo } from 'react';
import { View, Text, Input, ScrollView } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { useFoodStore } from '@/store/useFoodStore';
import { useUserStore } from '@/store/useUserStore';
import FoodCard from '@/components/FoodCard';
import CategoryFilter from '@/components/CategoryFilter';
import EmptyState from '@/components/EmptyState';

const HomePage: React.FC = () => {
  const {
    currentCategory,
    sortBy,
    searchKeyword,
    setCategory,
    setSortBy,
    setSearchKeyword,
    getFilteredFoods
  } = useFoodStore();

  const { user } = useUserStore();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const filteredFoods = useMemo(() => getFilteredFoods(), [currentCategory, sortBy, searchKeyword, getFilteredFoods]);

  useDidShow(() => {
    console.log('[HomePage] 页面显示');
  });

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      Taro.stopPullDownRefresh();
      Taro.showToast({
        title: '刷新成功',
        icon: 'success'
      });
    }, 1000);
  };

  const handlePullDownRefresh = () => {
    handleRefresh();
  };

  const sortOptions = [
    { key: 'distance', label: '距离最近', icon: '📍' },
    { key: 'time', label: '最新发布', icon: '🕐' },
    { key: 'remaining', label: '剩余最多', icon: '📦' }
  ];

  const totalFoods = filteredFoods.length;
  const totalRemaining = filteredFoods.reduce((sum, f) => sum + f.remaining, 0);
  const merchantsCount = new Set(filteredFoods.map(f => f.publisher.id)).size;

  return (
    <View className={styles.homePage}>
      <View className={styles.header}>
        <View className={styles.locationBar} onClick={handleRefresh}>
          <Text className={styles.locationIcon}>📍</Text>
          <Text className={styles.locationText}>{user.community}</Text>
          <Text className={styles.refreshIcon}>🔄</Text>
        </View>

        <View className={styles.searchBar}>
          <Text className={styles.searchIcon}>🔍</Text>
          <Input
            className={styles.searchInput}
            placeholder="搜索食物名称或描述..."
            placeholderClass="search-placeholder"
            value={searchKeyword}
            onInput={(e) => setSearchKeyword(e.detail.value)}
            confirmType="search"
          />
        </View>
      </View>

      <View className={styles.filterBar}>
        <Text className={styles.filterTitle}>分类筛选</Text>
      </View>

      <View style={{ padding: '0 32rpx' }}>
        <CategoryFilter
          currentCategory={currentCategory}
          onChange={setCategory}
        />
      </View>

      <View className={styles.filterBar}>
        <View className={styles.sortOptions}>
          {sortOptions.map(option => (
            <View
              key={option.key}
              className={classnames(
                styles.sortItem,
                sortBy === option.key && styles.active
              )}
              onClick={() => setSortBy(option.key as 'distance' | 'time' | 'remaining')}
            >
              <Text className={styles.sortIcon}>{option.icon}</Text>
              <Text>{option.label}</Text>
            </View>
          ))}
        </View>
      </View>

      <ScrollView
        className={styles.content}
        scrollY
        onScrollToLower={() => console.log('[HomePage] 滚动到底部')}
        lowerThreshold={100}
      >
        <View className={styles.statsBar}>
          <View className={styles.statItem}>
            <Text className={styles.statNumber}>{totalFoods}</Text>
            <Text className={styles.statLabel}>可领食物</Text>
          </View>
          <View className={styles.statDivider} />
          <View className={styles.statItem}>
            <Text className={styles.statNumber}>{totalRemaining}</Text>
            <Text className={styles.statLabel}>总份数</Text>
          </View>
          <View className={styles.statDivider} />
          <View className={styles.statItem}>
            <Text className={styles.statNumber}>{merchantsCount}</Text>
            <Text className={styles.statLabel}>发布者</Text>
          </View>
        </View>

        <View className={styles.foodList}>
          {filteredFoods.length > 0 ? (
            filteredFoods.map(food => (
              <FoodCard key={food.id} food={food} />
            ))
          ) : (
            <EmptyState
              icon="🍽️"
              title="暂无相关食物"
              description="换个分类试试，或者发布你想分享的食物吧"
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default HomePage;
