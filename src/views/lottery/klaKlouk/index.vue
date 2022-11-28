<template>
  <BetToolbar @click-tab="onChange" @to-play="toPlay" @to-gameplay="toGameplay"></BetToolbar>
  <div v-show="active === 1" class="sixDKlaKlouk mt80">
    <div ref="bet_content" class="bet_content">
      <section>
        <div class="trayBowl" :class="{ moving: moving, transitionAll: transitionAll }" @transitionend="transitionend">
          <div :style="{ transform: 'rotate(' + rotate + 'deg)' }" class="bowlAll">
            <div class="bowl" :class="{ opening: opening, transitionAll: transitionAll }" @transitionend="bowTransitionend">
              <img class="bow" src="@/assets/img/lottery/seafoods/bow.png" alt="" />
            </div>
            <div class="number">
              <img v-for="(item, i) in resultList" :key="i" :src="item.img" alt />
            </div>
            <img class="plate" src="@/assets/img/lottery/seafoods/disc.png" alt="" />
          </div>
        </div>
        <div class="lotteryInformation">
          <!-- reversal -->
          <span v-if="!reversal">
            <i class="i_one">{{ $t('6DKlaKlouk.seafoodInLottery.issue') }}</i>
            <i class="i_two">{{ issueId }}</i>
          </span>
          <span v-else>
            <i class="i_two">{{ issueId }}</i>
            <i class="i_one" style="margin-left: 0.07rem">{{ $t('6DKlaKlouk.seafoodInLottery.issue') }}</i>
          </span>
          <span>{{ msg }}</span>
          <span v-if="buyOffHand">{{ $t('6DKlaKlouk.seafoodInLottery.getDown') }}</span>
        </div>
        <div class="historicalLotteryInformation">
          <div v-for="(item, i) in lastManyIssues" :key="i" class="column">
            <span v-if="!reversal" class="column_issue">
              <i>{{ $t('6DKlaKlouk.seafoodInLottery.issue') }}</i>
              <i class="i">{{ item.phaseNo }}</i>
            </span>
            <span v-else class="column_issue">
              <i class="i">{{ item.phaseNo }}</i>
              <i style="margin-left: 0.05rem">{{ $t('6DKlaKlouk.seafoodInLottery.issue') }}</i>
            </span>
            <div v-if="item.winCode" key="item.imgList" class="imgListOne">
              <span v-for="(items, index) in item.imgList" :key="index">
                <img :src="items" alt="" />
              </span>
            </div>
            <i v-show="!item.winCode" class="cancel">{{ $t('goldBet.issueCancel') }}</i>
          </div>
        </div>
        <div class="lotteryImgList">
          <span v-for="(item, i) in seafoodList" :key="i" :class="{ borderActive: item.borderActive }">
            <img :src="item.img" alt="" />
          </span>
        </div>
      </section>
      <article>
        <div class="handover">
          <span v-for="item in flagList" v-show="item.flags" :key="item.goNum" @click="changeFlag(item.goNum)">
            <img :src="item.img" alt="" />
          </span>
          <!-- <span @click="changeFlag(1)" v-show="flagList[1].flags">
            <img src="@/assets/lottery/seafoods/2d_bt.png" alt="" />
          </span> -->
        </div>
        <div v-show="flagList[0].flags" key="seafoodList" class="chooseSeafood_oneD">
          <span v-for="(item, i) in seafoodList" :key="i" class="seafoodImg" @click.stop="clickSeafood(i, 0)">
            <img :src="item.img" alt="" />
          </span>
          <span class="seafoodImgBorder">
            <img v-for="(item, i) in seafoodList" :key="i" src="@/assets/img/lottery/seafoods/1d.png" alt="" :class="{ active: item.isActive }" />
          </span>
        </div>
        <div v-show="!flagList[0].flags" key="seafoodListTwoD" class="chooseSeafood_twoD">
          <div v-for="(item, i) in seafoodListTwoD" :key="i" :class="{ choiceDouble: true, active: item.isActive }" @click="clickSeafood(i, 1)">
            <div class="choiceDouble_img">
              <span>
                <img :src="item.img_left" alt="" />
              </span>
              <span>
                <img :src="item.img_right" alt="" />
              </span>
            </div>
          </div>
        </div>
      </article>
    </div>
    <p @click="showModal">
      <img src="@/assets/img/lottery/seafoods/ticket.png" alt="" />
      <span v-if="tickets > 0" class="note">{{ tickets }}</span>
    </p>
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
        <span :class="{ bt: true, disabled: buyOffHand }" @click.stop="handleBet">{{ $t('6DKlaKlouk.seafoodInLottery.bet') }}</span>
      </div>
    </footer>
  </div>
  <DrawHistory v-if="active === 2" class="mt80"></DrawHistory>
  <!-- 获胜动画 -->
  <winning-popup :winning-popup-visible="winningPopupVisible" :not-winning-popup-visible="notWinningPopupVisible"></winning-popup>
  <!-- 投注记录弹窗 -->
  <Modal :modal-visible="modalVisible" :issue-id="issueId" :lottery-id="lotteryId" @next="detail($event)" @back="modalVisible = false" @get-list-length="getListLength"></Modal>
