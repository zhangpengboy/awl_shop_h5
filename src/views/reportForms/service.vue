<template>
  <div class="service">
    <van-nav-bar :title="$t('reportForms.a81')" left-arrow @click-left="back" />
    <div class="hotline">
      <div class="header">
        <img src="@/assets/img/reportForms/hotline_service.png" alt="Hotline Service" />
        <div class="text">
          <h2>{{ $t('reportForms.a121') }}</h2>
          <p>8:00AM~11:59PM</p>
        </div>
      </div>
      <ul class="hotline__list">
        <li class="item">
          <a class="content tel" href="tel:0967275213">
            <img class="icon" src="@/assets/img/reportForms/logo_Smart.png" alt="Smart" />
            <div>
              <strong>Smart</strong>
              <span>0967275213</span>
            </div>
            <img class="call-button" src="@/assets/img/reportForms/call.png" alt="call" />
          </a>
        </li>
        <li class="item">
          <a class="content tel" href="tel:078726225">
            <img class="icon" src="@/assets/img/reportForms/logo_Cellcard.png" alt="Cellcard" />
            <div>
              <strong>Cellcard</strong>
              <span>078726225</span>
            </div>
            <img class="call-button" src="@/assets/img/reportForms/call.png" alt="call" />
          </a>
        </li>
        <li class="item">
          <a class="content tel" href="tel:0716383111">
            <img class="icon" src="@/assets/img/reportForms/logo_Metfone.png" alt="Metfone" />
            <div>
              <strong>Metphone</strong>
              <span>0716383111</span>
            </div>
            <img class="call-button" src="@/assets/img/reportForms/call.png" alt="call" />
          </a>
        </li>
        <li class="item">
          <div class="content copy">
            <img class="icon" src="@/assets/img/reportForms/logo_Facebook.png" alt="Facebook" />
            <div>
              <strong>{{ $t('reportForms.a122') }}</strong>
              <a class="blue" href="https://www.facebook.com/asianwelfarelottery">www.facebook.com/asianwelfarelottery</a>
            </div>
            <span class="copy-button" @click="gocopy('https://www.facebook.com/asianwelfarelottery')">go</span>
          </div>
        </li>
        <li class="item">
          <div class="content copy">
            <img class="icon" src="@/assets/img/reportForms/logo_Telegram.png" alt="Facebook" />
            <div>
              <strong>{{ $t('reportForms.a123') }}</strong>
              <a class="blue" href="https://t.me/asialottofanpage">https://t.me/asialottofanpage</a>
            </div>
            <span class="copy-button" @click="gocopy1('https://t.me/asialottofanpage')">go</span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import bottom from '@/assets/img/reportForms/bottom.png';
import iconDelete from '@/assets/img/reportForms/iconDelete.png';

export default {
  name: 'Service',

  setup() {
    const { t } = useI18n();
    const $router = useRouter();
    const state = reactive({
      bottom,
      iconDelete,
      money: null,
    });
    const back = () => {
      $router.back();
    };
    const gocopy = (url) => {
      window.location.href = url;
    };
    const gocopy1 = (url) => {
      window.open(url, '_blank');
    };
    onMounted(() => {
      console.log('onMounted');
    });
    return {
      state, // 状态
      t,
      gocopy,
      gocopy1,
      back, // 返回
    };
  },
};
</script>

<style lang="less" scoped>
.service {
  height: 100vh;
  width: 100vw;
  background: #f6f6f6;
  color: #000;
  :deep(.van-nav-bar__content) {
    height: 87px;
  }
  .hotline {
    padding: 30px;
    .header {
      display: flex;
      > img {
        width: 40%;
        height: 100%;
      }
      .text {
        display: flex;
        flex-direction: column;
        justify-content: center;
        h2 {
          font-size: 33px;
          color: #222222;
          margin: 0 0 12px 0;
        }
        p {
          font-size: 28px;
          color: #9e9e9e;
        }
      }
    }
    .item {
      margin-bottom: 20px;
      background: #ffffff;
      border-radius: 20px;
      .icon {
        display: block;
        width: 84px;
        height: 84px;
        margin-right: 20px;
      }
      .content {
        display: flex;
        align-items: center;
        padding-left: 30px;
        .blue {
          color: blue !important;
          text-decoration: underline;
        }
      }
      .tel {
        div {
          flex-grow: 1;
          strong {
            font-weight: normal;
            margin-right: 30px;
            font-size: 32px;
            color: #222;
          }
          span {
            color: #9e9e9e;
            font-size: 30px;
          }
        }
      }
      .copy {
        div {
          flex-grow: 1;
          strong {
            font-weight: normal;
            display: block;
            margin-right: 0;
            font-size: 32px;
            line-height: 44px;
          }
          p {
            font-size: 26px;
            color: #9e9e9e;
            line-height: 40px;
          }
          em {
            font-style: normal;
            color: #4a33fd;
          }
        }
      }
    }
    .call-button {
      width: 100px;
      height: 100px;
    }
    .copy-button {
      background: #9eca74;
      width: 100px;
      height: 140px;
      line-height: 140px;
      border-radius: 20px;
      font-size: 28px;
      color: #ffffff;
      text-align: center;
    }
  }
}
</style>
