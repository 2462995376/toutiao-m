<template>
  <div class="article-container">
    <!-- 导航栏 -->
    <van-nav-bar class="page-nav-bar" left-arrow title="头条" @click-left="clickleft"></van-nav-bar>
    <!-- /导航栏 -->

    <div class="main-wrap ">
      <!-- 加载中 -->
      <div class="loading-wrap" v-if="isLoading">
        <van-loading color="#3296fa" vertical>加载中</van-loading>
      </div>
      <!-- /加载中 -->

      <!-- 加载完成-文章详情 -->
      <div class="article-detail markdown-body" v-else-if="article.title">
        <!-- 文章标题 -->
        <h1 class="article-title">{{ article.title }}</h1>
        <!-- /文章标题 -->

        <!-- 用户信息 -->
        <van-cell class="user-info" center :border="false">
          <van-image class="avatar" slot="icon" round fit="cover" :src="article.aut_photo" />
          <div slot="title" class="user-name">{{ article.aut_name }}</div>
          <div slot="label" class="publish-date">{{ article.pubdate | relativeTime }}</div>

          <userFollower :userID="article.aut_id" :is_followed="article.is_followed" @update_is_followed="article.is_followed = $event" />
        </van-cell>
        <!-- /用户信息 -->

        <!-- 文章内容 -->
        <div class="article-content" v-html="article.content" ref="article-detail"></div>
        <van-divider>正文结束</van-divider>
        <commentList :source="articleID" @onload-success="totalComment = $event.total_count" :list="commentList" @reply-click="onReply"></commentList>
      </div>

      <!-- /加载完成-文章详情 -->

      <!-- 加载失败：404 -->
      <div class="error-wrap" v-else-if="this.errorStatus === 404">
        <van-icon name="failure" />
        <p class="text">该资源不存在或已删除！</p>
      </div>
      <!-- /加载失败：404 -->

      <!-- 加载失败：其它未知错误（例如网络原因或服务端异常） -->
      <div class="error-wrap" v-else>
        <van-icon name="failure" />
        <p class="text">内容加载失败！</p>
        <van-button class="retry-btn" @click="loadArticleData">点击重试</van-button>
      </div>
      <!-- /加载失败：其它未知错误（例如网络原因或服务端异常） -->
    </div>

    <!-- 底部区域 -->
    <div class="article-bottom">
      <van-button class="comment-btn" type="default" round size="small" @click="isPopuShow = true">写评论</van-button>
      <van-icon name="comment-o" :info="totalComment" color="#777" />
      <articleCollection v-model="article.is_collected" :articleid="articleID" @update-collection="article.is_collected = $event"></articleCollection>
      <aiticleLike v-model="article.attitude" :articleid="articleID" @update-like="article.attitude = $event"></aiticleLike>
      <!-- <van-icon color="#777" name="good-job-o" /> -->
      <van-icon name="share" color="#777777"></van-icon>
    </div>
    <!-- /底部区域 -->
    <van-popup v-model="isPopuShow" position="bottom">
      <postComment @post-success="postSuccess" :target="articleID"></postComment>
    </van-popup>
    <van-popup v-model="isReplyShow" position="bottom" style="height:100%">
      <commentReply v-if="isReplyShow" :comment="currentCommeneItem" :target="articleID" @close="isReplyShow = false"></commentReply>
    </van-popup>
  </div>
</template>

<script>
import { ImagePreview } from 'vant'
import { getArticleById } from '@/api/article.js'
import articleCollection from '@/components/article-collection/article-collection.vue'
import aiticleLike from '@/components/aiticle-like/aiticle-like.vue'
import userFollower from '@/components/userfollower/userFollower.vue'
import commentList from '@/views/article/components/comment-list.vue'
import postComment from '@/views/article/components/post-comment.vue'
import commentReply from '@/views/article/components/comment-reply.vue'
export default {
  name: 'ArticleIndex',
  components: { userFollower, articleCollection, aiticleLike, commentList, postComment, commentReply },
  props: {
    articleID: {
      type: [Number, String, Object],
      required: true
    }
  },
  data() {
    return {
      article: [],
      isLoading: true,
      errorStatus: 0,
      totalComment: 0,
      isPopuShow: false,
      commentList: [],
      isReplyShow: false,
      currentCommeneItem: {}
    }
  },
  provide: function() {
    return {
      articleID: this.articleID
    }
  },
  computed: {},
  watch: {},
  created() {
    this.loadArticleData()
  },
  mounted() {},
  methods: {
    clickleft() {
      this.$router.back()
    },
    async loadArticleData() {
      try {
        this.isLoading = true
        const { data } = await getArticleById(this.articleID)
        this.article = data.data

        setTimeout(() => {
          const imgDOM = this.$refs['article-detail']
          const imgs = imgDOM.querySelectorAll('img')
          const images = []
          imgs.forEach((item, index) => {
            images.push(item.src)
            item.onclick = () => {
              ImagePreview({
                images,
                startPosition: index
              })
            }
          })
        }, 0)
      } catch (err) {
        if (err.response && err.response.status === 404) this.errorStatus = 404
      }
      this.isLoading = false
    },
    postSuccess(e) {
      console.log(e)
      this.commentList.unshift(e)
      this.totalCommentCount++
      this.isPopuShow = false
    },
    onReply(comment) {
      this.isReplyShow = true
      this.currentCommeneItem = comment
    }
  }
}
</script>

<style scoped lang="less">
@import './github-markdown.css';
.article-container {
  .van-nav-bar__title {
    color: #fff;
  }
  .main-wrap {
    position: fixed;
    left: 0;
    right: 0;
    top: 92px;
    bottom: 88px;
    overflow-y: scroll;
    background-color: #fff;
  }
  .article-detail {
    .article-title {
      font-size: 40px;
      padding: 50px 32px;
      margin: 0;
      color: #3a3a3a;
    }

    .user-info {
      padding: 0 32px;
      .avatar {
        width: 70px;
        height: 70px;
        margin-right: 17px;
      }
      .van-cell__label {
        margin-top: 0;
      }
      .user-name {
        font-size: 24px;
        color: #3a3a3a;
      }
      .publish-date {
        font-size: 23px;
        color: #b7b7b7;
      }
      // .follow-btn {
      //   width: 170px;
      //   height: 58px;
      // }
    }

    .article-content {
      padding: 55px 32px;
      /deep/ p {
        text-align: justify;
      }
    }
  }

  .loading-wrap {
    padding: 200px 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
  }

  .error-wrap {
    padding: 200px 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    /deep/.van-icon {
      font-size: 122px;
      color: #b4b4b4;
    }
    .text {
      font-size: 30px;
      color: #666666;
      margin: 33px 0 46px;
    }
    .retry-btn {
      width: 280px;
      height: 70px;
      line-height: 70px;
      border: 1px solid #c3c3c3;
      font-size: 30px;
      color: #666666;
    }
  }

  .article-bottom {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-around;
    align-items: center;
    box-sizing: border-box;
    height: 88px;
    border-top: 1px solid #d8d8d8;
    background-color: #fff;
    .comment-btn {
      width: 282px;
      height: 46px;
      border: 2px solid #eeeeee;
      font-size: 30px;
      line-height: 46px;
      color: #a7a7a7;
    }
    .van-icon {
      font-size: 40px;
      .van-info {
        font-size: 16px;
        background-color: #e22829;
      }
    }
  }
}
</style>
