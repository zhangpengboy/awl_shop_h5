<template>
  <BetToolbar @click-tab="onChange" @to-play="toPlay" @to-gameplay="toGameplay"></BetToolbar>
  <div v-show="active === 1">
    <div class="bet-page">
      <div class="zodiac__top">
        <div class="zodiac__roulette-and-history">
          <div class="zodiac__roulette-and-countdown">
            <lucky-zodiac-roulette v-if="rouletteOptions" ref="roulette" :is-first="isFirst" :is-waiting="isWaiting" :options="rouletteOptions" @rotate-end="handleRotateEnd"> </lucky-zodiac-roulette>
            <lucky-zodiac-countdown :current-phase-no="currentPhaseNo" :remaining-time="remainingTime" :is-rotating="isRotating" :is-first="isFirst" :is-waiting="isWaiting" @remaining-time-change="handleCountDownChange" @countdown-end="handleCountdownEnd"></lucky-zodiac-countdown>
          </div>
          <div class="zodiac__history">
            <transition-group :name="animate ? 'myfade' : ''" tag="div">
              <div v-for="item in history_list" :key="item.phaseNo" class="zodiac__history_item">
                <span class="zodiac__history_item-index">{{ item.phaseNo.substr(item.phaseNo.length - 3, 3) }}</span>
                <template v-if="item.winCode">
                  <div class="zodiac__history_item-number" :class="`round_bg_${handleGetWinCodeColor(item.winCodeShow)}`">{{ item.winCode }}</div>
                  <img class="zodiac__history_item-zodiac" :src="srcimg(item.winCode)" />
                </template>
                <span v-else style="font-size: 3.2vw">{{ $t('goldBet.issueCancel') }}</span>
              </div>
            </transition-group>
          </div>
        </div>
      </div>
      <div class="zodiac__select-area">
        <lucky-zodiac-select v-model="selected" :max-options="12" :disabled="selectDisabled"></lucky-zodiac-select>
        <div class="zodiac__select-area-buttons">
          <div class="zodiac__random-4" @click="handleRandom">{{ $t('goldBet.random4') }}</div>
          <div class="zodiac__clean" @click="cleanSelected">{{ $t('goldBet.clean') }}</div>
        </div>
        <div class="ticket-button" @click="ticketTutton()">
          Ticket
          <span v-if="tickets > 0" class="note">{{ tickets }}</span>
        </div>
      </div>
    </div>
    <footer>
      <div class="betting">
        <span v-for="(item, i) in multiple" :key="i" :class="{ btActive: btActive === i }" @click="multipleClick(item, i)">{{ item }}K</span>
        <van-field v-model.number="times" style="width: 100px" type="number" maxlength="5" label="" @update:model-value="clickInput" @focus="onfocus" />
        <i>k</i>
      </div>
      <div class="bet">
        <div class="text">
          <span>{{ `Total: ` }}</span>
          <span>៛ {{ money.toLocaleString() || 0 }}</span>
        </div>
        <span :class="{ bt: true, disabled: (!isFirst && isRotating) || (!isFirst && remain <= 0) || randomPlaying }" @click.stop="handleBet">{{ $t('goldBet.bet') }}</span>
      </div>
    </footer>
    <div v-show="winningPopupVisible" ref="winningPopup" class="result-popup" @click="handleWinningPopupClose">
      <div class="result-popup__winning">
        <div class="result-popup__winning-text"></div>
        <div class="result-popup__treasure-box"></div>
      </div>
    </div>
    <div v-show="notWinningPopupVisible" ref="notWinningPopup" class="result-popup" @click="handleNotWinningPopupClose">
      <div class="result-popup__not-winning">
        <div class="result-popup__ordinary-box"></div>
      </div>
      <p>{{ $t('goldBet.noWinText') }}</p>
    </div>
  </div>
  <DrawHistory v-if="active === 2" class="mt80"></DrawHistory>
  <Modal :modal-visible="modalVisible" :issue-id="currentPhaseNo" @next="detail($event)" @back="modalVisible = false"></Modal>
  <!-- <van-dialog
    v-model:show="isEndModal"
    :title="$t('goldBet.isEndRemind')"
    :confirm-button-text="$t('goldBet.backToSelect')"
    :message="$t('goldBet.isEnd', { issue: currentPhaseNo || '' })"
    @confirm="isEndModal = false"
  >
  </van-dialog> -->
