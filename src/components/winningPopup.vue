<template>
  <div>
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
</template>

<script>
export default {
  name: 'WinningPopup',
  props: {
    winningPopupVisible: {
      type: Boolean,
      default: false,
    },
    notWinningPopupVisible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {};
  },
  methods: {
    handleWinningPopupClose() {
      this.winningPopupVisible = false;
    },
    handleNotWinningPopupClose() {
      this.notWinningPopupVisible = false;
    },
  },
};
</script>

<style lang="less" scoped>
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
