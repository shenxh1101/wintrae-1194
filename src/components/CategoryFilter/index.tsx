import React from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import classnames from 'classnames';
import styles from './index.module.scss';
import { Category } from '@/types/food';
import { categories } from '@/data/mockFoods';

interface CategoryFilterProps {
  currentCategory: string;
  onChange: (categoryId: string) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  currentCategory,
  onChange
}) => {
  return (
    <ScrollView
      className={styles.categoryScroll}
      scrollX
      enhanced
      showScrollbar={false}
    >
      <View className={styles.categoryList}>
        {categories.map((category: Category) => (
          <View
            key={category.id}
            className={classnames(
              styles.categoryItem,
              currentCategory === category.id && styles.active
            )}
            onClick={() => onChange(category.id)}
          >
            <Text className={styles.categoryIcon}>{category.icon}</Text>
            <Text className={styles.categoryName}>{category.name}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default CategoryFilter;
