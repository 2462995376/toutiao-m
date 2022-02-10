<template>
  <div class="search-suggestion">
    <van-cell icon="search" v-for="(item, index) in suggestion" :key="index" @click="onserch(item)">
      <div slot="title" v-html="highlight(item, searchText)"></div>
    </van-cell>
  </div>
</template>

<script>
import { getSuggestion } from '@/api/search.js'
import { debounce } from 'lodash'
export default {
  name: 'SearchSuggestion',
  components: {},
  props: {
    searchText: {
      type: String,
      require: true
    }
  },
  data() {
    return {
      suggestion: []
    }
  },
  computed: {},
  watch: {
    searchText: {
      handler: debounce(function(p) {
        this.LoadSuggestionSearch(p)
      }, 200),
      immediate: true
    }
  },
  created() {},
  mounted() {},
  methods: {
    async LoadSuggestionSearch(p) {
      try {
        const { data } = await getSuggestion(p)
        this.suggestion = data.data.options
      } catch (error) {
        this.$toast('获取数据失败，请稍后再试')
      }
    },
    highlight(source, keyword) {
      // /searchContent/ 正则表达式中的一切内容都会当做字符串使用
      // 这里可以 new RegExp 方式根据字符串创建一个正则表达式
      // RegExp 是原生 JavaScript 的内置构造函数
      // 参数1：字符串，注意，这里不要加 //
      // 参数2：匹配模式，g 全局，i 忽略大小写
      const reg = new RegExp(keyword, 'gi')
      return source.replace(reg, `<span style="color: #3296fa">${keyword}</span>`)
    },
    onserch(item) {
      this.$emit('onsearch', item)
    }
  }
}
</script>

<style scoped lang="less"></style>
