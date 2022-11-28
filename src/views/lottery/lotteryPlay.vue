<template>
  <div class="how-to-play">
    <ul>
      <li v-for="item in videoList" :key="item.id">
        <div :data-video-id="item.id" class="how-to-play__video-wrapper">
          <!--
          <iframe
              ref="iframe"
              width="100%"
              height="100%"
              :src="'https://www.youtube.com/embed/' + video.id + '?origin=http://13.229.25.246'"
              title="YouTube video player"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen>
          </iframe>
          -->
        </div>
        <p>{{ item.title }}</p>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'LotteryPlay',
  data() {
    return {
      data: {},
      video: '',
      videoList: [],
      videoLists: {
        HowToPlay: [
          {
            id: 'QmxTsAq3ExE',
            title: this.$t('HowToPlay.howToBet6D'),
          },
          {
            id: 'cY94c9pq86Y',
            title: this.$t('HowToPlay.howToPlayHappy6D'),
          },
          {
            id: 'wdpDsEcjgK4',
            title: this.$t('HowToPlay.howToBet6Dspecial'),
          },
          {
            id: 'yU7_rb7BY14',
            title: this.$t('HowToPlay.howToPlay5D'),
          },
          {
            id: 'X6RMOptWInk',
            title: this.$t('HowToPlay.FootballMulti'),
          },
          {
            id: 'DKZBbS2U0Mw',
            title: this.$t('HowToPlay.FootballSingle'),
          },
          {
            id: 'xtfuPKjwRg0',
            title: this.$t('HowToPlay.howToTopUp'),
          },
          {
            id: 'Hjpu1XI4S9g',
            title: this.$t('HowToPlay.howToWithdraw'),
          },
          {
            id: '3uAZyfXUDPc',
            title: this.$t('HowToPlay.KlaKlouk'),
          },
          {
            id: 'uzYagyDuV9M',
            title: this.$t('HowToPlay.howToRegister'),
          },
        ],
        '6DLuckyZodiac/HowToPlay': [
          {
            id: 'QmxTsAq3ExE',
            title: this.$t('HowToPlay.howToBet6D'),
          },
        ],
        'Happy6D/HowToPlay': [
          {
            // id: 'cY94c9pq86Y',
            id: '65HbyTRhZRE',
            title: this.$t('HowToPlay.howToPlayHappy6D'),
          },
        ],
        '6DSpecialZodiac/HowToPlay': [
          {
            id: 'wdpDsEcjgK4',
            title: this.$t('HowToPlay.howToBet6Dspecial'),
          },
        ],
        '5D/HowToPlay': [
          {
            id: 'yU7_rb7BY14',
            title: this.$t('HowToPlay.howToPlay5D'),
          },
        ],
        'FootballMulti/HowToPlay': [
          {
            id: 'X6RMOptWInk',
            title: this.$t('HowToPlay.FootballMulti'),
          },
        ],
        'FootballSingle/HowToPlay': [
          {
            id: 'DKZBbS2U0Mw',
            title: this.$t('HowToPlay.FootballSingle'),
          },
        ],
        '6DKlaKlouk/HowToPlay': [
          {
            id: '3uAZyfXUDPc',
            title: this.$t('HowToPlay.howToPlay6DKlaKlouk'),
          },
        ],
        'mark49/HowToPlay': [
          {
            id: 'ZmxtOg7oJ30',
            title: '',
          },
        ],
        'mark99/HowToPlay': [
          {
            id: 'gkP_0qmfdXs',
            title: '',
          },
        ],
        'nv5d/HowToPlay': [
          {
            id: 'PMpy-m0bJBE',
            title: '',
          },
        ],
        'sv5d/HowToPlay': [
          {
            id: '87pdjlKGpqg',
            title: '',
          },
        ],
      },
    };
  },
  mounted() {
    console.log('this.$route.query', this.$route.query);
    this.video = this.$route.query.videoId;
    console.log(this.video);
    this.videoList = this.videoLists[this.video];

    const that = this;
    // iframe会引起android webview加载过久，原因未明，故在此处先将messenger iframe脚本执行延迟
    setTimeout(() => {
      document.querySelectorAll('.how-to-play__video-wrapper').forEach((wrapper) => {
        wrapper.appendChild(that.createVideo(wrapper.dataset.videoId));
      });
    }, 1000);
  },
  beforeUnmount() {
    document.querySelectorAll('.how-to-play__video-wrapper').forEach((wrapper) => {
      wrapper.removeChild(document.querySelector('iframe'));
    });
  },
  methods: {
    createVideo(videoId) {
      const iframe = document.createElement('iframe');
      iframe.setAttribute('src', `https://www.youtube.com/embed/${videoId}?origin=https://www.lotteryasian.club`);
      iframe.setAttribute('width', '100%');
      iframe.setAttribute('height', '100%');
      iframe.setAttribute('title', 'YouTube video player');
      iframe.setAttribute('frameborder', '0');
      iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
      iframe.setAttribute('allowfullscreen', 'allowfullscreen');
      iframe.setAttribute('style', 'position: absolute; left: 0; top: 0;');
      return iframe;
    },
  },
};
</script>

<style lang="less" scoped>
.how-to-play {
  padding-top: 30px;
  background-color: #f7f7f7;
  li {
    margin: 11px 8px;
    background-color: #fff;
    box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.06);
  }
  &__video-wrapper {
    position: relative;
    padding-top: 56.25%;
    width: 100%;

    iframe {
      position: absolute;
      top: 0;
      left: 0;
    }
  }
  p {
    display: flex;
    align-items: center;
    padding-left: 12px;
    height: 50px;
  }
}
</style>
