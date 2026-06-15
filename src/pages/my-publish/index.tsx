import React, { useState } from 'react';
import { View, Text, Image, Button, Input, Textarea, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { useFoodStore } from '@/store/useFoodStore';
import { FoodItem } from '@/types/food';
import { categories } from '@/data/mockFoods';
import EmptyState from '@/components/EmptyState';

const MyPublishPage: React.FC = () => {
  const { myPublished, editPublishedFood, offlineFood, onlineFood, deleteFood } = useFoodStore();

  const [editingFood, setEditingFood] = useState<FoodItem | null>(null);
  const [editForm, setEditForm] = useState<Partial<FoodItem>>({});

  const getStatusLabel = (status: FoodItem['status']) => {
    const map = {
      available: '进行中',
      reserved: '已被预约',
      claimed: '已领完',
      expired: '已过期',
      offline: '已下架'
    };
    return map[status];
  };

  const getStatusClass = (status: FoodItem['status']) => {
    const map = {
      available: styles.statusAvailable,
      reserved: styles.statusReserved,
      claimed: styles.statusReserved,
      expired: styles.statusExpired,
      offline: styles.statusExpired
    };
    return map[status];
  };

  const handleEdit = (food: FoodItem) => {
    setEditingFood(food);
    setEditForm({
      title: food.title,
      description: food.description,
      category: food.category,
      quantity: food.quantity,
      unit: food.unit,
      expireTime: food.expireTime,
      pickupStartTime: food.pickupStartTime,
      pickupEndTime: food.pickupEndTime,
      location: { ...food.location }
    });
  };

  const handleSaveEdit = () => {
    if (!editingFood) return;
    if (!editForm.title?.trim()) {
      Taro.showToast({ title: '请填写标题', icon: 'none' });
      return;
    }
    const success = editPublishedFood(editingFood.id, editForm);
    if (success) {
      Taro.showToast({ title: '保存成功', icon: 'success' });
      setEditingFood(null);
    } else {
      Taro.showToast({ title: '保存失败', icon: 'error' });
    }
  };

  const handleOffline = (food: FoodItem) => {
    Taro.showModal({
      title: '下架确认',
      content: `确定要下架「${food.title}」吗？\n下架后首页将不再展示。`,
      success: (res) => {
        if (res.confirm) {
          const success = offlineFood(food.id);
          if (success) {
            Taro.showToast({ title: '已下架', icon: 'success' });
          }
        }
      }
    });
  };

  const handleOnline = (food: FoodItem) => {
    Taro.showModal({
      title: '重新上架',
      content: `确定要重新上架「${food.title}」吗？`,
      success: (res) => {
        if (res.confirm) {
          const success = onlineFood(food.id);
          if (success) {
            Taro.showToast({ title: '已上架', icon: 'success' });
          }
        }
      }
    });
  };

  const handleDelete = (food: FoodItem) => {
    Taro.showModal({
      title: '删除确认',
      content: `确定要删除「${food.title}」吗？\n删除后不可恢复，相关订单将标记为已过期。`,
      confirmColor: '#F53F3F',
      success: (res) => {
        if (res.confirm) {
          const success = deleteFood(food.id);
          if (success) {
            Taro.showToast({ title: '已删除', icon: 'success' });
          }
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
              {food.status === 'offline' && (
                <Button
                  className={classnames(styles.actionBtn, styles.btnPrimary)}
                  onClick={() => handleOnline(food)}
                >
                  重新上架
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

      {editingFood && (
        <View className={styles.modalOverlay} onClick={() => setEditingFood(null)}>
          <View className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <View className={styles.modalHeader}>
              <Text className={styles.modalTitle}>编辑食物信息</Text>
              <Text className={styles.modalClose} onClick={() => setEditingFood(null)}>✕</Text>
            </View>

            <ScrollView className={styles.modalBody} scrollY>
              <View className={styles.formGroup}>
                <Text className={styles.formLabel}>标题 *</Text>
                <Input
                  className={styles.formInput}
                  placeholder="请输入食物标题"
                  value={editForm.title || ''}
                  onInput={(e) => setEditForm({ ...editForm, title: e.detail.value })}
                />
              </View>

              <View className={styles.formGroup}>
                <Text className={styles.formLabel}>描述</Text>
                <Textarea
                  className={styles.formTextarea}
                  placeholder="请输入食物描述"
                  value={editForm.description || ''}
                  onInput={(e) => setEditForm({ ...editForm, description: e.detail.value })}
                />
              </View>

              <View className={styles.formGroup}>
                <Text className={styles.formLabel}>分类</Text>
                <View className={styles.categoryGrid}>
                  {categories.filter(c => c.id !== 'all').map(cat => (
                    <View
                      key={cat.id}
                      className={classnames(
                        styles.categoryOption,
                        editForm.category === cat.id && styles.categoryActive
                      )}
                      onClick={() => setEditForm({ ...editForm, category: cat.id })}
                    >
                      <Text>{cat.icon}</Text>
                      <Text>{cat.name}</Text>
                    </View>
                  ))}
                </View>
              </View>

              <View className={styles.formRow}>
                <View className={styles.formItem}>
                  <Text className={styles.formLabel}>总数量</Text>
                  <Input
                    className={styles.formInput}
                    type="number"
                    value={String(editForm.quantity || '')}
                    onInput={(e) => setEditForm({ ...editForm, quantity: Number(e.detail.value) })}
                  />
                </View>
                <View className={styles.formItem}>
                  <Text className={styles.formLabel}>单位</Text>
                  <Input
                    className={styles.formInput}
                    placeholder="份/盒/个..."
                    value={editForm.unit || ''}
                    onInput={(e) => setEditForm({ ...editForm, unit: e.detail.value })}
                  />
                </View>
              </View>

              <View className={styles.formGroup}>
                <Text className={styles.formLabel}>过期时间</Text>
                <Input
                  className={styles.formInput}
                  placeholder="例如：2026-06-18 18:00"
                  value={editForm.expireTime || ''}
                  onInput={(e) => setEditForm({ ...editForm, expireTime: e.detail.value })}
                />
              </View>

              <View className={styles.formRow}>
                <View className={styles.formItem}>
                  <Text className={styles.formLabel}>领取开始</Text>
                  <Input
                    className={styles.formInput}
                    placeholder="例如：09:00"
                    value={editForm.pickupStartTime || ''}
                    onInput={(e) => setEditForm({ ...editForm, pickupStartTime: e.detail.value })}
                  />
                </View>
                <View className={styles.formItem}>
                  <Text className={styles.formLabel}>领取结束</Text>
                  <Input
                    className={styles.formInput}
                    placeholder="例如：18:00"
                    value={editForm.pickupEndTime || ''}
                    onInput={(e) => setEditForm({ ...editForm, pickupEndTime: e.detail.value })}
                  />
                </View>
              </View>

              <View className={styles.formGroup}>
                <Text className={styles.formLabel}>领取地点</Text>
                <Input
                  className={styles.formInput}
                  placeholder="请输入领取地点"
                  value={editForm.location?.address || ''}
                  onInput={(e) => setEditForm({
                    ...editForm,
                    location: { ...(editForm.location as any), address: e.detail.value }
                  })}
                />
              </View>
            </ScrollView>

            <View className={styles.modalFooter}>
              <Button
                className={classnames(styles.modalBtn, styles.modalBtnSecondary)}
                onClick={() => setEditingFood(null)}
              >
                取消
              </Button>
              <Button
                className={classnames(styles.modalBtn, styles.modalBtnPrimary)}
                onClick={handleSaveEdit}
              >
                保存
              </Button>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default MyPublishPage;
