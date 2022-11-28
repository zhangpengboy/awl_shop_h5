<template>
  <ul class="lucky-zodiac-select">
    <li
      v-for="n in 12"
      :key="n"
      class="lucky-zodiac-select__option"
      :class="{
        ['lucky-zodiac-select__option-' + (n.toString().length < 2 ? '0' + n : n)]: true,
        ['lucky-zodiac-select__option-' + (n.toString().length < 2 ? '0' + n : n) + '--selected']: modelValue.includes(n),
      }"
      @click="handleClick(n)"
    ></li>
  </ul>
</template>

<script>
export default {
  name: 'LuckyZodiacSelect',
  props: {
    modelValue: {
      type: Array,
      required: true,
    },
    // 最多可选多少个号
    maxOptions: {
      type: Number,
      default: 12,
    },
    // 禁止选择号码
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:modelValue'],
  created() {
    console.log('>>>>>>>>>>', this.modelValue);
  },
  methods: {
    handleClick(n) {
      if (this.disabled) {
        return;
      }
      const value = this.modelValue.slice();
      const findIndex = value.indexOf(n);
      if (findIndex < 0) {
        // 不存在该选号
        if (this.modelValue.length + 1 <= this.maxOptions) {
          // 没有超过可选限制
          value.push(n);
        }
      } else {
        // 已存在该选号
        value.splice(findIndex, 1);
      }
      this.$emit('update:modelValue', value);
    },
  },
};
</script>

<style lang="less" scoped>
.lucky-zodiac-select {
  display: flex;
  flex-wrap: wrap;
  padding: 0 0 0 3.733vw;

  &__option {
    margin: 0 1.866vw 3.866vw 0;
    width: 13.866vw;
    height: 15.33vw;
    background: url(/src/assets/lucky_zodiac_options_bg.png) no-repeat;
    background-size: 176vw 32vw;
  }
  // @each $option, $times in (option-01, 0), (option-02, 1), (option-03, 2), (option-04, 3), (option-05, 4), (option-06, 5), (option-07, 6), (option-08, 7), (option-09, 8), (option-10, 9),
  //   (option-11, 10), (option-12, 11)
  // {
  //   .lucky-zodiac-select__#{$option} {
  //     background-position: -14.66vw * $times 0;
  //     &--selected {
  //       background-position: -14.66vw * $times -16vw;
  //     }
  //   }
  // }
  .lucky-zodiac-select__option-01 {
    background-position-x: 0;
    &--selected {
      background-position: calc(-14.66vw * 0) -16vw;
    }
  }
  .lucky-zodiac-select__option-02 {
    background-position-x: -14.66vw;
    &--selected {
      background-position: calc(-14.66vw * 1) -16vw;
    }
  }
  .lucky-zodiac-select__option-03 {
    background-position-x: calc(-14.66vw * 2);
    &--selected {
      background-position: calc(-14.66vw * 2) -16vw;
    }
  }
  .lucky-zodiac-select__option-04 {
    background-position: calc(-14.66vw * 3) 0;
    &--selected {
      background-position: calc(-14.66vw * 3) -16vw;
    }
  }
  .lucky-zodiac-select__option-05 {
    background-position: calc(-14.66vw * 4) 0;
    &--selected {
      background-position: calc(-14.66vw * 4) -16vw;
    }
  }
  .lucky-zodiac-select__option-06 {
    background-position: calc(-14.66vw * 5) 0;
    &--selected {
      background-position: calc(-14.66vw * 5) -16vw;
    }
  }
  .lucky-zodiac-select__option-07 {
    background-position: calc(-14.66vw * 6) 0;
    &--selected {
      background-position: calc(-14.66vw * 6) -16vw;
    }
  }
  .lucky-zodiac-select__option-08 {
    background-position: calc(-14.66vw * 7) 0;
    &--selected {
      background-position: calc(-14.66vw * 7) -16vw;
    }
  }
  .lucky-zodiac-select__option-09 {
    background-position: calc(-14.66vw * 8) 0;
    &--selected {
      background-position: calc(-14.66vw * 8) -16vw;
    }
  }
  .lucky-zodiac-select__option-10 {
    background-position: calc(-14.66vw * 9) 0;
    &--selected {
      background-position: calc(-14.66vw * 9) -16vw;
    }
  }
  .lucky-zodiac-select__option-11 {
    background-position: calc(-14.66vw * 10) 0;
    &--selected {
      background-position: calc(-14.66vw * 10) -16vw;
    }
  }
  .lucky-zodiac-select__option-12 {
    background-position: calc(-14.66vw * 11) 0;
    &--selected {
      background-position: calc(-14.66vw * 11) -16vw;
    }
  }
}
</style>
