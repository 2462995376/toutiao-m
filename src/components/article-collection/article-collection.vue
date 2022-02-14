<template>
  <van-icon :name="value ? 'star' : 'star-o'" :class="{ collextionlike: value }" @click="articleCollect" :loading="isloading" />
</template>

<script>
import { addCollect, deleteCollect } from '@/api/article.js'
export default {
  name: 'articleCollection',
  components: {},
  props: {
    value: {
      type: Boolean,
      require: true
    },
    articleid: {
      type: [Number, String, Object],
      require: true
    }
  },
  data() {
    return {
      isloading: false
    }
  },
  computed: {},
  watch: {},
  methods: {
    async articleCollect() {
      this.$toast.loading({
        duration: 0, // 持续展示 toast
        message: '操作中...',
        forbidClick: true // 是否禁止背景点击
      })
      try {
        // 已经收藏
        if (this.value) {
          await deleteCollect(this.articleid)
          this.$toast.success('取消收藏')
        } else {
          // 取消收藏
          await addCollect(this.articleid)
          this.$toast.success('收藏成功')
        }
        this.$emit('update-collection', !this.value)
      } catch (error) {
        this.$toast.fail('收藏失败')
      }
    }
  },
  created() {},
  mounted() {}
}
</script>
<style lang="less" scoped>
.collextionlike {
  color: #ffa500;
}
</style>
