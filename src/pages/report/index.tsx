import React, { useState } from 'react';
import { View, Text, Textarea, Image, Button } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';

const ReportPage: React.FC = () => {
  const router = useRouter();
  const targetId = router.params.targetId || '';
  const targetType = router.params.targetType || 'food';

  const [selectedReason, setSelectedReason] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<string[]>([]);

  const reasonOptions = [
    { id: 'fake', label: '虚假信息' },
    { id: 'expired', label: '食物已过期' },
    { id: 'inappropriate', label: '内容不当' },
    { id: 'fraud', label: '涉嫌欺诈' },
    { id: 'other', label: '其他原因' }
  ];

  const handleChooseImage = () => {
    if (images.length >= 6) {
      Taro.showToast({
        title: '最多上传6张图片',
        icon: 'none'
      });
      return;
    }

    Taro.chooseImage({
      count: 6 - images.length,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        setImages([...images, ...res.tempFilePaths]);
        console.log('[Report] 选择图片成功', res.tempFilePaths.length, '张');
      },
      fail: (err) => {
        console.error('[Report] 选择图片失败', err);
      }
    });
  };

  const handleRemoveImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
  };

  const canSubmit = () => {
    return selectedReason && description.trim().length >= 5;
  };

  const handleSubmit = () => {
    if (!canSubmit()) {
      Taro.showToast({
        title: '请填写完整举报信息',
        icon: 'none'
      });
      return;
    }

    console.log('[Report] 提交举报', {
      targetId,
      targetType,
      reason: selectedReason,
      description,
      images
    });

    Taro.showModal({
      title: '提交成功',
      content: '感谢您的举报，我们会尽快核实处理。',
      showCancel: false,
      success: () => {
        Taro.navigateBack();
      }
    });
  };

  return (
    <View className={styles.reportPage}>
      <View className={styles.formSection}>
        <Text className={styles.sectionTitle}>
          <Text className={styles.titleIcon}>📢</Text>
          举报类型
        </Text>
        <Text className={styles.tipText}>
          举报对象：{targetType === 'food' ? '食物发布' : '用户'}
        </Text>
      </View>

      <View className={styles.formSection}>
        <Text className={styles.sectionTitle}>
          <Text className={styles.titleIcon}>⚠️</Text>
          举报原因
          <Text className={styles.required}>*</Text>
        </Text>
        <View className={styles.reasonList}>
          {reasonOptions.map(option => (
            <View
              key={option.id}
              className={classnames(
                styles.reasonItem,
                selectedReason === option.id && styles.active
              )}
              onClick={() => setSelectedReason(option.id)}
            >
              <View
                className={classnames(
                  styles.reasonRadio,
                  selectedReason === option.id && styles.active
                )}
              >
                {selectedReason === option.id && (
                  <View className={styles.radioInner} />
                )}
              </View>
              <Text className={styles.reasonText}>{option.label}</Text>
            </View>
          ))}
        </View>
      </View>

      <View className={styles.formSection}>
        <Text className={styles.sectionTitle}>
          <Text className={styles.titleIcon}>📝</Text>
          详细描述
          <Text className={styles.required}>*</Text>
        </Text>
        <View className={styles.textareaWrap}>
          <Textarea
            className={styles.formTextarea}
            placeholder="请详细描述违规情况，以便我们更好地核实处理..."
            placeholderClass="input-placeholder"
            value={description}
            onInput={(e) => setDescription(e.detail.value)}
            maxlength={500}
            autoHeight
          />
        </View>
        <Text className={styles.charCount}>{description.length}/500</Text>
        <Text className={styles.tipText}>
          请至少输入5个字符，描述越详细越有助于我们处理
        </Text>
      </View>

      <View className={styles.formSection}>
        <Text className={styles.sectionTitle}>
          <Text className={styles.titleIcon}>📷</Text>
          上传凭证
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
          {images.length < 6 && (
            <View className={styles.uploadBtn} onClick={handleChooseImage}>
              <Text className={styles.uploadIcon}>➕</Text>
              <Text className={styles.uploadText}>上传图片</Text>
            </View>
          )}
        </View>
        <Text className={styles.tipText}>
          最多可上传6张图片，截图或照片均可作为凭证
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
          提交举报
        </Button>
      </View>
    </View>
  );
};

export default ReportPage;
