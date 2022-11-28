<template>
  <BetToolbar @click-tab="onChange" @to-play="toPlay" @to-gameplay="toGameplay"></BetToolbar>
  <div v-show="active === 1">
    <div class="bet-page mt80">
      <!-- 遮罩层 -->
      <div v-if="unfold" class="mask">
        <img :src="buttonImg" alt="" />
        <div @click="closeUnfold"></div>
      </div>
      <div ref="zodiac_content">
        <div class="zodiac__top">
          <!-- 展开按钮 -->
          <div class="zodiac__top_button" @click="openUnfold"></div>
          <!-- 历史开奖 -->
          <div class="zodiac__roulette-and-history">
            <!-- 开奖动画 rouletteOptions/转盘速度  isFirst/是否刚进入页面 isWaiting/是否是待开奖状态 -->
            <div class="zodiac__roulette-and-countdown">
              <!-- pedestal底座  glass玻璃 leaf叶子 bottom开奖位置 -->
              <div class="zodiac__roulette-and-countdown_glass"></div>
              <div class="zodiac__roulette-and-countdown_leaf" :class="leafRotateState ? 'leafrotate' : ''"></div>
              <div id="matter" ref="matter" class="zodiac__roulette-and-countdown_ballbox"></div>
              <div class="zodiac__roulette-and-countdown_pedestal">
                <div v-if="ballLotteryResultsTopArr[0]" class="ball1" :class="'round_bg_' + ballLotteryResultsTopArr[0]"></div>
                <div v-if="ballLotteryResultsTopArr[1]" class="ball2" :class="'round_bg_' + ballLotteryResultsTopArr[1]"></div>
                <div v-if="ballLotteryResultsTopArr[2]" class="ball3" :class="'round_bg_' + ballLotteryResultsTopArr[2]"></div>
                <div v-if="ballLotteryResultsTopArr[3]" class="ball4" :class="'round_bg_' + ballLotteryResultsTopArr[3]"></div>
                <div v-if="ballLotteryResultsTopArr[4]" class="ball5" :class="'round_bg_' + ballLotteryResultsTopArr[4]"></div>
                <div v-if="ballLotteryResultsTopArr[5]" class="ball6" :class="'round_bg_' + ballLotteryResultsTopArr[5]"></div>
                <div v-if="ballLotteryResultsTopArr[6]" class="ball7" :class="'round_bg_' + ballLotteryResultsTopArr[6]"></div>
              </div>
              <div class="zodiac__roulette-and-countdown_bottom">
                <div v-if="ballLotteryResultsBottomArr[0]" class="ball" :class="'round_bg_' + ballLotteryResultsBottomArr[0]"></div>
                <div v-if="ballLotteryResultsBottomArr[1]" class="ball" :class="'round_bg_' + ballLotteryResultsBottomArr[1]"></div>
                <div v-if="ballLotteryResultsBottomArr[2]" class="ball" :class="'round_bg_' + ballLotteryResultsBottomArr[2]"></div>
                <div v-if="ballLotteryResultsBottomArr[3]" class="ball" :class="'round_bg_' + ballLotteryResultsBottomArr[3]"></div>
                <div v-if="ballLotteryResultsBottomArr[4]" class="ball" :class="'round_bg_' + ballLotteryResultsBottomArr[4]"></div>
                <div v-if="ballLotteryResultsBottomArr[5]" class="ball" :class="'round_bg_' + ballLotteryResultsBottomArr[5]"></div>
                <div v-if="ballLotteryResultsBottomArr[6]" class="bigball" :class="'round_bg_' + ballLotteryResultsBottomArr[6]"></div>
              </div>
            </div>
            <div class="zodiac__roulette-and-history_right">
              <lucky-zodiac-countdown
                :current-phase-no="currentPhaseNo"
                :remaining-time="remainingTime"
                :is-rotating="isRotating"
                :is-first="isFirst"
                :is-waiting="isWaiting"
                countdown-class="special-zodiac-countdown"
                @remaining-time-change="handleCountDownChange"
                @countdown-end="handleCountdownEnd"
              ></lucky-zodiac-countdown>
              <div class="zodiac__history">
                <transition-group :name="animate ? 'myfade' : ''" tag="div">
                  <div v-for="item in history_list" :key="item.phaseNo" class="zodiac__history_item">
                    <span class="zodiac__history_item-index">{{ item.phaseNo }}</span>
                    <template v-if="item.winCode">
                      <img class="zodiac__history_item-zodiac" :src="srcimg(item.winCodeShow)" />
                    </template>
                    <span v-else style="font-size: 3.2vw">{{ $t('goldBet.issueCancel') }}</span>
                  </div>
                </transition-group>
              </div>
            </div>
          </div>
        </div>
        <!-- 选号模块 -->
        <div class="zodiac__select-area" :class="unfold ? 'unfold' : ''">
          <!-- 左侧当前选择的状态 -->
          <div class="zodiac__select-area-tab">
            <div class="tab" :class="areaTab == 1 ? 'numbershow' : 'numberhide'" @click="setTab(1)"></div>
            <div class="tab" :class="areaTab == 2 ? 'zodiacshow' : 'zodiachide'" @click="setTab(2)"></div>
            <div class="tab" :class="areaTab == 3 ? 'colorshow' : 'colorhide'" @click="setTab(3)"></div>
            <div class="ticket-button" @click="openModalVisible">
              <img :src="ticketshow" alt="" />
              <span v-if="tickets > 0" class="note">{{ tickets }}</span>
            </div>
          </div>
          <!-- 选号区域 -->
          <div class="zodiac__select-area-view">
            <!-- 号码 -->
            <div v-if="areaTab == 1" class="zodiac__select-area-view-number">
              <div
                v-for="(item, index) in 49"
                :key="index"
                class="item"
                :class="
                  currentNumberArr.indexOf(index + 1) !== -1 && blueArr.indexOf(index + 1) !== -1
                    ? 'blue'
                    : currentNumberArr.indexOf(index + 1) !== -1 && redArr.indexOf(index + 1) !== -1
                    ? 'red'
                    : currentNumberArr.indexOf(index + 1) !== -1 && greenArr.indexOf(index + 1) !== -1
                    ? 'green'
                    : ''
                "
                @click="addNumber(index + 1)"
              >
                {{ addzreo(index + 1) }}
              </div>
            </div>
            <!-- 生肖 -->
            <div v-if="areaTab == 2" class="zodiac__select-area-view-zodiac">
              <div v-for="(item, index) in zodiacArr" :key="index" class="item" :class="currentZodiacArr.indexOf(index) !== -1 ? 'show' + index : 'hide' + index" @click="addZodiac(index)">
                <span class="title" :class="currentZodiacArr.indexOf(index) !== -1 ? 'currenttitle' : ''">{{ item.en }}</span>
                <div class="numlist">
                  <div
                    v-for="(items, indexs) in item.number"
                    :key="indexs"
                    :class="
                      blueArr.indexOf(items) !== -1
                        ? currentZodiacArr.indexOf(index) !== -1
                          ? 'bluebg'
                          : 'blue'
                        : redArr.indexOf(items) !== -1
                        ? currentZodiacArr.indexOf(index) !== -1
                          ? 'redbg'
                          : 'red'
                        : greenArr.indexOf(items) !== -1
                        ? currentZodiacArr.indexOf(index) !== -1
                          ? 'greenbg'
                          : 'green'
                        : ''
                    "
                    class="numitem"
                  >
                    {{ addzreo(items) }}
                  </div>
                </div>
              </div>
            </div>
            <!-- 颜色 -->
            <div v-if="areaTab == 3" class="zodiac__select-area-view-color">
              <div
                v-for="(item, index) in colorArr"
                :key="index"
                class="zodiac__select-area-view-color-item"
                :class="currentColorArr.indexOf(index) !== -1 ? (index == 0 ? 'redbg' : index == 1 ? 'bluebg' : index == 2 ? 'greenbg' : '') : ''"
                @click="addColor(index)"
              >
                <div
                  class="zodiac__select-area-view-color-item-title"
                  :class="currentColorArr.indexOf(index) !== -1 ? 'whitetitle' : index == 0 ? 'redtitle' : index == 1 ? 'bluetitle' : index == 2 ? 'greentitle' : ''"
                >
                  {{ item.en }}
                </div>
                <div class="zodiac__select-area-view-color-item-colorlist">
                  <span
                    v-for="(items, indexs) in item.num"
                    :key="indexs"
                    :class="currentColorArr.indexOf(index) !== -1 ? 'whitebor' : index == 0 ? 'redbor' : index == 1 ? 'bluebor' : index == 2 ? 'greenbor' : ''"
                    >{{ addzreo(items) }}</span
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <footer>
        <div class="betting">
          <span v-for="(item, i) in multiple" :key="i" :class="{ btActive: btActive === i }" @click="multipleClick(item, i)">{{ item }}</span>
          <van-field v-model.number="times" style="width: 100px" type="text" maxlength="5" label="" @update:model-value="clickInput" @focus="onfocus" />
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
  </div>
  <DrawHistory v-if="active === 2" class="mt80"></DrawHistory>
  <Modal :modal-visible="modalVisible" :issue-id="currentPhaseNo" :lottery-id="'49C6'" @next="detail($event)" @back="modalVisible = false"> </Modal>
</template>