</template>
<script>
import { Toast, Dialog } from 'vant';
import BetToolbar from '@/components/BetToolbar.vue'; // 头部
import DrawHistory from './components/DrawHistory.vue';
import Modal from '@/components/Modal.vue'; // 投注记录弹窗
import User from '@/api/user';
import LuckyZodiacRoulette from '@/components/LuckyZodiacRoulette.vue';
import LuckyZodiacCountdown from '@/components/LuckyZodiacCountdown.vue';
import LuckyZodiacSelect from '@/components/LuckyZodiacSelect.vue';
import lance from '@/utils/lance';
import { ride } from '@/utils/decimal';
import zodiac_01 from '@/assets/img/zodiac/zodiac_01.png';
import zodiac_02 from '@/assets/img/zodiac/zodiac_02.png';
import zodiac_03 from '@/assets/img/zodiac/zodiac_03.png';
import zodiac_04 from '@/assets/img/zodiac/zodiac_04.png';
import zodiac_05 from '@/assets/img/zodiac/zodiac_05.png';
import zodiac_06 from '@/assets/img/zodiac/zodiac_06.png';
import zodiac_07 from '@/assets/img/zodiac/zodiac_07.png';
import zodiac_08 from '@/assets/img/zodiac/zodiac_08.png';
import zodiac_09 from '@/assets/img/zodiac/zodiac_09.png';
import zodiac_10 from '@/assets/img/zodiac/zodiac_10.png';
import zodiac_11 from '@/assets/img/zodiac/zodiac_11.png';
import zodiac_12 from '@/assets/img/zodiac/zodiac_12.png';

