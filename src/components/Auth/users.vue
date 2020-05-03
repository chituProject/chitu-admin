<template>
  <div class="main-col">
    <div class="filter-container">
      <router-link to="/auth/create" v-can:edit="'Auth'">
        <el-button icon="el-icon-plus" size="medium">添加用户</el-button>
      </router-link>
      <el-button type="primary" size="medium" v-can:edit="'Auth'" @click.stop="save">保存</el-button>
    </div>
    <div class="card-outer">
      <div class="card-container">
        <el-table :data="table" stripe>
          <el-table-column prop="username" label="用户"></el-table-column>
          <el-table-column prop="role" label="角色">
            <template slot-scope="scope">
              <el-select v-model="scope.row.role">
                <el-option v-for="role of roles" :key="role" :label="role" :value="role"></el-option>
              </el-select>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      roles: Object.freeze(['超级管理员', '市场人员']),
      table: [
        {
          username: 'biggreensnake',
          role: '超级管理员'
        }
      ]
    }
  },
  methods: {
    save () {}
  }
}
</script>

<style scoped>
.filter-container {
  padding: 12px;
  text-align: right;
}
</style>
