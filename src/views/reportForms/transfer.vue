<template>
  <div class="transfer">
    <div class="head">
      <van-nav-bar :title="$t('reportForms.a159')" left-arrow @click-left="back" />
    </div>
    <div class="top">
      <div class="title bor">{{ $t('reportForms.a160', { name: data.name }) }}</div>
      <div class="copy bor">
        <span class="green">{{ $t('reportForms.a44') }}</span>
        <span class="number">{{ data.toAccountNo }}</span>
        <div v-if="data.toAccountNo" class="btn" @click="copy(data.toAccountNo)">{{ $t('reportForms.a46') }}</div>
      </div>
      <div class="green bor">{{ $t('reportForms.a45') }}{{ data.toName }}</div>
      <div class="green">{{ $t('reportForms.a163') }}{{ state.youNumber }}</div>
    </div>
    <div class="bottom">
      <div class="bor">
        <span class="span1">{{ $t('reportForms.a164', { name: data.name }) }}</span>
        <input v-model="state.userBankNo" type="number" :placeholder="$t('reportForms.a166')" />
      </div>
      <div class="bor">
        <span class="span1">{{ $t('reportForms.a165', { name: data.name }) }}</span>
        <input v-model="state.userBankName" type="text" :placeholder="$t('reportForms.a167')" />
      </div>
      <div class="bor">
        <span class="span1">{{ $t('reportForms.a168') }}</span>
        <span v-if="state.money" class="span2">៛</span>
        <input v-model="state.money" :placeholder="$t('reportForms.a42')" />
        <img class="img2" :src="state.iconDelete" alt="" @click="state.money = null" />
      </div>
    </div>
    <div class="btn" @click="recharge">{{ $t('reportForms.a169') }}</div>
    <!-- 教程 -->
    <div class="tutorial">
      <span>{{ $t('reportForms.a56') }}</span>
      <div v-for="(item, index) in data.tutorialImgList" :key="index">
        <span>{{ index + 1 }}/{{ data.tutorialImgList.length }}</span>
        <img :src="item" alt="#" />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch, toRaw, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { Toast } from 'vant';
import { useI18n } from 'vue-i18n';
import reportforms from '@/api/reportforms';
import lance from '@/utils/lance';
import bottom from '@/assets/img/reportForms/bottom.png';
import iconDelete from '@/assets/img/reportForms/iconDelete.png';

