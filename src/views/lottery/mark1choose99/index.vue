<template>
  <BetToolbar @click-tab="onChange" @to-play="toPlay" @to-gameplay="toGameplay"></BetToolbar>
  <div v-show="active === 1" class="mark99">
    <div ref="bet_content" class="bet_content">
      <p v-if="statusTxt" class="statusTxt">{{ statusTxt }}</p>
      <van-count-down v-else :time="time" format="mm:ss" @finish="finish" />
      <p v-if="lastStatus === null" class="issueId">{{ $t('msg.a53') }}</p>
      <p v-else class="issueId">{{ `${issueId} End of Bet Time` }}</p>
      <div class="issueNo">
        <div v-for="(item, index) in issueNoList.split(';').length === 5 ? issueNoList.split(';') : 5" :key="index" class="issueNo-row">
          <div class="issueNo-row-top">{{ ['A', 'B', 'C', 'D', 'E'][index] }}</div>
          <div class="issueNo-row-bottom">{{ issueNoList.split(';').length === 5 ? item : '' }}</div>
        </div>
      </div>
      <div class="up-issueNo">
        <span class="up-issueNo-label">{{ `Issue${lastPhaseNo || '-'}` }}</span>
        <span v-if="lastStatus === null" class="up-issueNo-item">- - - - -</span>
        <span v-if="lastStatus === 7" class="up-issueNo-item">{{ $t('goldBet.issueCancel') }}</span>
        <template v-if="lastStatus === 5">
          <span v-for="(item, i) in lastWinCode.split(';')" :key="i" class="up-issueNo-item">{{ item || '-' }}</span>
        </template>
      </div>
      <div class="choose-code-one">
        <span class="label">ក្រុម &nbsp;</span>
        <van-checkbox v-model="checkedAll" @click="checkAll">
          <span class="label">ទាំងអស់&nbsp;</span>
          <template #icon="props">
            <img class="img-icon" :src="props.checked ? check_on : check_off" />
          </template>
        </van-checkbox>
        <van-checkbox-group v-model="checked" direction="horizontal" @change="onCheckChange">
          <van-checkbox v-for="item in checkList" :key="item" :name="item">
            <span class="label">{{ item }}</span>
            <template #icon="props">
              <img class="img-icon" :src="props.checked ? check_on : check_off" />
            </template>
          </van-checkbox>
        </van-checkbox-group>
      </div>
      <div class="choose-code-two">
        <div v-for="item in Math.round(codeList.length / 6)" :key="item" class="li">
          <div class="line" @click="onClickLine(item)">
            <img class="right-img" src="@/assets/img/lottery/change-right.png" alt="" />
          </div>
          <p class="flex">
            <span v-for="v in codeList.slice((item - 1) * 6, (item - 1) * 6 + 6)" :key="v.code" :class="[v.isShow ? 'on' : 'off']" @click="onClickLineItem(v.code)">{{ v.code }}</span>
          </p>
        </div>
      </div>
    </div>
    <div class="modalVisible" @click="modalVisible = true">
      <img src="@/assets/img/lottery/seafoods/ticket1.png" alt="" />
      <span v-if="tickets > 0" class="note">{{ tickets }}</span>
    </div>
    <footer>
      <div class="betting">
        <span v-for="(item, i) in multiple" :key="i" :class="{ btActive: btActive === i }" @click="multipleClick(item, i)">{{ item }}</span>
        <van-field v-model.number="times" style="width: 100px" type="number" label="" maxlength="5" @update:model-value="clickInput" @focus="onfocus" />
        <i>k</i>
      </div>
      <div class="bet">
        <div class="text">
          <span>{{ `Total: ` }}</span>
          <span>៛ {{ money.toLocaleString() || 0 }}</span>
        </div>
        <span :class="{ bt: true, disabled: buyOffHand }" @click.stop="handleBet">{{ $t('6DKlaKlouk.seafoodInLottery.bet') }}</span>
      </div>
    </footer>
    <div v-show="winningPopupVisible" class="result-popup" @click="handleWinningPopupClose">
      <div class="result-popup__winning">
        <div class="result-popup__winning-text"></div>
        <div class="result-popup__treasure-box"></div>
      </div>
    </div>
    <div v-show="notWinningPopupVisible" class="result-popup" @click="handleNotWinningPopupClose">
      <div class="result-popup__not-winning">
        <div class="result-popup__ordinary-box"></div>
      </div>
      <p>{{ $t('goldBet.noWinText') }}</p>
    </div>
  </div>
  <DrawHistory v-if="active === 2" class="mt80"></DrawHistory>
  <!-- 投注记录弹窗 -->
  <Modal :modal-visible="modalVisible" :issue-id="issueId" :lottery-id="lotteryId" @next="detail($event)" @back="modalVisible = false" @get-list-length="getListLength"></Modal>
