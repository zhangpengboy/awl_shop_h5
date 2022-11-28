<template>
  <div class="balance">
    <van-nav-bar title="余额明细详情" left-arrow @click-left="back" />
    <div v-if="false" class="type1">
      <div class="top">
        <div class="title">6D幸运生肖</div>
        <div class="desc">期号02151251</div>
      </div>
      <div class="bottom">
        <div>
          <span>开奖时间</span>
          <span class="color999">22/10/2022 01:25pm</span>
        </div>
        <div>
          <span>销量合计</span>
          <span class="color999">KHR90,000</span>
        </div>
        <div>
          <span>佣金合计</span>
          <span class="color999">KHR90,000</span>
        </div>
        <div>
          <span>余额</span>
          <span class="color333">KHR123,006,300</span>
        </div>
      </div>
    </div>
    <div class="type2">
      <div class="top">
        <img src="../../assets/img/salesAndTheWallet/group.png" alt="" />
        <span>转账成功</span>
      </div>
      <div class="bottom">
        <div>
          <span>转账类型</span>
          <span class="color333">店主转账</span>
        </div>
        <div>
          <span>转账时间</span>
          <span class="color999">24/10/2022 05:25pm</span>
        </div>
        <div v-if="false">
          <span style="color: #3885d2">查询和TA的转账记录</span>
          <img src="../../assets/img/salesAndTheWallet/right.png" alt="" />
        </div>
        <div>
          <span>余额</span>
          <span class="color333">KHR123,006,300</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from 'vue';

export default {
  name: 'Balance',

  setup() {
    const state = reactive({
      a: 0,
    });
    function back() {
      this.$router.back();
    }
    return {
      state, // 状态
      back, // 返回
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
  .type1 {
    .top {
      display: flex;
      justify-content: flex-start;
      align-items: flex-start;
      flex-direction: column;
      height: 1.76rem;
      background: #fff;
      width: 100vw;
      box-sizing: border-box;
      padding: 0.3733rem 0 0.2667rem 0.48rem;
      .title {
        height: 0.56rem;
        font-size: 0.4rem;
        font-family: PingFang SC;
        font-weight: 500;
        line-height: 0.56rem;
        color: #333333;
      }
      .desc {
        height: 0.5067rem;
        font-size: 0.3467rem;
        font-family: PingFang SC;
        font-weight: 400;
        line-height: 0.5067rem;
        color: #333333;
      }
    }
    .bottom {
      margin-top: 0.2667rem;
      > div {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #f5f5f5;
        padding: 0 0.3733rem 0 0.48rem;
        height: 0.9333rem;
        width: 100%;
        background: #fff;
        > span {
          &:first-child {
            font-size: 0.3467rem;
            font-family: PingFang SC;
            font-weight: 400;
            line-height: 0.5067rem;
            color: #333333;
            height: 0.5067rem;
          }
          &:last-child {
            height: 0.5067rem;
            font-size: 0.3467rem;
            font-family: PingFang SC;
            font-weight: 400;
            line-height: 0.5067rem;
          }
        }
        .color999 {
          color: #999999;
        }
        .color333 {
          color: #333333;
        }
      }
    }
  }
  .type2 {
    width: 100%;
    height: calc(100vh - 44px);
    .top {
      margin: 0.2667rem auto;
      height: 3.5467rem;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;
      background: #fff;
      > img {
        display: block;
        width: 1.0667rem;
        height: 1.0667rem;
        margin: 0.64rem 0 0.5067rem 0;
      }
      > span {
        height: 0.6667rem;
        font-size: 0.48rem;
        font-family: PingFang SC;
        font-weight: 500;
        line-height: 0.6667rem;
        color: #333333;
      }
    }
    .bottom {
      background: #fff;
      > div {
        height: 0.9333rem;
        padding: 0 0.3733rem 0 0.48rem;
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #f5f5f5;
        > span {
          &:first-child {
            height: 0.5067rem;
            font-size: 0.3467rem;
            font-family: PingFang SC;
            font-weight: 400;
            line-height: 0.5067rem;
            color: #333333;
          }
        }
        > img {
          display: block;
          width: 0.1867rem;
          height: 0.3467rem;
        }
        .color333 {
          height: 0.5067rem;
          font-size: 0.3467rem;
          font-family: PingFang SC;
          font-weight: 400;
          line-height: 0.5067rem;
          color: #333333;
        }
        .color999 {
          height: 0.5067rem;
          font-size: 0.3467rem;
          font-family: PingFang SC;
          font-weight: 400;
          line-height: 0.5067rem;
          color: #999999;
        }
      }
    }
  }
}
</style>
