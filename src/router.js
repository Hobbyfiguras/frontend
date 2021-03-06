import Vue from 'vue'
import Router from 'vue-router'
import index from '@/views/index'
import notfound from '@/views/notfound'
import privacy from '@/views/privacy'
import profile from '@/views/profile'
import login from '@/views/login'
import register from '@/views/register'
import emailVerify from '@/views/email_verify'
import forumIndex from '@/views/forum/ForumIndex'
import forumView from '@/views/forum/forum_view'
import threadView from '@/views/forum/thread_view'
import threadCreate from '@/views/forum/ThreadCreate'
import markdownGuide from '@/views/markdown_guide'
import PasswordResetVerify from '@/views/PasswordResetVerify'
import PasswordReset from '@/views/PasswordReset'
import Notifications from '@/views/Notifications'

import store from '@/store'

Vue.use(Router)

function requireAuth (to, from, next) {
  if (store.getters['auth/hasAuthData']) {
    store.dispatch('auth/getCurrentUser').then(() => {
      next()
    })
  } else {
    next('/')
  }
}

function requireUserAdmin (to, from, next) {
  if (store.getters['auth/hasAuthData']) {
    store.dispatch('auth/getCurrentUser').then(() => {
      console.log('state', store.state.auth.currentUser)
      if (store.state.auth.currentUser.is_staff) {
        next()
      } else {
        next('/')
      }
    })
  } else {
    next('/')
  }
}

function requireNotAuth (to, from, next) {
  if (store.getters['auth/hasAuthData']) {
    next('/')
  } else {
    next()
  }
}

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
      path: '/mensajes',
      name: 'PrivateMessages',
      component: () => import(/* webpackChunkName: "forum" */ '@/views/PrivateMessages'),
      props: true
    },
    {
      path: '/mensajes/:id',
      name: 'PrivateMessage',
      component: () => import(/* webpackChunkName: "forum" */ '@/views/PrivateMessage'),
      props: true
    },
    {
      path: '/confirmar_cambio_pass',
      name: 'password_change_confirm',
      component: PasswordResetVerify
    },
    {
      path: '/cambio_pass',
      name: 'password_change',
      component: PasswordReset
    },
    {
      path: '/mensaje/:id',
      name: 'PostView',
      component: () => import(/* webpackChunkName: "forum" */ '@/views/forum/PostView'),
      props: true
    },
    {
      path: '/foro',
      name: 'ForumIndex',
      component: forumIndex
    },
    {
      path: '/ref',
      name: 'markdown_guide',
      component: markdownGuide
    },
    {
      path: '/buscar/:text?',
      name: 'search',
      props: true,
      component: () => import(/* webpackChunkName: "forum" */ '@/views/forum/Search')
    },
    {
      path: '/foro/recientes',
      name: 'forum_recent',
      component: () => import(/* webpackChunkName: "forum" */ '@/views/forum/RecentThreads')
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
      component: threadCreate,
      beforeEnter: requireAuth
    },
    {
      path: '/notificaciones',
      name: 'notifications',
      props: true,
      component: Notifications,
      beforeEnter: requireAuth
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
      props: true,
      component: login,
      beforeEnter: requireNotAuth
    },
    {
      path: '/preferencias',
      component: () => import(/* webpackChunkName: "user_preferences" */ '@/views/UserPreferences'),
      beforeEnter: requireAuth,
      children: [
        {
          path: '',
          name: 'preferences',
          component: () => import(/* webpackChunkName: "user_preferences" */ '@/views/preferences/account')
        },
        {
          path: 'password',
          name: 'preferences_password',
          component: () => import(/* webpackChunkName: "user_preferences" */ '@/views/preferences/PasswordPreferences')
        }
      ]
    },
    {
      path: '/registro',
      name: 'register',
      component: register,
      beforeEnter: requireNotAuth
    },
    {
      path: '/verificar/:email_key',
      name: 'email_verify',
      component: emailVerify,
      props: true,
      beforeEnter: requireNotAuth
    },
    {
      path: '/admin',
      component: () => import(/* webpackChunkName: "admin" */ '@/views/admin/admin_base'),
      beforeEnter: requireUserAdmin,
      children: [
        {
          path: '',
          name: 'admin',
          component: () => import(/* webpackChunkName: "admin" */ '@/views/admin/admin_index')
        },
        {
          path: 'reportes',
          name: 'admin_reports',
          component: () => import(/* webpackChunkName: "admin" */ '@/views/admin/admin_reports')
        },
        {
          path: 'categorias',
          name: 'admin_forum_categories',
          component: () => import(/* webpackChunkName: "admin" */ '@/views/admin/admin_forum_categories')
        },
        {
          path: 'foros',
          name: 'admin_forum_forums',
          component: () => import(/* webpackChunkName: "admin" */ '@/views/admin/admin_forum_forums')
        }
      ]
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
