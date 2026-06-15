import { create } from 'zustand';
import { FoodItem, Order } from '@/types/food';
import { mockFoods, mockOrders, mockMyPublishedFoods } from '@/data/mockFoods';

interface FoodState {
  foods: FoodItem[];
  orders: Order[];
  myPublished: FoodItem[];
  favorites: FoodItem[];
  currentCategory: string;
  sortBy: 'distance' | 'time' | 'remaining';
  searchKeyword: string;
}

interface FoodActions {
  setCategory: (category: string) => void;
  setSortBy: (sortBy: 'distance' | 'time' | 'remaining') => void;
  setSearchKeyword: (keyword: string) => void;
  toggleFavorite: (foodId: string) => void;
  getFilteredFoods: () => FoodItem[];
  createOrder: (foodId: string, quantity: number) => Order | null;
  addPublishedFood: (food: FoodItem) => void;
}

export const useFoodStore = create<FoodState & FoodActions>((set, get) => ({
  foods: mockFoods,
  orders: mockOrders,
  myPublished: mockMyPublishedFoods,
  favorites: mockFoods.filter(f => f.isFavorite),
  currentCategory: 'all',
  sortBy: 'distance',
  searchKeyword: '',

  setCategory: (category) => set({ currentCategory: category }),

  setSortBy: (sortBy) => set({ sortBy }),

  setSearchKeyword: (keyword) => set({ searchKeyword: keyword }),

  toggleFavorite: (foodId) => {
    const { foods } = get();
    const updatedFoods = foods.map(food => {
      if (food.id === foodId) {
        return { ...food, isFavorite: !food.isFavorite };
      }
      return food;
    });
    const favorites = updatedFoods.filter(f => f.isFavorite);
    set({ foods: updatedFoods, favorites });
  },

  getFilteredFoods: () => {
    const { foods, currentCategory, sortBy, searchKeyword } = get();
    let filtered = [...foods];

    if (currentCategory !== 'all') {
      filtered = filtered.filter(f => f.category === currentCategory);
    }

    if (searchKeyword.trim()) {
      const keyword = searchKeyword.toLowerCase();
      filtered = filtered.filter(f =>
        f.title.toLowerCase().includes(keyword) ||
        f.description.toLowerCase().includes(keyword)
      );
    }

    switch (sortBy) {
      case 'distance':
        filtered.sort((a, b) => a.distance - b.distance);
        break;
      case 'time':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'remaining':
        filtered.sort((a, b) => b.remaining - a.remaining);
        break;
    }

    return filtered;
  },

  createOrder: (foodId, quantity) => {
    const { foods, orders } = get();
    const food = foods.find(f => f.id === foodId);
    if (!food || food.remaining < quantity) return null;

    const pickupCode = Math.floor(1000 + Math.random() * 9000).toString();
    const newOrder: Order = {
      id: `o${Date.now()}`,
      foodId: food.id,
      foodTitle: food.title,
      foodImage: food.images[0],
      quantity,
      pickupCode,
      status: 'reserved',
      publisherName: food.publisher.name,
      publisherAvatar: food.publisher.avatar,
      pickupAddress: food.location.address,
      pickupStartTime: food.pickupStartTime,
      pickupEndTime: food.pickupEndTime,
      createdAt: new Date().toISOString().slice(0, 16).replace('T', ' ')
    };

    const updatedFoods = foods.map(f => {
      if (f.id === foodId) {
        return { ...f, remaining: f.remaining - quantity };
      }
      return f;
    });

    set({ foods: updatedFoods, orders: [newOrder, ...orders] });
    return newOrder;
  },

  addPublishedFood: (food) => {
    const { foods, myPublished } = get();
    set({
      foods: [food, ...foods],
      myPublished: [food, ...myPublished]
    });
  }
}));
