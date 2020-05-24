import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Logout from '@/components/Logout'
import Goods from '@/components/Funds/index'
import GoodsList from '@/components/Funds/Funds'
import GoodsDetail from '@/components/Funds/FundsDetail'
import GoodsCreate from '@/components/Funds/FundsCreate'
import BatchUpload from '@/components/Funds/Upload/BatchUpload'
import Analysis from '@/components/Analysis/index'
import AnalysisAcross from '@/components/Analysis/AnalysisAcross'
import AnalysisSimulate from '@/components/Analysis/AnalysisSimulate'
import User from '@/components/User/index'
import UserList from '@/components/User/UserList'
import UserContact from '@/components/User/UserContact'
import Auth from '@/components/Auth/index'
import AuthCreate from '@/components/Auth/create'
import AuthUsers from '@/components/Auth/users'
import AuthPwd from '@/components/Auth/changepwd'
import axios from '@/assets/axios'
import store from '@/store/index'
// import { Message } from 'element-ui'

Vue.use(Router)

let router = new Router({
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
      component: Goods,
      meta: {
        can: 'view Goods'
      },
      children: [
        {
          path: '',
          name: 'Goods',
          component: GoodsList,
          meta: {
            can: 'view Goods'
          }
        },
        {
          path: 'list',
          component: GoodsList,
          meta: {
            can: 'view Goods'
          }
        },
        {
          path: 'detail/:id',
          component: GoodsDetail,
          props: true,
          meta: {
            can: 'view Goods'
          }
        },
        {
          path: 'add',
          component: GoodsCreate,
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
    },
    {
      path: '/auth',
      component: Auth,
      meta: {
        can: 'view Auth'
      },
      children: [
        {
          path: '',
          redirect: 'create'
        },
        {
          path: 'password',
          name: 'AuthPwd',
          component: AuthPwd
        },
        {
          path: 'create',
          name: 'AuthCreate',
          component: AuthCreate,
          meta: {
            can: 'edit Auth'
          }
        },
        {
          path: 'users',
          name: 'AuthUsers',
          component: AuthUsers,
          meta: {
            can: 'edit Auth'
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
        // if (err.response) {
        //   if (err.response.status === 401) {
        //     store.commit('SET_USERNAME', '')
        //     Message.warning('未登录或登录超时 请登录...')
        //     next({
        //       path: '/login',
        //       query: {redirect: to.fullPath}
        //     })
        //   } else if (err.response.status === 403) {
        //     Message.error('权限错误，请勿同时登陆admin和supplier')
        //   } else if (err.response.status === 404) {
        //     Message.error('找不到对应的供应商')
        //   } else {
        //     Message.error('未知错误')
        //   }
        // } else {
        //   console.log('Error', err.message)
        //   Message.error('请求未发出')
        // }
      })
  } else {
    next()
  }
})

export default router
