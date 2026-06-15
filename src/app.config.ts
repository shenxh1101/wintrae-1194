export default defineAppConfig({
  pages: [
    'pages/home/index',
    'pages/publish/index',
    'pages/orders/index',
    'pages/profile/index',
    'pages/detail/index',
    'pages/my-publish/index',
    'pages/favorites/index',
    'pages/reviews/index',
    'pages/blacklist/index',
    'pages/report/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#00B578',
    navigationBarTitleText: '邻食共享',
    navigationBarTextStyle: 'white',
    backgroundColor: '#F5F9F7'
  },
  tabBar: {
    color: '#86909C',
    selectedColor: '#00B578',
    backgroundColor: '#FFFFFF',
    borderStyle: 'white',
    list: [
      {
        pagePath: 'pages/home/index',
        text: '首页'
      },
      {
        pagePath: 'pages/publish/index',
        text: '发布'
      },
      {
        pagePath: 'pages/orders/index',
        text: '领取'
      },
      {
        pagePath: 'pages/profile/index',
        text: '我的'
      }
    ]
  }
})
