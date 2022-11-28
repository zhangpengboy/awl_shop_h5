<template>
  <div class="dailyReport">
    <van-nav-bar title="每日报表" left-arrow @click-left="back" />
    <div class="search">
      <van-dropdown-menu>
        <van-dropdown-item ref="item" v-model="currentDate" title="筛选">
          <van-datetime-picker v-model="currentDate" type="date" title="选择年月日" :min-date="minDate" :max-date="maxDate" @cancel="timeCancel" @confirm="timeConfirm" />
        </van-dropdown-item>
      </van-dropdown-menu>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from 'vue';

export default {
  name: 'DailyReport',

  setup() {
    const state = reactive({
      a: 0,
      timeshow: false,
      minDate: new Date(2020, 0, 1),
      maxDate: new Date(2025, 10, 1),
      currentDate: new Date(2021, 0, 17),
    });
    const currentDate = ref(new Date(2021, 0, 17));
    function back() {
      this.$router.back();
    }
    function timeCancel() {
      console.log(this.$refs);
      this.$refs.time.pickerVisible = true;
    }
    function timeConfirm(value) {
      console.log(value);
    }
    return {
      state, // 状态
      back, // 返回
      timeCancel, // 时间选择器取消
      timeConfirm, // 时间选择器确认
      minDate: new Date(2020, 0, 1),
      maxDate: new Date(2025, 10, 1),
      currentDate,
    };
  },
};
</script>

<style lang="less" scoped>
.dailyReport {
  width: 100vw;
  height: 100vh;
  .search {
    width: 100%;
    height: 1.0667rem;
    // 左外边距
    :deep(.van-dropdown-menu__item) {
      display: flex;
      flex: none;
      margin-right: 0.14rem;
    }
    // 内边距
    :deep(.van-dropdown-menu__title) {
      padding: 0 0.28rem;
    }
    // 箭头颜色
    :deep(.van-dropdown-menu__title:after) {
      border-color: transparent transparent #323232 #323232;
    }
    // 字体
    :deep(.van-ellipsis) {
      font-size: 0.28rem;
      font-family: PingFang SC;
      font-weight: 400;
      line-height: 0.4rem;
      color: #333333;
    }
    // 高度
    :deep(.van-dropdown-menu) {
      height: 1.0667rem !important;
    }
    :deep(.van-dropdown-menu__bar) {
      height: 1.0667rem !important;
    }
  }
}
</style>
