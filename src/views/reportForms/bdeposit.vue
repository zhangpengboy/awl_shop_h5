<template>
  <div class="cdeposit">
    <div class="head">
      <van-nav-bar :title="$t('reportForms.a35')" left-arrow @click-left="back" />
    </div>
    <div class="top">
      <div class="title">{{ $t('reportForms.a36') }}</div>
      <div class="paylist">
        <div :key="index" class="payitem" :class="state.currentIndex === 999 ? 'currentbor' : ''" @click="channgeType(false, false)">
          <div>
            <img class="icon" src="@/assets/img/reportForms/theShopOwner.png" alt="" />
            <span>{{ $t('reportForms.a37') }}</span>
          </div>
          <img v-if="state.currentIndex === 999" class="current" :src="state.current" alt="" />
        </div>
        <div v-for="(item, index) in state.payList" :key="index" class="payitem" :class="state.currentIndex === index ? 'currentbor' : ''" @click="channgeType(item, index)">
          <div>
            <img class="icon" :src="item.icon" alt="" />
            <span>{{ item.name }}</span>
          </div>
          <img v-if="state.currentIndex === index" class="current" :src="state.current" alt="" />
        </div>
      </div>
    </div>
    <!-- 在线充值 wing online/pipay -->
    <div v-if="state.rechargeType === 1" class="online">
      <div class="title">
        <span class="text">{{ $t('reportForms.a38') }}</span>
        <van-popover v-model:show="state.showPopover" theme="dark" placement="bottom-start" :offset="[-8, 12]">
          <div style="padding: 10px; width: 210px; font-size: 16px; color: #fff">
            <p style="line-height: 20px">{{ $t('reportForms.a39') }}</p>
            <p style="line-height: 20px">{{ $t('reportForms.a40') }}</p>
            <p style="line-height: 20px">{{ $t('reportForms.a41') }}</p>
          </div>
          <template #reference>
            <img :src="state.lotteryhelp" alt="#" />
          </template>
        </van-popover>
        <span class="number">{{ state.Mymoney }}</span>
      </div>
      <div class="onlineDetail">
        <div class="list">
          <div v-for="(item, index) in state.payNumList" :key="index" class="item" @click="channgeType1(item, index)">
            <div>{{ item.text }}</div>
            <img v-if="state.currentIndex1 === index" :class="state.currentIndex1 === index ? 'current1' : ''" :src="state.current1" alt="#" />
          </div>
        </div>
        <div class="red">{{ data.tips || '' }}</div>
        <div class="number">
          <span>៛</span>
          <van-field v-model="state.money" :placeholder="$t('reportForms.a42')" />
        </div>
      </div>
    </div>
    <div v-if="state.rechargeType === 1" class="onlinebtn" @click="next()">{{ $t('msg.a13') }}</div>
    <!-- wing缴费 -->
    <div v-if="state.rechargeType === 3" class="paycost">
      <div class="paycost_content">
        <div class="title">{{ $t('reportForms.a43') }}</div>
        <div class="copy">
          <span class="green">{{ $t('reportForms.a44') }}</span>
          <span class="number">{{ data.toAccountNo }}</span>
          <div v-if="data.toAccountNo" class="btn" @click="copy(data.toAccountNo)">{{ $t('reportForms.a46') }}</div>
        </div>
        <div class="text">{{ $t('reportForms.a45') }}{{ data.toName }}</div>
        <div class="copy1">
          <span class="green">{{ $t('reportForms.a48') }}</span>
          <span class="number">{{ state.youNumber ? state.youNumber : $t('reportForms.a73') }}</span>
          <div v-if="state.youNumber" class="btn" @click="copy(state.youNumber)">{{ $t('reportForms.a46') }}</div>
        </div>
      </div>
      <div v-if="!state.youNumber" class="paycost_btn" @click="$router.push('/reportForms/settingphone')">{{ $t('reportForms.a50') }}</div>
    </div>
    <!-- 店主代充 -->
    <div v-if="state.rechargeType === 2" class="shopbottom">
      <div class="tip">{{ $t('reportForms.a51') }}</div>
      <div class="copy">
        <span class="text">{{ $t('reportForms.a52') }}</span>
        <span class="number">{{ state.username }}</span>
        <span class="btn" @click="copy(state.username)">{{ $t('reportForms.a46') }}</span>
      </div>
    </div>
    <div v-if="state.rechargeType === 2" class="shopbottom1">
      <div class="tip">{{ $t('reportForms.a53') }}</div>
      <div class="tip">{{ $t('reportForms.a54') }}</div>
      <div class="tip">{{ $t('reportForms.a55') }}</div>
    </div>
    <!-- 人工转账 wing转账 /true money/aba/acleda -->
    <!-- <div class="artificial"></div> -->
    <div class="service" @click="$router.push('/reportForms/service')">
      <img :src="state.service" alt="#" />
    </div>
    <!-- 教程 -->
    <div v-if="data.tutorialImgList" class="tutorial">
      <span>{{ $t('reportForms.a56') }}</span>
      <div v-for="(item, index) in data.tutorialImgList" :key="index">
        <span>{{ index + 1 }}/{{ data.tutorialImgList.length }}</span>
        <img :src="item" alt="#" />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { Toast } from 'vant';
