<template>
  <div class="play-explain">
    <div class="content">
      <div class="play">
        <p class="title">{{ $t('msg.a39', { lotteryName: lotteryName[lotteryId] }) }}</p>
        <template v-if="lotteryId === 'fish'">
          <div class="titleBox">
            <span>{{ $t('play.a15') }}</span>
          </div>
          <div class="desc">
            <p>{{ $t('play.y1') }}</p>
          </div>
          <div class="smallTitle">
            <p>
              <span class="black">{{ $t('play.y2') }}</span>
              {{ $t('play.y3') }}
            </p>
            <p>{{ $t('play.y4') }}</p>
            <p>{{ $t('play.y5') }}</p>
            <p>{{ $t('play.y6') }}</p>
          </div>
          <div class="smallTitle">
            <p>
              <span class="black">{{ $t('play.y7') }}</span>
              {{ $t('play.y8') }}
            </p>
            <p>{{ $t('play.y9') }}</p>
          </div>
        </template>
        <template v-if="lotteryId === 'animal'">
          <div class="titleBox">
            <span>{{ $t('play.z1') }}</span>
          </div>
          <div class="desc">
            <p>{{ $t('play.z2') }}</p>
          </div>
          <div class="desc">
            <p>{{ $t('play.z3') }}</p>
          </div>
          <div class="titleBox">
            <span>{{ $t('play.z6') }}</span>
          </div>
          <div class="desc">
            <p>{{ `${$t('play.z7')}： ${$t('play.z8')}、${$t('play.z9')}、${$t('play.z10')}、${$t('play.z11')}` }}</p>
            <p>{{ `${$t('play.z12')}： ${$t('play.z13')}、${$t('play.z14')}、${$t('play.z15')}、${$t('play.z16')}` }}</p>
            <p>{{ `${$t('play.z17')}： ${$t('play.z18')}、${$t('play.z19')}、${$t('play.z20')}、${$t('play.z21')}` }}</p>
          </div>
        </template>
        <template v-if="lotteryId === '49C6'">
          <div class="titleBox">
            <span>{{ $t('play.m1') }}</span>
          </div>
          <div class="desc">
            <p>{{ $t('play.m2') }}</p>
          </div>
          <div class="desc">
            <p>{{ $t('play.m3') }}</p>
          </div>
          <div>
            <table class="table1">
              <tr v-for="(item, index) in tableArr1" :key="index">
                <td v-for="(items, indexs) in item" :key="indexs">{{ indexs === 0 ? $t(items) : items }}</td>
              </tr>
            </table>
          </div>
          <div class="desc">
            <p>{{ $t('play.m7') }}</p>
          </div>
          <div class="desc">
            <p>{{ $t('play.m8') }}</p>
          </div>
          <div class="desc">
            <p>{{ $t('play.m9') }}</p>
          </div>
          <div class="desc">
            <p>{{ $t('play.m10') }}</p>
          </div>
          <div class="desc">
            <p>{{ $t('play.m11') }}</p>
          </div>
          <div class="desc">
            <p>{{ $t('play.m12') }}</p>
          </div>
          <div class="desc">
            <p>{{ $t('play.m13') }}</p>
          </div>
        </template>
        <template v-if="lotteryId === '99C1'">
          <div class="titleBox">
            <span>{{ $t('play.a15') }}</span>
          </div>
          <div class="desc">
            <p>{{ $t('play.c1') }}</p>
          </div>
          <div class="group">
            <p class="group-label">{{ $t('play.c3') }}</p>
            <div v-for="item in group" :key="item.title" class="group-value">
              <p class="item">{{ item.title }}</p>
              <p class="value">{{ item.desc }}</p>
            </div>
          </div>
          <div class="desc">
            <p>{{ $t('play.c2') }}</p>
          </div>
        </template>
        <div class="titleBox mt30">
          <span>{{ $t('play.a7') }}</span>
        </div>
        <div class="desc">
          <p>{{ lotteryId === '49C6' ? $t('play.a20a') : $t('play.a20c') }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const $route = useRoute();
const lotteryId = ref('');
const lotteryName = ref({
  animal: '6D Lucky Zodiac',
  fish: '6D KLA KLOUK',
  '49C6': '6D Special Zodiac',
  '99C1': '6D ឆ្នោតឡូតូ 1/99',
});
const group = reactive([
  { title: 'A', desc: '18' },
  { title: 'B', desc: '26' },
  { title: 'C', desc: '01' },
  { title: 'D', desc: '28' },
  { title: 'E', desc: '40' },
]);
const tableArr1 = ref([
  ['play.m4', '15 30 02 18 20 33'],
  ['play.m5', '31'],
]);
onMounted(() => {
  lotteryId.value = $route.query.lotteryId;
});
</script>

<style lang="less" scoped>
.table1 {
  overflow: hidden;
  margin: 0 auto;
  margin: 20px auto 36px;
  width: 100%;
  text-align: center;
  border-collapse: collapse;
  > tr {
    height: 68px;
    line-height: 68px;
    td {
      font-size: 26px;
      font-weight: 400;
      border: 1px solid #edeeef;
      color: #333333;
      line-height: 68px;
      &:nth-child(1) {
        width: 188px;
        background: #f6f7f8;
      }
      &:nth-child(2) {
        text-align: left;
        text-indent: 106px;
      }
    }
  }
}
.mt30 {
  margin-top: 30px;
}
.title {
  margin-bottom: 30px;
  font-size: 36px;
  font-weight: 700;
}
.play-explain {
  padding-top: 0.28rem;
  height: 100%;
  text-align: left;
  background: #ffffff;
  box-sizing: border-box;
  .content {
    .play {
      margin-top: 10px;
      padding: 24px 30px;
      width: 100%;
      box-sizing: border-box;
      .titleBox {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        min-height: 46px;
        line-height: 46px;
        span {
          position: relative;
          height: 40px;
          font-size: 32px;
          font-family: PingFang SC;
          font-weight: 700;
          color: #333333;
          background: linear-gradient(to bottom, white 0%, white 50%, rgba(240, 69, 29, 0.39) 51%, rgba(240, 69, 29, 0.39) 100%);
          line-height: 0.46rem;
        }
      }
      .desc {
        margin: 26px 0;
        p {
          min-height: 46px;
          font-size: 26px;
          font-family: PingFangSC-Regular;
          line-height: 46px;
          color: #666666;
        }
      }
      .smallTitle {
        margin-top: 24px;
        font-size: 26px;
        font-family: PingFangSC-Regular;
        line-height: 42px;
        color: #666666;
      }
      .group {
        display: flex;
        align-items: flex-start;
        margin: 26px 0;
        .group-label {
          font-size: 30px;
          font-weight: 700;
          color: #333333;
        }
        .group-value {
          margin: 0 16px;
          text-align: center;
          .item {
            margin-bottom: 20px;
            font-size: 32px;
            font-weight: 700;
            color: #333333;
          }
          .value {
            width: 54px;
            height: 54px;
            font-size: 32px;
            border-radius: 50%;
            text-align: center;
            color: #fff;
            background: #f03212;
            line-height: 54px;
          }
        }
      }
    }
  }
}
.black {
  font-size: 26px;
  font-family: PingFangSC-Regular;
  font-weight: 700;
  color: #333333;
  line-height: 42px;
}
</style>