</template>
<script setup>
import { Toast, Dialog } from 'vant';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import BetToolbar from '@/components/BetToolbar.vue'; // 头部
import DrawHistory from './components/DrawHistory.vue';
// import winningPopup from '@/components/winningPopup.vue'; // 获胜动画
import Modal from '@/components/Modal.vue'; // 投注记录弹窗
import User from '@/api/user';
import lance from '@/utils/lance';
import { ride, except } from '@/utils/decimal';
import check_on from '@/assets/img/lottery/check-on.png';
import check_off from '@/assets/img/lottery/check-off.png';

const { t } = useI18n();
const $router = useRouter();
const active = ref(1);
const winningPopupVisible = ref(false);
const notWinningPopupVisible = ref(false);
const modalVisible = ref(false);
const multiple = ref([100, 200, 500, '1K']);
const lotteryId = ref('99C1');
const tickets = ref(0); // 角标数
const time = ref(5 * 60 * 1000);
// const time = ref(0);
const issueId = ref('');
const times = ref(0.1);
const btActive = ref(0);
const winAmount = ref(0); // 本期中奖金额
const statusTxt = ref(null); // 开奖状态值
const issueNoList = ref('');
const lastStatus = ref(null);
const buyOffHand = computed(() => {
  return money.value === 0;
});
const multipleClick = (num, i) => {
  btActive.value = i;
  if (multiple.value[btActive.value] === '1K') {
    times.value = 1;
  } else {
    times.value = except(num, 1000);
  }
};
const onfocus = () => {
  btActive.value = -1;
};
// const clickInput = (value) => {
//   // console.log(value);
//   if (value < 0) {
//     times.value = 0.1;
//   }
//   times.value = value.toFixed(1);
//   // console.log('clickInput', times.value);
// };
const clickInput = (v) => {
  if (Number(times.value) > 10000) {
    v = 10000;
    times.value = lance.onlyNonNegative(v);
    return Toast(t('msg.a52'));
  }
  times.value = lance.onlyNonNegative(v);
};
onMounted(() => {
  init();
});
const detail = (item) => {
  const { orderId } = item;
  $router.push({
    path: '/orderDetail',
    query: {
      orderId,
      lottery: '99C1',
    },
  });
};
const checkedAll = ref(false); // 奖组全选
// const checkboxGroup = ref(null);
const checked = ref([]); // 奖组选中
const checkList = ref(['A', 'B', 'C', 'D', 'E']); // 奖组
const checkAll = () => {
  if (checkedAll.value) {
    // checkboxGroup.value.toggleAll(true);
    checked.value = ['A', 'B', 'C', 'D', 'E'];
  } else {
    // checkboxGroup.value.toggleAll();
    checked.value = [];
  }
};
const onCheckChange = (arr) => {
  console.log(arr);
  if (arr.length === 5) {
    checkedAll.value = true;
  } else {
    checkedAll.value = false;
  }
};

