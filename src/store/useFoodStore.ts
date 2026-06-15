import { create } from 'zustand';
import { FoodItem, Order, Review } from '@/types/food';
import { mockFoods, mockOrders, mockMyPublishedFoods, mockReviews } from '@/data/mockFoods';

interface FoodState {
  foods: FoodItem[];
  orders: Order[];
  myPublished: FoodItem[];
  favorites: FoodItem[];
  reviews: Review[];
  currentCategory: string;
  sortBy: 'distance' | 'time' | 'remaining';
  searchKeyword: string;
  currentCommunity: string;
  distanceRange: number;
}

interface FoodActions {
  setCategory: (category: string) => void;
  setSortBy: (sortBy: 'distance' | 'time' | 'remaining') => void;
  setSearchKeyword: (keyword: string) => void;
  setCurrentCommunity: (community: string) => void;
  setDistanceRange: (range: number) => void;
  toggleFavorite: (foodId: string) => void;
  getFilteredFoods: () => FoodItem[];
  createOrder: (foodId: string, quantity: number) => Order | null;
  cancelOrder: (orderId: string) => boolean;
  verifyPickup: (orderId: string) => boolean;
  addPublishedFood: (food: FoodItem) => void;
  editPublishedFood: (foodId: string, updates: Partial<FoodItem>) => boolean;
  offlineFood: (foodId: string) => boolean;
  onlineFood: (foodId: string) => boolean;
  deleteFood: (foodId: string) => boolean;
  addReview: (review: Omit<Review, 'id' | 'userId' | 'userName' | 'userAvatar' | 'createdAt'>, userInfo: any) => Review | null;
  getReviewsForTarget: (targetUserId: string) => Review[];
}

