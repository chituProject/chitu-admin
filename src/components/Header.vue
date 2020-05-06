<template>
  <el-menu
    class="el-menu-demo"
    mode="horizontal"
    :default-active="openIndex"
    text-color="#333"
    active-text-color="#ffffff"
    @select="handleSelect">

    <el-menu-item v-for="menu in visibleMenus" :key="menu.index" :index="menu.index" class="header-bar">
      <!--<el-tooltip class="item" effect="dark" :content="menu.title" placement="bottom" popper-class="popper">-->
      <i class="iconfont" v-html="menu.title"></i>
      <!--</el-tooltip>-->
      <!--<span slot="title" v-show="bigScreen || showMenuText(menu.index)">{{ menu.title }}</span>-->
    </el-menu-item>

    <!--<el-menu-item index="account" class="right logout" v-if="notLogin">
      <i class="el-icon-setting"></i>
      <span v-if="username === ''" slot="title">登录</span>
      <span v-else slot="title">登出 ({{username}}) </span>
    </el-menu-item> -->

    <el-menu-item index="main" class="right" >
      <img src="../../static/logo.png" height="40px"/>
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
        title: '基金管理',
        icon: '&#xe631;'
      }, {
        index: 'analysis',
        title: '基金分析',
        icon: '&#xe60b;'
      }, {
        index: 'user',
        title: '用户管理',
        icon: '&#xe61f;'
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
      } else if (key === 'analysis') {
        this.$router.push('/analysis/across')
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
  color: #9e1306 !important;
}
#navbar-menu li {
  font-size: 16px !important;
}
.el-menu-demo {
  position: absolute;
  left: 20%;
  right: 0;
  z-index: 50;
  /*box-shadow: 0px 3px 7px 0px rgba(215, 211, 211, 0.35);*/
}
.right {
  float: right;
  font-size: 16px;
}
.right i {
  color: #333333;
  font-size: 20px;
}
.header-bar {
  font-size: 16px;
  padding-left: 100px;
  padding-right:100px;
}
.left i {
  color: #333333;
  font-size: 20px;
  margin-right: 3px;
}
.is-active i {
  color: #000000;
}
.popper {
  font-size: 16px;
  color: pink;
}
</style>