// 号码
const codeList = ref([
  { code: '01', isShow: false },
  { code: '02', isShow: false },
  { code: '03', isShow: false },
  { code: '04', isShow: false },
  { code: '05', isShow: false },
  { code: '06', isShow: false },
  { code: '07', isShow: false },
  { code: '08', isShow: false },
  { code: '09', isShow: false },
  { code: '10', isShow: false },
  { code: '11', isShow: false },
  { code: '12', isShow: false },
  { code: '13', isShow: false },
  { code: '14', isShow: false },
  { code: '15', isShow: false },
  { code: '16', isShow: false },
  { code: '17', isShow: false },
  { code: '18', isShow: false },
  { code: '19', isShow: false },
  { code: '20', isShow: false },
  { code: '21', isShow: false },
  { code: '22', isShow: false },
  { code: '23', isShow: false },
  { code: '24', isShow: false },
  { code: '25', isShow: false },
  { code: '26', isShow: false },
  { code: '27', isShow: false },
  { code: '28', isShow: false },
  { code: '29', isShow: false },
  { code: '30', isShow: false },
  { code: '31', isShow: false },
  { code: '32', isShow: false },
  { code: '33', isShow: false },
  { code: '34', isShow: false },
  { code: '35', isShow: false },
  { code: '36', isShow: false },
  { code: '37', isShow: false },
  { code: '38', isShow: false },
  { code: '39', isShow: false },
  { code: '40', isShow: false },
  { code: '41', isShow: false },
  { code: '42', isShow: false },
  { code: '43', isShow: false },
  { code: '44', isShow: false },
  { code: '45', isShow: false },
  { code: '46', isShow: false },
  { code: '47', isShow: false },
  { code: '48', isShow: false },
  { code: '49', isShow: false },
  { code: '50', isShow: false },
  { code: '51', isShow: false },
  { code: '52', isShow: false },
  { code: '53', isShow: false },
  { code: '54', isShow: false },
  { code: '55', isShow: false },
  { code: '56', isShow: false },
  { code: '57', isShow: false },
  { code: '58', isShow: false },
  { code: '59', isShow: false },
  { code: '60', isShow: false },
  { code: '61', isShow: false },
  { code: '62', isShow: false },
  { code: '63', isShow: false },
  { code: '64', isShow: false },
  { code: '65', isShow: false },
  { code: '66', isShow: false },
  { code: '67', isShow: false },
  { code: '68', isShow: false },
  { code: '69', isShow: false },
  { code: '70', isShow: false },
  { code: '71', isShow: false },
  { code: '72', isShow: false },
  { code: '73', isShow: false },
  { code: '74', isShow: false },
  { code: '75', isShow: false },
  { code: '76', isShow: false },
  { code: '77', isShow: false },
  { code: '78', isShow: false },
  { code: '79', isShow: false },
  { code: '80', isShow: false },
  { code: '81', isShow: false },
  { code: '82', isShow: false },
  { code: '83', isShow: false },
  { code: '84', isShow: false },
  { code: '85', isShow: false },
  { code: '86', isShow: false },
  { code: '87', isShow: false },
  { code: '88', isShow: false },
  { code: '89', isShow: false },
  { code: '90', isShow: false },
  { code: '91', isShow: false },
  { code: '92', isShow: false },
  { code: '93', isShow: false },
  { code: '94', isShow: false },
  { code: '95', isShow: false },
  { code: '96', isShow: false },
  { code: '97', isShow: false },
  { code: '98', isShow: false },
  { code: '99', isShow: false },
]); // 奖组选中

