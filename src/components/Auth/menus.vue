<template>
  <div class="main-col">
    <div class="filter-container">
      <el-button
        icon="el-icon-plus"
        size="medium"
        v-can:edit="'Auth'"
        @click.stop="dialogVisible = true"
      >添加菜单</el-button>
      <el-button type="primary" size="medium" v-can:edit="'Auth'" @click.stop="save">保存</el-button>
    </div>
    <div class="card-outer">
      <div class="card-container">
        <el-row>
          <el-col :span="8">
            <div class="title">全部路由</div>
            <draggable
              class="list-group"
              :list="routers"
              :move="moveRoute"
              id="all"
              :group="{ name: 'menu', pull: 'clone', put: false }"
            >
              <div class="list-group-item" v-for="element in routers" :key="element">
                <div style="flex: 1">{{ element }}</div>
              </div>
            </draggable>
          </el-col>
          <el-col :span="16" class="drag-container">
            <div class="drag-item" v-for="(menu, index) of menus" :key="index">
              <div class="title">{{ menu.label }}</div>
              <draggable
                class="list-group"
                :list="menu.router"
                group="menu"
                :move="moveRoute"
                :id="menu.menu"
              >
                <div
                  class="list-group-item"
                  v-for="(element, elIndex) in menu.router"
                  :key="element"
                >
                  <div style="flex: 1">{{ element }}</div>
                  <el-button
                    size="mini"
                    icon="el-icon-close"
                    circle
                    @click="removeRoute(index, elIndex)"
                  ></el-button>
                </div>
              </draggable>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <el-dialog :visible.sync="dialogVisible" append-to-body center>
      <el-form ref="form" :model="form" :rules="rules">
        <el-form-item label="菜单中文名" prop="name">
          <el-input v-model.trim="form.name" required></el-input>
        </el-form-item>
        <el-form-item label="菜单标识值" prop="value">
          <el-input v-model.trim="form.value" required></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" style="text-align: right">
        <el-button @click="dialogVisible = false" size="medium">取消</el-button>
        <el-button type="primary" size="medium" @click.stop="createMenu">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import draggable from 'vuedraggable'

export default {
  components: {
    draggable
  },
  data () {
    const validateName = (rule, value, callback) => {
      const allMenus = Object.keys(this.acl)
      if (allMenus.includes(value)) {
        callback(new Error(`显示名为${value}菜单该已经存在！`))
      } else {
        callback()
      }
    }
    const validateValue = (rule, value, callback) => {
      const allMenus = Object.keys(this.acl)
      if (allMenus.includes(value)) {
        callback(new Error(`键为${value}的菜单已经存在！`))
      } else {
        callback()
      }
    }
    return {
      routers: ['/insider/goods/'],
      menus: [
        {
          menu: 'Goods',
          label: '商品管理',
          router: ['/insider/goods/', '/insider/orders']
        }
      ],
      dialogVisible: false,
      form: {
        name: ''
      },
      rules: {
        name: [
          { required: true, message: '请填写菜单中文名', trigger: 'blur' },
          { validator: validateName, trigger: 'blur' }
        ],
        value: [
          { required: true, message: '请填写菜单识别值', trigger: 'blur' },
          { validator: validateValue, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    acl () {
      return this.$store.getters['acl/getKeys']
    }
  },
  methods: {
    save () {},
    createMenu () {
      this.$refs.form.validate().then(res => {})
    },
    moveRoute (evt) {
      const el = evt.draggedContext.element
      const menuItem = this.menus.find(menu => menu.menu === evt.to.id)
      console.log(menuItem)
      if (!menuItem || !menuItem.router) return false
      if (menuItem.router.includes(el)) return false
      return true
    },
    removeRoute (roleIdx, routeIdx) {
      this.menus[roleIdx].router.splice(routeIdx, 1)
    }
  }
}
</script>

<style scoped>
.filter-container {
  padding: 12px;
  text-align: right;
}
.list-group {
  max-width: 200px;
}
.list-group-item {
  display: flex;
  align-items: center;
}
.title {
  text-align: left;
  font-size: 18px;
  margin: 10px auto;
}
.drag-container {
  display: flex;
  flex-wrap: wrap;
}
.drag-item {
  width: 33.33333%;
}
</style>
