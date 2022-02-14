<template>
  <div class="userfollower-container">
    <van-button v-if="is_followed" :loading="isloadfollow" class="follow-btn" round size="small" @click="onfollow">已关注</van-button>
    <van-button v-else :loading="isloadfollow" class="follow-btn" type="info" color="#3296fa" round size="small" icon="plus" @click="onfollow">关注</van-button>
  </div>
</template>

<script>
import { followUser, cancelFollowUser } from '@/api/user.js'
export default {
  name: 'userFollower',
  components: {},
  props: {
    userID: {
      type: [Object, String, Number],
      require: true
    },
    is_followed: {
      type: Boolean,
      require: true
    }
  },
  data() {
    return {
      isloadfollow: false
    }
  },
  computed: {},
  watch: {},
  methods: {
    async onfollow() {
      this.isloadfollow = true
      try {
        if (this.is_followed) {
          await cancelFollowUser(this.userID)
        } else {
          await followUser(this.userID)
        }
        this.$emit('update_is_followed', !this.is_followed)
      } catch (err) {
        var message = '请稍后再试'
        if (err.response && err.response.status === 410) {
          // this.article.is_followed = false
          message = '不能关注你自己'
        }
        this.$toast(message)
      }
      this.isloadfollow = false
    }
  },
  created() {},
  mounted() {}
}
</script>
<style lang="less" scoped></style>
