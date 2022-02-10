<template>
  <div class="search-result">
    <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad" :error.sync="error" error-text="请求失败，点击重新加载">
      <van-cell v-for="(item, index) in list" :key="index" :title="item.title" />
    </van-list>
  </div>
</template>

<script>
import { getSearchResult } from '@/api/search.js'
export default {
  name: 'SearchResult',
  components: {},
  props: {
    searchText: {
      require: true
    }
  },
  data() {
    return {
      list: [],
      loading: false,
      finished: false,
      page: 1,
      per_page: 20,
      error: false
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    async onLoad() {
      try {
        const { data } = await getSearchResult({
          page: this.page,
          per_page: this.per_page,
          q: this.searchText
        })
        const result = data.data.results
        this.list.push(...result)
        this.loading = false
        if (result.length) {
          this.page++
        } else {
          this.finished = true
        }
      } catch (error) {
        // this.$toast('获取结果失败')
        console.log(error)
        this.loading = false
        this.error = true
      }
    }
  }
}
</script>

<style scoped lang="less"></style>