<script>
import { Toast, Dialog } from 'vant';
// import * as Matter from 'matter';
// import * as Matter from './lib/matter.js';
import BetToolbar from '@/components/BetToolbar.vue'; // 头部
import DrawHistory from './components/DrawHistory.vue';
import Modal from '@/components/Modal.vue'; // 投注记录弹窗
import LuckyZodiacCountdown from '@/components/LuckyZodiacCountdown.vue';
import User from '@/api/user';
import lance from '@/utils/lance';
import { ride, except } from '@/utils/decimal';
import numbershow from '@/assets/img/specialzodiac/numbershow.png';
import numberhide from '@/assets/img/specialzodiac/numberhide.png';
import zodiacshow from '@/assets/img/specialzodiac/zodiacshow.png';
import zodiachide from '@/assets/img/specialzodiac/zodiachide.png';
import colorshow from '@/assets/img/specialzodiac/colorshow.png';
import colorhide from '@/assets/img/specialzodiac/colorhide.png';
import ticket from '@/assets/img/specialzodiac/ticket.png';
import unfoldbutton from '@/assets/img/specialzodiac/unfoldbutton.png';
import smallball01 from '@/assets/img/specialzodiac/smallball01.png';
import smallball02 from '@/assets/img/specialzodiac/smallball02.png';
import smallball03 from '@/assets/img/specialzodiac/smallball03.png';
import smallball04 from '@/assets/img/specialzodiac/smallball04.png';
import smallball05 from '@/assets/img/specialzodiac/smallball05.png';
import smallball06 from '@/assets/img/specialzodiac/smallball06.png';
import smallball07 from '@/assets/img/specialzodiac/smallball07.png';
import smallball08 from '@/assets/img/specialzodiac/smallball08.png';
import smallball09 from '@/assets/img/specialzodiac/smallball09.png';
import smallball10 from '@/assets/img/specialzodiac/smallball10.png';
import smallball11 from '@/assets/img/specialzodiac/smallball11.png';
import smallball12 from '@/assets/img/specialzodiac/smallball12.png';
import smallball13 from '@/assets/img/specialzodiac/smallball13.png';
import smallball14 from '@/assets/img/specialzodiac/smallball14.png';
import smallball15 from '@/assets/img/specialzodiac/smallball15.png';
import smallball16 from '@/assets/img/specialzodiac/smallball16.png';
import smallball17 from '@/assets/img/specialzodiac/smallball17.png';
import smallball18 from '@/assets/img/specialzodiac/smallball18.png';
import smallball19 from '@/assets/img/specialzodiac/smallball19.png';
import smallball20 from '@/assets/img/specialzodiac/smallball20.png';
import smallball21 from '@/assets/img/specialzodiac/smallball21.png';
import smallball22 from '@/assets/img/specialzodiac/smallball22.png';
import smallball23 from '@/assets/img/specialzodiac/smallball23.png';
import smallball24 from '@/assets/img/specialzodiac/smallball24.png';
import smallball25 from '@/assets/img/specialzodiac/smallball25.png';
import smallball26 from '@/assets/img/specialzodiac/smallball26.png';
import smallball27 from '@/assets/img/specialzodiac/smallball27.png';
import smallball28 from '@/assets/img/specialzodiac/smallball28.png';
import smallball29 from '@/assets/img/specialzodiac/smallball29.png';
import smallball30 from '@/assets/img/specialzodiac/smallball30.png';
import smallball31 from '@/assets/img/specialzodiac/smallball31.png';
import smallball32 from '@/assets/img/specialzodiac/smallball32.png';
import smallball33 from '@/assets/img/specialzodiac/smallball33.png';
import smallball34 from '@/assets/img/specialzodiac/smallball34.png';
import smallball35 from '@/assets/img/specialzodiac/smallball35.png';
import smallball36 from '@/assets/img/specialzodiac/smallball36.png';
import smallball37 from '@/assets/img/specialzodiac/smallball37.png';
import smallball38 from '@/assets/img/specialzodiac/smallball38.png';
import smallball39 from '@/assets/img/specialzodiac/smallball39.png';
import smallball40 from '@/assets/img/specialzodiac/smallball40.png';
import smallball41 from '@/assets/img/specialzodiac/smallball41.png';
import smallball42 from '@/assets/img/specialzodiac/smallball42.png';
import smallball43 from '@/assets/img/specialzodiac/smallball43.png';
import smallball44 from '@/assets/img/specialzodiac/smallball44.png';
import smallball45 from '@/assets/img/specialzodiac/smallball45.png';
import smallball46 from '@/assets/img/specialzodiac/smallball46.png';
import smallball47 from '@/assets/img/specialzodiac/smallball47.png';
import smallball48 from '@/assets/img/specialzodiac/smallball48.png';
import smallball49 from '@/assets/img/specialzodiac/smallball49.png';
import ballred from '@/assets/img/specialzodiac/ballred.png';
import ballbule from '@/assets/img/specialzodiac/ballbule.png';
import ballgreen from '@/assets/img/specialzodiac/ballgreen.png';
import ball01 from '@/assets/img/specialzodiac/ball01.png';
import ball02 from '@/assets/img/specialzodiac/ball02.png';
import ball03 from '@/assets/img/specialzodiac/ball03.png';
import ball04 from '@/assets/img/specialzodiac/ball04.png';
import ball05 from '@/assets/img/specialzodiac/ball05.png';
import ball06 from '@/assets/img/specialzodiac/ball06.png';
import ball07 from '@/assets/img/specialzodiac/ball07.png';
import ball08 from '@/assets/img/specialzodiac/ball08.png';
import ball09 from '@/assets/img/specialzodiac/ball09.png';
import ball10 from '@/assets/img/specialzodiac/ball10.png';
import ball11 from '@/assets/img/specialzodiac/ball11.png';
import ball12 from '@/assets/img/specialzodiac/ball12.png';
import ball13 from '@/assets/img/specialzodiac/ball13.png';
import ball14 from '@/assets/img/specialzodiac/ball14.png';
import ball15 from '@/assets/img/specialzodiac/ball15.png';
import ball16 from '@/assets/img/specialzodiac/ball16.png';
import ball17 from '@/assets/img/specialzodiac/ball17.png';
import ball18 from '@/assets/img/specialzodiac/ball18.png';
import ball19 from '@/assets/img/specialzodiac/ball19.png';
import ball20 from '@/assets/img/specialzodiac/ball20.png';
import ball21 from '@/assets/img/specialzodiac/ball21.png';
import ball22 from '@/assets/img/specialzodiac/ball22.png';
import ball23 from '@/assets/img/specialzodiac/ball23.png';
import ball24 from '@/assets/img/specialzodiac/ball24.png';
import ball25 from '@/assets/img/specialzodiac/ball25.png';
import ball26 from '@/assets/img/specialzodiac/ball26.png';
import ball27 from '@/assets/img/specialzodiac/ball27.png';
import ball28 from '@/assets/img/specialzodiac/ball28.png';
import ball29 from '@/assets/img/specialzodiac/ball29.png';
import ball30 from '@/assets/img/specialzodiac/ball30.png';
import ball31 from '@/assets/img/specialzodiac/ball31.png';
import ball32 from '@/assets/img/specialzodiac/ball32.png';
import ball33 from '@/assets/img/specialzodiac/ball33.png';
import ball34 from '@/assets/img/specialzodiac/ball34.png';
import ball35 from '@/assets/img/specialzodiac/ball35.png';
import ball36 from '@/assets/img/specialzodiac/ball36.png';
import ball37 from '@/assets/img/specialzodiac/ball37.png';
import ball38 from '@/assets/img/specialzodiac/ball38.png';
import ball39 from '@/assets/img/specialzodiac/ball39.png';
import ball40 from '@/assets/img/specialzodiac/ball40.png';
import ball41 from '@/assets/img/specialzodiac/ball41.png';
import ball42 from '@/assets/img/specialzodiac/ball42.png';
import ball43 from '@/assets/img/specialzodiac/ball43.png';
import ball44 from '@/assets/img/specialzodiac/ball44.png';
import ball45 from '@/assets/img/specialzodiac/ball45.png';
import ball46 from '@/assets/img/specialzodiac/ball46.png';
import ball47 from '@/assets/img/specialzodiac/ball47.png';
import ball48 from '@/assets/img/specialzodiac/ball48.png';
import ball49 from '@/assets/img/specialzodiac/ball49.png';

