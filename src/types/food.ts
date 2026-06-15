export interface FoodItem {
  id: string;
  title: string;
  description: string;
  images: string[];
  category: string;
  quantity: number;
  remaining: number;
  unit: string;
  expireTime: string;
  pickupStartTime: string;
  pickupEndTime: string;
  allergens: string[];
  publisher: Publisher;
  location: Location;
  distance: number;
  status: 'available' | 'reserved' | 'claimed' | 'expired';
  createdAt: string;
  isFavorite: boolean;
}

export interface Publisher {
  id: string;
  name: string;
  avatar: string;
  type: 'resident' | 'merchant';
  creditScore: number;
  phone: string;
}

export interface Location {
  address: string;
  community: string;
  latitude: number;
  longitude: number;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface Order {
  id: string;
  foodId: string;
  foodTitle: string;
  foodImage: string;
  quantity: number;
  pickupCode: string;
  status: 'reserved' | 'picked' | 'cancelled' | 'expired';
  publisherName: string;
  publisherAvatar: string;
  pickupAddress: string;
  pickupStartTime: string;
  pickupEndTime: string;
  createdAt: string;
}

export interface Review {
  id: string;
  orderId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  content: string;
  createdAt: string;
}

export interface UserInfo {
  id: string;
  name: string;
  avatar: string;
  phone: string;
  type: 'resident' | 'merchant';
  creditScore: number;
  community: string;
  publishCount: number;
  claimCount: number;
}

export interface BlacklistItem {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  reason: string;
  createdAt: string;
}

export interface ReportItem {
  id: string;
  targetId: string;
  targetType: 'food' | 'user';
  reason: string;
  description: string;
  images: string[];
  status: 'pending' | 'processed' | 'rejected';
  createdAt: string;
}
