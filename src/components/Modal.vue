<template>
  <div class="modal-wrap">
    <transition name="fade">
      <div v-if="modalVisible" class="modal_bg"></div>
    </transition>
    <div class="ticket" :style="{ transform: modalVisible ? 'translate3d(0,0,0)' : 'translate3d(0,100%,0)' }">
      <div class="ticket__toolbar" @click="back()"></div>
      <div class="ticket__tab">
        <div class="tab-item" :class="{ active: index == 0 }" @click="tab(0)">{{ $t('goldBet.thisIssue') }}</div>
        <div class="tab-item" :class="{ active: index == 1 }" @click="tab(1)">{{ $t('goldBet.history') }}</div>
      </div>
      <div class="ticket__content">
        <div ref="content" class="content-wrap">
          <div ref="list" class="content-list">
            <div v-for="(item, i) in list" :key="i" class="content-list__item" @click="next(item.orderId)">
              <!-- <div class="ticket-time">
                    <div class="date">{{item.date}}</div>
                    <div class="time">{{item.time}}</div>
                  </div> -->
              <div class="ticket-msg">
                <div class="number">{{ item.phase }}</div>
                <div class="price">{{ item.animalBetNumber }}</div>
              </div>
              <div class="ticket-state">
                <div class="state">
                  {{
                    item.orderStatusInt == 2
                      ? $t('goldBet.wait')
                      : item.orderStatusInt == 3
                      ? $t('Diamond.OrderDetail.CancelTheOrder')
                      : item.orderStatusInt == 4
                      ? $t('goldBet.nowin')
                      : item.orderStatusInt == 5
                      ? $t('goldBet.win') + item.winAmount + '៛'
                      : item.orderStatusInt == 6
                      ? $t('goldBet.award') + item.winAmount + '៛'
                      : item.orderStatusInt == 7
                      ? $t('goldBet.noaward') + item.winAmount + '៛'
                      : ''
                  }}
                </div>
                <div class="next">{{ $t('goldBet.Purchased') }} {{ item.buyAmount }}៛</div>
              </div>
            </div>
          </div>
          <div v-show="loading" class="loading"><van-loading size="24px" />&nbsp;{{ $t('Diamond.HistoricalLottery.gettingData') }}</div>
          <div v-show="!list.length && !loading" class="noData">
            <img class="noData-img" src="@/assets/img/lottery/nodata.png" alt="" />
            <p class="noData-text">{{ $t('goldBet.noData') }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import User from '@/api/user';

export default {
  name: 'Modal',
  props: {
    modalVisible: {
      type: Boolean,
      default: false,
    },
    lotteryId: {
      type: String,
      default: 'animal',
    },
    issueId: {
      type: String,
      default: '',
    },
  },
  emits: ['next', 'back', 'getListLength'],
  data() {
    return {
      index: 0,
      list: [],
      searchTime: 0,
      orderStatus: 2,
      page: 1,
      loading: false,
      reload: true,
    };
  },
  watch: {
    modalVisible(newVal) {
      if (newVal) {
        this.list = [];
        this.index = 0;
        this.page = 1;
        this.orderStatus = 1;
        this.getMoreData();
      }
    },
  },
  mounted() {
    this.$refs.content && this.$refs.content.addEventListener('scroll', this.getMoreData);
  },
  methods: {
    tab(index) {
      this.$refs.content.removeEventListener('scroll', this.getMoreData);
      this.index = index;
      this.list = [];
      this.reload = true;
      if (index) {
        this.page = 1;
        this.orderStatus = 0;
      } else {
        this.orderStatus = 1;
        this.page = 1;
      }
      this.getMoreData();
    },

    back() {
      this.$emit('back'); // 隐藏modal
    },

    next(orderId) {
      // this.back();
      this.$emit('next', {
        orderId,
      }); // 点击跳转详情
    },

    getMoreData() {
      const { clientHeight } = this.$refs.content;
      const { scrollTop } = this.$refs.content;
      const list_offsetHeight = this.$refs.list.offsetHeight;
      console.log(clientHeight, scrollTop, list_offsetHeight);
      if (clientHeight + scrollTop >= list_offsetHeight - 30 || this.reload) {
        if (this.loading) {
          return;
        }
        this.loading = true;
        User.list({
          appInfo: {},
          data: {
            currentPage: this.page,
            pageNumber: 20,
            orderStatus: this.orderStatus,
            searchTime: this.searchTime,
            orderType: 'normal',
            lotteryId: this.lotteryId,
            phase: this.index === 0 ? this.issueId : '',
          },
        })
          .then((res) => {
            this.page++;
            this.list = [...this.list, ...res.data.data];
            this.orderStatus === 1 && this.$emit('getListLength', this.list.length);
            if (this.list.length === 0) {
              this.$refs.content.removeEventListener('scroll', this.getMoreData);
              return;
            }
            if (this.list.length === res.data.totalNumber) {
              this.$refs.content.removeEventListener('scroll', this.getMoreData);
              console.log('没了');
              return;
            }

            this.$refs.content && this.$refs.content.addEventListener('scroll', this.getMoreData);
          })
          .finally(() => {
            this.loading = false;
            // this.reload = false;
            // this.modalVisible = false
          });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

.modal_bg {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 99;
  overflow: hidden;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  transition: all 0.3s;
}

.ticket {
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 99;
  display: flex;
  width: 100%;
  height: 50vh;
  background: url('/src/assets/modal_bg.png') no-repeat top center;
  background-size: cover;
  transition: all 0.3s;
  transform: translate3d(0, 100%, 0);
  flex-direction: column;

  &__toolbar {
    display: flex;
    height: 8vh;
  }

  &__tab {
    display: flex;
    margin: 0 20px 0;

    .tab-item {
      position: relative;
      margin: 0 2px;
      height: 5vh;
      font-size: 15px;
      text-align: center;
      color: #333;
      color: #72bffe;
      background: url('/src/assets/modal_tab.png') no-repeat center;
      background-size: 100% 100%;
      flex: 1;
      line-height: 5vh;

      &.active {
        color: #e2f5ff;
        background: url('/src/assets/modal_tab_active.png') no-repeat center;
        background-size: 100% 100%;
      }
    }
  }

  &__content {
    flex: 1;
    position: relative;

    .content-wrap {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      overflow-y: scroll;
      -webkit-overflow-scrolling: touch;

      .content-list {
        margin: 10px;

        &__item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 1vw;
          padding: 2vw 1vw;
          height: 7vh;
          background: url('/src/assets/modal_list.png') no-repeat center;
          background-size: 100% 100%;
          box-sizing: border-box;

          .ticket-time {
            width: 18%;
            font-size: 13px;
            text-align: center;
            color: #fff;
          }

          .ticket-msg {
            // display: -webkit-box;
            // -webkit-box-orient: vertical;
            // -webkit-line-clamp: 1;
            overflow: hidden;
            padding-right: 10px;
            padding-left: 10px;
            font-size: 13px;
            text-align: left;
            color: #fff;
            flex: 1;
            .number {
              height: 3vw;
              font-size: 12px;
              line-height: 3vw;
            }
            .price {
              display: -webkit-box;
              overflow: hidden;
              margin-top: 8px;
              width: 100%;
              height: 3vw;
              font-size: 14px;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 1;
              line-height: 3vw;
            }
          }

          .ticket-state {
            padding-right: 10px;
            text-align: right;
            box-sizing: border-box;

            .state {
              margin-bottom: 8px;
              // line-height: 20px;
              padding-right: 20px;
              font-size: 14px;
              color: #fecf00;
            }

            .next {
              padding-right: 20px;
              height: 3.5vw;
              font-size: 13px;
              color: #fff;
              background: url('/src/assets/next-btn.png') no-repeat center right;
              background-size: contain;
              line-height: 3.5vw;
            }
          }
        }
      }

      .loading {
        padding: 50px 65px;
        text-align: center;
        color: #fff;
        background: url('/src/assets/img/lottery/loading.png') no-repeat center;
      }

      .noData {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        &-img {
          width: 62px;
          height: 81px;
          margin-top: 30px;
        }
        &-text {
          font-size: 14px;
          color: #fff;
          margin: 10px;
          text-align: center;
        }
      }
    }
  }
}
</style>