</template>
<script>
import { Toast, Dialog } from 'vant';
import BetToolbar from '@/components/BetToolbar.vue'; // 头部
import DrawHistory from './components/DrawHistory.vue';
import winningPopup from '@/components/winningPopup.vue'; // 获胜动画
import Modal from '@/components/Modal.vue'; // 投注记录弹窗
import User from '@/api/user';
import lance from '@/utils/lance';
import { ride } from '@/utils/decimal';
import oned_bt from '@/assets/img/lottery/seafoods/1d_bt.png';
import twod_bt from '@/assets/img/lottery/seafoods/2d_bt.png';
import hu from '@/assets/img/lottery/seafoods/hu.png';
import hulu from '@/assets/img/lottery/seafoods/hulu.png';
import ji from '@/assets/img/lottery/seafoods/ji.png';
import xia from '@/assets/img/lottery/seafoods/xia.png';
import xie from '@/assets/img/lottery/seafoods/xie.png';
import yu from '@/assets/img/lottery/seafoods/yu.png';
import hu_open from '@/assets/img/lottery/seafoods/hu_open.png';
import hulu_open from '@/assets/img/lottery/seafoods/hulu_open.png';
import ji_open from '@/assets/img/lottery/seafoods/ji_open.png';
import xia_open from '@/assets/img/lottery/seafoods/xia_open.png';
import xie_open from '@/assets/img/lottery/seafoods/xie_open.png';
import yu_open from '@/assets/img/lottery/seafoods/yu_open.png';

