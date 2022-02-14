<template>
  <van-icon
    :name="value === 1 ? 'good-job' : 'good-job-o'"
    :loading="isloading"
    @click="onlike"
    :class="{
      collextionlike: value === 1
    }"
  />
</template>

<script>
import { userLike, userCancelLike } from '@/api/article.js'

export default {
  name: 'aiticleLike',
  components: {},
  props: {
    articleid: {
      type: [Number, String, Object],
      required: true
    },
    value: {
      // 1为 点赞  -1为不点赞
      type: Number,
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
    async onlike() {
      this.$toast.loading({
        duration: 0, // 持续展示 toast
        message: '操作中...',
        forbidClick: true // 是否禁止背景点击
      })
      try {
        if (this.value === 1) {
          await userCancelLike(this.articleid)
          this.$emit('update-like', -1)
          this.$toast.success('取消成功')
        } else {
          await userLike(this.articleid)
          this.$emit('update-like', 1)
          this.$toast.success('点赞成功')
        }
      } catch (err) {
        this.$toast.fail('取消赞失败')
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