export default {
  name: 'LuckyZodiac',
  components: {
    LuckyZodiacRoulette,
    LuckyZodiacCountdown,
    LuckyZodiacSelect,
    BetToolbar,
    Modal,
    DrawHistory,
  },
  data() {
    return {
      multiple: [1, 2, 3, 5],
      btActive: 0,
      active: 1,
      modalVisible: false,
      moreMenuPopoverVisible: false,
      moreMenuPopoverTarget: null,
      history_list: [],
      trend_obj: {},
      errorDialog: false, // 错误弹窗
      betDialog: false, // 倍数弹窗
      bets: 1, // 注数
      times: 1,
      // 奖期
      lastPhaseNo: '', // 上一奖期号码
      currentPhaseNo: '', // 当前奖期号码
      lastStatus: null, // 开奖状态
      lastWinCode: null, // 开奖结果
      remainingTime: null, // 剩余开奖时长

      // 转盘
      rouletteOptions: { number: 0.5 },
      animate: false, // 是否有添加动画

      // 转盘结果
      winningPopupVisible: false,
      notWinningPopupVisible: false,

      // 选号
      selected: [],
      selectDisabled: false,
      randomPlaying: false,
      amount: 0,
      pix: 10,
      gold_amount: 0,
      tickets: 0,
      getGoldTimes: 0,
      allowGetGold: false,
      isNew: true,
      preHis: [],
      dialogVisible: false,
      // statusBarHeight:false,
      contentTop: false,
      isRotating: false, // 是否正在旋转
      isFirst: true, // 是否刚进入页面
      isWaiting: false, // 是否是待开奖状态
      remain: 0, // 剩余开奖时间
      isEndModal: false, // 是否奖期结束弹窗
    };
  },
  computed: {
    money() {
      if (this.times) {
        return ride(this.selected.length * 1000, this.times);
      }

      return 0;
    },
  },
  mounted() {
    console.log('mounted');
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        // app运行
        // this.isFirst = true;
      } else {
        // app挂起
      }
    });
  },
  created() {
    this.getPhaseInfo();

    // this.getGold();
  },
  methods: {
    srcimg(e) {
      console.log('eeeeeee', e);
      const map = {
        '01': zodiac_01,
        '02': zodiac_02,
        '03': zodiac_03,
        '04': zodiac_04,
        '05': zodiac_05,
        '06': zodiac_06,
        '07': zodiac_07,
        '08': zodiac_08,
        '09': zodiac_09,
        10: zodiac_10,
        11: zodiac_11,
        12: zodiac_12,
      };
      console.log(map[e]);
      return map[e];
    },
    multipleClick(num, i) {
      this.btActive = i;
      // this.playBtMusic();
      this.times = num;
    },
    clickInput(v) {
      if (Number(this.times) > 10000) {
        v = 10000;
        this.times = lance.onlyNonNegative(v);
        return Toast(this.$t('msg.a52'));
      }
      this.times = lance.onlyNonNegative(v);
    },
    onfocus() {
      this.btActive = -1;
    },
    toPlay() {
      this.$router.push({
        path: '/lotteryPlay',
        query: {
          videoId: '6DLuckyZodiac/HowToPlay',
        },
      });
    },
    toGameplay() {
      this.$router.push({
        path: '/playingInstrution',
        query: {
          lotteryId: 'animal',
        },
      });
    },
    onChange(e) {
      this.active = e;
      this.modalVisible = false;
    },
    getGold() {
      User.getAccountInfo({
        appInfo: {},
      })
        .then((res) => {
          this.gold_amount = res.data.cash;

          // 金币数小于100,领取次数小于5
          // console.log(this.allowGetGold ,this.gold_amount < 100 , this.getGoldTimes < 5)
          // if (this.allowGetGold && this.gold_amount < 100 && this.getGoldTimes < 5) {
          //   console.log(12322);
          //   User.drawGold({
          //     appInfo: {},
          //   }).then((res) => {
          //     this.allowGetGold = false;
          //     this.gold_amount += res.data.amount;
          //     this.getGoldTimes = res.data.finishTimes;
          //     this.dialogVisible = true;
          //   });
          // }
        })
        .catch((err) => {
          console.log(err);
          Toast(err.toast);
          if (!this.errorDialog) this.errorDialog = true;
        });
    },
    // 倒计时结束事件handler
    handleCountdownEnd() {
      if (!this.isFirst) {
        if (this.selected.length) {
          // 清空开奖时候选中的号码
          // this.$ons.notification.alert(this.$t('goldBet.isEnd',{issue:this.currentPhaseNo}), {
          //   class: '',
          //   buttonLabels:[this.$t('goldBet.backToSelect')],
          //   title:this.$t('goldBet.isEndRemind'),
          //   callback:() => {

          //   }
          // })
          // this.isEndModal = true;
          console.log('this.selectedthis.selected', this.selected);
          // setTimeout(() => {
          //   this.isEndModal = false;
          // }, 2000);
          const that = this;
          Dialog({
            title: that.$t('goldBet.isEndRemind'),
            message: that.$t('goldBet.isEnd', { issue: this.currentPhaseNo || '' }),
            confirmButtonText: that.$t('goldBet.backToSelect'),
          }).then(() => {
            // on close
          });
          this.selected = [];
        }
        console.log('CountdownEnd');
        this.isRotating = false;
        this.times = 1;
        this.btActive = 0;
        this.getPhaseInfo();
      }
    },
    handleCountDownChange(e) {
      this.remain = e;
    },
    // 获取奖期接口
    getPhaseInfo() {
      User.getPhaseInfo({
        appInfo: {},
        data: {
          lottId: 'animal',
        },
      })
        .then((res) => {
          const { data } = res;
          this.lastStatus = res.data.lastStatus;
          console.log('lastWinCode:', data.lastWinCode);
          // 刚进入页面
          if (this.isFirst) {
            // 已开奖
            if (data.lastWinCode && this.lastStatus === 5) {
              this.currentPhaseNo = data.currentPhaseNo;
              this.rouletteOptions = { number: Number(data.lastWinCode) };
              this.remainingTime = res.data.endTime - res.currentTime;
              this.isRotating = true;
              this.isWaiting = false;
              console.log(1);
            } else if (this.lastStatus !== 5 && this.lastStatus !== 7) {
              // 正在开奖
              this.currentPhaseNo = data.lastPhaseNo;
              this.rouletteOptions = { number: Number(data.lottHis[0].winCode) };
              this.isWaiting = true;
              const { lastLottRest } = res.data; // 获取后端返回的的距离开奖的时间
              setTimeout(
                () => {
                  this.isFirst = false;
                  this.animate = true; // 打开新增奖期动画
                  this.getPhaseInfo();
                },
                lastLottRest > 0 ? lastLottRest : 10000,
              ); // 在后端返回的距离开奖的时间结束后，如果还是没有结果，10秒后再次请求
            } else if (this.lastStatus === 7) {
              // 取消奖期
              this.currentPhaseNo = data.currentPhaseNo;
              this.isFirst = false;
              this.remainingTime = res.data.endTime - res.currentTime;
            }

            this.history_list = data.lottHis;
          } else {
            if (data.lastWinCode && this.lastStatus === 5) {
              this.currentPhaseNo = data.lastPhaseNo;
              this.rouletteOptions = { number: Number(data.lastWinCode) };
              this.remainingTime = res.data.endTime - res.currentTime;
              this.isRotating = true;
              this.isWaiting = false;
            }

            if (this.lastStatus !== 5 && this.lastStatus !== 7) {
              // 不是开奖（5）和取消（7）状态时继续请求开奖结果
              this.currentPhaseNo = data.lastPhaseNo;
              // 设置指定时间重新请求开奖结果
              const { lastLottRest } = res.data; // 获取后端返回的的距离开奖的时间
              this.isWaiting = true;
              setTimeout(
                () => {
                  this.animate = true; // 打开新增奖期动画
                  this.getPhaseInfo();
                },
                lastLottRest > 0 ? lastLottRest : 10000,
              ); // 在后端返回的距离开奖的时间结束后，如果还是没有结果，10秒后再次请求
            } else if (this.lastStatus === 7) {
              // 取消奖期
              console.log(data.lottHis);
              this.currentPhaseNo = data.currentPhaseNo;
              this.animate = true; // 打开新增奖期动画
              this.rouletteOptions = { number: 0.5 };
              this.remainingTime = res.data.endTime - res.currentTime;

              if (data.lastPhaseNo !== data.lottHis[0].phaseNo) {
                data.lottHis.unshift({
                  endTime: data.endTime,
                  lotteryId: 'animal',
                  phaseNo: data.lastPhaseNo,
                });

                this.history_list = data.lottHis;
                return;
              }
            }
            this.preHis = data.lottHis;
          }
          // this.noSale = false

          // if (this.lastStatus !== 5 && this.lastStatus !== 7) { // 不是开奖（5）和取消（7）状态时继续请求开奖结果
          //   // 设置指定时间重新请求开奖结果
          //   const lastLottRest = res.data.lastLottRest  // 获取后端返回的的距离开奖的时间
          //   setTimeout(() => {
          //     this.animate = true; //打开新增奖期动画
          //     this.getPhaseInfo()
          //   }, lastLottRest > 0 ? lastLottRest : 10000) // 在后端返回的距离开奖的时间结束后，如果还是没有结果，10秒后再次请求
          // } else if(this.lastStatus == 7) { //取消奖期
          //   this.animate = true; //打开新增奖期动画
          //   this.rouletteOptions = {number:0.5}
          //   this.remainingTime = res.data.endTime - res.currentTime
          // }

          // if(this.history_list.length == 0) {
          //   this.history_list = data.lottHis
          // } else {
          //   this.preHis = data.lottHis
          // }

          this.trend_obj = { hot: data.hot, cold: data.cold, maxMissing: data.maxMissing };
          this.getTickets();
        })
        .catch((res) => {
          console.log(res);
          // if (res.code === 1003) {
          //   this.noSale = true
          // }
          if (!this.errorDialog) this.errorDialog = true;
        });
    },
    /**
     * 投注
     */
    handleBet() {
      if ((!this.isFirst && this.isRotating) || (!this.isFirst && this.remain <= 0) || this.isFirst || this.randomPlaying) {
        return;
      }
      // 没有选择号码
      if (this.selected.length === 0) {
        Toast(this.$t('goldBet.SelectOneAtLeast'));
        return;
      }
      if (!this.money) {
        Toast(this.$t('msg.a49'));
        return false;
      }
      if (Number(this.money) > 10000000) {
        return Toast(this.$t('msg.a51'));
      }
      const selected = this.selected.map((item) => {
        if (item < 10) {
          return `a5#0${item}#1`;
        }
        return `a5#${String(item)}#1`;
      });
      const betCode = selected.join(';');
      // const amount = this.times * this.pix * this.selected.length;

      if (lance.getData('token')) {
        User.betHFive({
          appInfo: {},
          data: {
            lotteryType: 'animal',
            phase: this.currentPhaseNo,
            bets: this.selected.length,
            multiple: (this.times || this.multiple[this.btActive]) * 10,
            amount: this.money,
            betCode,
          },
        })
          .then((res) => {
            if (res.success) {
              // this.getGold();
              this.getTickets();
              this.cleanSelected();
              Toast(this.$t('goldBet.betSuccess'));
              this.allowGetGold = false;
            }
          })
          .catch((res) => {
            if (res.code === 1152) {
              // this.getGold();
            } else {
              Toast(res.toast);
            }
            //
          });
      } else {
        this.$router.push('/login');
      }

      // let number = Math.floor(Math.random() * 12) + 1 // 1-12中取随机数

      // if(number <= 6) {
      //   this.winningPopupVisible = true
      // } else {
      //   this.notWinningPopupVisible = true
      // }
    },
    /**
     * 转盘结束
     */
    handleRotateEnd() {
      console.log('转盘结束');
      this.allowGetGold = true;
      this.isRotating = false;
      if (this.preHis.length) {
        console.log(999);
        console.log(this.preHis);
        this.history_list.unshift(this.preHis[0]);
        console.log(this.history_list);
        this.preHis = [];
        // this.history_list = this.preHis;
      }
      // this.getGold();
      this.getTickets();
      User.getPhaseInfo({
        appInfo: {},
        data: {
          lottId: 'animal',
          orderTypeName: 'normal',
          fetchUserBetWin: true,
        },
      })
        .then((res) => {
          const { data } = res;

          if (this.lastStatus !== 5 && this.lastStatus !== 7) {
            // 正在开奖
            this.currentPhaseNo = data.lastPhaseNo;
          } else {
            // 已开奖
            this.currentPhaseNo = data.currentPhaseNo;
          }

          if (data.lastWinCode) {
            this.remainingTime = res.data.endTime - res.currentTime;
          }

          // 第一次进来不弹中奖状态
          if (!this.isFirst) {
            if (data.lastBetWinStatus === 1) {
              // 没中奖
              this.notWinningPopupVisible = true;
              this.modalVisible = false;
              setTimeout(() => {
                this.notWinningPopupVisible = false;
              }, 1000);
            } else if (data.lastBetWinStatus === 2) {
              // 中奖
              this.winningPopupVisible = true;
              this.modalVisible = false;
              setTimeout(() => {
                this.winningPopupVisible = false;
              }, 1000);
            }
          }
          this.isFirst = false;
        })
        .catch(() => {
          // if (res.code === 1003) {
          //   this.noSale = true
          // }
        });
    },
    confirmTimes(e) {
      if (e === 0 || !e) {
        this.times = 1;
      } else {
        this.times = +e;
      }
    },
    handleGetWinCodeColor(val) {
      if (val) {
        const num = val.split(',')[0];
        const red_array = ['01', '02', '03', '04'];
        const blue_array = ['05', '06', '07', '08'];
        return red_array.includes(num) ? 'red' : blue_array.includes(num) ? 'green' : 'blue';
      }
    },
    handleRandom() {
      if (this.randomPlaying || this.$refs.roulette.rotating) {
        return;
      }

      this.randomPlaying = true;
      this.selectDisabled = true;

      const changeCount = 15; // 随机切换的次数
      let leftChangeCount = changeCount; // 剩余切换的次数

      this.randomInterval = setInterval(() => {
        if (leftChangeCount > 0) {
          // const number = Math.ceil(Math.random() * 12); // 1-12中取随机数
          this.selected = this.getRandom(4);
          leftChangeCount--;
        } else {
          clearInterval(this.randomInterval);
          leftChangeCount = changeCount;
          this.randomPlaying = false;
          this.selectDisabled = false;
        }
      }, 100);
    },

    getRandom(count) {
      const arr = [];
      while (arr.length < count) {
        const number = Math.ceil(Math.random() * 12);

        if (!arr.includes(number)) {
          arr.push(number);
        }
      }

      return arr;
    },

    cleanSelected() {
      this.selected = [];
    },

    handleWinningPopupClose() {
      this.winningPopupVisible = false;
    },
    handleNotWinningPopupClose() {
      this.notWinningPopupVisible = false;
    },

    detail(item) {
      const { orderId } = item;
      this.$router.push({
        path: '/OrderDetail',
        query: {
          orderId,
          lottery: 'animal',
        },
      });
    },

    getTickets() {
      User.list({
        appInfo: {},
        data: {
          currentPage: 1,
          pageNumber: 100,
          orderStatus: 1,
          searchTime: 0,
          orderType: 'normal',
          lotteryId: 'animal',
          phase: this.currentPhaseNo,
        },
      })
        .then((res) => {
          this.tickets = res.data.totalNumber;
        })
        .catch((err) => {
          console.log(err);
          if (!this.errorDialog) this.errorDialog = true;
        });
    },

    ticketTutton() {
      // platform.exec('onPlayButtomSound');
      this.modalVisible = true;
    },
    clickNumber() {
      // platform.exec('onPlayButtomSound');
      this.betDialog = true;
    },
  },
};
</script>
<style lang="less" scoped>
.mt80 {
  margin-top: 80px;
}
.bet-page {
  overflow-y: scroll;
  height: 100vh;
  -webkit-overflow-scrolling: touch;
  // position: absolute;
  // left: 0;
  // right: 0;
  // box-sizing: border-box;
  .zodiac {
    &__top {
      position: relative;
      z-index: 10;
      padding-top: 90px;
      padding-bottom: constant(safe-area-inset-top);
      padding-bottom: env(safe-area-inset-top);
      height: 80vw;
      background: url(/src/assets/img/lottery/lucky_zodiac_top_bg.png) no-repeat 0 0/100%;
      background-size: 100%; //适配ios刘海屏
      .round_bg {
        &_red {
          background: url(/src/assets/img/lottery/round_red.png) no-repeat 0 0/100%;
        }
        &_blue {
          background: url(/src/assets/img/lottery/round_blue.png) no-repeat 0 0/100%;
        }
        &_green {
          background: url(/src/assets/img/lottery/round_green.png) no-repeat 0 0/100%;
        }
      }
    }
    &__roulette-and-history {
      display: flex;
    }
    &__roulette-and-countdown {
      margin-top: 0;
      margin-left: 4.53vw;
    }
    &__roulette {
      margin: 0 auto;
      width: 44vw;
      height: 44vw;
      border-radius: 50%;
      background: #000;
    }
    &__history {
      overflow: hidden;
      margin-top: 3.6vw;
      margin-left: 0.8vw;
      width: 35.2vw;
      height: 56vw;
      border: 0.53vw solid #ffe3e3;
      border-radius: 1vw;
      background: transparent;
      box-shadow: 0px 0px 5px #f17704;
      &_item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 3.2vw;
        // width: calc(100% - 6.4vw);
        height: 9vw;
        color: #fafeff;
        background: url(/src/assets/img/lottery/history_item_bg.png) no-repeat 0 0/100%;
        &-index {
          width: 5.5vw;
          font-size: 3.47vw;
          font-weight: 600;
        }
        &-number {
          display: flex;
          justify-content: center;
          align-items: center;
          margin: 0 auto;
          width: 5.87vw;
          height: 5.87vw;
          font-size: 3.47vw;
          font-weight: 600;
          color: #f2fff4;
        }
        &-zodiac {
          // zoom: 0.5;
          width: 6.93vw;
          max-height: 5.5vw;
        }
      }
    }
    &__trend-and-numbers {
      display: flex;
      justify-content: space-around;
      margin: 4vw 0;
      width: 100%;
      // position: absolute;
      // bottom: 0;

      > div {
        width: 25%;
        height: 14.33vw;
      }
      &-title {
        height: 3.47vw;
        line-height: 3.47vw;
        text-align: center;
        // margin-top: -1vw;
        background: linear-gradient(90deg, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0));
        span {
          font-size: 3.2vw;
          background: linear-gradient(0deg, #fbf7bf 0%, #ffca68 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      }
      &-trend {
        position: relative;
        width: 100%;
        height: 11.4vw;
        background: url(/src/assets/img/lottery/trend_bg.png) no-repeat center -1.5vw/65%;
      }
      &-omissions {
        width: 100%;
        height: 11.4vw;
        background: url(/src/assets/img/lottery/omissions_bg.png) no-repeat center 7.5vw/65%;
      }
      &-popular {
        width: 100%;
        height: 11.4vw;
        background: url(/src/assets/img/lottery/popular_bg.png) no-repeat center 6vw/65%;
      }
      &-unpopular {
        width: 100%;
        height: 11.4vw;
        background: url(/src/assets/img/lottery/unpopular_bg.png) no-repeat center 6vw/65%;
      }
      .round-number {
        margin: 0 auto;
        width: 9.34vw;
        height: 9.34vw;
        font-size: 5.2vw;
        font-weight: 600;
        text-align: center;
        color: #ffffff;
        line-height: 9.34vw;
        // position: absolute;
      }
    }
    &__select-area {
      position: relative;
      padding-top: 13.86vw;
      height: calc(100vh - 80vw);
      background: url(/src/assets/middle_bg.jpg) no-repeat;
      background-size: 100%;

      &-buttons {
        display: flex;
        margin-top: 2vw;
      }

      .ticket-button {
        position: absolute;
        top: 52vw;
        right: 2vw;
        width: 25vw;
        height: 12.67vw;
        font-size: 4.2vw;
        font-weight: bold;
        text-align: center;
        color: #fff;
        background: url(/src/assets/img/gold_up.png) no-repeat 0 0/100% 100%;
        line-height: 14vw;

        &::before {
          position: absolute;
          top: 0;
          left: -5.07vw;
          display: block;
          width: 11.33vw;
          height: 11.6vw;
          background: url(/src/assets/img/gold_roll.png) no-repeat 0 0/100% 100%;
          content: '';
        }

        .note {
          position: absolute;
          top: 4vw;
          right: 0.67vw;
          width: 4.67vw;
          height: 4vw;
          font-size: 2.93vw;
          text-align: center;
          color: #fff;
          background: url(/src/assets/gold_note.png) no-repeat 0 0/100% 100%;
          line-height: 4vw;
        }
      }
    }
    &__random-4,
    &__clean {
      margin-left: 5.3vw;
      width: 21.2vw;
      height: 9.46vw;
      font-size: 3.2vw;
      font-weight: bold;
      text-align: center;
      color: #ffffff;
      background: url(/src/assets/img/lottery/button_bg_02_c1.png) no-repeat 0 0/100% 100%;
      text-shadow: 0 0 0.53vw rgba(0, 0, 0, 0.72);
      line-height: 9.46vw;
    }
    &__clean {
      background-image: url(/src/assets/img/lottery/button_bg_02_c2.png);
    }
  }
}

/* 效果过程 */
.myfade-enter-active,
.myfade-leave-active {
  height: 8.8vw;
  transition: all 0.8s linear;
}
/* 进场的瞬间与离场的效果添加 */
.myfade-enter,
.myfade-leave-to {
  height: 0;
  opacity: 0;
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
.lottery-footer {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  background: #000000;

  &__times {
    height: 44px;
    background: linear-gradient(0deg, #13121b 0%, #0f1111 100%);

    &-title {
      margin: 0 auto;
      margin-bottom: 4px;
      width: 186px;
      height: 26px;
      font-size: 20px;
      font-weight: bold;
      text-align: center;
      background: url(/src/assets/img/lottery/times_title_bg.png) no-repeat 0 0/100%;
      zoom: 0.5;
    }
    &-input {
      display: flex;
      justify-content: center;
    }
    &-number {
      margin: 0 1px;
      width: 100px;
      height: 25px;
      font-size: 12px;
      border: 1px solid #3d3f4c;
      border-radius: 5px;
      text-align: center;
      color: #ffffff;
      background: linear-gradient(0deg, #232429 0%, #2e3341 100%);
      box-sizing: border-box;
      line-height: 25px;
    }
    &-reduce,
    &-add {
      width: 40px;
      height: 25px;
      border: 1px solid #3d3f4c;
      border-radius: 5px;
      text-align: center;
      color: #54575a;
      background: linear-gradient(0deg, #232429 0%, #2e3341 100%);
      box-sizing: border-box;
    }
  }
  &__total-and-bet {
    display: flex;
    align-items: center;
    padding: 0 13.5px 0 15px;
    height: 50px;
    background: linear-gradient(0deg, #13121b 0%, #0f1111 100%);
  }
  &__total {
    flex-grow: 1;
    color: #ffffff;

    span {
      display: block;
      margin-top: 9px;
      font-size: 14px;
      line-height: 14px;
    }
    em {
      display: block;
      margin-top: 6px;
      font-size: 20px;
      font-style: normal;
      line-height: 20px;
      zoom: 0.5;
    }
  }
  &__bet {
    width: 83px;
    height: 36px;
    font-size: 20px;
    font-weight: 600;
    text-align: center;
    color: #220500;
    background: url(/src/assets/img/lottery/button_bg_01.png) no-repeat 0 0/100%;
    line-height: 34px;

    &.disabled {
      background: url(/src/assets/img/lottery/button_disabled.png) no-repeat 0 0/100%;
    }
  }
}
.result-popup {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 100;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.5);
  flex-direction: column;

  &__winning {
    width: 100%;
    height: 68.93vw;
  }
  &__winning::after {
    position: absolute;
    top: -80px;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: -1;
    background: url(/src/assets/celebrate.png) no-repeat 50% 50%/100vw 68.93vw;
    content: '';
    -webkit-animation: opacityAnima 700ms infinite;
    animation: opacityAnima 700ms infinite;
  }
  &__winning-text {
    margin: 0 auto;
    width: 56.8vw;
    height: 12.93vw;
    background: url(/src/assets/winning_text.png) no-repeat 0 0/100% 100%;
    -webkit-animation: rotateAnima 300ms linear infinite;
    animation: rotateAnima 300ms linear infinite;
  }
  &__treasure-box {
    margin: 0 auto;
    width: 53.733vw;
    height: 50.93vw;
    background: url(/src/assets/treasure_box.png) no-repeat 0 0/100% 100%;
  }
  &__treasure-box-2 {
    margin: 0 auto;
    width: 36.8vw;
    height: 37.87vw;
    background: url(/src/assets/treasure_box_2.png) no-repeat 0 0/100% 100%;
  }
  &__ordinary-box {
    margin: 0 auto;
    width: 43.2vw;
    height: 35.33vw;
    background: url(/src/assets/ordinary_box.png) no-repeat 0 0/100% 100%;
  }
  p {
    margin-top: 6.27vw;
    width: 66.67vw;
    text-align: center;
    color: #ffffff;
  }
  &__button {
    margin-top: 6.67vw;
    width: 64vw;
    height: 13.47vw;
    font-size: 3.73vw;
    text-align: center;
    text-decoration: none;
    color: #472700;
    background: url(/src/assets/big_button.png) no-repeat 0 0/100% 100%;
    line-height: 13.47vw;
  }
}
@keyframes opacityAnima {
  0% {
    -moz-opacity: 1;
    opacity: 1;
    filter: alpha(Opacity=100);
  }
  50% {
    -moz-opacity: 0.1;
    opacity: 0.1;
    filter: alpha(Opacity=10);
  }
  100% {
    -moz-opacity: 1;
    opacity: 1;
    filter: alpha(Opacity=100);
  }
}
@-webkit-keyframes opacityAnima {
  0% {
    -moz-opacity: 1;
    opacity: 1;
    filter: alpha(Opacity=100);
  }
  50% {
    -moz-opacity: 0.1;
    opacity: 0.1;
    filter: alpha(Opacity=10);
  }
  100% {
    -moz-opacity: 1;
    opacity: 1;
    filter: alpha(Opacity=100);
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
</style>
