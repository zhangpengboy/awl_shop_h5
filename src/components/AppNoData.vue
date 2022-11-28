<template>
  <div class="app-nodata">
    <img src="@/assets/nodata.png" alt="" />
    <span>{{ value }}</span>
  </div>
</template>

<script>
export default {
  name: 'AppNoData',
  props: {
    value: {
      type: String,
      default: '',
    },
  },
};
</script>

<style lang="less" scoped>
.app-nodata {
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
  flex-direction: column;
  img {
    margin: 92px 0 29px;
    width: 132px;
    height: 173px;
  }
  span {
    font-size: 15px;
    font-weight: 400;
    color: #999999;
  }
}
</style>