export const useFoodStore = create<FoodState & FoodActions>((set, get) => ({
  foods: mockFoods,
  orders: mockOrders,
  myPublished: mockMyPublishedFoods,
  favorites: mockFoods.filter(f => f.isFavorite),
  reviews: mockReviews,
  currentCategory: 'all',
  sortBy: 'distance',
  searchKeyword: '',
  currentCommunity: '全部',
  distanceRange: 999,

  setCategory: (category) => set({ currentCategory: category }),

  setSortBy: (sortBy) => set({ sortBy }),

  setSearchKeyword: (keyword) => set({ searchKeyword: keyword }),

  setCurrentCommunity: (community) => set({ currentCommunity: community }),

  setDistanceRange: (range) => set({ distanceRange: range }),

  toggleFavorite: (foodId) => {
    const { foods, myPublished } = get();
    const updatedFoods = foods.map(food => {
      if (food.id === foodId) {
        return { ...food, isFavorite: !food.isFavorite };
      }
      return food;
    });
    const updatedMyPublished = myPublished.map(food => {
      if (food.id === foodId) {
        return { ...food, isFavorite: !food.isFavorite };
      }
      return food;
    });
    const favorites = updatedFoods.filter(f => f.isFavorite);
    set({ foods: updatedFoods, myPublished: updatedMyPublished, favorites });
  },

  getFilteredFoods: () => {
    const { foods, currentCategory, sortBy, searchKeyword, currentCommunity, distanceRange } = get();
    let filtered = [...foods];

    filtered = filtered.filter(f => f.status === 'available');

    if (currentCommunity !== '全部') {
      filtered = filtered.filter(f => f.location.community === currentCommunity);
    }

    if (distanceRange < 999) {
      filtered = filtered.filter(f => f.distance <= distanceRange);
    }

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
    const { foods, orders, myPublished } = get();
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
      publisherPhone: food.publisher.phone,
      pickupAddress: food.location.address,
      pickupStartTime: food.pickupStartTime,
      pickupEndTime: food.pickupEndTime,
      createdAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
      reviewed: false
    };

    const newRemaining = food.remaining - quantity;
    const newStatus: FoodItem['status'] = newRemaining === 0 ? 'reserved' : food.status;

    const updateFn = (f: FoodItem) => {
      if (f.id === foodId) {
        return { ...f, remaining: newRemaining, status: newStatus };
      }
      return f;
    };

    const updatedFoods = foods.map(updateFn);
    const updatedMyPublished = myPublished.map(updateFn);

    set({ foods: updatedFoods, myPublished: updatedMyPublished, orders: [newOrder, ...orders] });
    return newOrder;
  },

  cancelOrder: (orderId) => {
    const { orders, foods, myPublished } = get();
    const order = orders.find(o => o.id === orderId);
    if (!order || order.status !== 'reserved') return false;

    const restoreFn = (f: FoodItem) => {
      if (f.id === order.foodId) {
        const newRemaining = f.remaining + order.quantity;
        return { ...f, remaining: newRemaining, status: 'available' as const };
      }
      return f;
    };

    const updatedOrders = orders.map(o => {
      if (o.id === orderId) {
        return { ...o, status: 'cancelled' as const };
      }
      return o;
    });

    const updatedFoods = foods.map(restoreFn);
    const updatedMyPublished = myPublished.map(restoreFn);

    set({ orders: updatedOrders, foods: updatedFoods, myPublished: updatedMyPublished });
    return true;
  },

  verifyPickup: (orderId) => {
    const { orders, foods, myPublished } = get();
    const order = orders.find(o => o.id === orderId);
    if (!order || order.status !== 'reserved') return false;

    const updatedOrders = orders.map(o => {
      if (o.id === orderId) {
        return { ...o, status: 'picked' as const };
      }
      return o;
    });

    const updateFoodFn = (f: FoodItem) => {
      if (f.id === order.foodId) {
        const newStatus: FoodItem['status'] = f.remaining === 0 ? 'claimed' : f.status;
        return { ...f, status: newStatus };
      }
      return f;
    };

    const updatedFoods = foods.map(updateFoodFn);
    const updatedMyPublished = myPublished.map(updateFoodFn);

    set({ orders: updatedOrders, foods: updatedFoods, myPublished: updatedMyPublished });
    return true;
  },

  addPublishedFood: (food) => {
    const { foods, myPublished } = get();
    set({
      foods: [food, ...foods],
      myPublished: [food, ...myPublished]
    });
  },

  editPublishedFood: (foodId, updates) => {
    const { foods, myPublished, favorites } = get();
    const foodExists = myPublished.some(f => f.id === foodId);
    if (!foodExists) return false;

    const editFn = (f: FoodItem) => {
      if (f.id === foodId) {
        return { ...f, ...updates };
      }
      return f;
    };

    const updatedMyPublished = myPublished.map(editFn);
    const updatedFoods = foods.map(editFn);
    const updatedFavorites = favorites.map(editFn);

    set({ myPublished: updatedMyPublished, foods: updatedFoods, favorites: updatedFavorites });
    return true;
  },

  offlineFood: (foodId) => {
    const { foods, myPublished, favorites } = get();
    const foodExists = myPublished.some(f => f.id === foodId);
    if (!foodExists) return false;

    const offlineFn = (f: FoodItem) => {
      if (f.id === foodId) {
        return { ...f, status: 'offline' as const };
      }
      return f;
    };

    const updatedMyPublished = myPublished.map(offlineFn);
    const updatedFoods = foods.map(offlineFn);
    const updatedFavorites = favorites.filter(f => f.id !== foodId);

    set({ myPublished: updatedMyPublished, foods: updatedFoods, favorites: updatedFavorites });
    return true;
  },

  onlineFood: (foodId) => {
    const { foods, myPublished } = get();
    const food = myPublished.find(f => f.id === foodId);
    if (!food) return false;

    const onlineFn = (f: FoodItem) => {
      if (f.id === foodId) {
        const newStatus: FoodItem['status'] = f.remaining > 0 ? 'available' : 'reserved';
        return { ...f, status: newStatus };
      }
      return f;
    };

    const updatedMyPublished = myPublished.map(onlineFn);
    const updatedFoods = foods.map(onlineFn);

    set({ myPublished: updatedMyPublished, foods: updatedFoods });
    return true;
  },

  deleteFood: (foodId) => {
    const { foods, myPublished, favorites, orders } = get();
    const foodExists = myPublished.some(f => f.id === foodId);
    if (!foodExists) return false;

    set({
      myPublished: myPublished.filter(f => f.id !== foodId),
      foods: foods.filter(f => f.id !== foodId),
      favorites: favorites.filter(f => f.id !== foodId),
      orders: orders.map(o => o.foodId === foodId ? { ...o, status: 'expired' as const } : o)
    });
    return true;
  },

  addReview: (reviewData, userInfo) => {
    const { reviews, orders } = get();
    const order = orders.find(o => o.id === reviewData.orderId);
    if (!order || order.reviewed) return null;

    const newReview: Review = {
      id: `r${Date.now()}`,
      orderId: reviewData.orderId,
      foodId: reviewData.foodId,
      foodTitle: reviewData.foodTitle,
      userId: userInfo.id,
      userName: userInfo.name,
      userAvatar: userInfo.avatar,
      rating: reviewData.rating,
      content: reviewData.content,
      createdAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
      targetUserId: reviewData.targetUserId
    };

    const updatedOrders = orders.map(o => {
      if (o.id === reviewData.orderId) {
        return { ...o, reviewed: true };
      }
      return o;
    });

    set({ reviews: [newReview, ...reviews], orders: updatedOrders });
    return newReview;
  },

  getReviewsForTarget: (targetUserId) => {
    const { reviews } = get();
    return reviews.filter(r => r.targetUserId === targetUserId);
  }
}));
