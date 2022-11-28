<script setup>
const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: '',
  },
  confirmButtonText: {
    type: String,
    required: true,
  },
});
const emit = defineEmits(['update:visible', 'confirm', 'close']);
const isShow = ref(props.visible);
const close = () => {
  emit('close');
};
const confirm = () => {
  emit('confirm');
};
</script>
<template>
  <van-overlay :show="visible" @click="close">
    <div class="wrapper" @click.stop>
      <div class="block">
        <span class="close" @click="close">X</span>
        <p class="title">{{ title }}</p>
        <slot></slot>
        <div class="confim" @click="confirm">{{ confirmButtonText }}</div>
      </div>
    </div>
  </van-overlay>
</template>

<style scoped>
.wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: auto;
  height: 100%;
}

.block {
  width: 640px;
  border-radius: 16px;
  background-color: #fff;
}
.close {
  position: relative;
  top: 30px;
  right: -580px;
  font-size: 30px;
  color: #666;
}
.title {
  margin: 40px 0;
  font-size: 34px;
  font-weight: 400;
  text-align: center;
  color: #131417;
}
.confim {
  width: 640px;
  height: 95px;
  font-size: 34px;
  text-align: center;
  color: #fff;
  background: #ff6619;
  line-height: 95px;
  border-bottom-left-radius: 16px;
  border-bottom-right-radius: 16px;
}
</style>
