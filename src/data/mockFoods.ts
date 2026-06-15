import { FoodItem, Category, Order, UserInfo, BlacklistItem } from '@/types/food';

export const categories: Category[] = [
  { id: 'all', name: '全部', icon: '🍽️' },
  { id: 'vegetables', name: '蔬菜', icon: '🥬' },
  { id: 'fruits', name: '水果', icon: '🍎' },
  { id: 'bakery', name: '烘焙', icon: '🍞' },
  { id: 'dairy', name: '乳制品', icon: '🥛' },
  { id: 'meat', name: '肉类', icon: '🥩' },
  { id: 'snacks', name: '零食', icon: '🍪' },
  { id: 'drinks', name: '饮品', icon: '🥤' },
  { id: 'other', name: '其他', icon: '📦' }
];

export const allergenOptions = [
  '含有麸质的谷物',
  '甲壳纲类动物',
  '蛋类',
  '鱼类',
  '花生',
  '大豆',
  '乳制品',
  '坚果',
  '芹菜',
  '芥末',
  '芝麻',
  '二氧化硫'
];

export const mockFoods: FoodItem[] = [
  {
    id: '1',
    title: '新鲜有机生菜',
    description: '自家阳台种植的有机生菜，纯天然无农药，今天刚采摘，还剩一些分享给邻居。口感清脆，适合做沙拉或炒菜。',
    images: [
      'https://picsum.photos/id/292/600/600',
      'https://picsum.photos/id/312/600/600'
    ],
    category: 'vegetables',
    quantity: 5,
    remaining: 3,
    unit: '颗',
    expireTime: '2026-06-17 18:00',
    pickupStartTime: '09:00',
    pickupEndTime: '18:00',
    allergens: [],
    publisher: {
      id: 'u1',
      name: '李阿姨',
      avatar: 'https://picsum.photos/id/64/200/200',
      type: 'resident',
      creditScore: 98,
      phone: '138****1234'
    },
    location: {
      address: '阳光花园小区3号楼2单元',
      community: '阳光花园',
      latitude: 39.9042,
      longitude: 116.4074
    },
    distance: 0.3,
    status: 'available',
    createdAt: '2026-06-15 08:30',
    isFavorite: false
  },
  {
    id: '2',
    title: '手工全麦面包',
    description: '面包店今天出炉的全麦面包，因备货过多临期处理。采用天然酵母发酵，口感扎实有嚼劲，健康又美味。',
    images: [
      'https://picsum.photos/id/431/600/600',
      'https://picsum.photos/id/625/600/600'
    ],
    category: 'bakery',
    quantity: 12,
    remaining: 8,
    unit: '个',
    expireTime: '2026-06-16 22:00',
    pickupStartTime: '18:00',
    pickupEndTime: '21:00',
    allergens: ['含有麸质的谷物', '乳制品'],
    publisher: {
      id: 'u2',
      name: '麦香坊烘焙',
      avatar: 'https://picsum.photos/id/177/200/200',
      type: 'merchant',
      creditScore: 95,
      phone: '010-8888****'
    },
    location: {
      address: '阳光花园小区东门商业街12号',
      community: '阳光花园',
      latitude: 39.9055,
      longitude: 116.4088
    },
    distance: 0.5,
    status: 'available',
    createdAt: '2026-06-15 15:00',
    isFavorite: true
  },
  {
    id: '3',
    title: '进口香蕉礼盒',
    description: '公司发的福利，家里吃不完。厄瓜多尔进口香蕉，香甜软糯，还有一周保质期。整盒出，大约8-10根。',
    images: [
      'https://picsum.photos/id/401/600/600'
    ],
    category: 'fruits',
    quantity: 1,
    remaining: 1,
    unit: '盒',
    expireTime: '2026-06-22 12:00',
    pickupStartTime: '10:00',
    pickupEndTime: '20:00',
    allergens: [],
    publisher: {
      id: 'u3',
      name: '王先生',
      avatar: 'https://picsum.photos/id/338/200/200',
      type: 'resident',
      creditScore: 92,
      phone: '139****5678'
    },
    location: {
      address: '翠湖天地小区5号楼1单元',
      community: '翠湖天地',
      latitude: 39.9078,
      longitude: 116.4102
    },
    distance: 0.8,
    status: 'available',
    createdAt: '2026-06-15 10:20',
    isFavorite: false
  },
  {
    id: '4',
    title: '鲜牛奶临期特惠',
    description: '超市采购的鲜牛奶，还有3天保质期，喝不完分享。全脂牛奶，香浓醇厚，适合早餐配麦片。',
    images: [
      'https://picsum.photos/id/580/600/600'
    ],
    category: 'dairy',
    quantity: 6,
    remaining: 4,
    unit: '盒',
    expireTime: '2026-06-18 24:00',
    pickupStartTime: '08:00',
    pickupEndTime: '22:00',
    allergens: ['乳制品'],
    publisher: {
      id: 'u4',
      name: '张奶奶',
      avatar: 'https://picsum.photos/id/1027/200/200',
      type: 'resident',
      creditScore: 99,
      phone: '136****9012'
    },
    location: {
      address: '阳光花园小区1号楼3单元',
      community: '阳光花园',
      latitude: 39.9038,
      longitude: 116.4065
    },
    distance: 0.2,
    status: 'available',
    createdAt: '2026-06-15 09:00',
    isFavorite: false
  },
  {
    id: '5',
    title: '精品五花肉',
    description: '肉店今天的新鲜五花肉，买多了吃不完。肥瘦相间，适合红烧肉、烤肉等，品质非常好。',
    images: [
      'https://picsum.photos/id/1080/600/600'
    ],
    category: 'meat',
    quantity: 2,
    remaining: 1,
    unit: '斤',
    expireTime: '2026-06-16 12:00',
    pickupStartTime: '14:00',
    pickupEndTime: '19:00',
    allergens: [],
    publisher: {
      id: 'u5',
      name: '刘师傅肉铺',
      avatar: 'https://picsum.photos/id/91/200/200',
      type: 'merchant',
      creditScore: 96,
      phone: '010-6666****'
    },
    location: {
      address: '翠湖天地小区南门菜市场A12',
      community: '翠湖天地',
      latitude: 39.9085,
      longitude: 116.4095
    },
    distance: 1.2,
    status: 'available',
    createdAt: '2026-06-15 11:30',
    isFavorite: true
  },
  {
    id: '6',
    title: '混合坚果大礼包',
    description: '生日收到的礼物，对坚果过敏只能分享。包含夏威夷果、腰果、杏仁、核桃等多种坚果。',
    images: [
      'https://picsum.photos/id/835/600/600'
    ],
    category: 'snacks',
    quantity: 1,
    remaining: 1,
    unit: '袋',
    expireTime: '2026-08-15 12:00',
    pickupStartTime: '09:00',
    pickupEndTime: '21:00',
    allergens: ['坚果', '大豆'],
    publisher: {
      id: 'u6',
      name: '陈小姐',
      avatar: 'https://picsum.photos/id/1025/200/200',
      type: 'resident',
      creditScore: 94,
      phone: '137****3456'
    },
    location: {
      address: '阳光花园小区8号楼1单元',
      community: '阳光花园',
      latitude: 39.9062,
      longitude: 116.4082
    },
    distance: 0.6,
    status: 'available',
    createdAt: '2026-06-14 20:00',
    isFavorite: false
  },
  {
    id: '7',
    title: '现磨豆浆',
    description: '早餐店每天现磨的豆浆，今天做多了一些。原味无糖，健康营养，需要的邻居可以来取。',
    images: [
      'https://picsum.photos/id/570/600/600'
    ],
    category: 'drinks',
    quantity: 10,
    remaining: 7,
    unit: '杯',
    expireTime: '2026-06-15 12:00',
    pickupStartTime: '08:00',
    pickupEndTime: '11:30',
    allergens: ['大豆'],
    publisher: {
      id: 'u7',
      name: '早安豆浆铺',
      avatar: 'https://picsum.photos/id/1018/200/200',
      type: 'merchant',
      creditScore: 97,
      phone: '010-7777****'
    },
    location: {
      address: '阳光花园小区西门底商3号',
      community: '阳光花园',
      latitude: 39.9048,
      longitude: 116.4055
    },
    distance: 0.4,
    status: 'available',
    createdAt: '2026-06-15 07:00',
    isFavorite: false
  },
  {
    id: '8',
    title: '自制辣椒酱',
    description: '妈妈亲手做的辣椒酱，用新鲜红辣椒和秘制配方，香辣可口。家里做太多吃不完，分享给大家。',
    images: [
      'https://picsum.photos/id/326/600/600'
    ],
    category: 'other',
    quantity: 5,
    remaining: 5,
    unit: '瓶',
    expireTime: '2026-09-15 12:00',
    pickupStartTime: '10:00',
    pickupEndTime: '20:00',
    allergens: ['大豆'],
    publisher: {
      id: 'u8',
      name: '赵大姐',
      avatar: 'https://picsum.photos/id/659/200/200',
      type: 'resident',
      creditScore: 93,
      phone: '135****7890'
    },
    location: {
      address: '翠湖天地小区3号楼2单元',
      community: '翠湖天地',
      latitude: 39.9072,
      longitude: 116.4110
    },
    distance: 1.0,
    status: 'available',
    createdAt: '2026-06-13 16:00',
    isFavorite: false
  },
  {
    id: '9',
    title: '新鲜草莓',
    description: '周末去采摘园摘的草莓，新鲜多汁，甜中带酸。买多了吃不完，分享给邻居们。',
    images: [
      'https://picsum.photos/id/1080/600/600'
    ],
    category: 'fruits',
    quantity: 3,
    remaining: 2,
    unit: '盒',
    expireTime: '2026-06-17 18:00',
    pickupStartTime: '09:00',
    pickupEndTime: '19:00',
    allergens: [],
    publisher: {
      id: 'u9',
      name: '孙叔叔',
      avatar: 'https://picsum.photos/id/237/200/200',
      type: 'resident',
      creditScore: 91,
      phone: '133****2345'
    },
    location: {
      address: '阳光花园小区6号楼3单元',
      community: '阳光花园',
      latitude: 39.9058,
      longitude: 116.4070
    },
    distance: 0.5,
    status: 'available',
    createdAt: '2026-06-15 09:30',
    isFavorite: false
  },
  {
    id: '10',
    title: '曲奇饼干礼盒',
    description: '朋友送的丹麦曲奇，家里没人爱吃。黄油曲奇，酥松可口，保质期还有半年。',
    images: [
      'https://picsum.photos/id/580/600/600'
    ],
    category: 'snacks',
    quantity: 2,
    remaining: 1,
    unit: '盒',
    expireTime: '2026-12-15 12:00',
    pickupStartTime: '11:00',
    pickupEndTime: '21:00',
    allergens: ['含有麸质的谷物', '乳制品', '蛋类', '坚果'],
    publisher: {
      id: 'u10',
      name: '周女士',
      avatar: 'https://picsum.photos/id/1027/200/200',
      type: 'resident',
      creditScore: 96,
      phone: '138****6789'
    },
    location: {
      address: '翠湖天地小区7号楼1单元',
      community: '翠湖天地',
      latitude: 39.9090,
      longitude: 116.4120
    },
    distance: 1.5,
    status: 'available',
    createdAt: '2026-06-12 14:00',
    isFavorite: false
  }
];

