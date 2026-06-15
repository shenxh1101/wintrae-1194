import React from 'react';
import { View, Text, Image, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { useFoodStore } from '@/store/useFoodStore';
import { FoodItem } from '@/types/food';
import EmptyState from '@/components/EmptyState';

const MyPublishPage: React.FC = () => {
  const { myPublished } = useFoodStore();

  const getStatusLabel = (status: FoodItem['status']) => {
    const map = {
      available: '进行中',
      reserved: '已被预约',
      claimed: '已领完',
      expired: '已过期'
    };
    return map[status];
  };

  const getStatusClass = (status: FoodItem['status']) => {
    const map = {
      available: styles.statusAvailable,
      reserved: styles.statusReserved,
      claimed: styles.statusReserved,
      expired: styles.statusExpired
    };
    return map[status];
  };

  const handleEdit = (food: FoodItem) => {
    console.log('[MyPublish] 编辑', food.id);
    Taro.showToast({
      title: '编辑功能开发中',
      icon: 'none'
    });
  };

  const handleOffline = (food: FoodItem) => {
    Taro.showModal({
      title: '下架确认',
      content: `确定要下架「${food.title}」吗？`,
      success: (res) => {
        if (res.confirm) {
          console.log('[MyPublish] 下架', food.id);
          Taro.showToast({
            title: '已下架',
            icon: 'success'
          });
        }
      }
    });
  };

  const handleDelete = (food: FoodItem) => {
    Taro.showModal({
      title: '删除确认',
      content: `确定要删除「${food.title}」吗？删除后不可恢复。`,
      success: (res) => {
        if (res.confirm) {
          console.log('[MyPublish] 删除', food.id);
          Taro.showToast({
            title: '已删除',
            icon: 'success'
          });
        }
      }
    });
  };

  return (
    <View className={styles.myPublishPage}>
      {myPublished.length > 0 ? (
        myPublished.map(food => (
          <View key={food.id} className={styles.publishCard}>
            <View className={styles.cardHeader}>
              <Image
                className={styles.foodImage}
                src={food.images[0]}
                mode="aspectFill"
              />
              <View className={styles.cardInfo}>
                <Text className={styles.foodTitle}>{food.title}</Text>
                <Text className={styles.foodMeta}>
                  剩余 {food.remaining}/{food.quantity} {food.unit}
                </Text>
                <View
                  className={classnames(
                    styles.statusBadge,
                    getStatusClass(food.status)
                  )}
                >
                  {getStatusLabel(food.status)}
                </View>
              </View>
            </View>

            <View className={styles.cardFooter}>
              <Button
                className={classnames(styles.actionBtn, styles.btnSecondary)}
                onClick={() => handleEdit(food)}
              >
                编辑
              </Button>
              {food.status === 'available' && (
                <Button
                  className={classnames(styles.actionBtn, styles.btnSecondary)}
                  onClick={() => handleOffline(food)}
                >
                  下架
                </Button>
              )}
              <Button
                className={classnames(styles.actionBtn, styles.btnDanger)}
                onClick={() => handleDelete(food)}
              >
                删除
              </Button>
            </View>
          </View>
        ))
      ) : (
        <EmptyState
          icon="📦"
          title="暂无发布"
          description="快去发布你的第一个食物分享吧"
        />
      )}
    </View>
  );
};

export default MyPublishPage;
