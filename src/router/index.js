import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/Index/Index'
import Login from '@/components/Login'
import Logout from '@/components/Logout'
import Customers from '@/components/Customers/index'
import AfterSale from '@/components/Customers/AfterSale'
import User from '@/components/User/index'
import UserList from '@/components/User/UserList'
import UserTagList from '@/components/User/UserTagList'
import UserDetail from '@/components/User/Detail/UserDetail'
import UserVIP from '@/components/User/VIPList'
import UserInvite from '@/components/User/InviteList'
import Platform from '@/components/Platform/index'
import PlatformCategory from '@/components/Platform/Category'
import PlatformVIP from '@/components/Platform/VIP'
import PlatformOffpayLife from '@/components/Platform/OffpayLife'
import PlatformRedpacket from '@/components/Platform/Redpacket'
import PlatformReseller from '@/components/Platform/Reseller'
import PlatformMall from '@/components/Platform/Mall/index'
import PlatformMallPage from '@/components/Platform/Mall/HomePage/Page'
import PlatformMallJumpPage from '@/components/Platform/Mall/HomePage/JumpPage'
import PlatformMallBanner from '@/components/Platform/Mall/Banner'
import PlatformMallCategory from '@/components/Platform/Mall/Category'
import PlatformMallGoods from '@/components/Platform/Mall/Goods'
import PlatformKeyword from '@/components/Platform/Keyword/index'
import PlatformKeywordList from '@/components/Platform/Keyword/list'
import PlatformKeywordHistroy from '@/components/Platform/Keyword/history'
import PlatformRush from '@/components/Platform/Rush/index'
import PlatformRushCreate from '@/components/Platform/Rush/create'
import PlatformRushDetail from '@/components/Platform/Rush/detail'
import PlatformRushEdit from '@/components/Platform/Rush/edit'
import Auth from '@/components/Auth/index'
import AuthCreate from '@/components/Auth/create'
import AuthRoles from '@/components/Auth/roles'
import AuthMenus from '@/components/Auth/menus'
import AuthUsers from '@/components/Auth/users'
import AuthPwd from '@/components/Auth/changepwd'
import axios from '@/assets/axios'
import store from '@/store/index'
import { Message } from 'element-ui'

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
      path: '/index',
      name: 'Index',
      component: Index,
      meta: { requiresAuth: true }
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
          path: 'tags',
          component: UserTagList,
          meta: {
            can: 'view User'
          }
        },
        {
          path: 'detail/:id',
          component: UserDetail,
          props: true,
          meta: {
            can: 'view User'
          }
        },
        {
          path: 'vip',
          component: UserVIP,
          meta: {
            can: 'view User'
          }
        },
        {
          path: 'invite',
          component: UserInvite,
          meta: {
            can: 'view User'
          }
        }
      ]
    },
    {
      path: '/customers',
      name: 'Customers',
      component: Customers,
      meta: {
        can: 'view Customers'
      },
      children: [
        {
          path: 'aftersale',
          component: AfterSale,
          meta: {
            can: 'view Customers'
          }
        }
      ]
    },
    {
      path: '/platform',
      name: 'Platform',
      component: Platform,
      meta: {
        can: 'view Platform'
      },
      children: [
        {
          path: '',
          component: PlatformCategory,
          meta: {
            can: 'view Platform'
          }
        },
        {
          path: 'category',
          component: PlatformCategory,
          meta: {
            can: 'view Platform'
          }
        },
        {
          path: 'vip',
          component: PlatformVIP,
          meta: {
            can: 'view Platform'
          }
        },
        {
          path: 'offpaylife',
          component: PlatformOffpayLife,
          meta: {
            can: 'view Platform'
          }
        },
        {
          path: 'rush',
          component: PlatformRush,
          meta: {
            can: 'view Platform'
          }
        },
        {
          path: 'rush/create',
          component: PlatformRushCreate,
          meta: {
            can: 'edit Platform'
          }
        },
        {
          path: 'rush/:id/detail',
          name: 'rushDetail',
          component: PlatformRushDetail,
          props: true,
          meta: {
            can: 'view Platform'
          }
        },
        {
          path: 'rush/:id/edit',
          component: PlatformRushEdit,
          props: true,
          meta: {
            can: 'view Platform'
          }
        },
        {
          path: 'redPacket',
          component: PlatformRedpacket,
          meta: {
            can: 'view Platform'
          }
        },
        {
          path: 'mall',
          component: PlatformMall,
          meta: {
            can: 'view Platform'
          },
          children: [
            {
              path: '',
              component: PlatformMallPage,
              meta: {
                can: 'view Platform'
              }
            },
            {
              path: 'banner/:type',
              component: PlatformMallBanner,
              props: true,
              meta: {
                can: 'view Platform'
              }
            },
            {
              path: 'category',
              component: PlatformMallCategory,
              meta: {
                can: 'view Platform'
              }
            },
            {
              path: 'goods/:type',
              component: PlatformMallGoods,
              props: true,
              meta: {
                can: 'view Platform'
              }
            },
            {
              path: 'page',
              component: PlatformMallPage,
              meta: {
                can: 'view Platform'
              }
            },
            {
              path: 'jump_page',
              component: PlatformMallJumpPage,
              meta: {
                can: 'view Platform'
              }
            }
          ]
        },
        {
          path: 'reseller',
          name: 'PlatformReseller',
          component: PlatformReseller,
          meta: {
            can: 'view Platform'
          }
        },
        {
          path: 'keyword',
          component: PlatformKeyword,
          meta: {
            can: 'view Platform'
          },
          children: [
            {
              path: '',
              component: PlatformKeywordList,
              meta: {
                can: 'view Platform'
              }
            },
            {
              path: 'history',
              component: PlatformKeywordHistroy,
              meta: {
                can: 'view Platform'
              }
            }
          ]
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
          path: 'role',
          name: 'AuthRoles',
          component: AuthRoles,
          meta: {
            can: 'edit Auth'
          }
        },
        {
          path: 'menu',
          name: 'AuthMenus',
          component: AuthMenus,
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
        if (!store.state.merchant) {
          axios.get('/insider/goods/merchant/')
            .then(res2 => {
              store.commit('SET_MERCHANT', res2.data)
              next()
            })
            .catch(err => {
              console.log(err)
              Message.warning('暂时无法获取供应商列表')
              next()
            })
        } else {
          next()
        }
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