import { useI18n } from 'vue-i18n';
import reportforms from '@/api/reportforms';
import lance from '@/utils/lance';
import current from '@/assets/img/reportForms/current.png';
import current1 from '@/assets/img/reportForms/current1.png';
import service from '@/assets/img/reportForms/service.png';
import lotteryhelp from '@/assets/img/reportForms/lotteryhelp.png';

export default {
  name: 'Cdeposit',

  setup() {
    const { t } = useI18n();
    const $router = useRouter();
    const state = reactive({
      current,
      current1,
      service,
      lotteryhelp,
      currentIndex: 999,
      showPopover: false,
      currentcode: 'shop',
      rechargeType: 2,
      currentIndex1: null,
      money: null,
      Mymoney: null,
      name: '',
      phone: '',
      youNumber: '',
      payList: [],
      payNumList: [
        { number: 40000, text: '៛40,000' },
        { number: 80000, text: '៛80,000' },
        { number: 200000, text: '៛200,000' },
        { number: 400000, text: '៛400,000' },
      ],
    });
    const data = ref({});
    const back = () => {
      $router.back();
    };
    const channgeType = (item, index) => {
      console.log(item, index);
      state.currentIndex = index === 0 ? 0 : index || 999;
      state.currentcode = item ? item.platformCode : 'shop';
      state.rechargeType = item ? item.rechargeType : 2;
      data.value = item || {};
    };
    const channgeType1 = (item, index) => {
      state.currentIndex1 = index;
      state.money = item.number;
    };
    const copy = (text) => {
      lance.copy(text);
    };
    const next = () => {
      const money = Number(state.money.replace(/,/g, ''));
      if (money < 4000) {
        return Toast(t('reportForms.a57'));
      }
      if (money > 40000000) {
        return Toast(t('reportForms.a58'));
      }
      if (money) {
        lance.setJson('transferItem', data.value);
        lance.setJson('transferMoney', money);
        $router.push('/reportForms/transfer');
      } else {
        Toast(t('reportForms.a42'));
      }
    };
    const open = () => {
      // $router.push('/reportForms/transfer');
    };
    const getListRechargeIndex = () => {
      // const data = {};
      reportforms
        .listRechargeIndex({
          appInfo: {},
          data: {},
        })
        .then((res) => {
          if (res && res.code === 200) {
            state.payList = res.data;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    };
    watch(
      () => state.money,
      (newValue, oldValue) => {
        if (newValue === '') {
          state.money = '';
        }
        const newMoney = typeof newValue === 'number' ? newValue.toString() : newValue;
        const newStr = newMoney
          .replace(/,/g, '')
          .replace(/^0|\D/g, '')
          .replace(/\d{1,3}(?=(\d{3})+$)/g, '$&,');
        state.money = newStr;
        console.log(newStr, 'arr');
      },
    );
    onMounted(() => {
      getListRechargeIndex();
      const user = lance.getJson('user');
      state.youNumber = user.phone;
      state.phone = lance.getJson('user').phone || t('reportForms.a60');
      state.username = user.username;
      state.Mymoney = user.cash + user.cashExt;
    });
    return {
      t,
      state, // 状态
      data,
      back, // 返回
      channgeType, // 改变选中项
      channgeType1, // 改变选中项1
      copy, // 复制
      getListRechargeIndex, // 提现列表
      next, // 下一步
      open, // 打开wingapp
    };
  },
};
</script>

<style lang="less" scoped>
.cdeposit {
  overflow-y: scroll;
  padding-top: 87px;
  width: 100vw;
  height: 100vh;
  color: #000;
  background: #f6f6f6;
  box-sizing: border-box;
  .head {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 999;
    width: 100vw;
    height: 87px;
  }
  :deep(.van-nav-bar__content) {
    height: 87px;
  }
  :deep(.van-field, .van-cell) {
    padding: 0;
    height: 85px;
    flex: 1;
    box-sizing: border-box;
    input {
      margin-top: 20px;
      width: 100%;
      height: 40px;
      font-size: 28px;
      font-family: PingFang SC;
      font-weight: 400;
      border: none;
      text-indent: 11px;
      color: #333333;
      background: none;
      outline: none;
      line-height: 40px;
      letter-spacing: 2px;
      &::placeholder {
        font-size: 26px;
        font-family: PingFang SC;
        font-weight: 400;
        color: #9e9e9e;
        line-height: 40px;
      }
    }
  }
  .top {
    margin: 20px auto;
    width: 710px;
    min-height: 306px;
    border-radius: 10px;
    background: #fff;
    .title {
      padding-left: 30px;
      width: 100%;
      height: 103px;
      font-size: 32px;
      font-family: PingFang SC;
      font-weight: 500;
      border-bottom: 2px solid #f7f7f7;
      color: #333333;
      box-sizing: border-box;
      line-height: 103px;
    }
    .paylist {
      display: flex;
      padding: 34px 33px 15px;
      width: 100%;
      min-height: 286px;
      flex-wrap: wrap;
      box-sizing: border-box;
      .payitem {
        position: relative;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        margin-right: 25px;
        margin-bottom: 41px;
        width: 140px;
        max-height: 180px;
        border: 2px solid #efefef;
        border-radius: 14px;
        flex-shrink: 0;
        flex-direction: column;
        &:nth-child(4n) {
          margin-right: 0;
        }
        > div {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          width: 140px;
          height: 100%;
          border-radius: 14px;
          flex-direction: column;
          .icon {
            display: block;
            margin: 17px 0 6px 0;
            width: 56px;
            height: 56px;
          }
          > span {
            padding: 0 2px;
            width: 100%;
            min-height: 33px;
            font-size: 24px;
            font-family: PingFang SC;
            font-weight: 400;
            text-align: center;
            color: #333333;
            box-sizing: border-box;
            word-break: break-all;
            line-height: 33px;
          }
        }
        .current {
          position: absolute;
          right: 0;
          bottom: 0;
          z-index: 1;
          display: block;
          width: 36px;
          height: 36px;
        }
      }
      .currentbor {
        border: 2px solid #2284ef !important;
      }
    }
  }
  .shopbottom {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin: 0 auto;
    padding: 33px 30px;
    width: 710px;
    height: 180px;
    border-radius: 10px;
    background: #fff;
    box-sizing: border-box;
    flex-direction: column;
    .tip {
      height: 40px;
      font-size: 28px;
      font-family: PingFang SC;
      font-weight: 400;
      line-height: 40px;
      color: #000000;
    }
    .copy {
      display: flex;
      justify-content: flex-start;
      align-items: flex-end;
      width: 100%;
      height: 50px;
      .text {
        margin-right: 15px;
        height: 40px;
        font-size: 28px;
        font-family: PingFang SC;
        font-weight: 400;
        color: #098b81;
        line-height: 40px;
      }
      .number {
        height: 40px;
        font-size: 28px;
        font-family: PingFang SC;
        font-weight: 500;
        text-align: left;
        color: #e27989;
        line-height: 40px;
        flex: 1;
      }
      .btn {
        width: 100px;
        height: 50px;
        font-size: 28px;
        font-family: PingFang SC;
        font-weight: 400;
        border: 1px solid #2284ef;
        border-radius: 10px;
        text-align: center;
        color: #2680eb;
        background: #ffffff;
        opacity: 1;
        line-height: 50px;
      }
    }
  }
  .shopbottom1 {
    margin: 0 auto;
    margin-top: 20px;
    padding: 33px 30px;
    width: 710px;
    min-height: 180px;
    border-radius: 10px;
    background: #fff;
    box-sizing: border-box;
    > div {
      min-height: 40px;
      font-size: 28px;
      font-family: PingFang SC;
      font-weight: 400;
      line-height: 40px;
      color: #000000;
    }
  }
  .online {
    margin: 0 auto 84px;
    width: 710px;
    height: 370px;
    border-radius: 10px;
    background: #fff;
    .title {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      padding: 30px 36px 20px 30px;
      width: 100%;
      height: 95px;
      border-bottom: 2px solid #ecebeb;
      box-sizing: border-box;
      .text {
        margin-right: 9px;
        height: 45px;
        font-size: 32px;
        font-family: PingFang SC;
        font-weight: 500;
        color: #333333;
        line-height: 45px;
      }
      img {
        display: block;
        width: 30px;
        height: 30px;
      }
      .number {
        height: 45px;
        font-size: 32px;
        font-family: PingFang SC;
        font-weight: bold;
        text-align: right;
        color: #000000;
        line-height: 45px;
        flex: 1;
      }
    }
    .onlineDetail {
      width: 100%;
      height: 274px;
      .list {
        display: flex;
        justify-content: space-between;
        padding: 21px 40px 20px 41px;
        .item {
          position: relative;
          width: 140px;
          height: 80px;
          font-size: 30px;
          font-family: PingFang SC;
          font-weight: 400;
          border: 1px solid #cccccc;
          border-radius: 10px;
          text-align: center;
          color: #9e9e9e;
          line-height: 80px;
          .current1 {
            position: absolute;
            top: 0;
            left: 0;
            display: block;
            width: 140px;
            height: 80px;
          }
        }
      }
      .red {
        margin-bottom: 34px;
        padding: 0 30px;
        width: 100%;
        height: 37px;
        font-size: 26px;
        font-family: PingFang SC;
        font-weight: 400;
        color: #e27989;
        line-height: 37px;
        box-sizing: border-box;
      }
      .number {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        padding: 0 30px;
        box-sizing: border-box;
        > span {
          margin-right: 19px;
          height: 45px;
          font-size: 32px;
          font-family: PingFang SC;
          font-weight: 500;
          color: #333333;
          opacity: 1;
          line-height: 45px;
        }
        > input {
          height: 45px;
          font-size: 26px;
          font-family: PingFang SC;
          font-weight: 400;
          border: none;
          color: #333333;
          background: none;
          outline: none;
          line-height: 45px;
          &::placeholder {
            font-size: 26px;
            font-family: PingFang SC;
            font-weight: 400;
            color: #9e9e9e;
            line-height: 40px;
          }
        }
      }
    }
  }
  .onlinebtn {
    align-items: center;
    margin: 0 auto;
    width: 600px;
    height: 94px;
    height: 84px;
    font-size: 34px;
    font-family: PingFangSC-Semibold;
    border-radius: 44px;
    text-align: center;
    color: #ffffff;
    background: linear-gradient(270deg, #ff2929 0%, #ff6619 100%);
    opacity: 1;
    line-height: 84px;
  }
  .paycost {
    width: 100%;
    height: auto;
    .paycost_content {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      margin: 0 auto;
      padding: 0 30px;
      width: 710px;
      height: 400px;
      border-radius: 10px;
      background: #fff;
      box-sizing: border-box;
      flex-direction: column;
      .title {
        width: 100%;
        height: 100px;
        font-size: 28px;
        font-family: PingFang SC;
        font-weight: bold;
        border-bottom: 1px solid #e5e5e5;
        color: #000000;
        opacity: 1;
        line-height: 100px;
      }
      .copy,
      .copy1 {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        width: 100%;
        min-height: 100px;
        border-bottom: 1px solid #e5e5e5;
        flex-wrap: wrap;
        .green {
          margin-right: 15px;
          height: 40px;
          font-size: 28px;
          font-family: PingFang SC;
          font-weight: 400;
          color: #098b81;
          line-height: 40px;
        }
        .number {
          height: 40px;
          font-size: 28px;
          font-family: PingFang SC;
          line-height: 40px;
          color: #e27989;
          flex: 1;
        }
        .btn {
          width: 100px;
          height: 50px;
          font-size: 28px;
          font-family: PingFang SC;
          font-weight: 400;
          border: 1px solid #2284ef;
          border-radius: 10px;
          text-align: center;
          color: #2680eb;
          background: #ffffff;
          opacity: 1;
          line-height: 50px;
        }
      }
      .copy1 {
        border-bottom: none;
      }
      .text {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        width: 100%;
        min-height: 100px;
        font-size: 28px;
        font-family: PingFang SC;
        font-weight: 400;
        border-bottom: 1px solid #e5e5e5;
        color: #0b8b7e;
        line-height: 40px;
      }
    }
    .paycost_btn {
      margin: 54px auto 0;
      width: 600px;
      height: 94px;
      font-size: 34px;
      font-family: PingFangSC-Semibold;
      border-radius: 44px;
      text-align: center;
      color: #ffffff;
      background: linear-gradient(270deg, #ff2929 0%, #ff6619 100%);
      opacity: 1;
      line-height: 94px;
    }
  }
  .service {
    position: fixed;
    top: 554px;
    right: -18px;
    width: 104px;
    height: 104px;
    > img {
      display: block;
      width: 104px;
      height: 104px;
    }
  }
  .tutorial {
    display: flex;
    flex-direction: column;
    margin-top: 50px;
    > span {
      display: block;
      padding-left: 70px;
      width: 100vw;
      height: 40px;
      font-size: 36px;
      line-height: 40px;
      box-sizing: border-box;
    }
    > div {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;
      > span {
        margin: 10px;
        height: 40px;
        font-size: 36px;
        line-height: 40px;
      }
    }
  }
}
</style>
