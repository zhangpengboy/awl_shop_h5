<template>
  <div class="app-document">
    <i18n v-for="n in $i18n.t(i18nPath).length" :key="n - 1" :path="i18nPath + '[' + (n - 1) + ']'" :tag="tags[n - 1]">
      <template v-for="name in i18nSlotNames" #[name]>
        <slot :name="name"> </slot>
      </template>
      <template #br>
        <br />
      </template>
    </i18n>
  </div>
</template>

<script>
export default {
  name: 'AppDocument',
  props: {
    i18nPath: {
      type: String,
      required: true,
    },
    tags: Array,
    i18nSlotNames: Array,
  },
};
</script>

<style lang="less" scoped>
.app-document {
  padding: 4px 15px 20px;

  > h6 {
    margin: 12px 0 8px;
    font-size: 15px;
    color: #131417;
  }

  > p {
    margin: 8px 0;
    font-size: 14px;
    line-height: 21px;
    color: #5e5e5e;
  }
  > h5 {
    font-size: 3.5vw;
    line-height: 9vw;
    color: #fff;
  }
}
</style>
