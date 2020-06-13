import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Logout from '@/components/Logout'
import Funds from '@/components/Funds/index'
import FundsList from '@/components/Funds/Funds'
import FundsDetail from '@/components/Funds/FundsDetail'
import FundsCreate from '@/components/Funds/FundsCreate'
import BatchUpload from '@/components/Funds/Upload/BatchUpload'
import Analysis from '@/components/Analysis/index'
import AnalysisAcross from '@/components/Analysis/AnalysisAcross'
import AnalysisSimulate from '@/components/Analysis/AnalysisSimulate'
import User from '@/components/User/index'
import UserList from '@/components/User/UserList'
import UserContact from '@/components/User/UserContact'
import axios from '@/assets/axios'
import store from '@/store/index'
import { Message } from 'element-ui'

Vue.use(Router)

let router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'IndexLogin',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/logout',
      name: 'Logout',
      component: Logout
    },
    {
      path: '/user',
      name: 'User',
      component: User,
      meta: {
        can: 'view User'
      },
      children: [
        {
          path: '',
          component: UserList,
          meta: {
            can: 'view User'
          }
        },
        {
          path: 'list',
          component: UserList,
          meta: {
            can: 'view User'
          }
        },
        {
          path: 'contact',
          component: UserContact,
          meta: {
            can: 'view User'
          }
        }
      ]
    },
    {
      path: '/goods',
      component: Funds,
      meta: {
        can: 'view Goods'
      },
      children: [
        {
          path: '',
          name: 'Goods',
          component: FundsList,
          meta: {
            can: 'view Goods'
          }
        },
        {
          path: 'list',
          component: FundsList,
          meta: {
            can: 'view Goods'
          }
        },
        {
          path: 'detail/:id',
          component: FundsDetail,
          props: true,
          meta: {
            can: 'view Goods'
          }
        },
        {
          path: 'add',
          component: FundsCreate,
          meta: {
            can: 'edit Goods'
          }
        },
        {
          path: 'upload',
          component: BatchUpload,
          meta: {
            can: 'edit Goods'
          }
        }
      ]
    },
    {
      path: '/analysis',
      name: 'Analysis',
      component: Analysis,
      meta: {
        can: 'view Analysis'
      },
      children: [
        {
          path: '',
          name: 'Analysis',
          component: AnalysisAcross,
          meta: {
            can: 'view Analysis'
          }
        },
        {
          path: 'across',
          component: AnalysisAcross,
          meta: {
            can: 'view Analysis'
          }
        },
        {
          path: 'simulate',
          component: AnalysisSimulate,
          meta: {
            can: 'view Analysis'
          }
        }
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    axios.get('/insider/session/')
      .then(res => {
        console.log(res.data)
        store.commit('SET_USERNAME', res.data.user.username)
      })
      .catch(err => {
        console.log(err.response, err.status)
        if (err.response) {
          if (err.response.status === 401) {
            store.commit('SET_USERNAME', '')
            Message.warning('未登录或登录超时 请登录...')
            next({
              path: '/login',
              query: {redirect: to.fullPath}
            })
          } else {
            Message.error('未知错误')
          }
        } else {
          console.log('Error', err.message)
          Message.error('请求未发出')
        }
      })
  } else {
    next()
  }
})

export default router
