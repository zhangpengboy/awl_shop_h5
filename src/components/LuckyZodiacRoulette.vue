<template>
  <div class="lucky-zodiac-roulette">
    <div class="lucky-zodiac-roulette__lights" :class="{ 'lucky-zodiac-roulette__lights--status-2': lightsStatus2 }"></div>
    <div
      class="lucky-zodiac-roulette__arrow"
      :class="{ 'lucky-zodiac-roulette__arrow--actived': rotateDeg && options.number >= 1, fast: isFirst }"
      :style="{ transform: `rotate(${rotateDeg}deg)` }"
      @transitionend="handleTransitionEnd"
    ></div>
    <div class="lucky-zodiac-roulette__logo"></div>
  </div>
</template>

<script>
export default {
  name: 'LuckyZodiacRoulette',
  props: {
    // options对象格式为：{ number: 1 }
    options: {
      type: Object,
      required: true,
    },
    isFirst: {
      type: Boolean,
    },
  },
  emits: ['rotate-end'],
  data() {
    const offset = 15; // 默认偏移角度

    return {
      first: true,
      offset,
      rotateDeg: this.options.number * 30 - offset,
      rotating: false,
      lightsStatus2: false,
      initState: 0,
    };
  },
  watch: {
    options(newOptions) {
      if (this.rotating) {
        return;
      }
      console.log(this.first);
      // console.log(newOptions,999)
      // 设置为：当前已转角度 + (当前圈剩余可转角度) + 固定转的圈数 + (需要停留位置需要转动的角度)
      if (this.isFirst && this.first) {
        this.first = false;
        // this.rotateDeg = this.rotateDeg + (360 - this.rotateDeg % 360) + (newOptions.number * 30 - this.offset)
        this.rotateDeg = newOptions.number * 30 - this.offset;
      } else {
        this.rotateDeg = this.rotateDeg + (360 - (this.rotateDeg % 360)) + 360 * 10 + (newOptions.number * 30 - this.offset);
      }
      this.rotating = true;
    },
    rotating(newRatatingValue) {
      // newRatatingValue && this.initState && platform.exec('onPlayDrawPrizeAudio', { arguments: ['raw/zodiac20s.mp3'] });
      // 转盘灯泡颜色切换动画
      if (newRatatingValue) {
        this.lightsIntervalId = setInterval(() => {
          this.lightsStatus2 = !this.lightsStatus2;
        }, 200);
      } else {
        clearInterval(this.lightsIntervalId);
      }
    },
  },
  created() {
    setTimeout(() => {
      this.initState = 1;
    }, 500);
  },
  methods: {
    handleTransitionEnd() {
      // this.initState && platform.exec('onReleaseDrawPrizeAudio');
      this.rotating = false;
      this.$emit('rotate-end');
    },
  },
};
</script>

<style lang="less" scoped>
.lucky-zodiac-roulette {
  position: relative;
  width: 52.66vw;
  height: 54.13vw;
  background: url(/src/assets/img/lottery/lucky_zodiac_roulette_circle.png) no-repeat 50% 50%/35.57vw 35.57vw,
    url(/src/assets/img/lottery/lucky_zodiac_roulette_bottom.png) no-repeat 50% 50%/44.53vw 44.53vw, url(/src/assets/img/lottery/lucky_zodiac_roulette_light.png) no-repeat 50% 50%/52.66vw 54.13vw;

  &__lights {
    position: absolute;
    top: 50%;
    left: 50%;
    margin: -21.465vw 0 0 -21.465vw;
    width: 42.93vw;
    height: 42.93vw;
    background: url(/src/assets/img/lottery/lucky_zodiac_roulette_lights.png) no-repeat 50% 50%/100%;

    &--status-2 {
      transform: rotate(15deg);
    }
  }

  &__arrow {
    position: absolute;
    top: 50%;
    left: 50%;
    margin: -15.86vw 0 0 -15.86vw;
    width: 31.72vw;
    height: 31.72vw;
    background: url(/src/assets/img/lottery/lucky_zodiac_roulette_arrow.png) no-repeat 0 0/200% 100%;
    transition: transform 4s;

    &--actived {
      background-position: 100% 0;

      &.fast {
        transition: transform 1s;
      }
    }
  }

  &__logo {
    position: absolute;
    top: 50%;
    left: 50%;
    margin: -3.42vw 0 0 -3.42vw;
    width: 6.84vw;
    height: 6.84vw;
    background: url(/src/assets/img/lottery/lucky_zodiac_roulette_logo.png) no-repeat 50% 50%/100% 100%;
  }
}
@keyframes rotate {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(15deg);
  }
}
</style>
