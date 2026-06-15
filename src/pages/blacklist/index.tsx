import React from 'react';
import { View, Text, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { useUserStore } from '@/store/useUserStore';
import EmptyState from '@/components/EmptyState';

const BlacklistPage: React.FC = () => {
  const { blacklist, removeFromBlacklist } = useUserStore();

  const handleRemove = (userId: string, userName: string) => {
    Taro.showModal({
      title: '移出黑名单',
      content: `确定要将「${userName}」移出黑名单吗？`,
      success: (res) => {
        if (res.confirm) {
          removeFromBlacklist(userId);
          Taro.showToast({
            title: '已移出黑名单',
            icon: 'success'
          });
        }
      }
    });
  };

  return (
    <View className={styles.blacklistPage}>
      {blacklist.length > 0 ? (
        blacklist.map(item => (
          <View key={item.id} className={styles.blacklistCard}>
            <Image
              className={styles.userAvatar}
              src={item.userAvatar}
              mode="aspectFill"
            />
            <View className={styles.userInfo}>
              <Text className={styles.userName}>{item.userName}</Text>
              <Text className={styles.reason}>{item.reason}</Text>
              <Text className={styles.addTime}>加入时间：{item.createdAt}</Text>
            </View>
            <View
              className={styles.removeBtn}
              onClick={() => handleRemove(item.userId, item.userName)}
            >
              移出
            </View>
          </View>
        ))
      ) : (
        <EmptyState
          icon="🚫"
          title="黑名单为空"
          description="你还没有将任何人加入黑名单"
        />
      )}
    </View>
  );
};

export default BlacklistPage;
