import Vue from 'vue'
import VueRouter from 'vue-router'
import Search from '@/views/search/search.vue'
import article from '@/views/article/articleindex.vue'

Vue.use(VueRouter)

// 路由表
const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login')
  },
  {
    path: '/',
    // name: 'layout', // 如果父路由有默认子路由，那它的 name 没有意义
    component: () => import('@/views/layout'),
    children: [
      {
        path: '', // 默认子路由，只能有1个
        name: 'home',
        component: () => import('@/views/home')
      },
      {
        path: '/qa',
        name: 'qa',
        component: () => import('@/views/qa')
      },
      {
        path: '/video',
        name: 'video',
        component: () => import('@/views/video')
      },
      {
        path: '/my',
        name: 'my',
        component: () => import('@/views/my')
      }
    ]
  },
  {
    path: '/search',
    name: 'search',
    component: Search
  },
  {
    path: '/article/:articleID',
    name: 'article',
    component: article,
    props: true
  }
]

const router = new VueRouter({
  routes
})

export default router
