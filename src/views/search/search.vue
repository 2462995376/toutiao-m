<template>
  <div class="serch-container">
    <form action="/">
      <van-search v-model="searchText" show-action placeholder="请输入搜索关键词" @search="onSearch" @cancel="onCancel" background="#3296fa" />
    </form>
  </div>
</template>

<script>
export default {
  name: 'Search',
  data() {
    return {
      searchText: ''
    }
  },
  methods: {
    onSearch() {
      // this.$toast(val)
      console.log('ok')
    },
    onCancel() {
      // this.$toast('取消')
      console.log('quxiao')
    }
  }
}
</script>

<style lang="less" scoped>
.serch-container {
  .van-search__action {
    color: #fff;
  }
}
</style>