export default {
  name: 'SpecialZodiac',
  components: {
    BetToolbar,
    Modal,
    DrawHistory,
    LuckyZodiacCountdown,
  },
  data() {
    return {
      multiple: [100, 200, 500, '1k'],
      btActive: 0,
      active: 1,
      money: 0, // 投注总金额
      modalVisible: false,
      history_list: [],
      trend_obj: {},
      errorDialog: false, // 错误弹窗
      betDialog: false, // 倍数弹窗
      bets: 1, // 注数
      times: 0.1,
      // 奖期
      lastPhaseNo: '', // 上一奖期号码
      currentPhaseNo: '', // 当前奖期号码
      lastStatus: null, // 开奖状态
      lastWinCode: null, // 开奖结果
      remainingTime: null, // 剩余开奖时长

      // 转盘
      // rouletteOptions: {number:0.5}, //转盘速度
      animate: false, // 是否有添加动画

      // 转盘结果
      winningPopupVisible: false,
      notWinningPopupVisible: false,

      // 选号
      selected: [],
      selectDisabled: false,
      // platformName: platform.name, // ios还是android
      amount: 0,
      pix: 10, // 一注10金币
      gold_amount: 0, // 剩余金币数
      tickets: 0,
      getGoldTimes: 0, // 剩余领取金币次数
      allowGetGold: false, // 是否允许获取金币
      isNew: true,
      preHis: [],
      dialogVisible: false, // 是否显示赠送金币弹窗
      statusBarHeight: 0,
      contentTop: false,
      isRotating: false, // 是否正在旋转/开奖中
      isFirst: true, // 是否刚进入页面
      isWaiting: false, // 是否是待开奖状态
      remain: 0, // 剩余开奖时间
      isEndModal: false, // 是否奖期结束弹窗

      // 选号左侧图片
      areaTab: 1, // 1 number 2 zodiac 3 color
      numbershow,
      numberhide,
      zodiacshow,
      zodiachide,
      colorshow,
      colorhide,
      ticketshow: ticket,
      buttonImg: unfoldbutton,
      redArr: [1, 2, 7, 8, 12, 13, 18, 19, 23, 24, 29, 30, 34, 35, 40, 45, 46], // 红色号码数组
      blueArr: [3, 4, 9, 10, 14, 15, 20, 25, 26, 31, 36, 37, 41, 42, 47, 48], // 蓝色号码数组
      greenArr: [5, 6, 11, 16, 17, 21, 22, 27, 28, 32, 33, 38, 39, 43, 44, 49], // 绿色号码数组
      currentNumberArr: [], // 当前选中号码数组
      zodiacArr: [
        { en: this.$t('6DSpzGoldBet.Mouse'), number: [3, 15, 27, 39] },
        { en: this.$t('6DSpzGoldBet.Cow'), number: [2, 14, 26, 38] },
        { en: this.$t('6DSpzGoldBet.Tiger'), number: [1, 13, 25, 37, 49] },
        { en: this.$t('6DSpzGoldBet.Rabbit'), number: [12, 24, 36, 48] },
        { en: this.$t('6DSpzGoldBet.Dragon'), number: [11, 23, 35, 47] },
        { en: this.$t('6DSpzGoldBet.Snake'), number: [10, 22, 34, 46] },
        { en: this.$t('6DSpzGoldBet.Horse'), number: [9, 21, 33, 45] },
        { en: this.$t('6DSpzGoldBet.Sheep'), number: [8, 20, 32, 44] },
        { en: this.$t('6DSpzGoldBet.Monkey'), number: [7, 19, 31, 43] },
        { en: this.$t('6DSpzGoldBet.Chinken'), number: [6, 18, 30, 42] },
        { en: this.$t('6DSpzGoldBet.Dog'), number: [5, 17, 29, 41] },
        { en: this.$t('6DSpzGoldBet.Pig'), number: [4, 16, 28, 40] },
      ], // 生肖数组
      currentZodiacArr: [], // 当前选中的生肖数组
      colorArr: [
        { en: this.$t('6DSpzGoldBet.Red'), num: [1, 2, 7, 8, 12, 13, 18, 19, 23, 24, 29, 30, 34, 35, 40, 45, 46] },
        { en: this.$t('6DSpzGoldBet.Blue'), num: [3, 4, 9, 10, 14, 15, 20, 25, 26, 31, 36, 37, 41, 42, 47, 48] },
        { en: this.$t('6DSpzGoldBet.Green'), num: [5, 6, 11, 16, 17, 21, 22, 27, 28, 32, 33, 38, 39, 43, 44, 49] },
      ], // 颜色数组
      currentColorArr: [], // 选中的颜色
      unfold: false, // 展开状态
      randomPlaying: false, // 是否在随机4中动画中
      ballImgArr: [
        smallball01,
        smallball02,
        smallball03,
        smallball04,
        smallball05,
        smallball06,
        smallball07,
        smallball08,
        smallball09,
        smallball10,
        smallball11,
        smallball12,
        smallball13,
        smallball14,
        smallball15,
        smallball16,
        smallball17,
        smallball18,
        smallball19,
        smallball20,
        smallball21,
        smallball22,
        smallball23,
        smallball24,
        smallball25,
        smallball26,
        smallball27,
        smallball28,
        smallball29,
        smallball30,
        smallball31,
        smallball32,
        smallball33,
        smallball34,
        smallball35,
        smallball36,
        smallball37,
        smallball38,
        smallball39,
        smallball40,
        smallball41,
        smallball42,
        smallball43,
        smallball44,
        smallball45,
        smallball46,
        smallball47,
        smallball48,
        smallball49,
      ],
      ballred,
      ballbule,
      ballgreen,
      ballLotteryResultsTopArr: [], // 小球开奖结果动画数组
      ballLotteryResultsBottomArr: [], // 小球开奖结果显示数组
      ballArr: [], // 小球刚体数组
      leafRotateState: false, // 叶子旋转状态/是否开奖中
      Engine: Matter.Engine, // 引擎
      Render: Matter.Render, // 渲染器
      World: Matter.World, /// 世界
      Body: Matter.Body,
      Common: Matter.Common,
      Bodies: Matter.Bodies, // 物体
      Sleeping: Matter.Sleeping, // 物体
    };
  },
  computed: {
    // money() {
    //   console.log('currentNumberArr:::', this.currentNumberArr);
    //   console.log('currentZodiacArr:::', this.currentZodiacArr);
    //   console.log('currentColorArr:::', this.currentColorArr);
    //   if (this.currentNumberArr.length > 0) {
    //     return this.currentNumberArr.length * 1000 * this.times;
    //   }
    //   if (this.currentZodiacArr.length > 0) {
    //     return this.currentZodiacArr.length * 1000 * this.times;
    //   }
    //   if (this.currentColorArr.length > 0) {
    //     return this.currentColorArr.length * 1000 * this.times;
    //   }
    //   return 0;
    // },
  },
  watch: {
    currentNumberArr: {
      // 每个属性值发生变化就会调用这个函数
      handler(newVal) {
        this.money = ride(newVal.length * 1000, this.times);
      },
      // 立即处理 进入页面就触发
      immediate: true,
      // 深度监听 属性的变化
      deep: true,
    },
    currentZodiacArr: {
      // 每个属性值发生变化就会调用这个函数
      handler(newVal) {
        this.money = ride(newVal.length * 1000, this.times);
      },
      // 立即处理 进入页面就触发
      immediate: true,
      // 深度监听 属性的变化
      deep: true,
    },
    currentColorArr: {
      // 每个属性值发生变化就会调用这个函数
      handler(newVal) {
        this.money = ride(newVal.length * 1000, this.times);
      },
      // 立即处理 进入页面就触发
      immediate: true,
      // 深度监听 属性的变化
      deep: true,
    },
    times: {
      // 每个属性值发生变化就会调用这个函数
      handler(newVal) {
        if (this.currentNumberArr.length > 0) {
          this.money = ride(this.currentNumberArr.length * 1000, newVal);
        }
        if (this.currentZodiacArr.length > 0) {
          this.money = ride(this.currentZodiacArr.length * 1000, newVal);
        }
        if (this.currentColorArr.length > 0) {
          this.money = ride(this.currentColorArr.length * 1000, newVal);
        }
      },
      // 立即处理 进入页面就触发
      immediate: true,
      // 深度监听 属性的变化
      deep: true,
    },
  },
  mounted() {
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        // app运行
        // this.isFirst = true;
      } else {
        // app挂起
      }
    });
    // matter 创建世界
    const engine = this.Engine.create();
    const { world } = engine;
    // console.log('>>>>>>>>', world);
    // world.gravity.x = 0; //设置重力 this.Engine.create().world.gravity.y
    // world.gravity.y = 0; //设置重力 this.Engine.create().world.gravity.y
    const matterWidth = document.getElementById('matter').clientWidth;
    const matterHeight = document.getElementById('matter').clientHeight;
    const options = {
      width: matterWidth,
      height: matterHeight,
      // showAngleIndicator: true, // 显示物体的角度
      wireframes: false, // 线框模式，这里选择关闭，线框模式适合调试用
      background: 'transparent',
      // showAngleIndicator: true, // 是否显示角度,默认false
      // showVelocity: true, // 是否显示速度,默认false
      // showCollisions: true, // 是否显示碰撞点,默认false
      // showBroadphase: true, // 是否显示宽频，用于调试,默认false
      // showMousePosition: false // 鼠标约束线
    };
    // console.log(this.$refs.matter);
    const render = this.Render.create({
      engine,
      element: this.$refs.matter,
      options,
    });

    // // 生产四个长方形边界
    // var boxA=this.Bodies.rectangle(0,0,matterWidth*2,4,{isStatic:true,fillStyle:'transparent'});
    // var boxB=this.Bodies.rectangle(matterWidth,0,4,matterWidth*2,{isStatic:true,fillStyle:'transparent'});
    // var boxC=this.Bodies.rectangle(matterWidth,matterWidth,matterWidth*2,4,{isStatic:true,fillStyle:'transparent'});
    // var boxD=this.Bodies.rectangle(0,matterWidth,4,matterWidth*2,{isStatic:true,fillStyle:'transparent'});
    // // 渲染长方形边界
    // this.World.add(world,[boxA,boxB,boxC,boxD]);
    const parts = []; // 用长方形围起来的圆（世界）
    for (let i = 0; i < 90; i++) {
      const a = this.Bodies.rectangle(matterWidth / 2 + Math.cos((i * 4 * Math.PI) / 180) * (matterWidth / 2), matterHeight / 2 + Math.sin((i * 4 * Math.PI) / 180) * (matterHeight / 2), 10, 60, {
        isStatic: true,
        restitution: 1, // 刚度？弹性？
        friction: 1, // 摩擦力
        frictionStatic: 1, // 静摩擦系数
        // frictionAir: 0, //空气摩擦力
        angle: (Math.PI / 180) * i * 4,
        render: {
          fillStyle: 'transparent',
          strokeStyle: 'transparent',
          lineWidth: 1,
        },
        collisionFilter: {
          category: 0x0001,
          mask: 0x0001 | 0x0002,
        },
      });
      this.Sleeping.set(a, true);
      parts.push(a);
      this.World.add(world, a);
    }

    this.Body.create({ parts, isStatic: true });
    // 后面一层的球
    for (let i = 0; i < 49; i++) {
      const randomx = this.random(0, matterWidth / 2);
      const randomy = this.random(0, matterHeight / 2);
      const ball = this.Bodies.circle(matterWidth / 4 + randomx, matterHeight / 4 + randomy, 5, {
        restitution: 1, // 刚度？弹性？
        friction: 0.1, // 摩擦力
        frictionStatic: 0.5, // 静摩擦系数
        frictionAir: 0.01, // 空气摩擦力
        density: 0.0001, // 密度
        // isSleeping:true,
        label: 'ball',
        render: {
          opacity: 1,
          // fillStyle: "#f66",
          sprite: {
            // xScale:0.25,
            // yScale:0.25,
            // texture: this.ballred
            xScale: 0.52,
            yScale: 0.52,
            texture: this.ballImgArr[i],
          },
        },
        collisionFilter: {
          category: 0x0002,
          mask: 0x0002 | 0x0001,
        },
      });
      this.ballArr.push(ball);
      this.World.add(world, ball);
    }
    this.Engine.run(engine); // 运行引擎
    this.Render.run(render); // 运行渲染
  },
  created() {
    this.getPhaseInfo();
    // this.getTickets();
    // this.getGold();
  },
  unmounted() {
    console.log('zujian销毁');
  },
  methods: {
    srcimg(e) {
      console.log(e);
      const map = {
        '01': ball01,
        '02': ball02,
        '03': ball03,
        '04': ball04,
        '05': ball05,
        '06': ball06,
        '07': ball07,
        '08': ball08,
        '09': ball09,
        10: ball10,
        11: ball11,
        12: ball12,
        13: ball13,
        14: ball14,
        15: ball15,
        16: ball16,
        17: ball17,
        18: ball18,
        19: ball19,
        20: ball20,
        21: ball21,
        22: ball22,
        23: ball23,
        24: ball24,
        25: ball25,
        26: ball26,
        27: ball27,
        28: ball28,
        29: ball29,
        30: ball30,
        31: ball31,
        32: ball32,
        33: ball33,
        34: ball34,
        35: ball35,
        36: ball36,
        37: ball37,
        38: ball38,
        39: ball39,
        40: ball40,
        41: ball41,
        42: ball42,
        43: ball43,
        44: ball44,
        45: ball45,
        46: ball46,
        47: ball47,
        48: ball48,
        49: ball49,
      };
      return map[e.split(',')[0]];
      // return `/src/assets/img/specialzodiac/ball${e.split(',')[0]}.png`;
    },
    addzreo(val) {
      if (val < 10) {
        return `0${val}`;
      }
      return val;
    },
    multipleClick(num, i) {
      this.btActive = i;
      if (this.multiple[this.btActive] === '1k') {
        this.times = 1;
      } else {
        this.times = except(num, 1000);
      }
      // console.log('multipleClick', this.currentNumberArr.length);
      if (this.currentNumberArr.length > 0) {
        this.money = ride(this.currentNumberArr.length * 1000, this.times);
      }
      if (this.currentZodiacArr.length > 0) {
        this.money = ride(this.currentZodiacArr.length * 1000, this.times);
      }
      if (this.currentColorArr.length > 0) {
        this.money = ride(this.currentColorArr.length * 1000, this.times);
      }
      // console.log(this.money);
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
          videoId: '6DSpecialZodiac/HowToPlay',
        },
      });
    },
    toGameplay() {
      this.$router.push({
        path: '/playingInstrution',
        query: {
          lotteryId: '49C6',
        },
      });
    },
    onChange(e) {
      this.active = e;
      this.modalVisible = false;
    },
    detail(item) {
      const { orderId } = item;
      this.$router.push({
        path: '/OrderDetail',
        query: {
          orderId,
          lottery: '49C6',
        },
      });
    },
    ballmove() {
      // for(let i = 0; i < this.ballArr.length; i++){
      //   Matter.Body.setVelocity(this.ballArr[i], { x: 10, y: -10 });
      // }
      // this.Engine.create().world.gravity.x = 0;
      // this.Engine.create().world.gravity.y = 1;
      let moveNumber = 0;
      this.leafRotateState = true;
      const movetime = setInterval(() => {
        for (let i = 0; i < this.ballArr.length; i++) {
          const body = this.ballArr[i];
          // console.log('x',body.position.x,'y',body.position.y);
          // console.log('67.5-x',67.5-body.position.x,'67.5-y',67.5-body.position.y);
          // console.log(((67.5-body.position.x)*(67.5-body.position.y))/2-50);
          // console.log(body.position.x<=0 || body.position.y<=0,body.position.x>=135 || body.position.y>=135);
          if (!body.isStatic && body.position.y >= 0) {
            const forceMagnitude = 0.02 * body.mass;
            // console.log('body.mass:',body.mass,'body.position:',body.position,'x:',forceMagnitude + this.Common.random() * forceMagnitude) * this.Common.choose([1, -1])
            // console.log('y:',-forceMagnitude + this.Common.random() * -forceMagnitude)
            const x = (forceMagnitude + this.Common.random() * forceMagnitude) * this.Common.choose([1, -1]);
            const y = -forceMagnitude + this.Common.random() * -forceMagnitude;
            this.Body.applyForce(body, body.position, { x, y });
          }
          if (body.position.x <= 0 || body.position.y <= 0) {
            this.Body.setPosition(body, { x: 67.5, y: 67.5 });
          } else if (body.position.x >= 135 || body.position.y >= 135) {
            this.Body.setPosition(body, { x: 67.5, y: 67.5 });
          }
        }
        moveNumber++;
        if (moveNumber > 59) {
          clearInterval(movetime);
          this.leafRotateState = false;
        }
      }, 500);
    },

    // 倒计时结束事件handler
    handleCountdownEnd() {
      if (!this.isFirst) {
        if (this.currentNumberArr.length || this.currentZodiacArr.length || this.currentColorArr.length) {
          // this.isEndModal = true; // 是否奖期结束弹窗
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
          this.cleanSelected(); // 清空选号数组
        }
        this.leafRotateState = false;
        this.ballLotteryResultsTopArr = []; // 清空开奖结果动画号码数组
        this.ballLotteryResultsBottomArr = []; // 清空开奖结果底座号码数组
        this.times = 0.1;
        this.btActive = 0;
        this.getPhaseInfo();
      }
    },

    // 获取奖期接口
    getPhaseInfo() {
      User.getPhaseInfo({
        appInfo: {},
        data: {
          lottId: '49C6',
          orderTypeName: 'normal',
          fetchUserBetWin: true,
        },
      })
        .then((res) => {
          const { data } = res;
          this.lastStatus = res.data.lastStatus;
          // 刚进入页面
          if (this.isFirst) {
            // 已开奖
            if (data.lastWinCode && this.lastStatus === 5) {
              this.currentPhaseNo = data.currentPhaseNo; // 当前奖期号码("220125058")
              this.remainingTime = res.data.endTime - res.currentTime; // 剩余开奖时长
              this.isFirst = false; // 是否第一次进入页面
              this.ballLotteryResultsBottomArr = data.lastWinCode.split(','); // 设置底座上期号码
            } else if (this.lastStatus !== 5 && this.lastStatus !== 7) {
              // 正在开奖
              this.currentPhaseNo = data.lastPhaseNo; // 上期奖期号码("220125058")
              this.isWaiting = true; // 是否是待开奖状态
              const { lastLottRest } = res.data; // 获取后端返回的的距离开奖的时间
              setTimeout(
                () => {
                  this.isFirst = false; // 是否第一次进入页面
                  this.animate = true; // 打开新增奖期动画
                  this.getPhaseInfo(); // 调用获取奖期接口
                },
                lastLottRest > 0 ? lastLottRest : 10000,
              ); // 在后端返回的距离开奖的时间结束后，如果还是没有结果，10秒后再次请求
            } else if (this.lastStatus === 7) {
              // 取消奖期
              this.currentPhaseNo = data.currentPhaseNo; // 设置当前奖期号码
              this.isFirst = false; // 设置是否刚刚进来
              this.remainingTime = res.data.endTime - res.currentTime; // 设置时间
            }
            this.history_list = data.lottHis.slice(0, 5); // 动画右侧历史奖期 前五条
            console.log(this.history_list, 'history_list');
          } else {
            if (data.lastWinCode && this.lastStatus === 5) {
              console.log('data.lastWinCode');
              this.ballLotteryResultsTopArr = []; // 清空小球开奖结果号码动画数组
              this.ballLotteryResultsBottomArr = []; // 清空小球开奖结果号码底座数组
              this.currentPhaseNo = data.lastPhaseNo; // 设置上期奖期号码
              this.remainingTime = res.data.endTime - res.currentTime; // 剩余开奖时长
              this.isWaiting = false; // 是否待开奖中
              this.isRotating = true; // 是否开奖中/旋转中
              this.leafRotateState = true; // 叶子是否旋转中
              // platform.exec('onPlayDrawPrizeAudio', { arguments: ['raw/zodiac20s.mp3'] }); // 播放开奖音乐
              this.ballmove(); // 给小球们一个力
              let i = 0;
              let index = 0;
              setTimeout(() => {
                const bottomTimes = setInterval(() => {
                  this.ballLotteryResultsBottomArr.push(data.lastWinCode.split(',')[index]);
                  index++;
                  if (index > 6) {
                    clearInterval(bottomTimes);
                  }
                }, 4000); // 设置小球开奖结果号码底座数组
              }, 2000); // 延迟两秒执行
              const topTimes = setInterval(() => {
                this.ballLotteryResultsTopArr.push(data.lastWinCode.split(',')[i]);
                i++;
                if (i > 7) {
                  clearInterval(topTimes);
                  this.isRotating = false; // 是否开奖中
                  this.leafRotateState = false; // 叶子是否旋转中
                  // platform.exec('onReleaseDrawPrizeAudio'); // 关闭开奖音乐
                  this.animate = true; // 打开新增奖期动画
                  this.currentPhaseNo = data.currentPhaseNo; // 设置最新奖期号码
                  if (this.history_list[0].phaseNo !== data.lottHis[0].phaseNo) this.history_list.unshift(data.lottHis[0]); // 往当前右侧历史特码结果数组里面添加最新一条数组--如果不重复的话
                  // 是否中奖
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
                  this.tickets = 0;
                }
              }, 4000);
            }
            if (this.lastStatus !== 5 && this.lastStatus !== 7) {
              // 不是开奖（5）和取消（7）状态时继续请求开奖结果
              this.currentPhaseNo = data.lastPhaseNo; // 设置上期
              const { lastLottRest } = res.data; // 设置指定时间重新请求开奖结果 获取后端返回的的距离开奖的时间
              this.isWaiting = true; // 设置是否待开奖中
              setTimeout(
                () => {
                  this.getPhaseInfo();
                },
                lastLottRest > 0 ? lastLottRest : 10000,
              ); // 在后端返回的距离开奖的时间结束后，如果还是没有结果，10秒后再次请求
            } else if (this.lastStatus === 7) {
              // 取消奖期
              this.animate = true; // 打开新增奖期动画
              this.currentPhaseNo = data.currentPhaseNo; // 设置当前奖期号码
              this.remainingTime = res.data.endTime - res.currentTime; // 剩余开奖时长
              this.isWaiting = false;
              this.isRotating = false;
              const obj = {
                endTime: data.endTime,
                lotteryId: '49C6',
                phaseNo: data.lastPhaseNo,
              };
              if (data.lastPhaseNo !== data.lottHis[0].phaseNo) this.history_list.unshift(obj); // 往当前右侧历史特码结果数组里面添加最新一条数组--如果不重复的话
            }
          }
          this.trend_obj = { hot: data.hot, cold: data.cold, maxMissing: data.maxMissing };
          this.getTickets();
        })
        .catch(() => {
          // if (res.code === 1003) {
          //   this.noSale = true
          // }
          // if(!this.errorDialog) this.errorDialog = true
        });
    },

    // 投注
    handleBet() {
      // 是否刚刚进入 && 是否正在旋转 || 是否刚刚进入 && 剩余开奖时间 || 刚刚进入 || 是否随机4注中
      if ((!this.isFirst && this.isRotating) || (!this.isFirst && this.remain <= 0) || this.randomPlaying) {
        return;
      }
      // this.playBtMusic();
      // 没有选择号码  当前玩法areaTab=1号码玩法 判断选中号码数组是否为空  areaTab=2生肖玩法 判断选中生肖数组是否为空  areaTab=3颜色玩法 判断选中颜色数组是否为空
      // eslint-disable-next-line indent
      if (this.areaTab == 1 ? this.currentNumberArr.length == 0 : this.areaTab == 2 ? this.currentZodiacArr.length == 0 : this.areaTab == 3 ? this.currentColorArr.length == 0 : false) {
        Toast(this.$t('goldBet.SelectOneAtLeast')); // 至少选择1个数字
        return;
      }
      if (!this.money) {
        Toast(this.$t('msg.a49'));
        return false;
      }
      if (Number(this.money) > 10000000) {
        return Toast(this.$t('msg.a51'));
      }
      // 投注参数处理
      let betsArr;
      let amount;
      let bets;
      let betCode = '';
      if (this.areaTab === 1) {
        // 号码玩法
        betsArr = this.currentNumberArr.map((item) => {
          if (item < 10) {
            return `number#0${item}#1`;
          }
          return `number#${String(item)}#1`;
        });
        betCode = betsArr.join(';'); // 选中1，2，3 则betCode 应为 number#01#1;number#02#1 类型#号码（以,分割）#注数
        amount = ride(this.times, 1000) * betsArr.length; // times 注数 pix一注金额（10金币）
        bets = betsArr.length;
      } else if (this.areaTab === 2) {
        // 生肖玩法
        betsArr = this.currentZodiacArr.map((item) => {
          switch (item) {
          case 0:
            return 'zodiac#Mouse#1';
          case 1:
            return 'zodiac#Cattle#1';
          case 2:
            return 'zodiac#Tiger#1';
          case 3:
            return 'zodiac#Rabbit#1';
          case 4:
            return 'zodiac#Dragon#1';
          case 5:
            return 'zodiac#Snake#1';
          case 6:
            return 'zodiac#Horse#1';
          case 7:
            return 'zodiac#Sheep#1';
          case 8:
            return 'zodiac#Monkey#1';
          case 9:
            return 'zodiac#Chicken#1';
          case 10:
            return 'zodiac#Dog#1';
          case 11:
            return 'zodiac#Pig#1';
          default:
            return '';
          }
        });
        betCode = betsArr.join(';'); // 选中Dog,Pig 则betCode 应为 zodiac#Pig#1;zodiac#Dog#1 类型#号码（以;分割）#注数
        amount = ride(this.times, 1000) * betsArr.length;
        bets = betsArr.length;
      } else if (this.areaTab === 3) {
        // 颜色玩法
        betsArr = this.currentColorArr.map((item) => {
          switch (item) {
          case 0:
            return 'color#Red#1';
          case 1:
            return 'color#Green#1';
          case 2:
            return 'color#Blue#1';
          default:
            return '';
          }
        });
        betCode = betsArr.join(';'); // 选中1，2，3 则betCode 应为 number#01#1; 类型#号码（以;分割）#注数
        amount = ride(this.times, 1000) * betsArr.length;
        bets = betsArr.length;
      }
      // 有用户信息 并且有token
      if (lance.getData('token')) {
        User.betHFive({
          appInfo: {},
          data: {
            amount, // 总下注金币数
            lotteryType: '49C6', // 投注类型
            phase: this.currentPhaseNo, // 彩期
            bets, // 下注个数
            multiple: ride(this.times, 10), // 下注倍数
            betCode, // 下注code
          },
        })
          .then((res) => {
            if (res.success) {
              // this.getGold(); // 查询金币和剩余获取金币次数
              this.getTickets(); // 获取购彩历史记录
              this.cleanSelected(); // 清空号码、生肖、颜色选号数组 currentNumberArr currentZodiacArr currentColorArr
              Toast(this.$t('goldBet.betSuccess')); // 投注成功
              this.allowGetGold = false;
            }
          })
          .catch((res) => {
            if (res.code === 1152) {
              // this.getGold();
            } else {
              Toast(res.toast); // 后端给的message
            }
            //
          });
      } else {
        this.$router.push('/login'); // 没有用户信息和token 跳转去登录页
      }
    },

    // 剩余倒计时
    handleCountDownChange(e) {
      this.remain = e;
    },

    // 打开
    openModalVisible() {
      // this.playBtMusic();
      this.modalVisible = true;
    },

    // 打开展开状态
    openUnfold() {
      // this.playBtMusic();
      this.unfold = true;
    },

    // 关闭张开状态
    closeUnfold() {
      // this.playBtMusic();
      this.unfold = false;
    },

    // 获取一个随机 min最小值 max最大值
    random(min, max) {
      return Math.floor(Math.random() * max + min);
    },

    // 查询金币和金币领取次数
    getGold() {
      User.getAccountInfo({
        appInfo: {},
      })
        .then((res) => {
          this.gold_amount = res.data.cash;
          // 金币数小于100,领取次数小于5
          // console.log(this.allowGetGold ,this.gold_amount < 100 , this.getGoldTimes < 5)
          // if (this.allowGetGold && this.gold_amount < 100 && this.getGoldTimes < 5) {
          //   User.drawGold({
          //     // 获取金币接口
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
          Toast(err.toast);
          if (!this.errorDialog) this.errorDialog = true;
        });
    },

    // 选好左侧tab切换
    setTab(num) {
      // this.playBtMusic();
      if (num === 1) {
        this.currentZodiacArr = [];
        this.currentColorArr = [];
      } else if (num === 2) {
        this.currentNumberArr = [];
        this.currentColorArr = [];
      } else if (num === 3) {
        this.currentZodiacArr = [];
        this.currentNumberArr = [];
      }
      this.areaTab = num;
    },

    // 随机四注
    handleRandom() {
      if (this.randomPlaying || this.areaTab === 3) {
        return;
      }
      // this.playBtMusic();
      this.randomPlaying = true;
      const changeCount = 19; // 随机切换的次数
      let leftChangeCount = changeCount; // 剩余切换的次数
      if (this.areaTab === 1) {
        this.randomInterval = setInterval(() => {
          if (leftChangeCount > 0) {
            this.currentNumberArr = this.getRandom(4, 49, 1);
            leftChangeCount--;
          } else {
            clearInterval(this.randomInterval);
            this.currentNumberArr = this.getRandom(4, 49, 1);
            leftChangeCount = changeCount;
            this.randomPlaying = false;
          }
        }, 100);
      } else if (this.areaTab === 2) {
        this.randomInterval = setInterval(() => {
          if (leftChangeCount > 0) {
            this.currentZodiacArr = this.getRandom(4, 12, 0);
            leftChangeCount--;
          } else {
            this.currentZodiacArr = this.getRandom(4, 12, 0);
            clearInterval(this.randomInterval);
            leftChangeCount = changeCount;
            this.randomPlaying = false;
          }
        }, 100);
      }
    },

    // 获取随机数 返回数组
    getRandom(count, max, min) {
      const arr = [];
      while (arr.length < count) {
        const number = Math.floor(Math.random() * max + min);
        // let number = Math.floor(Math.random() * randomnum)
        if (!arr.includes(number)) {
          arr.push(number);
        }
      }
      return arr;
    },

    // 清空按钮事件
    cleanSelected() {
      this.currentNumberArr = [];
      this.currentZodiacArr = [];
      this.currentColorArr = [];
    },

    // 中奖界面
    handleWinningPopupClose() {
      this.winningPopupVisible = false;
    },

    // 未中奖界面
    handleNotWinningPopupClose() {
      this.notWinningPopupVisible = false;
    },

    // 购彩记录接口
    getTickets() {
      User.list({
        appInfo: {},
        data: {
          currentPage: 1,
          pageNumber: 100,
          orderStatus: 1,
          searchTime: 0,
          orderType: 'normal',
          lotteryId: '49C6',
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

    // 选择号码
    addNumber(number) {
      // this.playBtMusic();
      const index = this.currentNumberArr.indexOf(number);
      if (index !== -1) {
        this.currentNumberArr.splice(index, 1);
      } else {
        this.currentNumberArr.push(number);
      }
      console.log('号码:', this.currentNumberArr);
    },
    // 选择生肖
    addZodiac(number) {
      // this.playBtMusic();
      const index = this.currentZodiacArr.indexOf(number);
      if (index !== -1) {
        this.currentZodiacArr.splice(index, 1);
      } else {
        this.currentZodiacArr.push(number);
      }
      console.log('生肖:', this.currentZodiacArr);
    },

    // 选择颜色
    addColor(number) {
      // this.playBtMusic();
      const index = this.currentColorArr.indexOf(number);
      if (index !== -1) {
        this.currentColorArr.splice(index, 1);
      } else {
        this.currentColorArr.push(number);
      }
      console.log('颜色:', this.currentColorArr);
    },
  },
};
</script>
<style lang="scss" scoped>
.mt80 {
  margin-top: 80px;
}
.bet-page {
  height: 100%;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  background: #191a1c;
  // position: absolute;
  // left: 0;
  // right: 0;
  // box-sizing: border-box;
  .statusBarHeight {
    background: #191a1c;
    width: 100vw;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 97;
  }
  .mask {
    width: 100vw;
    height: 100vh;
    position: fixed;
    bottom: 0;
    left: 0;
    background: rgba(5, 5, 5, 0.6);
    z-index: 11;
    img {
      position: absolute;
      bottom: 150.28vw;
      width: 100vw;
      height: 9.33vw;
      display: block;
    }
    > div {
      position: absolute;
      bottom: 150.13vw;
      width: 9.33vw;
      height: 9.33vw;
      left: 1.3vw;
    }
  }

  .unfold {
    position: fixed !important;
    bottom: 0;
    z-index: 12;
    height: 100vw;
  }
  .zodiac {
    &__top {
      // margin-top:12.93vw;
      position: relative;
      z-index: 10;
      height: 74.33vw;
      background: url(/src/assets/img/specialzodiac/bgtop.png) no-repeat 0 0/100%;
      background-size: 100% 100%;
      // padding-bottom: constant(safe-area-inset-top);//适配ios刘海屏
      // padding-bottom: env(safe-area-inset-top);
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
        // 第一个1-49号码背景图
        @for $i from 1 through 49 {
          @if ($i<10) {
            &_0#{$i} {
              background: url(/src/assets/img/specialzodiac/ball0#{$i}.png) no-repeat 0 0/100%;
            }
          } @else {
            &_#{$i} {
              background: url(/src/assets/img/specialzodiac/ball#{$i}.png) no-repeat 0 0/100%;
            }
          }
        }
      }
      &_button {
        width: 9.33vw;
        height: 9.33vw;
        position: absolute;
        bottom: 0;
        left: 1.8vw;
        z-index: 10;
        border: 1px solid transparent;
      }
    }
    &__roulette-and-history {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 66.78vw;
      &_right {
        position: absolute;
        right: 0;
        top: 0;
        width: 47.3vw;
      }
    }
    &__roulette-and-countdown {
      position: absolute;
      top: 2vw;
      left: 4.13vw;
      width: 55.86vw; //419
      height: 63.2vw; //474
      &_bottom {
        width: 55.86vw;
        height: 14.13vw;
        position: absolute;
        bottom: 0;
        left: 0;
        box-sizing: border-box;
        background: url(/src/assets/img/specialzodiac/gashapon_bottom.png) no-repeat 0 0/100%;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        padding-left: 3.22vw;
        .ball {
          margin-right: 1.6vw;
          display: block;
          width: 4.93vw;
          height: 4.93vw;
        }
        .bigball {
          width: 8vw;
          height: 8vw;
          margin-left: 2.4vw;
        }
      }
      &_glass {
        width: 38.8vw;
        height: 38.8vw;
        position: absolute;
        top: 0;
        left: 6.4vw;
        background: url(/src/assets/img/specialzodiac/gashapon_glass.png) no-repeat 0 0/100%;
      }
      &_leaf {
        width: 36vw;
        height: 36vw;
        position: absolute;
        top: 1.33vw;
        left: 7.86vw;
        background: url(/src/assets/img/specialzodiac/gashapon_leaf.png) no-repeat 0 0/100%;
        z-index: -1;
      }
      &_pedestal {
        position: absolute;
        width: 49.6vw;
        height: 43.46vw;
        left: 0.93vw;
        bottom: 11.2vw;
        background: url(/src/assets/img/specialzodiac/gashapon_pedestal.png) no-repeat 0 0/100%;
        z-index: -2;
        > div {
          width: 2.8vw;
          height: 2.8vw;
          position: absolute;
          left: 23.86vw;
          bottom: 13.2vw;
          opacity: 0;
        }
        .ball1 {
          animation: dropout1 2s ease-in forwards;
          -webkit-animation: dropout1 2s ease-in forwards; /* Safari 与 Chrome */
        }
        .ball2 {
          animation: dropout2 2s ease-in forwards;
          -webkit-animation: dropout2 2s ease-in forwards; /* Safari 与 Chrome */
        }
        .ball3 {
          animation: dropout3 2s ease-in forwards;
          -webkit-animation: dropout3 2s ease-in forwards; /* Safari 与 Chrome */
        }
        .ball4 {
          animation: dropout4 2s ease-in forwards;
          -webkit-animation: dropout4 2s ease-in forwards; /* Safari 与 Chrome */
        }
        .ball5 {
          animation: dropout5 2s ease-in forwards;
          -webkit-animation: dropout5 2s ease-in forwards; /* Safari 与 Chrome */
        }
        .ball6 {
          animation: dropout6 2s ease-in forwards;
          -webkit-animation: dropout6 2s ease-in forwards; /* Safari 与 Chrome */
        }
        .ball7 {
          animation: dropout7 2s ease-in forwards;
          -webkit-animation: dropout7 2s ease-in forwards; /* Safari 与 Chrome */
        }
      }
      &_ballbox {
        width: 36vw;
        height: 36vw;
        position: absolute;
        top: 1.33vw;
        left: 7.86vw;
        z-index: -1;
        border-radius: 50%;
        overflow: hidden;
      }
      .leafrotate {
        animation: leafrotate 2s linear 15;
      }
    }
    &__roulette {
      width: 44vw;
      height: 44vw;
      background: #000;
      border-radius: 50%;
      margin: 0 auto;
    }
    &__history {
      width: 32vw;
      height: 50vw;
      background: url(/src/assets/img/specialzodiac/history_border.png) no-repeat 0 0/100% 100%;
      margin: 2.67vw 5.06vw 0 8vw;
      // border: 0.13vw solid;
      // border-image: linear-gradient(-90deg, #6A4E20, #F5C95C, #66471A) 10 10;
      // border-radius: 0.93vw;
      box-sizing: padding-box;
      padding: 1px;
      overflow: hidden;
      &_item {
        background: url(/src/assets/img/specialzodiac/history_item_bg.png) no-repeat 0 0/100% 100%;
        // width: calc(100% - 6.4vw);
        height: 10vw;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 0.8vw 0 2.4vw;
        color: #fafeff;
        &-index {
          font-size: 2.93vw;
          font-weight: 600;
          width: 5.5vw;
        }
        &-number {
          width: 5.87vw;
          height: 5.87vw;
          font-size: 3.47vw;
          font-weight: 600;
          color: #f2fff4;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto;
        }
        &-zodiac {
          // zoom: 0.5;
          width: 9vw;
          max-height: 9vw;
          padding-right: 2vw;
        }
        &-issueCancel {
          font-size: 10px;
        }
      }
    }
    &__trend-and-numbers {
      display: flex;
      width: 100%;
      justify-content: space-between;
      box-sizing: border-box;
      padding: 0 3.6vw 0 16.67vw;
      // margin: 4vw 0;
      position: absolute;
      bottom: 4.13vw;
      > div {
        width: 25%;
        height: 14.33vw;
      }
      &-title {
        height: 3.47vw;
        line-height: 3.47vw;
        text-align: center;
        background: linear-gradient(90deg, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0));
        span {
          font-size: 3.2vw;
          background: linear-gradient(0deg, #fbf7bf 0%, #ffca68 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      }
      &-trend {
        height: 11.4vw;
        width: 100%;
        position: relative;
        background: url(/src/assets/img/lottery/trend_bg.png) no-repeat center -1.5vw/65%;
      }
      &-omissions {
        height: 11.4vw;
        width: 100%;
        background: url(/src/assets/img/lottery/omissions_bg.png) no-repeat center 7.5vw/65%;
      }
      &-popular {
        height: 11.4vw;
        width: 100%;
        background: url(/src/assets/img/lottery/popular_bg.png) no-repeat center 6vw/65%;
      }
      &-unpopular {
        height: 11.4vw;
        width: 100%;
        background: url(/src/assets/img/lottery/unpopular_bg.png) no-repeat center 6vw/65%;
      }
      .round-number {
        width: 8.93vw;
        height: 8.93vw;
        text-align: center;
        margin: 0 auto;
        line-height: 8.93vw;
        font-size: 5.2vw;
        font-weight: 600;
        color: #ffffff;
        // position: absolute;
      }
    }
    &__select-area {
      position: relative;
      background: url(/src/assets/img/specialzodiac/bgbottom.png) repeat;
      background-size: 100%;
      min-height: 125.2vw;
      margin-bottom: 25.33vw;
      display: flex;
      justify-content: flex-start;
      align-items: flex-start;
      padding: 4vw 4.66vw 0 3.73vw;
      box-sizing: border-box;
      width: 100vw;
      &-tab {
        margin-right: 3.06vw;
        > .tab {
          width: 13.6vw;
          height: 14.13vw;
          background-size: 13.6vw auto;
          background-repeat: no-repeat;
          background-position: bottom;
          margin-bottom: 2.35vw;
        }
        .numbershow {
          background-image: url(/src/assets/img/specialzodiac/numbershow.png);
        }
        .numberhide {
          background-image: url(/src/assets/img/specialzodiac/numberhide.png);
        }
        .zodiacshow {
          background-image: url(/src/assets/img/specialzodiac/zodiacshow.png);
        }
        .zodiachide {
          background-image: url(/src/assets/img/specialzodiac/zodiachide.png);
        }
        .colorshow {
          background-image: url(/src/assets/img/specialzodiac/colorshow.png);
        }
        .colorhide {
          background-image: url(/src/assets/img/specialzodiac/colorhide.png);
        }
        .ticket-button {
          position: relative;
          width: 13.6vw;
          height: auto;
          color: #fff;
          line-height: 14vw;
          text-align: center;
          font-size: 4.2vw;
          font-weight: bold;
          > img {
            display: block;
            width: 13.6vw;
          }
          .note {
            position: absolute;
            right: 0.26vw;
            top: 6.66vw;
            width: 4.53vw;
            height: 3.86vw;
            text-align: center;
            line-height: 4vw;
            font-size: 2.93vw;
            color: #fff;
            background: url(/src/assets/gold_note.png) no-repeat 0 0/100% 100%;
          }
        }
      }
      &-view {
        flex: 1;
        min-height: 64vw;
        &-number {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          flex-wrap: wrap;
          width: 75.07vw;
          height: 121.1vw;
          .item {
            width: 9.6vw;
            height: 9.6vw;
            background: #333333;
            border-radius: 50%;
            line-height: 9.6vw;
            font-size: 4.53vw;
            font-weight: 400;
            text-align: center;
            color: #c2c2c2;
            margin: 1.6vw 3.38vw 2.53vw 0;
            &:nth-child(6n) {
              margin-right: 0;
            }
          }
          .red {
            color: #ffffff;
            background: #fc3635;
          }
          .blue {
            color: #ffffff;
            background: #3685ec;
          }
          .green {
            color: #ffffff;
            background: #55c339;
          }
        }
        &-zodiac {
          // height: 121.1vw;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          flex-wrap: wrap;
          width: 68.67vw;
          margin: 2.26vw auto 0;
          .item {
            width: 32vw;
            height: 14.13vw;
            border-radius: 2.66vw;
            margin-bottom: 2.66vw;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: flex-start;
            &:nth-child(3) {
              .numlist {
                .numitem {
                  margin-right: 0.66vw;
                }
              }
            }
            .title {
              height: 3.6vw;
              font-size: 3.73vw;
              color: #ababab;
              line-height: 3.6vw;
              padding-left: 3.33vw;
              margin: 1.86vw 0 1.46vw;
            }
            .currenttitle {
              color: #0e0e0e;
            }
            .numlist {
              display: flex;
              align-items: center;
              justify-content: flex-start;
              padding-left: 2.26vw;
              .numitem {
                width: 5.33vw;
                height: 5.33vw;
                border-radius: 50%;
                font-size: 2.93vw;
                font-weight: 400;
                color: #ffffff;
                line-height: 5.33vw;
                text-align: center;
                margin-right: 1.06vw;
                box-sizing: border-box;
              }
              .red {
                border: 1px solid #fc3635;
              }
              .blue {
                border: 1px solid #3685ec;
              }
              .green {
                border: 1px solid #55c339;
              }
              .redbg {
                border: 1px solid transparent;
                background-color: #fc3635;
              }
              .bluebg {
                border: 1px solid transparent;
                background-color: #3685ec;
              }
              .greenbg {
                border: 1px solid transparent;
                background-color: #55c339;
              }
            }
          }
          @for $i from 0 through 11 {
            .show#{$i} {
              background: url(/src/assets/img/specialzodiac/zodiacshow#{$i}.png) no-repeat 0 0/100% 100%;
            }
          }
          @for $i from 0 through 11 {
            .hide#{$i} {
              background: url(/src/assets/img/specialzodiac/zodiachide#{$i}.png) no-repeat 0 0/100% 100%;
            }
          }
        }
        &-color {
          height: 121.1vw;
          &-item {
            width: 72vw;
            height: 18.66vw;
            background: #333333;
            border-radius: 2.66vw;
            margin: 0 auto 2.93vw;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            flex-direction: column;
            &-title {
              height: 2.93vw;
              font-size: 3.73vw;
              line-height: 2.93vw;
              margin: 1.46vw auto 1.2vw;
            }
            .redtitle {
              color: #fc3635;
            }
            .bluetitle {
              color: #3685ec;
            }
            .greentitle {
              color: #55c339;
            }
            .whitetitle {
              color: #ffffff;
            }
            &-colorlist {
              display: flex;
              justify-content: flex-start;
              align-items: center;
              flex-wrap: wrap;
              padding: 0 2.66vw 0 4.8vw;
              span {
                display: block;
                box-sizing: border-box;
                width: 4.8vw;
                height: 4.8vw;
                border: 1px solid transparent;
                border-radius: 50%;
                font-size: 2.4vw;
                color: #ffffff;
                line-height: 4.8vw;
                text-align: center;
                margin: 0 1.06vw 1.06vw 0;
              }
              .redbor {
                border-color: #fc3635;
              }
              .greenbor {
                border-color: #55c339;
              }
              .bluebor {
                border-color: #3685ec;
              }
              .whitebor {
                border-color: #ffffff;
              }
            }
          }
          .redbg {
            background: linear-gradient(0deg, #fc3635, #c20100);
          }
          .greenbg {
            background: linear-gradient(0deg, #55c339, #1f9501);
          }
          .bluebg {
            background: linear-gradient(0deg, #3685ec, #0f56b1);
          }
        }
      }
    }
    &__random-4,
    &__clean {
      width: 21.2vw;
      height: 9.46vw;
      line-height: 9.46vw;
      background: url(/src/assets/img/lottery/button_bg_02_c1.png) no-repeat 0 0/100% 100%;
      font-size: 3.2vw;
      font-weight: bold;
      color: #ffffff;
      text-align: center;
      text-shadow: 0 0 0.53vw rgba(0, 0, 0, 0.72);
      margin-left: 5.3vw;
    }
    &__clean {
      background-image: url(/src/assets/img/lottery/button_bg_02_c2.png);
    }
  }
  .zodiac_content {
    --contentTop: '';
    // position: absolute;
    // left: 0;
    // right: 0;
    // top: constant(safe-area-inset-top);
    // top: env(safe-area-inset-top);
    overflow: auto;
    height: calc(100vh - var(--contentTop) - env(safe-area-inset-top));
  }
  .zodiac_contentunfold {
    --contentTop: '';
    // position: absolute;
    // left: 0;
    // right: 0;
    // top: constant(safe-area-inset-top);
    // top: env(safe-area-inset-top);
    // overflow: auto;
    height: calc(100vh - var(--contentTop) - env(safe-area-inset-top));
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
  opacity: 0;
  height: 0;
}
.ticket-button {
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
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  background: #000000;
  height: 25.33vw;
  z-index: 12;
  &__times {
    height: 12vw;
    background: linear-gradient(0deg, #191a1c, #070908);
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding: 0 6.93vw;
    &-title {
      text-align: center;
      width: 21.33vw;
      height: 8vw;
      background: #333333;
      border-radius: 4vw;
      font-size: 4vw;
      font-weight: 400;
      color: #ffffff;
      line-height: 8vw;
      margin-right: 3.46vw;
    }
    &-forbidden {
      color: #ababab;
    }
    &-input {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 35.46vw;
      height: 8vw;
      background: url(/src/assets/img/specialzodiac/bginput.png) no-repeat 0 0/100%;
    }
    &-number {
      text-align: center;
      box-sizing: border-box;
      width: 13.6vw;
      height: 6.8vw;
      line-height: 6.8vw;
      margin: 0 1px;
      font-size: 4.53vw;
      color: #e8bf58;
    }
    &-reduce,
    &-add {
      text-align: center;
      box-sizing: border-box;
      width: 10.66vw;
      height: 6.4vw;
      font-size: 4.53vw;
      color: #c2c2c2;
    }
  }
  &__total-and-bet {
    display: flex;
    align-items: center;
    height: 50px;
    padding: 0 1px 0 13.5px;
    background: linear-gradient(0deg, #191a1c 0%, #191a1c 100%);
  }
  &__total {
    flex-grow: 1;
    color: #ffffff;
    height: 50px;
    .bettimestotal {
      display: block;
      font-size: 14px;
      line-height: 13px;
      margin-top: 12.5px;
    }
    .mycoin {
      display: block;
      font-style: normal;
      font-size: 20px;
      line-height: 20px;
      margin-top: 6px;
      zoom: 0.5;
      margin-left: 2px;
    }
  }
  &__bet {
    width: 106.5px;
    height: 46.5px;
    line-height: 46.5px;
    font-size: 20px;
    text-align: center;
    font-weight: 600;
    background: url(/src/assets/img/specialzodiac/bgbet.png) no-repeat 0 0/100%;
    color: #220500;

    &.disabled {
      background: url(/src/assets/img/specialzodiac/bgbetdisabled.png) no-repeat 0 0/100%;
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
.chance-popup {
  background: rgba(0, 0, 0, 0.5);
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  &__close {
    position: absolute;
    left: 50%;
    top: 50%;
    margin: -52vw 0 0 32vw;
    width: 7.2vw;
    height: 7.2vw;
    background: url(/src/assets/close.png) no-repeat 0 0/100% 100%;
  }
  &__title {
    width: 78.26vw;
    height: 24.67vw;
    background: url(/src/assets/chance_wheel_title.png) no-repeat 50% 50%/100% 100%;
  }
  &__wheel {
    background: #f6e052;
    border-radius: 50%;
    width: 67.73;
    height: 67.73;
    position: relative;
    margin: 4.8vw 0 5.33vw;
    background: url(/src/assets/chance_wheel_border.png) no-repeat 50% 50%/100% 100%;
    &-light {
      width: 109.87vw;
      height: 109.87vw;
      position: absolute;
      left: 50%;
      top: 50%;
      z-index: -1;
      margin: -54.93vw 0 0 -54.93vw;
      background: url(/src/assets/lighting.png) no-repeat 0 0/100%;
      animation: lightAnima 10000ms linear infinite;
    }
    &-arrow {
      position: absolute;
      top: -4.8vw;
      left: 50%;
      width: 58.53vw;
      height: 22.93vw;
      margin-left: -29.87vw;
      background: url(/src/assets/chance_wheel_arrow.png) no-repeat 50% 50%/100% 100%;
      z-index: 1;
    }
    &-main {
      width: 56.53vw;
      height: 56.53vw;
      position: absolute;
      left: 50%;
      top: 50%;
      margin: -28.27vw 0 0 -28.27vw;
      background: url(/src/assets/chance_wheel.png) no-repeat 50% 50%/100% 100%;
      transition: transform 4s;
    }
  }
  &__button {
    width: 47.87vw;
    height: 13.73vw;
    line-height: 13.73vw;
    color: #472700;
    text-align: center;
    background: url(/src/assets/big_button_2.png) no-repeat 0 0/100% 100%;
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

// 球1掉落滚动动画
@keyframes dropout1 {
  0% {
    transform: rotate(0deg);
    opacity: 1;
  }
  25% {
    transform: translate(0, 2.8vw);
  }
  100% {
    transform: translate(-16.4vw, 8.4vw) rotate(-360deg);
    opacity: 1;
  }
}
@-webkit-keyframes dropout1 {
  0% {
    -webkit-transform: rotate(0deg);
    opacity: 1;
  }
  25% {
    -webkit-transform: translate(0, 2.8vw);
  }
  100% {
    -webkit-transform: translate(-16.4vw, 8.4vw) rotate(-360deg);
    opacity: 1;
  }
}

// 球2掉落滚动动画
@keyframes dropout2 {
  0% {
    transform: rotate(0deg);
    opacity: 1;
  }
  25% {
    transform: translate(0, 2.8vw);
  }
  100% {
    transform: translate(-13.73vw, 7.6vw) rotate(-300deg);
    opacity: 1;
  }
}
@-webkit-keyframes dropout2 {
  0% {
    -webkit-transform: rotate(0deg);
    opacity: 1;
  }
  25% {
    -webkit-transform: translate(0, 2.8vw);
  }
  100% {
    -webkit-transform: translate(-13.73vw, 7.6vw) rotate(-300deg);
    opacity: 1;
  }
}

// 球3掉落滚动动画
@keyframes dropout3 {
  0% {
    transform: rotate(0deg);
    opacity: 1;
  }
  25% {
    transform: translate(0, 2.8vw);
  }
  100% {
    transform: translate(-11.06vw, 6.8vw) rotate(-240deg);
    opacity: 1;
  }
}
@-webkit-keyframes dropout3 {
  0% {
    -webkit-transform: rotate(0deg);
    opacity: 1;
  }
  25% {
    -webkit-transform: translate(0, 2.8vw);
  }
  100% {
    -webkit-transform: translate(-11.06vw, 6.8vw) rotate(-240deg);
    opacity: 1;
  }
}

// 球4掉落滚动动画
@keyframes dropout4 {
  0% {
    transform: rotate(0deg);
    opacity: 1;
  }
  25% {
    transform: translate(0, 2.8vw);
  }
  100% {
    transform: translate(-8.26vw, 5.86vw) rotate(-180deg);
    opacity: 1;
  }
}
@-webkit-keyframes dropout4 {
  0% {
    -webkit-transform: rotate(0deg);
    opacity: 1;
  }
  25% {
    -webkit-transform: translate(0, 2.8vw);
  }
  100% {
    -webkit-transform: translate(-8.26vw, 5.86vw) rotate(-180deg);
    opacity: 1;
  }
}

// 球5掉落滚动动画
@keyframes dropout5 {
  0% {
    transform: rotate(0deg);
    opacity: 1;
  }
  25% {
    transform: translate(0, 2.8vw);
  }
  100% {
    transform: translate(-5.73vw, 4.93vw) rotate(-120deg);
    opacity: 1;
  }
}
@-webkit-keyframes dropout5 {
  0% {
    -webkit-transform: rotate(0deg);
    opacity: 1;
  }
  25% {
    -webkit-transform: translate(0, 2.8vw);
  }
  100% {
    -webkit-transform: translate(-5.73vw, 4.93vw) rotate(-120deg);
    opacity: 1;
  }
}

// 6掉落滚动动画
@keyframes dropout6 {
  0% {
    transform: rotate(0deg);
    opacity: 1;
  }
  25% {
    transform: translate(0, 2.8vw);
  }
  100% {
    transform: translate(-3.06vw, 4.13vw) rotate(-60deg);
    opacity: 1;
  }
}
@-webkit-keyframes dropout6 {
  0% {
    -webkit-transform: rotate(0deg);
    opacity: 1;
  }
  25% {
    -webkit-transform: translate(0, 2.8vw);
  }
  100% {
    -webkit-transform: translate(-3.06vw, 4.13vw) rotate(-60deg);
    opacity: 1;
  }
}

// 球7掉落滚动动画
@keyframes dropout7 {
  0% {
    transform: rotate(0deg);
    opacity: 1;
  }
  25% {
    transform: translate(0, 2.8vw);
  }
  100% {
    transform: translate(15.2vw, 8.4vw) rotate(360deg);
    opacity: 1;
  }
}
@-webkit-keyframes dropout7 {
  0% {
    -webkit-transform: rotate(0deg);
    opacity: 1;
  }
  25% {
    -webkit-transform: translate(0, 2.8vw);
  }
  100% {
    -webkit-transform: translate(15.2vw, 8.4vw) rotate(360deg);
    opacity: 1;
  }
}

// 叶子旋转动画
@keyframes leafrotate {
  0% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(-240deg);
  }
  100% {
    transform: rotate(-480deg);
  }
}
@-webkit-keyframes leafrotate {
  0% {
    -webkit-transform: rotate(0deg);
  }
  50% {
    -webkit-transform: rotate(-240deg);
  }
  100% {
    -webkit-transform: rotate(-480deg);
  }
}

.internet_error {
  font-size: 4vw;
  font-weight: 400;
  color: #fefeff;
  // margin-bottom: 9.2vw;
}
</style>
