<template>
  <div class="post-comment">
    <van-field class="post-field" v-model.trim="message" rows="2" autosize type="textarea" maxlength="50" placeholder="优质评论将会被优先展示" show-word-limit />
    <van-button size="small" type="info" @click="onPost" :disabled="!message">发布</van-button>
  </div>
</template>

<script>
import { addComment } from '@/api/comment.js'
export default {
  name: 'PostComment',
  components: {},
  props: {
    comment: {
      type: Object
    },
    target: {
      type: [Object, String, Number],
      require: true
    }
  },
  inject: {
    articleID: {
      ttype: [Object, String, Number],
      require: true
    }
  },
  data() {
    return {
      message: ''
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    async onPost() {
      try {
        const { data } = await addComment({
          target: this.target.toString(), // 评论的目标id（评论文章即为文章id，对评论进行回复则为评论id）
          content: this.message, // 评论内容
          art_id: this.articleID ? this.articleID.toString() : this.articleID
        })
        this.$toast.success('发表评论成功')
        this.$emit('post-success', { idObj: data.data, content: this.message })
        this.message = ''
      } catch (error) {
        console.log(error)
        this.$toast('发表评论失败')
      }
    }
  }
}
</script>

<style scoped lang="less">
.post-comment {
  display: flex;
  padding: 15px;
  align-items: center;
  .post-field {
    background: #f5f7f9;
    margin-right: 15px;
  }
}
</style>
