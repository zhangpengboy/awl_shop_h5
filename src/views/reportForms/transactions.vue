<template>
  <div class="transactions">
    <van-nav-bar :title="$t('reportForms.a146')" left-arrow @click-left="back" />
    <div class="tab">
      <span :class="state.current === 1 ? 'current' : ''" @click="changTab(1)">{{ $t('reportForms.a116') }}</span>
      <span :class="state.current === 2 ? 'current' : ''" @click="changTab(2)">{{ $t('reportForms.a35') }}</span>
      <span :class="state.current === 3 ? 'current' : ''" @click="changTab(3)">{{ $t('reportForms.a111') }}</span>
    </div>
    <div class="listbox">
      <van-pull-refresh v-model="state.refreshloading" :pulling-text="$t('reportForms.a177')" :loosing-text="$t('reportForms.a178')" :loading-text="$t('reportForms.a179')" @refresh="onRefresh">
        <van-list v-model:loading="state.loading" :finished="state.finished" :finished-text="$t('reportForms.a119')" :loading-text="$t('reportForms.a179')" @load="onLoad">
          <div class="list">
            <div v-for="(item, index) in state.list" :key="index" class="item" @click="gobilldetail(item)">
              <p>
                <span class="type1">{{ item.name }}</span>
                <span class="number">{{ item.cashShow }}</span>
              </p>
              <p>
                <span class="time">{{ item.createTime }}</span>
                <span class="balance">{{ $t('reportForms.a147') }}{{ item.balance }}</span>
              </p>
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

export default {
  name: 'Transactions',

  setup() {
    const { t } = useI18n();
    const $router = useRouter();
    const state = reactive({
      current: 1,
      loading: false,
      finished: false,
      page: 1,
      refreshloading: false,
      list: [],
    });
    const back = () => {
      $router.back();
    };
    const getDate = () => {
      if (state.loading) {
        return;
      }
      state.loading = true;
      reportforms
        .listAccountCashDetail({
          appInfo: {},
          data: {
            queryType: state.current,
            queryTime: 3,
            page: state.page,
            pageSize: 20,
          },
        })
        .then((res) => {
          if (res && res.code === 200) {
            if (res.data.records.length < 20) {
              state.finished = true;
            } else {
              state.page++;
            }
            const arr = res.data.records;
            arr.forEach((item) => {
              item.balance = `${lance.filterMoney(Number(item.balance))}.00`;
              item.cashShow = `${item.cashShow.slice(0, 2) + lance.filterMoney(Number(item.cashShow.slice(2)))}.00`;
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
      state.current = index;
      onRefresh();
    };
    const gobilldetail = (item) => {
      console.log(item.id);
      $router.push({
        path: '/reportForms/billdetail',
        query: {
          id: item.id,
        },
      });
    };
    onMounted(() => {
      getDate();
    });
    return {
      state, // 状态
      t,
      back, // 返回
      onClickTab, // 切换标签页
      onRefresh,
      onLoad,
      changTab,
      gobilldetail,
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
      line-height: 90px;
      text-align: center;
      color: #999999;
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
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        border-bottom: 2px solid #f6f6f6;
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
</style>
