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
import { communities, distanceRanges } from '@/data/mockFoods';

const HomePage: React.FC = () => {
  const {
    currentCategory,
    sortBy,
    searchKeyword,
    currentCommunity,
    distanceRange,
    setCategory,
    setSortBy,
    setSearchKeyword,
    setCurrentCommunity,
    setDistanceRange,
    getFilteredFoods
  } = useFoodStore();

  const { user } = useUserStore();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showCommunityPicker, setShowCommunityPicker] = useState(false);
  const [showDistancePicker, setShowDistancePicker] = useState(false);

  const filteredFoods = useMemo(() => getFilteredFoods(), [
    currentCategory,
    sortBy,
    searchKeyword,
    currentCommunity,
    distanceRange,
    getFilteredFoods
  ]);

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

  const sortOptions = [
    { key: 'distance', label: '距离最近', icon: '📍' },
    { key: 'time', label: '最新发布', icon: '🕐' },
    { key: 'remaining', label: '剩余最多', icon: '📦' }
  ];

  const totalFoods = filteredFoods.length;
  const totalRemaining = filteredFoods.reduce((sum, f) => sum + f.remaining, 0);
  const merchantsCount = new Set(filteredFoods.map(f => f.publisher.id)).size;

  const getDistanceLabel = (range: number) => {
    const item = distanceRanges.find(d => d.key === range);
    return item ? item.label : '不限';
  };

  return (
    <View className={styles.homePage}>
      <View className={styles.header}>
        <View className={styles.locationBar}>
          <View className={styles.locationMain} onClick={() => setShowCommunityPicker(true)}>
            <Text className={styles.locationIcon}>📍</Text>
            <Text className={styles.locationText}>{currentCommunity}</Text>
            <Text className={styles.locationArrow}>▼</Text>
          </View>
          <View
            className={styles.distanceBadge}
            onClick={() => setShowDistancePicker(true)}
          >
            <Text className={styles.distanceText}>{getDistanceLabel(distanceRange)}</Text>
          </View>
          <View className={styles.refreshWrap} onClick={handleRefresh}>
            <Text className={classnames(styles.refreshIcon, isRefreshing && styles.spinning)}>🔄</Text>
          </View>
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
          {searchKeyword && (
            <Text
              className={styles.searchClear}
              onClick={() => setSearchKeyword('')}
            >
              ✕
            </Text>
          )}
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

        {(currentCommunity !== '全部' || distanceRange < 999) && (
          <View className={styles.filterHint}>
            <Text className={styles.filterHintText}>
              筛选：{currentCommunity !== '全部' ? `🏘️ ${currentCommunity} · ` : ''}
              {getDistanceLabel(distanceRange)}
              <Text
                className={styles.filterClear}
                onClick={() => {
                  setCurrentCommunity('全部');
                  setDistanceRange(999);
                }}
              >
                 清除筛选
              </Text>
            </Text>
          </View>
        )}

        <View className={styles.foodList}>
          {filteredFoods.length > 0 ? (
            filteredFoods.map(food => (
              <FoodCard key={food.id} food={food} />
            ))
          ) : (
            <EmptyState
              icon="🍽️"
              title="暂无相关食物"
              description={
                currentCommunity !== '全部' || distanceRange < 999
                  ? '当前筛选条件下暂无食物，试试清除筛选条件'
                  : '换个分类试试，或者发布你想分享的食物吧'
              }
            />
          )}
        </View>
      </ScrollView>

      {showCommunityPicker && (
        <View className={styles.pickerOverlay} onClick={() => setShowCommunityPicker(false)}>
          <View className={styles.pickerSheet} onClick={(e) => e.stopPropagation()}>
            <View className={styles.pickerHeader}>
              <Text className={styles.pickerTitle}>选择社区</Text>
              <Text className={styles.pickerClose} onClick={() => setShowCommunityPicker(false)}>✕</Text>
            </View>
            <ScrollView className={styles.pickerBody} scrollY>
              {['全部', ...communities].map(community => (
                <View
                  key={community}
                  className={classnames(
                    styles.pickerOption,
                    currentCommunity === community && styles.pickerOptionActive
                  )}
                  onClick={() => {
                    setCurrentCommunity(community);
                    setShowCommunityPicker(false);
                  }}
                >
                  <Text>{community === '全部' ? '🌍 全部社区' : `🏘️ ${community}`}</Text>
                  {currentCommunity === community && (
                    <Text className={styles.pickerCheck}>✓</Text>
                  )}
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      )}

      {showDistancePicker && (
        <View className={styles.pickerOverlay} onClick={() => setShowDistancePicker(false)}>
          <View className={styles.pickerSheet} onClick={(e) => e.stopPropagation()}>
            <View className={styles.pickerHeader}>
              <Text className={styles.pickerTitle}>选择距离范围</Text>
              <Text className={styles.pickerClose} onClick={() => setShowDistancePicker(false)}>✕</Text>
            </View>
            <View className={styles.pickerBody}>
              {distanceRanges.map(range => (
                <View
                  key={range.key}
                  className={classnames(
                    styles.pickerOption,
                    distanceRange === range.key && styles.pickerOptionActive
                  )}
                  onClick={() => {
                    setDistanceRange(range.key);
                    setShowDistancePicker(false);
                  }}
                >
                  <Text>📍 {range.label}</Text>
                  {distanceRange === range.key && (
                    <Text className={styles.pickerCheck}>✓</Text>
                  )}
                </View>
              ))}
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default HomePage;
