<template>
  <!-- <van-tabs v-model:active="active" sticky shrink color="#F9571D">
    <van-tab title="AWL Lotto" title-style="font-size: 0.4rem; width: 3rem;"></van-tab>
    <van-tab :title="$t('msg.a37')" title-style="font-size: 0.4rem; width: 2rem;"></van-tab>
  </van-tabs> -->
  <div class="tabs">
    <div class="img1" :class="[active === 0 ? 'img-on' : 'img-off']" @click="active = 0">Lotto</div>
    <div class="img2" :class="[active === 1 ? 'img-on' : 'img-off']" @click="active = 1">Me</div>
  </div>
  <Home v-if="active === 0"></Home>
  <ReportForms v-if="active === 1"></ReportForms>
  <Dialog :visible="dialogShow" :title="$t('msg.a34')" :confirm-button-text="$t('msg.a35')" @confirm="goHome" @close="onClose">
    <div ref="bill" class="row">
      <p class="text">
        <span class="color999">{{ $t('msg.a36') }}:</span><span class="color333">{{ url }}</span>
      </p>
      <p class="text">
        <span class="color999">{{ $t('msg.a5') }}:</span><span class="color333">{{ username }}</span>
      </p>
      <p class="text">
        <span class="color999">{{ $t('msg.a6') }}:</span><span class="color333">{{ password }}</span>
      </p>
    </div>
  </Dialog>
</template>
<script setup>
import html2Canvas from 'html2canvas';
import { Toast } from 'vant';
import Home from './home.vue';
import ReportForms from './reportForms.vue';
import Dialog from '@/components/Dialog.vue';
import lance from '@/utils/lance';

const active = ref(0);
const username = ref('');
const password = ref('');
const dialogShow = ref(false);
const url = ref('');
onMounted(() => {
  if (lance.getJson('registerInfo') && lance.getJson('registerInfo').username) {
    username.value = lance.getJson('registerInfo').username;
    password.value = lance.getJson('registerInfo').password;
    dialogShow.value = true;
    url.value = import.meta.env.VITE_C_H5_URL || '';
  }
});
const onClose = () => {
  dialogShow.value = false;
  lance.clearStorage('registerInfo');
};
// const currentInstance = getCurrentInstance();
const bill = ref(null);
// 截图保存跳首页
const goHome = async () => {
  // const ret = await generateSharedImages(currentInstance.ctx.$refs.bill);
  // console.log(bill.value);
  const ret = await generateSharedImages(bill.value);
  // console.log(ret);
  if (ret) {
    dialogShow.value = false;
  }
  lance.clearStorage('registerInfo');
};
// 生成分享图片
const generateSharedImages = (el) => {
  return new Promise((resolve) => {
    html2Canvas(el, {
      backgroundColor: '#e8f4ff',
      useCORS: true, // 如果截图的内容里有图片,可能会有跨域的情况,加上这个参数,解决文件跨域问题
    })
      .then((canvas) => {
        const dataURL = canvas.toDataURL('image/png');
        // console.log(dataURL);
        // this.canvasImageUrl = dataURL
        const creatDom = document.createElement('a');
        document.body.appendChild(creatDom);
        creatDom.href = dataURL;
        creatDom.download = 'img';
        creatDom.click();
        // resolve(this.base64ToFile(dataURL));
        // 压缩图片
        // this.changeImgSize(dataURL, 500, function (newBase64) {
        //     console.log('压缩前',dataURL.length)
        //     console.log('压缩后',newBase64.length)
        //     resolve(newBase64)
        // })
        resolve(true);
      })
      .catch((err) => {
        Toast(err);
      });
  }).catch((err) => {
    Toast(err);
  });
};
</script>
<style lang="less" scoped>
.row {
  padding: 40px;
  background: #fff;
}
.text {
  display: flex;
  justify-content: space-between;
  align-items: center;
  line-height: 48px;
  font-size: 28px;
}
.tabs {
  display: flex;
  align-items: flex-end;
  padding-left: 10px;
  width: 100%;
  background: #fff;
  box-sizing: border-box;
  .img1 {
    z-index: 1;
    text-align: center;
  }
  .img2 {
    z-index: 0;
    margin-left: -70px;
    text-align: center;
  }
  .img-on {
    width: 295px;
    height: 84px;
    font-size: 30px;
    color: #333;
    line-height: 104px;
    background: url(/src/assets/img/home/tab1-on.png) no-repeat 0 0/100% 100%;
  }
  .img-off {
    width: 273px;
    height: 78px;
    font-size: 28px;
    color: #666;
    line-height: 100px;
    background: url(/src/assets/img/home/tab1-off.png) no-repeat 0 0/100% 100%;
  }
}
</style>
