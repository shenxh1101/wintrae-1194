import React, { useState } from 'react';
import { View, Text, Input, Textarea, Image, Button, Picker } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { categories, allergenOptions } from '@/data/mockFoods';
import { useFoodStore } from '@/store/useFoodStore';
import { useUserStore } from '@/store/useUserStore';
import { FoodItem } from '@/types/food';

const PublishPage: React.FC = () => {
  const { addPublishedFood } = useFoodStore();
  const { user } = useUserStore();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [category, setCategory] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('份');
  const [expireDate, setExpireDate] = useState('');
  const [pickupStartTime, setPickupStartTime] = useState('09:00');
  const [pickupEndTime, setPickupEndTime] = useState('18:00');
  const [selectedAllergens, setSelectedAllergens] = useState<string[]>([]);
  const [address, setAddress] = useState(user.community);

  const unitOptions = ['份', '个', '盒', '袋', '斤', '瓶', '包', '碗', '杯'];

  const handleChooseImage = () => {
    if (images.length >= 9) {
      Taro.showToast({
        title: '最多上传9张图片',
        icon: 'none'
      });
      return;
    }

    Taro.chooseImage({
      count: 9 - images.length,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        setImages([...images, ...res.tempFilePaths]);
        console.log('[Publish] 选择图片成功', res.tempFilePaths.length, '张');
      },
      fail: (err) => {
        console.error('[Publish] 选择图片失败', err);
      }
    });
  };

  const handleRemoveImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
  };

  const toggleAllergen = (allergen: string) => {
    if (selectedAllergens.includes(allergen)) {
      setSelectedAllergens(selectedAllergens.filter(a => a !== allergen));
    } else {
      setSelectedAllergens([...selectedAllergens, allergen]);
    }
  };

  const canSubmit = () => {
    return (
      title.trim() &&
      description.trim() &&
      images.length > 0 &&
      category &&
      parseInt(quantity) > 0 &&
      expireDate &&
      pickupStartTime &&
      pickupEndTime
    );
  };

  const handleSubmit = () => {
    if (!canSubmit()) {
      Taro.showToast({
        title: '请填写完整信息',
        icon: 'none'
      });
      return;
    }

    const newFood: FoodItem = {
      id: `new-${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      images: images.length > 0 ? images : ['https://picsum.photos/id/292/600/600'],
      category,
      quantity: parseInt(quantity),
      remaining: parseInt(quantity),
      unit,
      expireTime: expireDate + ' 23:59',
      pickupStartTime,
      pickupEndTime,
      allergens: selectedAllergens,
      publisher: {
        id: user.id,
        name: user.name,
        avatar: user.avatar,
        type: user.type,
        creditScore: user.creditScore,
        phone: user.phone
      },
      location: {
        address: address,
        community: user.community,
        latitude: 39.9050,
        longitude: 116.4075
      },
      distance: 0,
      status: 'available',
      createdAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
      isFavorite: false
    };

    addPublishedFood(newFood);

    console.log('[Publish] 发布成功', newFood);

    Taro.showToast({
      title: '发布成功',
      icon: 'success'
    });

    setTitle('');
    setDescription('');
    setImages([]);
    setCategory('');
    setQuantity('');
    setExpireDate('');
    setSelectedAllergens([]);

    setTimeout(() => {
      Taro.switchTab({
        url: '/pages/home/index'
      });
    }, 1500);
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <View className={styles.publishPage}>
      <View className={styles.formSection}>
        <Text className={styles.sectionTitle}>
          <Text className={styles.titleIcon}>📝</Text>
          基本信息
        </Text>

        <View className={styles.formItem}>
          <Text className={styles.formLabel}>
            <Text className={styles.required}>*</Text>食物标题
          </Text>
          <View className={styles.inputWrap}>
            <Input
              className={styles.formInput}
              placeholder="请输入食物名称"
              placeholderClass="input-placeholder"
              value={title}
              onInput={(e) => setTitle(e.detail.value)}
              maxlength={30}
            />
          </View>
        </View>

        <View className={styles.formItem}>
          <Text className={styles.formLabel}>
            <Text className={styles.required}>*</Text>食物描述
          </Text>
          <View className={styles.textareaWrap}>
            <Textarea
              className={styles.formTextarea}
              placeholder="详细描述食物的特点、口味、保存方式等信息..."
              placeholderClass="input-placeholder"
              value={description}
              onInput={(e) => setDescription(e.detail.value)}
              maxlength={500}
              autoHeight
            />
          </View>
          <Text className={styles.charCount}>{description.length}/500</Text>
        </View>

        <View className={styles.formItem}>
          <Text className={styles.formLabel}>
            <Text className={styles.required}>*</Text>食物图片
          </Text>
          <View className={styles.imageUploadArea}>
            {images.map((img, index) => (
              <View key={index} className={styles.imageItem}>
                <Image
                  className={styles.uploadImage}
                  src={img}
                  mode="aspectFill"
                />
                <View
                  className={styles.removeBtn}
                  onClick={() => handleRemoveImage(index)}
                >
                  <Text className={styles.removeText}>×</Text>
                </View>
              </View>
            ))}
            {images.length < 9 && (
              <View className={styles.uploadBtn} onClick={handleChooseImage}>
                <Text className={styles.uploadIcon}>➕</Text>
                <Text className={styles.uploadText}>添加图片</Text>
              </View>
            )}
          </View>
        </View>
      </View>

      <View className={styles.formSection}>
        <Text className={styles.sectionTitle}>
          <Text className={styles.titleIcon}>🏷️</Text>
          分类与数量
        </Text>

        <View className={styles.formItem}>
          <Text className={styles.formLabel}>
            <Text className={styles.required}>*</Text>食物分类
          </Text>
          <View className={styles.categoryGrid}>
            {categories.filter(c => c.id !== 'all').map((cat) => (
              <View
                key={cat.id}
                className={classnames(
                  styles.categoryItem,
                  category === cat.id && styles.active
                )}
                onClick={() => setCategory(cat.id)}
              >
                <Text className={styles.categoryIcon}>{cat.icon}</Text>
                <Text className={styles.categoryName}>{cat.name}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className={styles.formItem}>
          <Text className={styles.formLabel}>
            <Text className={styles.required}>*</Text>数量与单位
          </Text>
          <View className={styles.quantityRow}>
            <View className={classnames(styles.inputWrap, styles.quantityInput)}>
              <Input
                className={styles.formInput}
                type="number"
                placeholder="请输入数量"
                placeholderClass="input-placeholder"
                value={quantity}
                onInput={(e) => setQuantity(e.detail.value)}
              />
            </View>
            <Picker
              mode="selector"
              range={unitOptions}
              onChange={(e) => setUnit(unitOptions[e.detail.value])}
            >
              <View className={styles.unitSelect}>
                <Text>{unit} ▾</Text>
              </View>
            </Picker>
          </View>
        </View>
      </View>

      <View className={styles.formSection}>
        <Text className={styles.sectionTitle}>
          <Text className={styles.titleIcon}>⏰</Text>
          时间与地点
        </Text>

        <View className={styles.formItem}>
          <Text className={styles.formLabel}>
            <Text className={styles.required}>*</Text>过期日期
          </Text>
          <Picker
            mode="date"
            start={today}
            value={expireDate}
            onChange={(e) => setExpireDate(e.detail.value)}
          >
            <View className={styles.timeInput}>
              <Text className={styles.timeText}>
                {expireDate || '请选择过期日期'}
              </Text>
              <Text className={styles.timeIcon}>📅</Text>
            </View>
          </Picker>
        </View>

        <View className={styles.formItem}>
          <Text className={styles.formLabel}>
            <Text className={styles.required}>*</Text>可领取时段
          </Text>
          <View className={styles.timeRow}>
            <View className={styles.timeItem}>
              <Picker
                mode="time"
                value={pickupStartTime}
                onChange={(e) => setPickupStartTime(e.detail.value)}
              >
                <View className={styles.timeInput}>
                  <Text className={styles.timeText}>{pickupStartTime}</Text>
                  <Text className={styles.timeIcon}>🕐</Text>
                </View>
              </Picker>
            </View>
            <Text className={styles.formLabel}>至</Text>
            <View className={styles.timeItem}>
              <Picker
                mode="time"
                value={pickupEndTime}
                onChange={(e) => setPickupEndTime(e.detail.value)}
              >
                <View className={styles.timeInput}>
                  <Text className={styles.timeText}>{pickupEndTime}</Text>
                  <Text className={styles.timeIcon}>🕐</Text>
                </View>
              </Picker>
            </View>
          </View>
        </View>

        <View className={styles.formItem}>
          <Text className={styles.formLabel}>领取地点</Text>
          <View className={styles.addressInput}>
            <Text className={styles.addressIcon}>📍</Text>
            <Text className={styles.addressText}>{address}</Text>
          </View>
        </View>
      </View>

      <View className={styles.formSection}>
        <Text className={styles.sectionTitle}>
          <Text className={styles.titleIcon}>⚠️</Text>
          过敏原标注
        </Text>

        <View className={styles.allergenList}>
          {allergenOptions.map((allergen) => (
            <View
              key={allergen}
              className={classnames(
                styles.allergenTag,
                selectedAllergens.includes(allergen) && styles.active
              )}
              onClick={() => toggleAllergen(allergen)}
            >
              {allergen}
            </View>
          ))}
        </View>
        <Text className={styles.allergenTip}>
          如食物含有常见过敏原，请务必标注，保护过敏人群安全
        </Text>
      </View>

      <View className={styles.submitBar}>
        <Button
          className={classnames(
            styles.submitBtn,
            !canSubmit() && styles.disabled
          )}
          onClick={handleSubmit}
          disabled={!canSubmit()}
        >
          立即发布
        </Button>
      </View>
    </View>
  );
};

export default PublishPage;
