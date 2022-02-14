<template>
  <div class="serch-container">
    <form action="/" class="form-search">
      <van-search v-model="searchText" show-action placeholder="请输入搜索关键词" @search="onSearch" @cancel="onCancel" background="#3296fa" @focus="isResultShow = false" />
    </form>
    <!-- 搜索结果 -->
    <search-result v-if="isResultShow" :searchText="searchText" />
    <!-- /搜索结果 -->

    <!-- 联想建议 -->
    <search-suggestion v-else-if="searchText" :searchText="searchText" @onsearch="onSearch" />
    <!-- /联想建议 -->

    <!-- 搜索历史记录 -->
    <search-history v-else :searchHistories="searchHistories" @serch="onSearch" @clear-history-search="searchHistories = []" />
    <!-- /搜索历史记录 -->
  </div>
</template>

<script>
import searchSuggestion from '@/views/search/conpoments/search-suggestion.vue'
import searchResult from '@/views/search/conpoments/search-result.vue'
import searchHistory from '@/views/search/conpoments/search-history.vue'
import { setItem, getItem } from '@/utils/storage.js'
export default {
  name: 'Search',
  data() {
    return {
      searchText: '',
      isResultShow: false,
      searchHistories: getItem('TOUTIAO_HISTORY_SEARCH') || []
    }
  },
  watch: {
    searchHistories(val) {
      setItem('TOUTIAO_HISTORY_SEARCH', val)
    }
  },
  methods: {
    onSearch(val) {
      // this.$toast(val)
      this.searchText = val
      // 展示历史记录
      const index = this.searchHistories.indexOf(this.searchText)
      if (index !== -1) {
        this.searchHistories.splice(index, 1)
      }
      this.searchHistories.unshift(val)
      this.isResultShow = true
    },
    onCancel() {
      // this.$toast('取消')
      // console.log('quxiao')
      this.$router.back()
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
  padding-top: 108px;
  .van-search__action {
    color: #fff;
  }

  .form-search {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 2;
  }
}
</style>
