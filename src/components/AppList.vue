<template>
  <div ref="content" class="list-content">
    <template v-if="list.length">
      <div ref="list">
        <slot></slot>
      </div>
      <div v-show="loadingShow" class="loading"><van-loading size="24px" />&nbsp;{{ $t('appList.gettingData') }}</div>
    </template>
    <app-no-data v-show="noDataShow" :value="noDataText"></app-no-data>
  </div>
</template>

<script>
import AppNoData from '@/components/AppNoData.vue';

export default {
  name: 'AppList',
  components: {
    AppNoData,
  },
  // top:列表至顶部toolbar的距离，例：列表与toolbar之间存在tab栏的情况，没有不传
  // list:列表数据
  // loadingShow 底部loading开关
  // noDataShow 缺省页开关
  // noDataShow 缺省页显示文本
  // disable_pullhook 下拉刷新开关，true关闭 false开启
  props: {
    top: {
      type: String,
      default: '',
    },
    list: {
      type: Array,
      default() {
        return [];
      },
    },
    loadingShow: Boolean,
    noDataShow: Boolean,
    noDataText: {
      type: String,
      default() {
        return '';
      },
    },
    disablePullhook: { default: false, type: Boolean },
  },
  emits: ['getDataList', 'getMoreData'],
  data() {
    return {
      state: 'initial',
    };
  },
  mounted() {
    this.addEventListener();
    this.$refs.content.style.setProperty('--top', this.top ?? '0px');
  },
  methods: {
    loadItem(done) {
      // 下拉刷新
      this.$emit('getDataList', done); // 父组件请求列表数据接口
    },
    getMoreData() {
      // 触底
      if (this.loadingShow === true) {
        return false;
      }
      const { clientHeight } = this.$refs.content;
      const { scrollTop } = this.$refs.content;
      const list_offsetHeight = this.$refs.list.offsetHeight;
      const pull_hook_height = this.$refs.pull_hook ? this.$refs.pull_hook.$el.clientHeight : 0; // 下拉刷新组件的高度
      // console.log(clientHeight,pull_hook_height,scrollTop,clientHeight+scrollTop-pull_hook_height,list_offsetHeight);
      if (clientHeight + scrollTop - pull_hook_height >= list_offsetHeight - 30) {
        this.$emit('getMoreData'); // 父组件请求更多数据
      }
    },
    addEventListener() {
      this.$refs.content.addEventListener('scroll', this.getMoreData);
    },
    removeEventListener() {
      this.$refs.content.removeEventListener('scroll', this.getMoreData);
    },
  },
};
</script>

<style lang="less" scoped>
.list-content {
  --top: '';
  position: absolute;
  top: var(--top);
  bottom: 0;
  overflow: auto;
  width: 100%;
}
.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 75px;
}
</style>
