import React from 'react';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { useUserStore } from '@/store/useUserStore';
import { useFoodStore } from '@/store/useFoodStore';

const ProfilePage: React.FC = () => {
  const { user, blacklist } = useUserStore();
  const { myPublished, favorites } = useFoodStore();

  const menuGroups = [
    {
      title: '我的发布与收藏',
      items: [
        { icon: '📦', text: '我的发布', path: '/pages/my-publish/index', badge: myPublished.length },
        { icon: '❤️', text: '我的收藏', path: '/pages/favorites/index', badge: favorites.length }
      ]
    },
    {
      title: '评价与信用',
      items: [
        { icon: '⭐', text: '评价管理', path: '/pages/reviews/index' },
        { icon: '📋', text: '信用记录', path: '' }
      ]
    },
    {
      title: '其他',
      items: [
        { icon: '🚫', text: '黑名单', path: '/pages/blacklist/index', badge: blacklist.length },
        { icon: '📢', text: '违规举报', path: '/pages/report/index' },
        { icon: '⚙️', text: '设置', path: '' },
        { icon: '💬', text: '意见反馈', path: '' }
      ]
    }
  ];

  const handleMenuClick = (item: { path: string; text: string }) => {
    if (!item.path) {
      Taro.showToast({
        title: '功能开发中',
        icon: 'none'
      });
      return;
    }

    console.log('[Profile] 点击菜单', item.text);
    Taro.navigateTo({
      url: item.path
    });
  };

  const handleLogout = () => {
    Taro.showModal({
      title: '退出登录',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          console.log('[Profile] 退出登录');
          Taro.showToast({
            title: '已退出登录',
            icon: 'success'
          });
        }
      }
    });
  };

  return (
    <ScrollView className={styles.profilePage} scrollY>
      <View className={styles.header}>
        <View className={styles.userInfo}>
          <Image
            className={styles.avatar}
            src={user.avatar}
            mode="aspectFill"
          />
          <View className={styles.userDetail}>
            <Text className={styles.userName}>{user.name}</Text>
            <View className={styles.userType}>
              {user.type === 'merchant' ? '🏪 商户' : '🏠 住户'}
            </View>
            <Text className={styles.userCommunity}>📍 {user.community}</Text>
          </View>
          <View className={styles.creditBadge}>
            <Text className={styles.creditScore}>{user.creditScore}</Text>
            <Text className={styles.creditLabel}>信用分</Text>
          </View>
        </View>
      </View>

      <View className={styles.statsRow}>
        <View className={styles.statItem}>
          <Text className={styles.statNumber}>{user.publishCount}</Text>
          <Text className={styles.statLabel}>发布数</Text>
        </View>
        <View className={styles.statItem}>
          <Text className={styles.statNumber}>{user.claimCount}</Text>
          <Text className={styles.statLabel}>领取数</Text>
        </View>
        <View className={styles.statItem}>
          <Text className={styles.statNumber}>{favorites.length}</Text>
          <Text className={styles.statLabel}>收藏数</Text>
        </View>
      </View>

      {menuGroups.map((group, groupIndex) => (
        <View key={groupIndex} className={styles.section}>
          <Text className={styles.sectionTitle}>{group.title}</Text>
          <View className={styles.menuList}>
            {group.items.map((item, itemIndex) => (
              <View
                key={itemIndex}
                className={styles.menuItem}
                onClick={() => handleMenuClick(item)}
              >
                <Text className={styles.menuIcon}>{item.icon}</Text>
                <Text className={styles.menuText}>{item.text}</Text>
                {item.badge !== undefined && item.badge > 0 && (
                  <View className={styles.menuBadge}>{item.badge}</View>
                )}
                <Text className={styles.menuArrow}>›</Text>
              </View>
            ))}
          </View>
        </View>
      ))}

      <View className={styles.logoutBtn} onClick={handleLogout}>
        退出登录
      </View>
    </ScrollView>
  );
};

export default ProfilePage;