// 选择一排号码
const onClickLine = (item) => {
  const a = codeList.value.slice((item - 1) * 6, (item - 1) * 6 + 6).filter((m) => m.isShow === true).length;
  codeList.value.slice((item - 1) * 6, (item - 1) * 6 + 6).forEach((v) => {
    if (item === 17) {
      if (a >= 1 && a < 3) {
        v.isShow = true;
      } else {
        v.isShow = !v.isShow;
      }
    } else if (a >= 1 && a < 6) {
      v.isShow = true;
    } else {
      v.isShow = !v.isShow;
    }
  });
};
// 选择单个号码
const onClickLineItem = (item) => {
  codeList.value.forEach((v) => {
    if (v.code === item) {
      v.isShow = !v.isShow;
    }
  });
};
const money = computed(() => {
  // console.log('times.value', times.value);
  const len = codeList.value.filter((v) => v.isShow === true).length;
  if (checked.value.length === 0) {
    return ride(ride(len, 1000), times.value);
  }
  return ride(ride(ride(len, 1000), times.value), checked.value.length);
});
const lastPhaseNo = ref(''); // 上一期期号
const lastWinCode = ref(''); // 上一期中奖号码
// 获取当前奖期数据
const init = () => {
  // console.log('获取当前奖期数据');
  statusTxt.value = '00:00';
  User.getPhaseInfo({
    appInfo: {},
    data: { lottId: '99C1', fetchUserBetWin: true, orderTypeName: 'normal' },
  }).then((res) => {
    if (res.code === 200) {
      lastStatus.value = res.data.lastStatus;
      if (lastStatus.value === 1 || lastStatus.value === 3 || res.data.lastStatus === 4) {
        statusTxt.value = t('msg.waiting');
        setTimeout(() => {
          init();
        }, res.data.lastLottRest);
      } else if (res.data.lastStatus === 7) {
        // 奖期取消
        statusTxt.value = '';
        issueNoList.value = '';
        time.value = res.data.endTime - new Date().getTime();
        issueId.value = res.data.currentPhaseNo;
        lastPhaseNo.value = res.data.lastPhaseNo;
        lastWinCode.value = res.data.lastWinCode;
        // // 是否本期有投注
        // if (tickets.value > 0) {
        //   // 获取本期投注中奖信息
        //   getList();
        // }
        // setTimeout(() => {
        //   init();
        // }, 3000);
      } else if (res.data.lastStatus === 5) {
        statusTxt.value = '';
        time.value = res.data.endTime - new Date().getTime();
        // console.log('KKKKKKK', time.value);
        issueId.value = res.data.currentPhaseNo;
        lastPhaseNo.value = res.data.lastPhaseNo;
        lastWinCode.value = res.data.lastWinCode;
        getTickets();
      }
    }
  });
};
// 倒计时结束
const finish = () => {
  // console.log('倒计时结束');
  time.value = 0;
  statusTxt.value = '00:00';
  if (codeList.value.filter((v) => v.isShow === true).length) {
    Dialog({
      title: t('goldBet.isEndRemind'),
      message: t('goldBet.isEnd', { issue: issueId.value || '' }),
      confirmButtonText: t('goldBet.backToSelect'),
    }).then(() => {
      // on close
    });
  }
  const timers = setInterval(() => {
    User.getPhaseInfo({
      appInfo: {},
      data: { lottId: '99C1', fetchUserBetWin: true, orderTypeName: 'normal' },
    }).then((res) => {
      if (res.code === 200) {
        if (res.data.lastStatus === 1 || res.data.lastStatus === 3) {
          statusTxt.value = t('msg.waiting');
        } else if (res.data.lastStatus === 7) {
          // 奖期取消
          clearInterval(timers);
          statusTxt.value = t('goldBet.issueCancel');
          issueNoList.value = '';
          // 是否本期有投注
          if (tickets.value > 0) {
            // 获取本期投注中奖信息
            getList();
          }
          setTimeout(() => {
            statusTxt.value = '';
            issueNoList.value = '';
            tickets.value = 0;
            times.value = 0.1;
            btActive.value = 0;
            init();
          }, 3000);
        } else if (res.data.lastStatus === 5) {
          clearInterval(timers);
          statusTxt.value = t('msg.opening');
          issueNoList.value = res.data.lastWinCodeShow;
          // 是否本期有投注
          if (tickets.value > 0) {
            // 获取本期投注中奖信息
            getList();
          }
          setTimeout(() => {
            statusTxt.value = '';
            issueNoList.value = '';
            tickets.value = 0;
            times.value = 0.1;
            btActive.value = 0;
            init();
          }, 5000);
        }
      }
    });
  }, 2000);
};
// 投注
const handleBet = () => {
  if (buyOffHand.value) return Toast(t('goldBet.SelectOneAtLeast'));
  if (checked.value.length === 0) {
    return Toast(t('msg.a44'));
  }
  if (!Number(money.value)) {
    Toast(this.$t('msg.a49'));
    return false;
  }
  if (Number(money.value) > 10000000) {
    return Toast(t('msg.a51'));
  }
  if (!lance.getData('token')) {
    return $router.push('/login');
  }
  console.log(money.value);
  const arr = codeList.value.filter((v) => v.isShow === true);
  const code = arr.map((e) => e.code).toString(); // 选中号码
  const betts = arr.length * checked.value.length; // 注数
  const betCode = `n1f99#${code}#${betts}#${checked.value.toString()}#${money.value};`;
  User.betHFive({
    appInfo: {},
    data: {
      lotteryType: '99C1',
      phase: issueId.value,
      multiple: ride(times.value, 10),
      amount: money.value,
      betCode,
      realAmount: money.value,
    },
  })
    .then((res) => {
      if (res.success) {
        getTickets();
        cleanSelected();
        Toast(t('goldBet.betSuccess'));
      }
    })
    .catch((res) => {
      Toast(res.toast);
    });
};
const cleanSelected = () => {
  codeList.value.forEach((v) => {
    v.isShow = false;
  });
  checked.value = [];
};
const onChange = (e) => {
  active.value = e;
};
const toPlay = () => {
  $router.push({
    path: '/lotteryPlay',
    query: {
      videoId: 'mark99/HowToPlay',
    },
  });
};
const toGameplay = () => {
  $router.push({
    path: '/playingInstrution',
    query: {
      lotteryId: lotteryId.value,
    },
  });
};
/**
 * 角标数
 */
