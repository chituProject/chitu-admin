<template>
  <div class="main-col">
    <div class="filter-container">
      <el-button
        icon="el-icon-plus"
        size="medium"
        v-can:edit="'Auth'"
        @click.stop="dialogVisible = true"
      >添加角色</el-button>
      <el-button type="primary" size="medium" v-can:edit="'Auth'" @click.stop="save">保存</el-button>
    </div>
    <div class="card-outer">
      <div class="card-container">
        <el-table :data="table" stripe>
          <el-table-column prop="role" label="角色" fixed></el-table-column>
          <el-table-column
            v-for="(val, key) in acl"
            :key="key"
            :prop="key"
            :label="val"
            width="140"
          >
            <template slot-scope="scope">
              <el-select v-model="scope.row[key]">
                <el-option label="不可访问" :value="0"></el-option>
                <el-option label="可查看" :value="1"></el-option>
                <el-option label="可编辑" :value="2"></el-option>
              </el-select>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <el-dialog :visible.sync="dialogVisible" append-to-body center>
      <el-form ref="form" :model="form" :rules="rules">
        <el-form-item label="新角色名" prop="name">
          <el-input v-model.trim="form.name" required></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" style="text-align: right">
        <el-button @click="dialogVisible = false" size="medium">取消</el-button>
        <el-button type="primary" size="medium" @click.stop="createRole">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    const validateName = (rule, value, callback) => {
      const allRoles = this.table.map(item => item.role)
      if (allRoles.includes(value)) {
        callback(new Error('该角色已经存在！'))
      } else {
        callback()
      }
    }
    return {
      table: [
        {
          role: '超级管理员',
          Goods: 2,
          Orders: 2,
          Reseller: 2,
          Supplier: 2,
          Customers: 2,
          User: 2,
          Platform: 2,
          Gift: 2,
          Stats: 1,
          Auth: 2
        },
        {
          role: '市场人员',
          Goods: 1,
          Orders: 2,
          Reseller: 2,
          Supplier: 2,
          Customers: 1,
          User: 1,
          Platform: 1,
          Gift: 1,
          Stats: 1,
          Auth: 0
        }
      ],
      dialogVisible: false,
      form: {
        name: ''
      },
      rules: {
        name: [
          { required: true, message: '请填写角色名', trigger: 'blur' },
          { validator: validateName, trigger: 'blur' }
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
    createRole () {
      this.$refs.form.validate().then(res => {})
    }
  }
}
</script>

<style scoped>
.filter-container {
  padding: 12px;
  text-align: right;
}
</style>
