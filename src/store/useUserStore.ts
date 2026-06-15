import { create } from 'zustand';
import { UserInfo, BlacklistItem } from '@/types/food';
import { mockUser, mockBlacklist } from '@/data/mockFoods';

interface UserState {
  user: UserInfo;
  blacklist: BlacklistItem[];
}

interface UserActions {
  updateUser: (user: Partial<UserInfo>) => void;
  addToBlacklist: (item: BlacklistItem) => void;
  removeFromBlacklist: (userId: string) => void;
}

export const useUserStore = create<UserState & UserActions>((set) => ({
  user: mockUser,
  blacklist: mockBlacklist,

  updateUser: (user) => set((state) => ({
    user: { ...state.user, ...user }
  })),

  addToBlacklist: (item) => set((state) => ({
    blacklist: [item, ...state.blacklist]
  })),

  removeFromBlacklist: (userId) => set((state) => ({
    blacklist: state.blacklist.filter(item => item.userId !== userId)
  }))
}));