const getTickets = () => {
  User.list({
    appInfo: {},
    data: {
      currentPage: 1,
      pageNumber: 100,
      orderStatus: 1,
      searchTime: 0,
      orderType: 'normal',
      lotteryId: '99C1',
      phase: issueId.value,
    },
  })
    .then((res) => {
      tickets.value = res.data.totalNumber;
    })
    .catch((err) => {
      console.log(err);
    });
};
const getListLength = (num) => {
  tickets.value = num;
  console.log('num', num);
};
// 获取当前奖期中奖信息
const getList = () => {
  User.list({
    appInfo: {},
    data: {
      currentPage: 1,
      pageNumber: 100,
      orderStatus: 0,
      searchTime: 0,
      orderType: 'normal',
      lotteryId: '99C1',
      phase: issueId.value,
    },
  })
    .then((res) => {
      if (res.data.length > 0) {
        res.data.forEach((v) => {
          winAmount.value += v.winAmount;
        });
        if (winAmount.value === 0) {
          notWinningPopupVisible.value = true;
        } else {
          winningPopupVisible.value = true;
        }
      }
    })
    .catch((err) => {
      console.log(err);
    });
};
// 中奖界面
const handleWinningPopupClose = () => {
  winningPopupVisible.value = false;
};

// 未中奖界面
const handleNotWinningPopupClose = () => {
  notWinningPopupVisible.value = false;
};
</script>
<style lang="scss" scoped>
.mt80 {
  margin-top: 80px;
}
.mark99 {
  width: 100%;
  height: 100%;
  background: #eef2f6;
  overflow-y: scroll;
  padding-top: 80px;
  padding-bottom: 190px;
  .bet_content {
    .statusTxt {
      margin: 28px 0 0 70px;
      font-size: 72px;
      font-weight: 700;
      color: #333;
      line-height: 72px;
    }
    :deep(.van-count-down) {
      margin: 28px 0 0 70px;
      font-size: 72px;
      font-weight: 700;
      color: #333;
      line-height: 72px;
    }
    .issueId {
      margin: 30px 70px;
      font-size: 30px;
      font-weight: 700;
      color: #333;
    }
    .issueNo {
      margin: 0 70px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      &-row {
        width: 100px;
        height: 160px;
        background: #f03212;
        border: 2px solid #f03212;
        border-radius: 10px;
        &-top {
          width: 100%;
          height: 78px;
          background: #f03212;
          text-align: center;
          line-height: 78px;
          font-size: 48px;
          font-weight: 500;
          color: #fff;
          border-top-left-radius: 10px;
          border-top-right-radius: 10px;
        }
        &-bottom {
          width: 100%;
          height: 78px;
          background: #fff;
          text-align: center;
          line-height: 78px;
          font-size: 48px;
          font-weight: 500;
          color: #333;
          border-bottom-left-radius: 10px;
          border-bottom-right-radius: 10px;
        }
      }
    }
    .up-issueNo {
      margin: 40px auto 20px;
      width: 656px;
      height: 100px;
      background: url(/src/assets/img/lottery/marke99.png) no-repeat 0 0/100% 100%;
      line-height: 100px;
      text-align: center;
      &-label {
        font-size: 30px;
        color: #333;
      }
      &-item {
        font-size: 36px;
        color: #f03212;
        padding: 0 16px;
      }
    }
    .choose-code-one {
      width: 100%;
      height: 90px;
      display: flex;
      justify-content: center;
      align-items: center;
      box-sizing: border-box;
      // padding: 0 26px;
      text-align: center;
      background: #fff;
      .label {
        font-size: 30px;
        color: #46433a;
      }
      .img-icon {
        width: 40px;
        height: 40px;
      }
      :deep(.van-checkbox--horizontal) {
        margin-right: 18px;
      }
      :deep(.van-checkbox__label) {
        margin-left: 10px;
      }
    }
    .choose-code-two {
      width: 100%;
      // height: calc(100vh - 600px);
      box-sizing: border-box;
      padding: 20px 26px 200px 40px;
      text-align: center;
      background: #fff;
      margin-top: 2px;
      overflow-y: scroll;
      .li {
        display: flex;
        align-items: center;
        margin-bottom: 28px;
        .line {
          width: 72px;
          height: 72px;
          background: #f8bc08;
          border-radius: 50%;
          margin-right: 40px;
          text-align: center;
          line-height: 80px;
          .right-img {
            width: 42px;
            height: 26px;
          }
        }
        .flex {
          width: 560px;
          display: flex;
          align-items: center;

          .on {
            width: 72px;
            height: 72px;
            font-size: 36px;
            font-weight: 700;
            color: #fff;
            line-height: 72px;
            text-align: center;
            background: #41d4d4;
            border-radius: 50%;
            margin-right: 20px;
          }
          .off {
            width: 72px;
            height: 72px;
            font-size: 34px;
            font-weight: 700;
            color: #333;
            line-height: 72px;
            text-align: center;
            background: #eef2f6;
            border-radius: 50%;
            margin-right: 20px;
          }
        }
      }
    }
  }
  .modalVisible {
    position: fixed;
    right: 0;
    bottom: 200px;
    z-index: 99;
    width: 226px;
    height: 112px;

    img {
      width: 226px;
      height: 112px;
    }
    .note {
      position: absolute;
      top: 35px;
      right: 5px;
      width: 40px;
      height: 40px;
      font-size: 28px;
      text-align: center;
      color: #fff;
      background: url(/src/assets/gold_note.png) no-repeat 0 0/100% 100%;
      line-height: 40px;
    }
  }
  footer {
    position: fixed;
    bottom: 0;
    z-index: 99;
    width: 100vw;
    background: linear-gradient(0deg, #191a1c, #070908);

    .betting {
      position: relative;
      display: flex;
      align-items: center;
      padding-left: 27px;
      width: 100%;
      height: 90px;
      color: #fff;

      :deep(.van-field) {
        margin: 0 10px;
        width: 150px;
        height: 60px;
        border-radius: 10px;
        line-height: 60px;
        .van-field__control {
          margin-top: -20px;
        }
      }

      i {
        position: absolute;
        right: 40px;
        z-index: 66;
        font-size: 36px;
        color: #131516;
      }
      span {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-left: 18px;
        width: 120px;
        height: 60px;
        font-size: 30px;
        border-radius: 30px;
        background: #333333;
        line-height: 60px;
        &.btActive {
          color: #333333;
          background: #ffffff;
        }
      }
    }
    .bet {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-left: 27px;
      height: 100px;
      background: linear-gradient(0deg, #191a1c 0%, #191a1c 100%);
      .text {
        i {
          color: #efc55a;
        }
        .colorEFC55A {
          color: #efc55a !important;
        }
        span {
          font-size: 28px;
          color: #ffffff;
        }
        span:nth-child(1) {
          font-family: PingFang SC;
          font-weight: 700;
        }
        span:nth-child(2) {
          padding-left: 20px;
          font-weight: 700;
          color: #efc55a;
        }
      }
      .bt {
        margin-right: 10px;
        width: 210px;
        font-size: 40px;
        border-radius: 10px;
        text-align: center;
        background: url(/src/assets/img/lottery/seafoods/bet.png) no-repeat 0 0/100%;
        line-height: 100px;
        &.disabled {
          background: url(/src/assets/img/lottery/button_disabled.png) no-repeat 0 0/100%;
        }
      }
    }
  }
  .result-popup {
    background: rgba(0, 0, 0, 0.5);
    position: fixed;
    z-index: 100;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    &__winning {
      width: 100%;
      height: 68.93vw;
    }
    &__winning::after {
      content: '';
      top: -80px;
      left: 0;
      bottom: 0;
      right: 0;
      position: absolute;
      z-index: -1;
      background: url(/src/assets/celebrate.png) no-repeat 50% 50%/100vw 68.93vw;
      animation: opacityAnima 700ms infinite;
      -webkit-animation: opacityAnima 700ms infinite;
    }
    &__winning-text {
      width: 56.8vw;
      height: 12.93vw;
      background: url(/src/assets/winning_text.png) no-repeat 0 0/100% 100%;
      margin: 0 auto;
      animation: rotateAnima 300ms linear infinite;
      -webkit-animation: rotateAnima 300ms linear infinite;
    }
    &__treasure-box {
      width: 53.733vw;
      height: 50.93vw;
      background: url(/src/assets/treasure_box.png) no-repeat 0 0/100% 100%;
      margin: 0 auto;
    }
    &__treasure-box-2 {
      width: 36.8vw;
      height: 37.87vw;
      background: url(/src/assets/treasure_box_2.png) no-repeat 0 0/100% 100%;
      margin: 0 auto;
    }
    &__ordinary-box {
      width: 43.2vw;
      height: 35.33vw;
      background: url(/src/assets/ordinary_box.png) no-repeat 0 0/100% 100%;
      margin: 0 auto;
    }
    p {
      width: 66.67vw;
      color: #ffffff;
      text-align: center;
      margin-top: 6.27vw;
    }
    &__button {
      text-decoration: none;
      width: 64vw;
      height: 13.47vw;
      line-height: 13.47vw;
      color: #472700;
      font-size: 3.73vw;
      text-align: center;
      margin-top: 6.67vw;
      background: url(/src/assets/big_button.png) no-repeat 0 0/100% 100%;
    }
  }
  @keyframes opacityAnima {
    0% {
      filter: alpha(Opacity=100);
      -moz-opacity: 1;
      opacity: 1;
    }
    50% {
      filter: alpha(Opacity=10);
      -moz-opacity: 0.1;
      opacity: 0.1;
    }
    100% {
      filter: alpha(Opacity=100);
      -moz-opacity: 1;
      opacity: 1;
    }
  }
  @-webkit-keyframes opacityAnima {
    0% {
      filter: alpha(Opacity=100);
      -moz-opacity: 1;
      opacity: 1;
    }
    50% {
      filter: alpha(Opacity=10);
      -moz-opacity: 0.1;
      opacity: 0.1;
    }
    100% {
      filter: alpha(Opacity=100);
      -moz-opacity: 1;
      opacity: 1;
    }
  }
  @keyframes rotateAnima {
    0% {
      transform: rotate(0deg);
    }
    25% {
      transform: rotate(10deg);
    }
    50% {
      transform: rotate(0deg);
    }
    75% {
      transform: rotate(-10deg);
    }
    100% {
      transform: rotate(0deg);
    }
  }
  @-webkit-keyframes rotateAnima {
    0% {
      -webkit-transform: rotate(0deg);
    }
    25% {
      -webkit-transform: rotate(10deg);
    }
    50% {
      -webkit-transform: rotate(0deg);
    }
    75% {
      -webkit-transform: rotate(-10deg);
    }
    100% {
      -webkit-transform: rotate(0deg);
    }
  }
}
</style>
