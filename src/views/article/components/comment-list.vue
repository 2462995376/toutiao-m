<template>
  <van-list v-model="loading" :finished="finished" finished-text="已显示全部评论" :error="error" error-text="加载失败，请点击重试" :immediate-check="false" @load="onLoad">
    <commentItem v-for="(item, index) in commentlist" :key="index" :comment="item" @reply-click="$emit('reply-click', $event)"></commentItem>
  </van-list>
</template>

<script>
import { getCommentList } from '@/api/comment'
import { getUserInfo } from '@/api/user.js'
import commentItem from '@/views/article/components/CommentItem.vue'

export default {
  name: 'CommentList',
  components: { commentItem },
  props: {
    source: {
      type: [Number, String, Object],
      required: true
    },
    list: {
      type: [Object, Array],
      default: () => []
    },
    type: {
      type: String,
      // 自定义 Prop 数据验证
      validator(value) {
        return ['a', 'c'].includes(value)
      },
      default: 'a'
    }
  },
  data() {
    return {
      commentlist: [],
      loading: false,
      finished: false,
      offset: null, // 获取下一页数据的标记
      limit: 10,
      error: false
    }
  },
  computed: {},
  watch: {
    list: {
      isDeep: true,
      async handler() {
        const { data } = await getUserInfo()
        const { idObj, content } = this.list[0]
        const newComment = {
          com_id: idObj.com_id,
          aut_id: data.data.id,
          aut_name: data.data.name,
          aut_photo: data.data.photo,
          like_count: 0,
          reply_count: 0,
          pubdate: Date.now(),
          content: content,
          is_top: 0,
          is_liking: false
        }
        console.log(newComment)
        this.commentlist.unshift(newComment)
      }
    }
  },
  created() {
    // 当你手动初始 onLoad 的话，它不会自动开始初始的 loading
    this.loading = true
    this.onLoad()
  },
  mounted() {},
  methods: {
    async onLoad() {
      try {
        const { data } = await getCommentList({
          type: this.type, //  评论类型，a-对文章(article)的评论，c-对评论(comment)的回复
          source: this.source.toString(), // 源id，文章id或评论id
          offset: this.offset, // 获取评论数据的偏移量，值为评论id，表示从此id的数据向后取，不传表示从第一页开始读取数据
          limit: this.limit // 获取的评论数据个数，不传表示采用后端服务设定的默认每页数据量
        })

        // 2. 将数据添加到列表中
        const { results } = data.data
        this.commentlist.push(...results)
        this.loading = false
        // 把文章评论的总数量传递到外部
        this.$emit('onload-success', data.data)

        // 3. 将 loading 设置为 false
        this.loading = false

        // 4. 判断是否还有数据
        if (results.length) {
          // 有就更新获取下一页的数据页码
          this.offset = data.data.last_id
        } else {
          // 没有就将 finished 设置结束
          this.finished = true
        }
      } catch (err) {
        this.error = true
        this.loading = false
      }
    }
  }
}
</script>

<style scoped lang="less"></style>