export const mockOrders: Order[] = [
  {
    id: 'o1',
    foodId: '2',
    foodTitle: '手工全麦面包',
    foodImage: 'https://picsum.photos/id/431/600/600',
    quantity: 2,
    pickupCode: '8821',
    status: 'reserved',
    publisherName: '麦香坊烘焙',
    publisherAvatar: 'https://picsum.photos/id/177/200/200',
    pickupAddress: '阳光花园小区东门商业街12号',
    pickupStartTime: '18:00',
    pickupEndTime: '21:00',
    createdAt: '2026-06-15 16:00'
  },
  {
    id: 'o2',
    foodId: '4',
    foodTitle: '鲜牛奶临期特惠',
    foodImage: 'https://picsum.photos/id/580/600/600',
    quantity: 2,
    pickupCode: '5634',
    status: 'picked',
    publisherName: '张奶奶',
    publisherAvatar: 'https://picsum.photos/id/1027/200/200',
    pickupAddress: '阳光花园小区1号楼3单元',
    pickupStartTime: '08:00',
    pickupEndTime: '22:00',
    createdAt: '2026-06-14 10:00'
  },
  {
    id: 'o3',
    foodId: '6',
    foodTitle: '混合坚果大礼包',
    foodImage: 'https://picsum.photos/id/835/600/600',
    quantity: 1,
    pickupCode: '7920',
    status: 'picked',
    publisherName: '陈小姐',
    publisherAvatar: 'https://picsum.photos/id/1025/200/200',
    pickupAddress: '阳光花园小区8号楼1单元',
    pickupStartTime: '09:00',
    pickupEndTime: '21:00',
    createdAt: '2026-06-14 21:00'
  }
];

