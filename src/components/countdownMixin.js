export default {
  i18n: {
    messages: {
      cn: {
        opening: '开奖中',
        waiting: '待开奖',
        end: '本期截止!',
        lastPhaseText: '第{lastPhaseNo}期 开奖',
        endTimeText: '{currentPhaseNo}投注截止',
      },
      en: {
        opening: 'កំពុងចាប់រង្វាន់',
        waiting: 'រង់ចាំចេញលទ្ធផល ',
        end: 'End',
        lastPhaseText: 'Draw results of issue {lastPhaseNo}',
        endTimeText: 'End time of issue {currentPhaseNo}',
      },
      cambodia: {
        opening: 'កំពុងចាប់រង្វាន់',
        waiting: 'រង់ចាំចេញលទ្ធផល ',
        end: 'បញ្ចប់',
        lastPhaseText: 'លទ្ធផលរង្វាន់វគ្គទី {lastPhaseNo}',
        endTimeText: '{currentPhaseNo}ម៉ោងបញ្ចប់នៃការភ្នាល់',
      },
    },
  },
  props: {
    isFirst: {
      // 是否是刚进入页面
      type: Boolean,
    },
    isWaiting: {
      // 是否显示待开奖
      type: Boolean,
    },
    isRotating: Boolean, // 转盘是否正在旋转
    currentPhaseNo: String, // 当前奖期号码
    remainingTime: Number, // 剩余时间
  },
  data() {
    return {
      remain: null,
      remainFormat: 0,
      interval: null,
    };
  },
  mounted() {
    console.log('endTimeText', this.$t('endTimeText'));
    this.setCountdownInterval();
  },
  watch: {
    remainingTime() {
      this.setCountdownInterval();
    },
    isRotating(val) {
      // console.log(val,9090)
    },
  },
  beforeDestroy() {
    if (this.interval) {
      // console.log(`${this.$options.name}: clear interval beforeDestroy`)
      clearInterval(this.interval);
    }
  },
  methods: {
    setCountdownInterval() {
      if (this.interval) {
        // console.log(`${this.$options.name}: clear interval`)
        clearInterval(this.interval);
      }

      this.remain = this.remainingTime;

      this.remainFormat = this.getRemainFormat();

      this.lastDate = new Date(); // 记录开始时间
      // console.log(`${this.$options.name}: set interval`)
      this.interval = setInterval(() => {
        // 计算剩余时间，减去经过的时间
        this.remain -= new Date() - this.lastDate;
        this.$emit('remaining-time-change', this.remain);

        if (this.remain > 0) {
          this.lastDate = new Date();

          this.remainFormat = this.getRemainFormat();
        } else {
          // console.log(`${this.$options.name}: clear interval`)
          clearInterval(this.interval);
          this.$emit('countdown-end');
        }
      }, 1000);
    },
    getRemainFormat() {
      const h = Math.floor(this.remain / 1000 / 60 / 60).toString();
      const m = Math.floor((this.remain / 1000 / 60) % 60).toString();
      const s = Math.floor((this.remain / 1000) % 60).toString();
      const hh = h.length < 2 ? `0${h}` : h;
      const mm = m.length < 2 ? `0${m}` : m;
      const ss = s.length < 2 ? `0${s}` : s;

      return `${(h > 0 ? `${hh} : ` : '') + mm} : ${ss}`;
    },
  },
};
