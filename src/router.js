import Vue from 'vue'
import Router from 'vue-router'
import index from '@/views/index'
import notfound from '@/views/notfound'
import privacy from '@/views/privacy'
import profile from '@/views/profile'
import login from '@/views/login'
import forumIndex from '@/views/forum/forum_index'
import forumView from '@/views/forum/forum_view'
import threadView from '@/views/forum/thread_view'
import threadCreate from '@/views/forum/thread_create'
import markdownGuide from '@/views/markdown_guide'
import store from '@/store'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'index',
      component: index
    },
    {
      path: '/privacy-policy',
      name: 'privacy',
      component: privacy
    },
    {
      path: '/perfil/:username',
      name: 'profile',
      component: profile,
      props: true
    },
    {
      path: '/foro',
      name: 'forum_index',
      component: forumIndex
    },
    {
      path: '/ref',
      name: 'markdown_guide',
      component: markdownGuide
    },
    {
      path: '/foro/:slug',
      name: 'forum',
      props: true,
      component: forumView
    },
    {
      path: '/foro/:slug/nuevo',
      name: 'thread_new',
      props: true,
      component: threadCreate
    },
    {
      path: '/foro/:forum?/:id/:slug?/:page?',
      name: 'thread',
      props: true,
      component: threadView
    },
    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: '/404',
      name: '404',
      component: notfound
    },
    {
      path: '*',
      redirect: '/404'
    }
  ],
  scrollBehavior (to, from, savedPosition) {
    return { x: 0, y: 0 }
  }
})

router.beforeEach((to, from, next) => {
  store.dispatch('auth/inspectToken').then(() => {
    next()
  })
})

export default router