export default {
  name: 'KlaKlouk',
  components: {
    Modal,
    winningPopup,
    BetToolbar,
    DrawHistory,
  },
  props: {},
  data() {
    return {
      lotteryId: 'fish', // 彩种
      // 1d 2d btn
      flagList: [
        {
          flags: true,
          goNum: 2,
          img: oned_bt,
        },
        {
          flags: false,
          goNum: 1,
          img: twod_bt,
        },
      ],
      // 1d
      seafoodList: [
        {
          img: hu,
          isActive: false,
          borderActive: false,
        },
        {
          img: hulu,
          isActive: false,
          borderActive: false,
        },
        {
          img: ji,
          isActive: false,
          borderActive: false,
        },
        {
          img: xia,
          isActive: false,
          borderActive: false,
        },
        {
          img: xie,
          isActive: false,
          borderActive: false,
        },
        {
          img: yu,
          isActive: false,
          borderActive: false,
        },
      ],
      // 2d
      seafoodListTwoD: [
        {
          img_left: hu,
          img_right: hulu,
          isActive: false,
        },
        {
          img_left: hulu,
          img_right: ji,
          isActive: false,
        },
        {
          img_left: ji,
          img_right: xie,
          isActive: false,
        },
        {
          img_left: hu,
          img_right: ji,
          isActive: false,
        },
        {
          img_left: hulu,
          img_right: xia,
          isActive: false,
        },
        {
          img_left: ji,
          img_right: yu,
          isActive: false,
        },
        {
          img_left: hu,
          img_right: xia,
          isActive: false,
        },
        {
          img_left: hulu,
          img_right: xie,
          isActive: false,
        },
        {
          img_left: xia,
          img_right: xie,
          isActive: false,
        },
        {
          img_left: hu,
          img_right: xie,
          isActive: false,
        },
        {
          img_left: hulu,
          img_right: yu,
          isActive: false,
        },
        {
          img_left: xia,
          img_right: yu,
          isActive: false,
        },
        {
          img_left: hu,
          img_right: yu,
          isActive: false,
        },
        {
          img_left: ji,
          img_right: xia,
          isActive: false,
        },
        {
          img_left: xie,
          img_right: yu,
          isActive: false,
        },
      ],
      // 往期结果公示
      lastManyIssues: [],
      // 开奖结果
      openList: [
        {
          img: hu_open,
        },
        {
          img: hulu_open,
        },
        {
          img: ji_open,
        },
        {
          img: xia_open,
        },
        {
          img: xie_open,
        },
        {
          img: yu_open,
        },
      ],
      multiple: [1, 2, 3, 5],
      statusBarHeight: false,
      moreMenuPopoverVisible: false,
      moreMenuPopoverTarget: null,
      moving: false,
      opening: false,
      moveIndex: 0,
      rotate: 0,
      rotateList: [0, 8, 0, -8],
      timimg: 0,
      msg: null,
      difftime: null, // 多久开一次大盘
      issueId: null, // 下一期的开奖id
      flag: 1, // 1d或者2d
      isStatus: '',
      num: 0, // 计数器
      opening_number: [], // 开奖编号
      resultList: [], // 设置开奖结果
      errorDialog: false, // 错误弹窗
      betDialog: false, // 倍数弹窗
      times: 1, // 倍数
      // 选号
      selected: [], // 选中的鱼虾蟹
      modalVisible: false,
      dialogVisible: false,
      gold_amount: null, // 账户剩余金额-金币
      getGoldTimes: '',
      onedOrtwoD: 'f1#',
      tickets: 0, // 角标
      // 开奖结果
      winningPopupVisible: false,
      notWinningPopupVisible: false,
      isVictory: false, // 是否中奖
      transitionAll: true,
      isEndModal: false, // 是否奖期结束弹窗
      contentTop: false,
      backgroundTop: null,
      btActive: 0,
      active: 1,
    };
  },
  computed: {
    refreshTime() {
      if (this.moving || this.opening) {
        return false;
      }
      return true;
    },
    buyOffHand() {
      if (this.timimg < 0) {
        return true;
      }
      if (this.moving) {
        return true;
      }
      return false;
    },
    money() {
      if (this.times) {
        return ride(this.selected.length * 1000, this.times);
      }
      return 0;
    },
    reversal() {
      return this.getQueryString('lang') === 'cn';
    },
  },
  watch: {
    timimg: {
      handler(v, s) {
        v = parseInt(v);
        // console.log('timimg', v);
        if (v === 1) {
          // console.log('timimg==1掉接口了');
          setTimeout(() => {
            if (this.selected.length) {
              const that = this;
              Dialog({
                title: that.$t('goldBet.isEndRemind'),
                message: that.$t('goldBet.isEnd', { issue: this.issueId || '' }),
                confirmButtonText: that.$t('goldBet.backToSelect'),
              }).then(() => {
                // on close
              });
            }
            this.getLotteryResults();
          }, 3000);
        }
      },
    },
  },
  created() {
    // platform.name === "android" && (this.backgroundTop = bgTop);
    document.addEventListener('visibilitychange', this.updateData, false);
    // this.getGold();
    this.init();
    // this.getTickets();
  },
  mounted() {
    window.timess = setInterval(this.countDown, 1000);
    setTimeout(() => {
      this.transitionAll = false;
    }, 1000);
  },
  /**
   * keep-alive 组件激活时调用。 仅针对keep-alive 组件有效
   */
  activated() {},
  /**
   * keep-alive 组件停用时调用。 仅针对keep-alive 组件有效
   */
  deactivated() {},
  beforeUnmount() {
    document.removeEventListener('visibilitychange', this.updateData, false);
  },
  methods: {
    // ...mapMutations(['setUserData', 'popPage']),
    toPlay() {
      this.$router.push({
        path: '/lotteryPlay',
        query: {
          videoId: '6DKlaKlouk/HowToPlay',
        },
      });
    },
    toGameplay() {
      this.$router.push({
        path: '/playingInstrution',
        query: {
          lotteryId: 'fish',
        },
      });
    },
    onChange(e) {
      this.active = e;
      this.modalVisible = false;
    },
    init() {
      User.getPhaseInfo({
        appInfo: {},
        data: { lottId: 'fish', fetchUserBetWin: true, orderTypeName: 'normal' },
      })
        .then((res) => {
          this.lastManyIssues = res.data.lottHis.slice(0, 4);
          this.lastManyIssues.forEach((item) => {
            item.imgList = [];
            if (item.winCode) {
              for (let i = 0; i < 3; i++) {
                item.imgList.push(this.seafoodList[Number(item.winCode.split(',')[i].slice(1)) - 1].img);
              }
            }
          });
          if (res.data.lastStatus === 3) {
            this.issueId = res.data.lastPhaseNo;
            return this.getLotteryResults();
          }
          this.issueId = res.data.currentPhaseNo;

          if (this.isVictory) {
            if (res.data.lastBetWinStatus === 1) {
              // 没中奖
              this.notWinningPopupVisible = true;
              this.modalVisible = false;
              setTimeout(() => {
                this.notWinningPopupVisible = false;
                this.tickets = 0;
              }, 2000);
            } else if (res.data.lastBetWinStatus === 2) {
              // 中奖
              this.winningPopupVisible = true;
              this.modalVisible = false;
              setTimeout(() => {
                this.winningPopupVisible = false;
                this.tickets = 0;
                this.isVictory = false;
                // this.getGold();
              }, 2000);
            }
          }
          this.difftime = (res.data.endTime - res.currentTime) / 1000;
          this.timimg = this.difftime;
          this.getTickets();
        })
        .catch(() => {});
    },
    confirmTimes(e) {
      if (e === 0 || !e) {
        this.times = 1;
      } else {
        this.times = +e;
      }
      const eMap = {
        1: 0,
        10: 1,
        100: 2,
        1000: 3,
      };
      this.btActive = eMap[e];
    },
    // handlePageShow(e) {
    //   this.moving && !this.opening && (this.opening = true);
    //   this.timimg < 0 && this.init();
    // },
    detail(item) {
      const { orderId } = item;
      this.$router.push({
        path: '/orderDetail',
        query: {
          orderId,
          lottery: 'fish',
        },
      });
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
    /**
     * 投注
     */
    handleBet() {
      // !this.buyOffHand && this.playBtMusic();
      if (this.buyOffHand) return false;
      // 没有选择号码
      if (this.selected.length === 0) {
        Toast(this.$t('6DKlaKlouk.toasted'));
        return false;
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
          return `0${item}`;
        }
        return String(item);
      });
      const betCodes = [];
      for (let i = 0; i < selected.length; i++) {
        betCodes.push(`${this.onedOrtwoD + selected[i]}#${1}`);
      }
      const betCode = betCodes.join(';');
      console.log('betCode', betCode);

      // let betCode = this.onedOrtwoD + selected.join(",") + "#" + selected.length;

      if (lance.getData('token')) {
        User.betHFive({
          appInfo: {},
          data: {
            lotteryType: 'fish',
            phase: this.issueId, // 奖期号
            bets: this.selected.length, // 注数
            multiple: (this.times || this.multiple[this.btActive]) * 10, // 倍数
            amount: this.money, // 多少金币
            betCode,
          },
        })
          .then((res) => {
            if (res.success) {
              // this.getGold();
              this.getTickets();
              // this.cleanSelected();
              Toast(this.$t('goldBet.betSuccess'));
              this.allowGetGold = false;
              // 投注后清空
              this.empty();
            } else {
              Toast(res.toast);
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
    },
    /**
     * 投注后清空
     */
    empty() {
      this.seafoodListTwoD.forEach((item, i) => {
        item.isActive = false;
        this.seafoodList[i] && (this.seafoodList[i].isActive = false);
      });
      this.selected = [];
      this.times = 1;
      this.btActive = 0;
    },
    /**
     * 余额数
     */
    getGold() {
      User.getAccountInfo({
        appInfo: {},
      })
        .then((res) => {
          this.gold_amount = res.data.cash;
          // this.getGoldTimes = res.data.finishTimes;

          // //金币数小于100,领取次数小于5
          // // console.log(this.allowGetGold ,this.gold_amount < 100 , this.getGoldTimes < 5)
          // if (this.allowGetGold && this.gold_amount < 100 && this.getGoldTimes < 5) {
          //   console.log(12322);
          //   activity
          //     .drawGold({
          //       appInfo: {
          //         accessToken: this.userData.token || "",
          //         userNo: this.userData.userNo || "",
          //       },
          //     })
          //     .then((res) => {
          //       this.allowGetGold = false;
          //       this.gold_amount += res.data.amount;
          //       this.getGoldTimes = res.data.finishTimes;
          //       this.dialogVisible = true;
          //     });
          // }
        })
        .catch(() => {
          // console.log(err);
          // Toast(err.toast);
          // if (!this.errorDialog) this.errorDialog = true;
        });
    },
    /**
     * 角标数
     */
    getTickets() {
      User.list({
        appInfo: {},
        data: {
          currentPage: 1,
          pageNumber: 100,
          orderStatus: 1,
          searchTime: 0,
          orderType: 'normal',
          lotteryId: 'fish',
          phase: this.issueId,
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
    getListLength(num) {
      this.tickets = num;
      console.log('num', num);
    },
    /**
     * 移动盘子
     */
    startMove() {
      this.moving = true;
      this.isVictory = true;
    },
    /**
     * 盘子移动结束
     */
    glitter(flag, second) {
      setTimeout(() => {
        for (let i = 0; i < 3; i++) {
          this.seafoodList[this.opening_number[i]].borderActive = flag;
        }
      }, second * 1000);
    },
    transitionend() {
      if (this.moving) {
        // 开奖
        this.opening = true;
        for (let i = 0; i < 3; i++) {
          this.seafoodList[this.opening_number[i]].borderActive = true;
        }
        for (let index = 1; index < 8; index++) {
          this.glitter(index % 2 === 0, index * 0.5);
        }
        // (num%2 ==0) ?"偶数":"奇数"
        setTimeout(() => {
          this.reset();
        }, 5000);
      } else {
        // 复原
        this.opening = false;
      }
    },
    /**
     * 盘子复原
     */
    reset() {
      this.moving = false;
      this.opening = false;
      console.log('盘子复原');
      setTimeout(() => {
        this.init();
        this.empty();
      }, 1000);
    },
    /**
     * 盖子移动结束
     */
    bowTransitionend() {
      if (this.opening) {
        // 开盖
      } else {
        // 复原
        const startShakeTimeout = setTimeout(() => {
          this.startShake(); // 摇晃骰子
        }, 2000);
        clearTimeout(startShakeTimeout);
      }
    },
    /**
     * 摇晃骰子
     */
    startShake() {
      this.resultList = [];
      this.moveIndex = 0;
      let timer = null;
      this.init();
      timer = setInterval(() => {
        if (this.moveIndex > 100) {
          clearInterval(timer);
          return;
        }
        this.rotate = this.rotateList[this.moveIndex % this.rotateList.length];
        this.moveIndex++;
      }, 50);
    },
    /**
     * 设置开奖结果
     */
    getLotteryResults() {
      User.getPhaseInfo({
        appInfo: {},
        data: { lottId: 'fish', fetchUserBetWin: true, orderTypeName: 'normal' },
      })
        .then((res) => {
          if (res.data.lastStatus === 7) {
            Toast(this.$t('goldBet.issueCancel'));
            this.issueId = res.data.currentPhaseNo;
            this.timimg = (res.data.endTime - res.currentTime) / 1000;
            this.lastManyIssues.unshift({
              imgList: [],
              phaseNo: res.data.lastPhaseNo,
            });
            this.lastManyIssues.pop();
            return false;
          }
          if (res.data.lastStatus === 1 || res.data.lastStatus === 3 || res.data.lastStatus === 4) {
            if (this.num >= 50) {
              this.num = 0;
              this.init();
              clearTimeout(getResults);
              return false;
            }
            let getResults = setTimeout(() => {
              this.num++;
              this.getLotteryResults();
            }, 1000);
          }
          if (res.data.lastStatus === 5) {
            this.opening_number = []; // 开奖编号
            this.resultList = []; // 设置开奖结果
            this.num = 0;
            for (let i = 0; i < 3; i++) {
              this.opening_number.push(res.data.lastWinCode.split(',')[i].slice(1) - 1);
              this.resultList.push(this.openList[this.opening_number[i]]);
            }
            return this.startMove();
          }
        })
        .catch(() => {
          if (this.num >= 50) {
            this.num = 0;
            this.init();
            clearTimeout(getResults);
            return false;
          }
          let getResults = setTimeout(() => {
            this.num++;
            console.log('this.num', this.num);
            this.getLotteryResults();
          }, 1000);
        });
    },
    /**
     * 设置倒计时
     */
    countDown() {
      if (this.timimg >= 0) {
        // 天
        const days = parseInt(this.timimg / 3600 / 24);
        // 时
        let hours = parseInt((this.timimg / 3600) % 60) == 0 ? '' : parseInt((this.timimg / 3600) % 60);
        hours && (hours = hours < 10 ? `0${hours}:` : `${hours}:`);
        // 分
        let minutes = parseInt((this.timimg / 60) % 60) == 0 ? '00' : parseInt((this.timimg / 60) % 60);
        minutes = minutes < 10 && minutes > 0 ? `0${minutes}` : minutes;
        // 秒
        let seconds = parseInt(this.timimg % 60) == 0 ? '00' : parseInt(this.timimg % 60);
        seconds = seconds < 10 && seconds > 0 ? `0${seconds}` : seconds;
        this.msg = `${hours + minutes}:${seconds}`;
        --this.timimg;
      }
    },
    /**
     * 倍数选择
     */
    multipleClick(num, i) {
      this.btActive = i;
      // this.playBtMusic();
      this.times = num;
    },
    /**
     * 1d 2d切换
     */
    changeFlag(flag) {
      // console.log('flagflagflagflagflag', flag);
      if (this.flag !== flag) {
        this.selected = [];
        this.flag = flag;
      }
      this.flagList[0].flags = flag === 1;
      this.flagList[1].flags = flag === 2;
      if (this.flagList[0].flags === false) {
        this.seafoodList.forEach((item) => {
          item.isActive = false;
        });
      }
      if (this.flagList[1].flags === false) {
        this.seafoodListTwoD.forEach((item) => {
          item.isActive = false;
        });
      }
    },
    playBtMusic() {
      console.log('playBtMusic');
      // platform.exec('onPlayButtomSound');
    },
    /**
     * 1d 2d选中
     */
    clickSeafood(i, num) {
      // this.playBtMusic();
      if (num === 0) {
        this.onedOrtwoD = 'f1#';
        this.seafoodList[i].isActive = !this.seafoodList[i].isActive;
        this.seafoodList[i].isActive && this.selected.push(i + 1);
        !this.seafoodList[i].isActive &&
          this.selected.forEach((item, index) => {
            if (item === i + 1) {
              this.selected.splice(index, 1);
            }
          });
      } else {
        const maps = {
          1: 1,
          2: 6,
          3: 11,
          4: 2,
          5: 7,
          6: 12,
          7: 3,
          8: 8,
          9: 13,
          10: 4,
          11: 9,
          12: 14,
          13: 5,
          14: 10,
          15: 15,
        };
        this.onedOrtwoD = 'f2#';
        this.seafoodListTwoD[i].isActive = !this.seafoodListTwoD[i].isActive;
        this.seafoodListTwoD[i].isActive && this.selected.push(maps[i + 1]);
        !this.seafoodListTwoD[i].isActive &&
          this.selected.forEach((item, index) => {
            if (item === maps[i + 1]) {
              this.selected.splice(index, 1);
            }
          });
      }
    },
    /**
     * 进入页面自动刷新
     */
    updateData() {
      if (!document.hidden) {
        // this.moving = false;
        // this.opening = false;
        this.moving && (this.opening = true);
        setTimeout(() => {
          this.transitionAll = false;
        }, 1000);
        // this.getGold();
        this.init();
      }
    },
    showModal() {
      // this.playBtMusic();
      this.modalVisible = true;
    },
    getQueryString(name) {
      const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`, 'i');
      const r = window.location.search.substr(1).match(reg);
      if (r != null) return decodeURI(r[2]);
      return null;
    },
  },
};
</script>
<style lang="less" scoped>
@keyframes light {
  from {
    opacity: 1.5;
  }

  to {
    opacity: 0;
  }
}
@-webkit-keyframes light {
  from {
    opacity: 1;
  }

  to {
    opacity: 0;
  }
}
@keyframes turn {
  0% {
    -webkit-transform: rotate(0deg);
  }

  25% {
    -webkit-transform: rotate(90deg);
  }
  // 50% {
  //   -webkit-transform: rotate(180deg);
  // }

  // 75% {
  //   -webkit-transform: rotate(270deg);
  // }

  // 100% {
  //   -webkit-transform: rotate(360deg);
  // }
}
@-webkit-keyframes turn {
  0% {
    -webkit-transform: rotate(0deg);
  }

  25% {
    -webkit-transform: rotate(20deg);
  }
  50% {
    -webkit-transform: rotate(40deg);
  }

  75% {
    -webkit-transform: rotate(60deg);
  }

  100% {
    -webkit-transform: rotate(80deg);
  }
}
.mt80 {
  margin-top: 80px;
}
.sixDKlaKlouk {
  overflow-y: scroll;
  // height: 100vh;
  width: 100%;
  height: 100%;
  background: url(/src/assets/img/lottery/seafoods/bg_three.png) no-repeat center center;
  // background-position-y: 49px;
  -webkit-background-size: 100% 100%;
  background-size: 100% 100%;
  -webkit-overflow-scrolling: touch;
  &::-webkit-scrollbar {
    display: none;
  }
  // position: absolute;
  // left: 0;
  // right: 0;
  // box-sizing: border-box;
  .bet_content {
    --contentTop: '';
    // position: absolute;
    // left: 0;
    // right: 0;
    overflow: auto;
    overflow-x: hidden;
    height: calc(100vh - var(--contentTop) - env(safe-area-inset-top));
  }

  section {
    position: relative;
    // padding: 0.26rem 0.21rem 0.17rem 0.29rem;
    padding: 32px 21px 0 29px;
    height: 487px;

    .trayBowl {
      position: absolute;
      top: 32px;
      left: 64px;
      z-index: 90;
      width: 160px;
      height: 170px;
      transition: all 2s;
      &.moving {
        top: 500px;
        left: 300px;
        transform: translateZ(0) scale(3, 3);
      }
      .bowlAll {
        position: relative;
        height: 170px;
        // transform-origin: 1rem 0.8rem;
        .bowl {
          position: absolute;
          top: 2px;
          left: 50.6%;
          z-index: 92;
          width: 122px;
          height: 148px;
          transition: all 2s;
          transform: translate(-50.6%, 0);
          &.opening {
            transform: translate3d(350px, -100px, 0);
            // animation: turn 2s linear 1;
          }
          .bow {
            width: 125px;
            height: 142px;
          }
        }
        .plate {
          position: absolute;
          // left: 0.32rem;
          top: 62px;
          width: 160px;
          height: 108px;
          // box-shadow: 0px 11px 24px 0px #000000;
        }
        .number {
          position: relative;
          top: 50px;
          z-index: 88;
          // z-index: 1000;
          width: 150px;
          height: 100px;
          img {
            width: 47.7px;
            height: 55.35px;
            &:nth-child(1) {
              position: absolute;
              top: 26px;
              left: 25px;
              z-index: 9;
            }
            &:nth-child(2) {
              position: absolute;
              top: 0;
              left: 55px;
              z-index: 8;
            }
            &:nth-child(3) {
              position: absolute;
              top: 26px;
              left: 85px;
              z-index: 9;
            }
          }
        }
      }
    }
    .lotteryInformation {
      display: flex;
      align-items: center;
      float: left;
      margin-left: 224px;
      width: 200px;
      height: 161px;
      flex-direction: column;
      span {
        display: block;
        white-space: nowrap;
        flex-shrink: 0;

        &:nth-child(1) {
          margin-bottom: 8px;
          height: 40px;
          font-size: 30px;
          color: #fff;
          .i_one {
            font-family: Khmer OS New;
          }
          .i_two {
            margin-left: 7px;
            font-size: 24px;
            font-family: Adobe Heiti Std;
            font-weight: normal;
          }
        }
        &:nth-child(2) {
          height: 68px;
          font-size: 68px;
          font-family: arialBold;
          font-weight: normal;
          color: #ff0000;
          line-height: 68px;
          // text-shadow: 0px 1px 1px #000000;
          // -webkit-text-stroke: 1px #000000;
          // text-stroke: 1px #000000;
        }
        &:nth-child(3) {
          margin-top: 4px;
          height: 36px;
          font-size: 24px;
          font-family: Khmer OS New;
          color: #ff0000;
          text-shadow: 0px 1px 1px #000000;
          // -webkit-text-stroke: 1px #000000;
          text-stroke: 1px #000000;
          animation-name: light;
          animation-duration: 1s;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          animation-direction: alternate;
        }
      }
    }
    .historicalLotteryInformation {
      float: right;
      padding: 10px 18px 22px 18px;
      width: 250px;
      height: 480px;
      border: 3px solid #49607d;
      border-radius: 10px;
      background: #001b3a;
      box-shadow: -0.03rem 0.04rem 0.2rem 0px rgba(0, 0, 0, 0.76);
      box-sizing: border-box;
      .column {
        display: flex;
        // position: relative;
        margin-bottom: 8px;
        height: 105px;
        flex-direction: column;
        .column_issue {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          margin: 0 0 5px 0;
          color: #fff;
          .i {
            margin-left: 5px;
            height: 36px;
            font-size: 20px;
            line-height: 36px;
          }
        }

        .imgListOne {
          display: flex;
          justify-content: space-between;
          align-items: center;
          span {
            display: inline-block;
            display: flex;
            justify-content: center;
            align-items: center;
            width: 64px;
            height: 64px;
            border-radius: 5px;
            background: url(/src/assets/img/lottery/seafoods/1d.png) no-repeat 0 0/100%;
            img {
              width: 60px;
              height: 60px;
              border-radius: 5px;
            }
          }
        }
        .cancel {
          margin: 0 auto;
          height: 64px;
          color: #fff;
          line-height: 64px;
        }

        .imgListTwo {
          position: absolute;
          bottom: 1.5px;
          img {
            width: 64px;
            height: 64px;
            &:nth-child(1) {
              position: relative;
              left: -2px;
            }
            &:nth-child(3) {
              position: relative;
              right: -2px;
            }
          }
        }
      }
    }
    .lotteryImgList {
      position: relative;
      display: flex;
      justify-content: space-between;
      float: left;
      margin-top: 29px;
      width: 429px;
      height: 290px;
      flex-wrap: wrap;
      span {
        display: inline-block;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 140px;
        height: 140px;
        background: url(/src/assets/img/lottery/seafoods/1d.png) no-repeat 0 0/100%;
        img {
          width: 132px;
          height: 132px;
        }
        &.borderActive {
          background: url(/src/assets/img/lottery/seafoods/white.png) no-repeat 0 0/100% !important;
        }
      }
    }
  }

  article {
    // display: flex;
    // justify-content: center;
    // align-items: center;
    padding: 0 50px 350px 50px;
    flex-direction: column;
    .handover {
      position: relative;
      margin-bottom: 10px;
      text-align: center;
      span {
        pointer-events: none;
        &:nth-child(1):after {
          position: absolute;
          top: -80px;
          right: 62px;
          display: block;
          width: 220px;
          height: 80px;
          content: '';
          pointer-events: auto;
        }
        &:nth-child(2):after {
          position: absolute;
          top: -80px;
          left: 38px;
          display: block;
          width: 220px;
          height: 80px;
          content: '';
          pointer-events: auto;
        }
        img {
          width: 550px;
          height: 122px;
        }
      }
    }
    .chooseSeafood_oneD {
      position: relative;
      display: flex;
      justify-content: space-between;
      width: 650px;
      height: 440px;
      flex-wrap: wrap;
      .seafoodImg {
        display: inline-block;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 214px;
        height: 214px;
        img {
          z-index: 10;
          width: 168px;
          height: 168px;
        }
      }
      .seafoodImgBorder {
        position: absolute;
        top: 0;
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        img {
          margin-bottom: 4px;
          width: 214px;
          height: 214px;
        }
      }
    }
    .chooseSeafood_twoD {
      display: flex;
      justify-content: space-between;
      width: 100%;
      flex-wrap: wrap;
      .choiceDouble {
        display: flex;
        // background: #fff;
        margin-bottom: 22px;
        .choiceDouble_img {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 200px;
          height: 100px;
          background: url(/src/assets/img/lottery/seafoods/2d.png) no-repeat 0 0/100%;
          span {
            display: inline-block;
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100px;
            height: 100px;

            img {
              width: 80px;
              height: 80px;
            }
          }
        }
      }
    }
  }
  p {
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
  //选择鱼虾蟹高亮
  .active {
    background: #fff;
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
}
</style>
