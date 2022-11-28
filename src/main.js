import { createApp } from 'vue';
// 引入matter.js 2D物理引擎
// import * as Matter from './matter';
import App from './App.vue';
import router from './router';
import store from './store';
import { i18n } from './i18n';
import '@/assets/main.css';
import '@/style/index.less';
import 'lib-flexible/flexible.js';
import 'vant/es/toast/style';
import 'vant/es/dialog/style';
import lance from '@/utils/lance';
// 初始化语言
const InitializationLang = lance.getData('lang') || 'kh';
lance.setData('lang', InitializationLang);

createApp(App).use(router).use(store).use(i18n).mount('#app');
