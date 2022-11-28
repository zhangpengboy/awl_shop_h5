import { createRouter, createWebHashHistory } from 'vue-router';
import store from '@/store';

import demoRouters from './modules/demo';
import { useCounterStore } from '@/store/modules/counter';

const routes = [...demoRouters];

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    return {
      el: '#app',
      top: 0,
      behavior: 'smooth',
    };
  },
});
const counterStore = useCounterStore(store);
router.beforeEach((to, from, next) => {
  if (to.meta.noAuth) {
    next();
  } else {
    if (!counterStore.hasLogin) {
      next('/login');
      return false;
    }
    if (counterStore.user.hasPwd === 0) {
      next('/changingInitialPassword');
      return false;
    }
    next();
  }
});

export default router;