export const mockUser: UserInfo = {
  id: 'currentUser',
  name: '小林同学',
  avatar: 'https://picsum.photos/id/1025/200/200',
  phone: '138****8888',
  type: 'resident',
  creditScore: 95,
  community: '阳光花园小区',
  publishCount: 12,
  claimCount: 28
};

export const mockBlacklist: BlacklistItem[] = [
  {
    id: 'b1',
    userId: 'bad1',
    userName: '不良用户A',
    userAvatar: 'https://picsum.photos/id/1015/200/200',
    reason: '多次预约未按时领取',
    createdAt: '2026-05-20 10:00'
  }
];

export const mockMyPublishedFoods: FoodItem[] = [
  {
    id: 'my1',
    title: '自家种的小番茄',
    description: '阳台种的小番茄成熟了，甜甜的很好吃，分享给邻居们。',
    images: ['https://picsum.photos/id/312/600/600'],
    category: 'fruits',
    quantity: 10,
    remaining: 4,
    unit: '盒',
    expireTime: '2026-06-18 18:00',
    pickupStartTime: '10:00',
    pickupEndTime: '19:00',
    allergens: [],
    publisher: {
      id: 'currentUser',
      name: '小林同学',
      avatar: 'https://picsum.photos/id/1025/200/200',
      type: 'resident',
      creditScore: 95,
      phone: '138****8888'
    },
    location: {
      address: '阳光花园小区5号楼2单元',
      community: '阳光花园',
      latitude: 39.9050,
      longitude: 116.4075
    },
    distance: 0,
    status: 'available',
    createdAt: '2026-06-15 08:00',
    isFavorite: false
  }
];
