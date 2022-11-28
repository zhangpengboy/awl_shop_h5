<template>
  <div class="balance">
    <van-nav-bar title="余额明细列表" left-arrow @click-left="back" />
    <div class="search">
      <van-dropdown-menu>
        <van-dropdown-item v-model="state.value1" title="时间筛选" :options="state.option1" />
        <van-dropdown-item v-model="state.value2" title="请选择类型" :options="state.option2" />
      </van-dropdown-menu>
    </div>
    <div class="list">
      <van-pull-refresh v-model="state.refreshLoading" :pulling-text="$t('reportForms.a177')" :loosing-text="$t('reportForms.a178')" :loading-text="$t('reportForms.a179')" @refresh="onRefresh">
        <van-list v-model:loading="state.loading" :finished="state.finished" :finished-text="$t('reportForms.a119')" :loading-text="$t('reportForms.a179')" @load="onLoad">
          <div v-for="(item, index) in state.list" :key="index" class="item">
            <div class="top">
              <span class="type">{{ item.name }}</span>
              <span class="number" :class="item.number > 0 ? 'red' : 'green'">{{ item.number }}</span>
            </div>
            <div class="bottom">
              <span class="time">{{ item.time }}</span>
              <span class="balances">
                <span>余额：</span>
                <span>{{ item.balance }}</span>
              </span>
            </div>
          </div>
        </van-list>
      </van-pull-refresh>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from 'vue';

export default {
  name: 'Balance',

  setup() {
    const state = reactive({
      value1: '',
      value2: '',
      option1: [{ text: 'a', value: 'a' }],
      option2: [{ text: 'b', value: 'b' }],
      refreshLoading: false, // 是否下拉刷新
      loading: false, // 是否上拉加载中
      finished: true, // 是否完成加载
      list: [
        {
          name: '存款',
          time: '2018-06-21 15:29:32',
          number: 2000,
          type: 'add',
          balance: 1000,
        },
        {
          name: '存款',
          time: '2018-06-21 15:29:32',
          number: 2000,
          type: 'add',
          balance: 1000,
        },
        {
          name: '存款',
          time: '2018-06-21 15:29:32',
          number: 2000,
          type: 'add',
          balance: 1000,
        },
        {
          name: '存款',
          time: '2018-06-21 15:29:32',
          number: 2000,
          type: 'add',
          balance: 1000,
        },
      ],
    });
    function back() {
      this.$router.back();
    }
    function onRefresh() {
      console.log('onRefresh');
    }
    function onLoad() {
      console.log('onLoad');
    }
    return {
      state, // 状态
      back, // 返回
      onRefresh, // 刷新事件
      onLoad, // 加载中事件
    };
  },
};
</script>

<style lang="less" scoped>
.balance {
  width: 100vw;
  height: 100vh;
  background: #f6f6f6;
  :deep(.van-nav-bar__content) {
    height: 1.1733rem;
  }
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
  .list {
    margin-top: 0.1rem;
    height: calc(100vh - 1.1733rem - 1.0667rem);
    .item {
      width: 100vw;
      height: 1.8667rem;
      box-sizing: border-box;
      padding: 0.48rem 0.3467rem 0.32rem 0.3467rem;
      background: #fff;
      border-bottom: 1px solid #f5f5f5;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      > div {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: #fff;
      }
      .top {
        .type {
          font-size: 0.3733rem;
          font-family: PingFang SC;
          font-weight: 500;
          line-height: 0.3733rem;
          color: #333333;
        }
        .number {
          font-size: 0.3733rem;
          font-family: PingFang SC;
          font-weight: 400;
          line-height: 0.3733rem;
        }
        .red {
          color: #ff0000;
        }
        .green {
          color: #009d06;
        }
      }
      .bottom {
        .time {
          height: 0.4533rem;
          font-size: 0.32rem;
          font-family: PingFang SC;
          font-weight: 400;
          line-height: 0.4533rem;
          color: #999999;
        }
        .balances {
          height: 0.5067rem;
          > span {
            display: inline-block;
            font-size: 0.3467rem;
            font-family: PingFang SC;
            font-weight: 400;
            line-height: 0.5067rem;
            color: #333333 !important;
            margin-left: 0.08rem;
          }
        }
      }
      &:last-child {
        border-bottom: none;
      }
    }
  }
}
</style>
