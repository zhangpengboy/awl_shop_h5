export default [
  {
    name: 'notFound',
    path: '/',
    redirect: {
      name: 'home',
    },
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('@/views/home/index.vue'),
  },
  {
    path: '/login',
    name: 'login',
    meta: { title: '登录', noAuth: true },
    component: () => import('@/views/login/index.vue'),
  },
  {
    name: 'forgetPwd',
    path: '/forgetPwd',
    meta: { title: '忘记密码', noAuth: true },
    component: () => import('@/views/login/forgetPwd.vue'),
  },
  {
    name: 'salesAndTheWalletalanceList',
    path: '/salesAndTheWallet/balancelist',
    meta: { title: '余额明细列表' },
    component: () => import('@/views/salesAndTheWallet/balancelist.vue'),
  },
  {
    name: 'salesAndTheWalletalanceDetail',
    path: '/salesAndTheWallet/balancedetail',
    meta: { title: '余额明细列表' },
    component: () => import('@/views/salesAndTheWallet/balancedetail.vue'),
  },
  {
    name: 'salesAndTheWalletalanceDailyReport',
    path: '/salesAndTheWallet/dailyReport',
    meta: { title: '每日报表' },
    component: () => import('@/views/salesAndTheWallet/dailyReport.vue'),
  },
  {
    name: 'bdeposit',
    path: '/reportForms/bdeposit',
    meta: { title: '充值' },
    component: () => import('@/views/reportForms/bdeposit.vue'), // B端充值
  },
  {
    name: 'cdeposit',
    path: '/reportForms/cdeposit',
    meta: { title: '充值' },
    component: () => import('@/views/reportForms/cdeposit.vue'), // C端充值
  },
  {
    name: 'transfer',
    path: '/reportForms/transfer',
    meta: { title: '转账' },
    component: () => import('@/views/reportForms/transfer.vue'), // 转账
  },
  {
    name: 'withdrawal',
    path: '/reportForms/withdrawal',
    meta: { title: '提现' },
    component: () => import('@/views/reportForms/withdrawal.vue'), // 提现
  },
  {
    name: 'bankcardwithdrawal',
    path: '/reportForms/bankcardwithdrawal',
    meta: { title: '银行账户取款' },
    component: () => import('@/views/reportForms/bankcardwithdrawal.vue'), // 银行账户取款
  },
  {
    name: 'addacount',
    path: '/reportForms/addacount',
    meta: { title: '添加取款账户', keepAlive: true },
    component: () => import('@/views/reportForms/addacount.vue'), // 添加取款账户
  },
  {
    name: 'onlinewithdrawal',
    path: '/reportForms/onlinewithdrawal',
    meta: { title: '网店提现' },
    component: () => import('@/views/reportForms/onlinewithdrawal.vue'), // 网店提现
  },
  {
    name: 'offlinewithdrawal',
    path: '/reportForms/offlinewithdrawal',
    meta: { title: '网点提现' },
    component: () => import('@/views/reportForms/offlinewithdrawal.vue'), // 网点提现
  },
  {
    name: 'billdetail',
    path: '/reportForms/billdetail',
    meta: { title: '账单详情' },
    component: () => import('@/views/reportForms/billdetail.vue'), // 账单详情
  },
  {
    name: 'transactions',
    path: '/reportForms/transactions',
    meta: { title: '交易明细' },
    component: () => import('@/views/reportForms/transactions.vue'), // 交易明细
  },
  {
    name: 'recordofpurchase',
    path: '/reportForms/recordofpurchase',
    meta: { title: '购彩记录' },
    component: () => import('@/views/reportForms/recordofpurchase.vue'), // 购彩记录
  },
  {
    name: 'myacount',
    path: '/reportForms/myacount',
    meta: { title: '我的取款账户' },
    component: () => import('@/views/reportForms/myacount.vue'), // 我的取款账户
  },
  {
    name: 'service',
    path: '/reportForms/service',
    meta: { title: '客服', noAuth: true },
    component: () => import('@/views/reportForms/service.vue'), // 客服
  },
  {
    name: 'setting',
    path: '/reportForms/setting',
    meta: { title: '设置' },
    component: () => import('@/views/reportForms/setting.vue'), // 设置
  },
  {
    name: 'settingpassword',
    path: '/reportForms/settingpassword',
    meta: { title: '设置密码' },
    component: () => import('@/views/reportForms/settingpassword.vue'), // 设置密码
  },
  {
    name: 'settingphone',
    path: '/reportForms/settingphone',
    meta: { title: '设置手机号码' },
    component: () => import('@/views/reportForms/settingphone.vue'), // 设置手机号码
  },
  {
    name: 'settingpin',
    path: '/reportForms/settingpin',
    meta: { title: '设置pin', keepAlive: true },
    component: () => import('@/views/reportForms/settingpin.vue'), // 设置pin
  },
  {
    name: 'forgetpin',
    path: '/reportForms/forgetpin',
    meta: { title: '忘记PIN', keepAlive: true },
    component: () => import('@/views/reportForms/forgetpin.vue'), // 忘记PIN
  },
  {
    name: 'register',
    path: '/register',
    meta: { title: '注册', noAuth: true },
    component: () => import('@/views/login/register.vue'),
  },
  {
    name: 'luckyZodiac',
    path: '/luckyZodiac',
    meta: { title: '6D Lucky Zodiac' },
    component: () => import('@/views/lottery/luckyZodiac/index.vue'),
  },
  {
    name: 'mark1choose99',
    path: '/mark1choose99',
    meta: { title: '99选1' },
    component: () => import('@/views/lottery/mark1choose99/index.vue'),
  },
  {
    name: 'klaKlouk',
    path: '/klaKlouk',
    meta: { title: 'klaKlouk' },
    component: () => import('@/views/lottery/klaKlouk/index.vue'),
  },
  {
    name: 'specialZodiac',
    path: '/specialZodiac',
    meta: { title: '6D specialZodiac' },
    component: () => import('@/views/lottery/specialZodiac/index.vue'),
  },
  {
    name: 'playingInstrution',
    path: '/playingInstrution',
    meta: { title: '玩法说明' },
    component: () => import('@/views/lottery/playingInstrution.vue'),
  },
  {
    name: 'lotteryPlay',
    path: '/lotteryPlay',
    meta: { title: '视频教程' },
    component: () => import('@/views/lottery/lotteryPlay.vue'),
  },
  {
    name: 'orderDetail',
    path: '/orderDetail',
    meta: { title: '订单详情' },
    component: () => import('@/views/lottery/orderDetail.vue'),
  },
  {
    name: 'changingInitialPassword',
    path: '/changingInitialPassword',
    meta: { title: '修改初始密码', noAuth: true },
    component: () => import('@/views/login/changingInitialPassword.vue'),
  },
];
