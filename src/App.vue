<template>
  <RouterView />
</template>
<script setup>
import lance from '@/utils/lance';
import { isDev } from '@/utils/env';

// 渠道号为（C端H5彩民：80002、B端H5彩民：80001）后续接口都需要用到
onMounted(() => {
  if (isDev()) {
    lance.setData('channel', 80002);
  } else if (window.location.href.split('/')[2] === import.meta.env.VITE_B_H5_URL.split('/')[2]) {
    lance.setData('channel', 80001);
  } else if (window.location.href.split('/')[2] === import.meta.env.VITE_C_H5_URL.split('/')[2]) {
    lance.setData('channel', 80002);
  }
});
</script>
<style>
body {
  color: #000000;
  background: #ffffff !important;
}
.van-dialog__message {
  color: #000000 !important;
}
</style>
