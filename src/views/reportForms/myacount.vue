<template>
  <div class="myacount">
    <van-nav-bar :title="$t('reportForms.a91')" left-arrow @click-left="back" />
    <div v-for="(item, index) in state.showContentList" :key="index" class="type">
      <img class="icontype" :src="item.icon" alt="#" />
      <span class="typename">{{ item.accountNo }}</span>
    </div>
    <div class="addaccount" @click="$router.push('/reportForms/addacount')">
      <img class="icontype1" src="../../assets/img/reportForms/add.png" alt="#" />
      <span class="typename">{{ $t('reportForms.a24') }}</span>
    </div>
    <!-- 选择取款账户 -->
    <van-action-sheet v-model:show="state.show" :title="$t('reportForms.a32')">
      <div class="showcontent">
        <div class="list">
          <div v-for="(item, index) in state.showContentList" :key="index" class="item">
            <img class="icon" :src="item.icon" alt="#" />
            <span>{{ item.platformCode }}</span>
            <img v-if="item.isCheck" class="check" :src="state.currentcheck" alt="" />
          </div>
        </div>
        <div class="add" @click="$router.push('/reportForms/addacount')">
          <img :src="state.add" alt="" />
          <span>{{ $t('reportForms.a24') }}</span>
        </div>
      </div>
    </van-action-sheet>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { Toast } from 'vant';
import { useI18n } from 'vue-i18n';
import aba from '../../assets/img/reportForms/aba.png';
import money from '../../assets/img/reportForms/money.png';
import pipay from '../../assets/img/reportForms/pipay.png';
import wing from '../../assets/img/reportForms/wing.png';
import acleda from '../../assets/img/reportForms/acleda.png';
import currentcheck from '../../assets/img/reportForms/currentcheck.png';
import add from '../../assets/img/reportForms/add.png';
import reportforms from '@/api/reportforms';
import lance from '@/utils/lance';

export default {
  name: 'Myacount',

  setup() {
    const $router = useRouter();
    const { t } = useI18n();
    const state = reactive({
      curren: 0,
      hasAccount: true,
      show: false,
      currentcheck,
      add,
      showContentList: [],
    });
    const back = () => {
      $router.back();
    };
    const getlistPlatformAccount = () => {
      reportforms
        .listPlatformAccount({
          appInfo: {
            channel: lance.getData('channel'),
            appId: 'test',
            platform: 'web',
            imei: lance.randomString(6),
          },
          data: {
            platformType: '', // 1银行卡  3 第三方
          },
        })
        .then((res) => {
          if (res && res.code === 200) {
            state.showContentList = res.data;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    };
    onMounted(() => {
      getlistPlatformAccount();
      console.log('onMounted');
    });
    return {
      t,
      state, // 状态
      back, // 返回
      getlistPlatformAccount,
    };
  },
};
</script>

<style lang="scss" scoped>
.myacount {
  height: 100vh;
  width: 100vw;
  background: #f6f6f6;
  color: #000;
  :deep(.van-nav-bar__content) {
    height: 87px;
  }
  .addaccount,
  .type {
    width: 710px;
    height: 120px;
    background: #fff;
    border-radius: 10px;
    margin: 20px auto 0;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    box-sizing: border-box;
    padding: 0 30px;
    .icontype1 {
      display: block;
      width: 66px;
      height: 66px;
      margin-right: 27px;
    }
    .icontype {
      display: block;
      width: 80px;
      height: 80px;
      margin-right: 20px;
    }
    .tip {
      width: 52px;
      height: 37px;
      font-size: 26px;
      font-family: PingFang SC;
      font-weight: 400;
      line-height: 37px;
      color: #666666;
      margin-right: 6px;
    }
    .iconright {
      display: block;
      width: 44px;
      height: 44px;
    }
    .typename {
      flex: 1;
      height: 42px;
      font-size: 30px;
      font-family: PingFang SC;
      font-weight: 400;
      line-height: 42px;
      color: #000000;
    }
  }
  .showcontent {
    min-height: 689px;
    width: 100%;
    padding: 0 30px;
    box-sizing: border-box;
    border-top: 4px solid rgba($color: #000000, $alpha: 0.1);
    .list {
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: flex-start;
      .item {
        height: 109px;
        width: 100%;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        border-bottom: 2px solid #f1f1f2;
        .icon {
          display: block;
          width: 80px;
          height: 80px;
          margin-right: 30px;
        }
        > span {
          flex: 1;
          height: 40px;
          font-size: 28px;
          font-family: PingFang SC;
          font-weight: 400;
          line-height: 40px;
          color: #000000;
          opacity: 1;
        }
        .check {
          display: block;
          width: 36px;
          height: 36px;
        }
      }
    }
    .add {
      width: 100%;
      height: 123px;
      box-sizing: border-box;
      padding: 14px 0 29px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      > img {
        display: block;
        width: 80px;
        height: 80px;
        margin-right: 30px;
      }
      > span {
        flex: 1;
        height: 40px;
        font-size: 28px;
        font-family: PingFang SC;
        font-weight: 400;
        line-height: 40px;
        color: #000000;
      }
    }
  }
}
</style>
