<template>
  <el-menu
    class="el-menu-demo"
    mode="horizontal"
    :default-active="openIndex"
    text-color="#333"
    active-text-color="#f26250"
    @select="handleSelect">
    <el-menu-item index="main" style="margin-right: 70px">
      <img src="../../static/logo.png" width="90px" height="40px"/>
    </el-menu-item>
    <el-menu-item v-for="menu in visibleMenus" :key="menu.index" :index="menu.index" class="left">
      <el-tooltip class="item" effect="dark" :content="menu.title" placement="bottom" popper-class="popper">
        <i class="iconfont" v-html="menu.icon"></i>
      </el-tooltip>
      <span slot="title" v-show="bigScreen || showMenuText(menu.index)">{{ menu.title }}</span>
    </el-menu-item>
    <el-menu-item index="account" class="right logout" v-if="notLogin">
      <i class="el-icon-setting"></i>
      <span v-if="username === ''" slot="title">登录</span>
      <span v-else slot="title">登出 ({{username}}) </span>
    </el-menu-item>
  </el-menu>
</template>

<script>
import { Message } from 'element-ui'
import CollapseTransition from 'element-ui/lib/transitions/collapse-transition'
export default {
  name: 'yheader',
  components: {
    CollapseTransition
  },
  data () {
    return {
      menus: [{
        index: 'goods',
        title: '商品管理',
        icon: '&#xe631;'
      }, {
        index: 'orders',
        title: '订单管理',
        icon: '&#xe67c;'
      }, {
        index: 'reseller',
        title: '合伙人',
        icon: '&#xe663;'
      }, {
        index: 'supplier',
        title: '供应商',
        icon: '&#xe621;'
      }, {
        index: 'customers',
        title: '客户服务',
        icon: '&#xe65e;'
      }, {
        index: 'user',
        title: '用户管理',
        icon: '&#xe61f;'
      }, {
        index: 'platform',
        title: '平台管理',
        icon: '&#xe60b;'
      }, {
        index: 'gift',
        title: '锦礼君',
        icon: '&#xe63a;'
      }, {
        index: 'auth',
        title: '权限管理',
        icon: '&#xe61a;'
      }]
    }
  },
  computed: {
    username () {
      return this.$store.state.username || ''
    },
    notLogin () {
      return !this.$route.path.startsWith('/login')
    },
    openIndex () {
      const keys = this.menus.map(i => i.index)
      const selected = keys.find(k => this.$route.path.startsWith('/' + k.toLowerCase()))
      return selected || ''
    },
    bigScreen () {
      console.log('bigScreen', document.body.clientWidth > 1500)
      return document.body.clientWidth > 1500
    },
    visibleMenus () {
      const capitalize = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1)
      }
      return this.menus.filter(menu => {
        if (menu.can && typeof menu.can === 'function') {
          return menu.can()
        } else {
          return this.$can('view', capitalize(menu.index))
        }
      })
    }
  },
  methods: {
    refreshHeader () {
      this.$axios.get('/insider/session/')
        .then(res => {
          this.$store.commit('SET_USERNAME', res.data.user.username)
          this.$store.dispatch('acl/set', res.data.user.acl)
          if (!this.$store.state.merchant) {
            this.$axios.get('/insider/goods/merchant/')
              .then(res2 => {
                this.$store.commit('SET_MERCHANT', res2.data)
              })
              .catch(err => {
                console.log(err)
                Message.warning('暂时无法获取供应商列表')
              })
          }
        })
    },
    showMenuText (menuItem) {
      return this.$route.path.startsWith('/' + menuItem.toLowerCase())
    },
    handleSelect (key, keyPath) {
      this.refreshHeader()
      if (key === 'main') {
        this.$router.push('/index')
      } else if (key === 'goods') {
        this.$router.push('/goods')
      } else if (key === 'orders') {
        this.$router.push('/orders')
      } else if (key === 'reseller') {
        this.$router.push('/reseller')
      } else if (key === 'supplier') {
        this.$router.push('/supplier/merchant')
      } else if (key === 'customers') {
        this.$router.push('/customers/aftersale')
      } else if (key === 'user') {
        this.$router.push('/user')
      } else if (key === 'platform') {
        this.$router.push('/platform')
      } else if (key === 'gift') {
        this.$router.push('/gift')
      } else if (key === 'auth') {
        this.$router.push('/auth')
      } else {
        if (this.username === '') {
          this.$router.push('/')
        } else {
          this.$router.push('/logout')
        }
      }
    }
  },
  mounted () {
    this.$axios.get('/insider/session/')
      .then(res => {
        this.$store.commit('SET_USERNAME', res.data.user.username)
        this.$store.dispatch('acl/set', res.data.user.acl)
      })
  }
}
</script>

<style scoped>
#logout {
  /*color: #ff5a49;*/
  color: #E46256 !important;
}
#navbar-menu li {
  font-size: 16px !important;
}
.el-menu-demo {
  position: absolute;
  left: 0;
  right: 0;
  z-index: 50;
  box-shadow: 0px 3px 7px 0px rgba(215, 211, 211, 0.35);
}
.right {
  float: right;
  font-size: 16px;
}
.right i {
  color: #333333;
  font-size: 20px;
}
.left {
  font-size: 16px;
}
.left i {
  color: #333333;
  font-size: 20px;
  margin-right: 3px;
}
.is-active i {
  color: #E46256;
}
.popper {
  font-size: 16px;
  color: pink;
}
</style>
