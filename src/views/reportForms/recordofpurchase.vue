<template>
  <div class="transactions">
    <van-nav-bar :title="$t('reportForms.a92')" left-arrow @click-left="back" />
    <div class="tab">
      <span :class="state.current === 0 ? 'current' : ''" @click="changTab(0)">{{ $t('reportForms.a116') }}</span>
      <span :class="state.current === 2 ? 'current' : ''" @click="changTab(2)">{{ $t('reportForms.a117') }}</span>
      <span :class="state.current === 1 ? 'current' : ''" @click="changTab(1)">{{ $t('reportForms.a118') }}</span>
    </div>
    <div class="listbox">
      <van-pull-refresh v-model="state.refreshloading" :pulling-text="$t('reportForms.a177')" :loosing-text="$t('reportForms.a178')" :loading-text="$t('reportForms.a179')" @refresh="onRefresh">
        <van-list v-model:loading="state.loading" :finished="state.finished" :finished-text="$t('reportForms.a119')" :loading-text="$t('reportForms.a179')" @load="onLoad">
          <div class="list">
            <div v-for="(item, index) in state.list" :key="index" class="item" @click="godetail(item)">
              <img :src="filterLoteryImg(item.lotteryType)" alt="" class="icon" />
              <div class="right">
                <p>
                  <span class="type1">{{ item.lotteryName }}</span>
                  <!-- <span class="number">-{{ item.buyAmount + ' ' + item.currency }}</span> -->
                  <span v-if="item.orderStatusInt === 6">{{ $t('reportForms.a184') + item.winAmount + item.currency }}</span>
                  <span v-else>{{ filterOrderStatusInt(item.orderStatusInt) }}</span>
                </p>
                <p>
                  <span class="time">{{ item.date + ' ' + item.time }}</span>
                  <span class="balance">{{ $t('reportForms.a120') }}{{ item.buyAmount + item.currency }}</span>
                </p>
              </div>
            </div>
          </div>
        </van-list>
      </van-pull-refresh>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { Toast } from 'vant';
import { useI18n } from 'vue-i18n';
import reportforms from '@/api/reportforms';
import lance from '@/utils/lance';
import zodiac from '@/assets/img/lucky_zodiac.png';
import mark99 from '@/assets/img/mark1choose99.png';
import klaKlouk from '@/assets/img/klaKlouk.png';
import mark6 from '@/assets/img/specialZodiac.png';

export default {
  name: 'Transactions',

  setup() {
    const { t } = useI18n();
    const $router = useRouter();
    const state = reactive({
      current: 0,
      page: 1,
      loading: false,
      finished: false,
      refreshloading: false,
      list: [],
    });
    const back = () => {
      $router.back();
    };
    const onClickTab = () => {
      console.log('onClickTab');
    };
    const onRefresh = () => {
      state.page = 1;
      state.finished = false;
      state.list = [];
      state.refreshloading = true;
      onLoad();
      state.refreshloading = false;
    };
    const onLoad = () => {
      getDate();
      console.log('onLoad');
    };
    const changTab = (index) => {
      state.finished = false;
      state.current = index;
      onRefresh();
    };
    const filterLoteryImg = (lottery) => {
      const obj = {
        animal: zodiac,
        '99C1': mark99,
        fish: klaKlouk,
        '49C6': mark6,
      };
      return obj[lottery];
    };
    const godetail = (item) => {
      $router.push({
        path: '/orderDetail',
        query: {
          orderId: item.orderId,
          lottery: item.lotteryType,
        },
      });
    };
    const filterOrderStatusInt = (item) => {
      const obj = {
        1: t('reportForms.a76'), // 下注失败
        2: t('reportForms.a118'), // 待开奖
        3: t('Diamond.OrderDetail.Refunded'), // 已退款
        4: t('goldBet.nowin'), // 未中奖
        5: t('goldBet.win'), // 已中奖
      };
      return obj[item];
    };
    const getDate = () => {
      if (state.loading || state.finished) {
        return;
      }
      state.loading = true;
      reportforms
        .orderlist({
          appInfo: {
            imei: lance.randomString(),
            version: '',
            machineId: '',
            osVersion: '',
            pkgName: '',
            mac: '',
            versionCode: '',
            ip: '',
            deviceType: '',
          },
          data: {
            orderStatus: state.current,
            searchTime: 2,
            currentPage: state.page,
            orderType: 'normal',
            pageNumber: 20,
          },
        })
        .then((res) => {
          if (res && res.code === 200) {
            if (res.data.data.length < 20) {
              state.finished = true;
            } else {
              state.page++;
            }
            const arr = res.data.data;
            arr.forEach((item) => {
              item.buyAmount = `${lance.filterMoney(Number(item.buyAmount))}`;
              item.winAmount = `${lance.filterMoney(Number(item.winAmount))}`;
            });
            state.list = state.list.concat(arr);
            state.loading = false;
          }
        })
        .catch((err) => {
          state.finished = true;
          state.loading = false;
          console.log(err);
        });
    };
    onMounted(() => {
      getDate();
      console.log('onMounted');
    });
    return {
      state, // 状态
      t,
      back, // 返回
      onClickTab, // 切换标签页
      onRefresh,
      filterLoteryImg,
      onLoad,
      changTab,
      godetail,
      filterOrderStatusInt,
    };
  },
};
</script>

