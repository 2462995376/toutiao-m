<template>
  <div class="serch-container">
    <form action="/">
      <van-search v-model="searchText" show-action placeholder="请输入搜索关键词" @search="onSearch" @cancel="onCancel" background="#3296fa" />
    </form>
    <!-- 搜索历史记录 -->
    <search-history />
    <!-- /搜索历史记录 -->

    <!-- 联想建议 -->
    <search-suggestion />
    <!-- /联想建议 -->

    <!-- 历史记录 -->
    <search-result />
    <!-- /历史记录 -->
  </div>
</template>

<script>
import searchSuggestion from '@/views/search/conpoments/search-suggestion.vue'
import searchResult from '@/views/search/conpoments/search-result.vue'
import searchHistory from '@/views/search/conpoments/search-history.vue'
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
  },
  components: {
    searchSuggestion,
    searchResult,
    searchHistory
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
