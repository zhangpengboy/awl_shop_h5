<template>
  <div class="order-detail">
    <div class="order-detail__header">
      <div class="content-top">
        <img :src="srcimg" alt="" />
        <div class="text">
          <div class="title">{{ data.lotteryName }}</div>
          <div class="desc">{{ data.phase }}</div>
        </div>
        <div class="state">
          <template v-if="data.orderStatusInt == 1">
            {{ $t('Diamond.OrderDetail.Ordering') }}
          </template>
          <template v-else-if="data.orderStatusInt == 2">
            <img class="img--wait" src="@/assets/img/wating.png" alt="" />
            {{ $t('Diamond.OrderDetail.Waiting') }}
          </template>
          <template v-else-if="data.orderStatusInt == 3">
            {{ $t('Diamond.OrderDetail.CancelTheOrder') }}
          </template>
          <template v-else-if="data.orderStatusInt == 4">
            <img class="img--fail" src="@/assets/img/nowin_cambodia.png" alt="" />
          </template>
          <template v-else-if="data.orderStatusInt == 6">
            <img class="img--success" src="@/assets/img/win_cambodia.png" alt="" />
          </template>
          <template v-else-if="data.orderStatusInt == 5">
            {{ $t('Diamond.OrderDetail.Awarded') }}
          </template>
          <template v-else-if="data.orderStatusInt == 7">
            {{ $t('Diamond.OrderDetail.PendingReview') }}
          </template>
        </div>
      </div>

      <div class="content-center">
        <div class="content-center__item">
          <div class="title">
            <span class="text">
              {{ data.lotteryAmount ? data.lotteryAmount.toLocaleString() : '' }}
              <div v-if="data.orderStatusInt == 3" class="text__note">{{ $t('Diamond.OrderDetail.Refunded') }}</div>
            </span>
          </div>
          <div class="desc">{{ $t('Diamond.OrderDetail.OrderAmount') }}</div>
        </div>
        <div class="content-center__item">
          <div class="title red">{{ data.winningPrize ? data.winningPrize.toLocaleString() : '' }}</div>
          <div class="desc">{{ $t('Diamond.OrderDetail.PrizeAmount') }}</div>
        </div>
      </div>

      <!-- <div v-if="data.couponDetail" class="content-bottom">
          <div class="desc">优惠详情</div>
          <div class="note">-${{data.couponDetail}}</div>
        </div> -->
    </div>

    <div class="order-detail__body">
      <div class="content-list">
        <div class="content-list__child content-list__child--number">
          <div class="left">{{ $t('Diamond.OrderDetail.Results') }}</div>
          <div class="right" v-html="data.winNumber"></div>
        </div>
        <!-- <div class="content-list__child content-list__child--detail">
          <div class="left">{{ $t('Diamond.OrderDetail.BetDetails') }}</div>
          <div class="right">{{ data.betNumber || '--' }}{{ $t('Diamond.OrderDetail.Bets') }} {{ data.multiple || '--' }}{{ $t('Diamond.OrderDetail.Times') }}</div>
        </div> -->
        <div class="content-list__child content-list__child--table">
          <div class="left mb10">{{ $t('Diamond.OrderDetail.BetDetails') }}</div>
          <table class="table" border="0">
            <thead>
              <tr>
                <th v-if="lottery === '99C1'">{{ $t('play.c3') }}</th>
                <th v-else>{{ $t('Diamond.OrderDetail.Type') }}</th>
                <th style="width: 40%">{{ $t('Diamond.OrderDetail.Selection') }}</th>
                <th>{{ $t('Diamond.OrderDetail.NumberofBets') }}</th>
                <th>{{ $t('msg.a40') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in data.ticketList" :key="index">
                <td v-if="lottery === '99C1' && item.group">{{ item.group }}</td>
                <td v-else>{{ item.playType }}</td>
                <td style="width: 40%" v-html="item.content"></td>
                <td>{{ item.detailBetNumber }}</td>
                <!-- <td>{{ item.betMoney }}</td> -->
                <td>{{ filterMoney(item.betMoney) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- <div class="content-list__child content-list__child--list">
            <div class="left">开奖号码</div>
            <div class="right">
              <div class="item" v-for="item in 20" :key="item">{{item}}</div>
            </div>
          </div>
          <div class="content-list__child content-list__child--detail">
            <div class="left">开奖和值</div>
            <div class="right">802倍</div>
          </div> -->
        <div class="content-list__child content-list__child--msg">
          <div class="left">{{ $t('Diamond.OrderDetail.OrderTime') }}</div>
          <div class="right">{{ data.placeOrderTime }}</div>
        </div>
        <div class="content-list__child content-list__child--msg">
          <div class="left">{{ $t('Diamond.OrderDetail.DrawTime') }}</div>
          <div class="right">{{ data.drawPrizeTime }}</div>
        </div>
        <div class="content-list__child content-list__child--msg">
          <div class="left">{{ $t('Diamond.OrderDetail.OrderID') }}</div>
          <div class="right">{{ data.orderId }}</div>
        </div>
      </div>
    </div>

    <div class="order-detail__note">
      {{ $t('Diamond.OrderDetail.Tips') }}
    </div>

    <div class="order-detail__footer">
      <div class="order-detail__footer__item order-detail__footer__item--left" @click="handleOnBack">
        {{ $t('Gold.LotteryRecord') }}
      </div>
      <div class="order-detail__footer__item order-detail__footer__item--right" @click="handleBet">
        {{ $t('Gold.KeepBetting') }}
      </div>
    </div>
  </div>
</template>

<script>
import User from '@/api/user';
import lance from '@/utils/lance';
import sixDKlaKlouk_order from '@/assets/img/lottery/6DKlaKlouk_order.png';
import sixDLuckyZodiac_order from '@/assets/img/lottery/6DLuckyZodiac_order.png';
import sixDSpecialZodiac_order from '@/assets/img/lottery/6DSpecialZodiac_order.png';
import mark1choose99 from '@/assets/img/mark1choose99.png';

export default {
  name: 'OrderDetail',
  beforeRouteEnter(to, from, next) {
    console.log(to);
    console.log(from.name);
    next((vm) => {
      console.log(vm);
      vm.pathName = from.name;
    });
    // if (from.name === 'recordofpurchase') {

    // }
  },
  data() {
    return {
      data: {},
      orderId: '',
      lottery: '',
      locale: lance.getData('lang'),
      pathName: '',
    };
  },
  computed: {
    srcimg() {
      const map = {
        fish: sixDKlaKlouk_order,
        animal: sixDLuckyZodiac_order,
        '49C6': sixDSpecialZodiac_order,
        '99C1': mark1choose99,
      };
      // console.log(map[this.lottery]);
      return map[this.lottery];
    },
  },
  created() {
    this.orderId = this.$route.query.orderId;
    this.lottery = this.$route.query.lottery;
  },
  mounted() {
    this.getData();
  },
  methods: {
    filterMoney(item) {
      return lance.filterMoney(item);
    },
    getData() {
      User.detail({
        appInfo: {},
        data: {
          orderId: this.orderId,
          orderType: 'normal',
        },
      })
        .then((res) => {
          this.data = res.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 购彩记录
    handleOnBack() {
      this.$router.push({
        path: '/reportForms/recordofpurchase',
        query: {
          orderId: this.orderId,
          orderType: 'normal',
        },
      });
    },
    handleBet() {
      console.log(this.pathName);
      // if (this.pathName === 'recordofpurchase') {
      //   const map = {
      //     fish: '/klaKlouk',
      //     animal: '/luckyZodiac',
      //     '49C6': '/specialZodiac',
      //     '99C1': '/mark1choose99',
      //   };
      //   this.$router.push(map[this.lottery]);
      // } else {
      //   this.$router.go(-1);
      const map = {
        fish: '/klaKlouk',
        animal: '/luckyZodiac',
        '49C6': '/specialZodiac',
        '99C1': '/mark1choose99',
      };
      this.$router.push(map[this.lottery]);
      // }
    },
  },
};
</script>

<style lang="scss" scoped>
.mb10 {
  margin-bottom: 10px;
}
.red {
  font-size: 32px !important;
  color: red;
  font-weight: 700;
}
.order-detail {
  &__header {
    .content-top {
      height: 128px;
      background: #fff;
      padding: 20px 42px 24px 28px;
      display: flex;
      border-bottom: 1px solid #f7f7f7;

      > img {
        width: 112px;
        height: 112px;
      }

      .text {
        flex: 1;
        margin-left: 28px;

        .title {
          margin-top: 16px;
          font-size: 32px;
          line-height: 36px;
          color: #333333;
        }

        .desc {
          margin-top: 14px;
          font-size: 28px;
          line-height: 36px;
          color: #666666;
        }
      }

      .state {
        display: flex;
        align-items: center;
        font-size: 30px;
        line-height: 36px;
        color: #333333;

        .img {
          &--wait {
            margin-right: 14px;
            width: 32px;
          }

          &--success {
            width: 158px;
            height: 128px;
          }

          &--fail {
            width: 158px;
            height: 128px;
          }
        }
      }
    }

    .content-center {
      background: #fff;
      display: flex;
      padding: 32px 0;

      &__item {
        width: 50%;
        text-align: center;

        &:nth-of-type(1) {
          border-right: 1px solid #ececec;
        }

        .title {
          .text {
            font-size: 38px;
            line-height: 36px;
            color: #000000;
            position: relative;

            &__note {
              top: 0;
              position: absolute;
              left: 100%;
              background: #fa3333;
              font-size: 24px;
              width: 100px;
              border-radius: 0 0 20px 0;
              color: #fff;
            }
          }
        }

        .desc {
          margin-top: 20px;
          font-size: 28px;
          line-height: 36px;
          color: #666666;
        }
      }
    }

    .content-bottom {
      background: #fff;
      display: flex;
      padding: 20px 30px 24px;
      border-top: 1px solid #f7f7f7;

      .desc {
        font-size: 30px;
        color: #666666;
      }

      .note {
        text-align: right;
        flex: 1;
        font-size: 30px;
        color: #666666;
      }
    }
  }

  &__body {
    background: #fff;
    margin-top: 20px;

    .content-list {
      &__child {
        border-bottom: 1px solid #f7f7f7;
        font-size: 30px;
        line-height: 36px;

        &:nth-last-of-type(1) {
          border: 0;
        }

        &--number {
          padding: 20px 32px;
          display: flex;

          .left {
            color: #666;
            margin-right: 30px;
          }

          .right {
            flex: 1;
            color: #033;
          }
        }

        &--detail {
          padding: 20px 32px;
          display: flex;

          .left {
            color: #666;
            margin-right: 30px;
          }

          .right {
            flex: 1;
            color: #333;
          }
        }

        &--table {
          padding: 34px 32px;

          .table {
            width: 100%;
            border-collapse: collapse;

            th {
              color: #333;
              background: #f7f7f7;
              height: 60px;
              border: 1px solid #efefef;
              font-weight: normal;
              vertical-align: middle !important;
            }

            td {
              height: 60px;
              text-align: center;
              background: #fff;
              color: #666;
              border: 1px solid #efefef;
              word-break: break-word;
              line-height: 60px;
            }
          }
        }

        &--list {
          padding: 22px 32px 42px 30px;
          display: flex;
          align-items: flex-start;

          .left {
            color: #666;
            margin-right: 30px;
          }

          .right {
            display: grid;
            flex: 1;
            grid-template-columns: 60px 60px 60px 60px 60px;
            grid-template-rows: 60px 60px 60px 60px;
            grid-gap: 18px 28px;

            .item {
              border-radius: 50%;
              line-height: 60px;
              text-align: center;
              color: #fff;
              font-size: 28px;
              background: #ff090b;
            }
          }
        }

        &--msg {
          display: flex;
          padding: 20px 32px;

          .left {
            color: #999;
            margin-right: 30px;
          }

          .right {
            flex: 1;
            font-size: 28px;
            color: #999;
          }
        }
      }
    }
  }

  &__note {
    padding: 12px 30px 160px;
    font-size: 26px;
    line-height: 36px;
    color: #999999;
  }

  &__footer {
    width: 100%;
    position: fixed;
    // left:0;
    // right:0;
    bottom: 0;
    display: flex;
    box-shadow: 0px -2px 10px #dedede;

    &__item {
      flex: 1;
      height: 88px;
      line-height: 88px;
      text-align: center;
      font-size: 32px;

      &--left {
        background: #fff;
        color: #ef8632;
      }

      &--right {
        background: linear-gradient(90deg, #f09a4e, #ec643c);
        color: #ffffff;
      }
    }
  }
}
</style>