<style lang="scss" scoped>
.transactions {
  height: 100vh;
  width: 100vw;
  background: #f6f6f6;
  color: #000;
  :deep(.van-nav-bar__content) {
    height: 87px;
  }
  :deep(.van-tabs__wrap) {
    height: 90px;
  }
  .type {
    width: 710px;
    height: 242px;
    background: #fff;
    border-radius: 10px;
    margin: 20px auto 2px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    .number {
      margin: 55px 0 1px 0;
      min-width: 248px;
      height: 90px;
      font-size: 64px;
      font-family: PingFang SC;
      font-weight: 600;
      line-height: 90px;
      color: #333333;
    }
    .text {
      min-width: 60px;
      height: 42px;
      font-size: 30px;
      font-family: PingFang SC;
      font-weight: 400;
      line-height: 42px;
      color: #333333;
    }
  }
  .top,
  .bottom {
    width: 710px;
    min-height: 432px;
    background: #fff;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    box-sizing: border-box;
    padding: 29px 29px 30px 25px;
    margin: 0 auto 20px;
    > div {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      margin-bottom: 40px;
      > span {
        &:first-child {
          min-width: 112px;
          height: 40px;
          font-size: 28px;
          font-family: PingFang SC;
          font-weight: 400;
          line-height: 40px;
          color: #666666;
        }
        &:last-child {
          min-width: 118px;
          height: 42px;
          font-size: 30px;
          font-family: PingFang SC;
          font-weight: 400;
          line-height: 42px;
          color: #333333;
          opacity: 1;
        }
      }
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
  .tab {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 90px;
    width: 100%;
    background: #ffffff;
    box-sizing: border-box;
    border-top: 2px solid #f6f6f6;
    > span {
      flex: 1;
      height: 90px;
      width: 100%;
      font-size: 32px;
      font-family: PingFang SC;
      font-weight: 400;
      line-height: 45px;
      text-align: center;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #999999;
      word-break: break-all;
    }
    .current {
      position: relative;
      color: #333;
      &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 90px;
        height: 6px;
        display: block; //块级元素
        background: #f83e11;
      }
    }
  }
  .listbox {
    margin-top: 20px;
    width: 100%;
    .list {
      width: 100%;
      background: #fff;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;
      .item {
        height: 130px;
        width: 100%;
        box-sizing: border-box;
        padding: 26px 25px 21px 31px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        border-bottom: 2px solid #f6f6f6;
        > img {
          display: block;
          width: 82px;
          height: 70px;
          margin-right: 32px;
        }
        .right {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: center;
          > p {
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: space-between;
            > .type1 {
              height: 40px;
              font-size: 28px;
              font-family: PingFang SC;
              font-weight: 400;
              line-height: 40px;
              color: #333333;
            }
            .number {
              height: 42px;
              font-size: 30px;
              font-family: PingFang SC;
              font-weight: 500;
              line-height: 42px;
              color: #333333;
            }
            .time {
              height: 33px;
              font-size: 24px;
              font-family: PingFang SC;
              font-weight: 500;
              line-height: 33px;
              color: #999999;
            }
            .balance {
              height: 37px;
              font-size: 26px;
              font-family: PingFang SC;
              font-weight: 400;
              line-height: 37px;
              color: #999999;
            }
          }
        }
      }
    }
  }
}
</style>