export default {
  name: 'Transfer',

  setup() {
    const { t } = useI18n();
    const $router = useRouter();
    const state = reactive({
      bottom,
      iconDelete,
      money: null,
      userBankNo: '',
      userBankName: '',
      youNumber: '',
      phone: '',
    });
    const data = ref({});
    const back = () => {
      $router.back();
      lance.clearStorage('transferItem');
      lance.clearStorage('transferMoney');
    };
    const copy = (text) => {
      lance.copy(text);
    };
    const recharge = () => {
      const money = Number(state.money.replace(/,/g, ''));
      if (!state.userBankNo) {
        return Toast(t('reportForms.a170', { name: data.value.name }));
      }
      if (state.userBankNo === '') {
        return Toast(t('reportForms.a166'));
      }
      if (state.userBankName === '') {
        return Toast(t('reportForms.a167'));
      }
      if (!money) {
        return Toast(t('reportForms.a13'));
      }
      if (money < 4000) {
        return Toast(t('reportForms.a57'));
      }
      if (money > 40000000) {
        return Toast(t('reportForms.a58'));
      }
      reportforms
        .rechargeOrder({
          appInfo: {},
          data: {
            amount: money, // 金额
            payRechargeTypeCode: data.value.code === 'WingTransfer' ? data.value.code : data.value.platformCode, // 充值类型
            platformAccountId: data.value.toPlatformAccountComId || 'test', // 平台账号ID
            verification: state.phoen, // 验证信息 （转账时需要的平台的注册手机号）
            screenshot: '', // 打款截图
            paymentAccount: '', // 打款账号
            // isFirstRechargeAct: true, // 是否首次充值
            customerId: '', // 用户pageGo账号
            userBankNo: state.userBankNo, // 用户充值输入的账号
            userBankName: state.userBankName, // 用户充值输入的账号名称
          },
        })
        .then((res) => {
          if (res && res.code === 200) {
            Toast(t('reportForms.a18'));
            back();
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
      data.value = lance.getJson('transferItem');
      state.money = lance.getJson('transferMoney');
      state.youNumber = lance.getJson('user').username;
      state.phoen = lance.getJson('user').phone;
      const datas = toRaw(data.value);
      if (datas.platformAccountBO.length > 0) {
        state.userBankNo = datas.platformAccountBO[0].userBankNo;
        state.userBankName = datas.platformAccountBO[0].userBankName;
      }
      console.log('onMounted', data, state.money);
    });
    return {
      t,
      state, // 状态
      data,
      back, // 返回
      copy,
      recharge, // 充值
    };
  },
};
</script>

<style lang="scss" scoped>
.transfer {
  height: 100vh;
  width: 100vw;
  background: #f6f6f6;
  color: #000;
  overflow-y: scroll;
  box-sizing: border-box;
  padding-top: 87px;
  .head {
    width: 100vw;
    height: 87px;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 999;
  }
  :deep(.van-nav-bar__content) {
    height: 87px;
  }
  :deep(.van-field, .van-cell) {
    flex: 1;
    height: 99px;
    box-sizing: border-box;
    padding: 0;
    input {
      width: 100%;
      margin-top: 22px;
      height: 56px;
      font-size: 40px;
      font-family: PingFang SC;
      font-weight: 400;
      line-height: 56px;
      letter-spacing: 2px;
      color: #000000;
      font-weight: bold;
      border: none;
      outline: none;
      background: none;
      &::placeholder {
        color: #999999;
      }
    }
  }
  .top {
    width: 710px;
    min-height: 450px;
    background: #ffffff;
    border-radius: 10px;
    margin: 20px auto;
    box-sizing: border-box;
    padding: 0 30px;
    > div {
      min-height: 100px;
      width: 100%;
    }
    .title {
      width: 665px;
      min-height: 120px;
      font-size: 32px;
      font-family: PingFang SC;
      line-height: 60px;
      color: #000000;
      opacity: 1;
    }
    .copy {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      flex-wrap: wrap;
      box-sizing: border-box;
      padding: 29px 0;
      min-height: 42px;

      .green {
        min-height: 42px;
        font-size: 30px;
        font-family: PingFang SC;
        font-weight: 500;
        line-height: 42px;
        color: #098b81;
        opacity: 1;
        margin-right: 15px;
      }
      .number {
        min-height: 40px;
        font-size: 28px;
        font-family: PingFang SC;
        font-weight: 500;
        line-height: 40px;
        color: #e27989;
        white-space: nowrap;
        flex: 1;
      }
      > .btn {
        width: 100px;
        height: 50px;
        background: #ffffff;
        border: 1px solid #2284ef;
        opacity: 1;
        border-radius: 10px;
        font-size: 28px;
        font-family: PingFang SC;
        font-weight: 400;
        line-height: 50px;
        color: #2680eb;
        text-align: center;
      }
    }
    > .green {
      width: 100%;
      min-height: 42px;
      font-size: 30px;
      font-family: PingFang SC;
      font-weight: 500;
      line-height: 42px;
      word-break: break-all;
      color: #0b8b7e;
      box-sizing: border-box;
      padding: 29px 0;
    }
  }
  .bottom {
    width: 710px;
    height: 331px;
    background: #ffffff;
    border-radius: 10px;
    margin: 0 auto;
    box-sizing: border-box;
    padding: 0 30px;
    margin-bottom: 75px;
    > div {
      min-height: 100px;
      width: 100%;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      .span1 {
        max-width: 280px;
        min-height: 42px;
        font-size: 30px;
        font-family: PingFang SC;
        font-weight: 500;
        line-height: 42px;
        color: #333333;
        margin-right: 15px;
        word-break: break-all;
      }
      .span2 {
        height: 56px;
        font-size: 40px;
        font-family: PingFang SC;
        font-weight: 400;
        line-height: 56px;
        color: #000000;
      }
      .img1 {
        display: block;
        width: 21px;
        height: 12px;
      }
      .img2 {
        display: block;
        width: 32px;
        height: 32px;
        position: absolute;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
      }
      > input {
        flex: 1;
        height: 56px;
        font-size: 30px;
        font-family: PingFang SC;
        font-weight: bold;
        line-height: 56px;
        color: #000000;
        background: none;
        outline: none;
        border: none;
        &::placeholder {
          color: #9e9e9e;
          font-size: 26px;
          font-family: PingFang SC;
          font-weight: 400;
          line-height: 40px;
        }
      }
    }
  }
  > .btn {
    width: 600px;
    height: 94px;
    background: linear-gradient(270deg, #ff2929 0%, #ff6619 100%);
    border-radius: 44px;
    font-family: PingFangSC-Semibold;
    line-height: 94px;
    text-align: center;
    color: #ffffff;
    margin: 0 auto;
    font-size: 34px;
  }
  .bor {
    box-shadow: 0px 1px 0px #e5e5e5;
  }
  .tutorial {
    display: flex;
    flex-direction: column;
    margin-top: 50px;
    > span {
      display: block;
      width: 100vw;
      height: 40px;
      line-height: 40px;
      font-size: 36px;
      padding-left: 70px;
      box-sizing: border-box;
    }
    > div {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;
      > span {
        height: 40px;
        line-height: 40px;
        font-size: 36px;
        margin: 10px;
      }
    }
  }
}
</style>
