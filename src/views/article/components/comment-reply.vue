<template>
  <div class="comment-reply">
    <!-- 导航栏 -->
    <van-nav-bar fixed :title="comment.reply_count > 0 ? comment.reply_count + '条回复' : '暂无回复'">
      <van-icon slot="left" name="cross" @click="$emit('close')" />
    </van-nav-bar>
    <!-- /导航栏 -->

    <div class="scroll-reply">
      <!-- 当前评论项 -->
      <commentItem :comment="comment"></commentItem>
      <!-- /当前评论项 -->
      <van-cell title="所有回复" />

      <!-- 评论的回复列表 -->
      <commentList :type="'c'" :source="comment.com_id" :list="replyList"></commentList>
      <!-- /评论 的回复列表 -->
    </div>

    <!-- 底部 -->
    <div class="post-rely" @click="isReplyShow = true">
      <van-button class="post-btn" round>发评论</van-button>
    </div>
    <!-- /底部 -->

    <!-- 发表评论 -->
    <van-popup v-model="isReplyShow" position="bottom">
      <postComment :target="comment.com_id" @post-success="onPostSuccess"></postComment>
    </van-popup>
  </div>
</template>

<script>
import commentItem from '@/views/article/components/CommentItem.vue'
import commentList from '@/views/article/components/comment-list.vue'
import postComment from '@/views/article/components/post-comment.vue'

export default {
  name: 'CommentReply',
  components: { commentItem, commentList, postComment },
  props: {
    comment: {
      type: Object,
      require: true
    },
    target: {
      type: [Number, String, Object],
      required: true
    }
  },
  data() {
    return {
      isReplyShow: false,
      replyList: []
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    onPostSuccess(comment) {
      // 将发布成功的评论 放到评论列表顶部
      this.isReplyShow = false
      this.comment.reply_count++
      this.replyList.unshift(comment)
    }
  }
}
</script>

<style scoped lang="less">
.scroll-reply {
  padding-top: 98px;
  padding-bottom: 90 px;
  overflow-y: auto;
}
.post-rely {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  border-top: 1px solid #ccc;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #fff;
  .post-btn {
    width: 60%;
  }
}
</style>
