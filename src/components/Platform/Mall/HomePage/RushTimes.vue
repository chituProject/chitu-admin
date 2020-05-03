<template>
  <div v-loading="loading">
    <el-row v-for="(time, index) of shownTimes" :key="time.id">
      <div v-if="!time.deleted" class="form-row demo-table-expand">
        <el-col :span="4" class="form-label fs-14">
          时间段 {{ +index + 1 }}:
        </el-col>
        <el-col :span="20" class="form-col">
          <el-time-select
            v-model="time.start_at"
            :picker-options="{
              start: '00:00',
              step: '00:15',
              end: '23:45'
            }"
            placeholder="请选择">
          </el-time-select>
          <div class="line">-</div>
          <el-time-select
            v-model="time.end_at"
            :picker-options="{
              start: '00:00',
              step: '00:15',
              end: '23:45',
              minTime: time.start_at,
              maxTime: index + 1 < shownTimes.length ? shownTimes[index + 1].end_at : '23:59'
            }"
            @change="setTimeEnd(index)"
            placeholder="请选择">
          </el-time-select>
          <el-button :disabled="!$can('edit', 'Platform')" icon="el-icon-close" size="mini" circle class="form-btn" @click.stop="del(index)"></el-button>
        </el-col>
      </div>
    </el-row>
    <div class="button-container">
      <el-button type="primary" v-can:edit="'Platform'" class="search-button button-container-item" @click="add">新增</el-button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    // 当前homepage_item.id
    homepage: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      loading: false,
      shownTimes: [],
      allTimes: []
    }
  },
  watch: {
    allTimes (val) {
      if (val) {
        this.shownTimes = val
          .filter(item => item.homepage === this.homepage)
          .map(item => ({ ...item }))
      }
    },
    homepage (val) {
      if (val && this.allTimes) {
        this.shownTimes = this.allTimes
          .filter(item => item.homepage === val)
          .map(item => ({ ...item }))
      }
    }
  },
  methods: {
    getData () {
      this.loading = true
      this.$axios.get(`/insider/homepage_rush_time/`)
        .then(res => {
          this.allTimes = res.data
        })
        .finally(() => {
          this.loading = false
        })
    },
    add () {
      const last = this.shownTimes[this.shownTimes.length - 1]
      const item = {
        start_at: last ? last.end_at : '00:00',
        end_at: '23:59',
        homepage: this.homepage,
        isNew: true
      }
      this.shownTimes.push(item)
    },
    del (index) {
      const item = this.shownTimes[index]
      this.shownTimes.splice(index, 1, { ...item, deleted: true })
    },
    save () {
      const originalTimes = this.allTimes.filter(item => item.homepage === this.homepage)
      const reqs = this.shownTimes.map(item => {
        if (item.isNew && !item.deleted) {
          return this.$axios.post(`/insider/homepage_rush_time/`, item)
        } else if (!item.isNew && item.deleted) {
          this.$axios.delete(`/insider/homepage_rush_time/${item.id}/`)
        } else {
          const orig = originalTimes.find(i => i.id === item.id)
          if (orig && (orig.start_at !== item.start_at || orig.end_at !== item.end_at)) {
            return this.$axios.patch(`/insider/homepage_rush_time/${item.id}/`, item)
          }
        }
      })
      this.loading = true
      Promise
        .all(reqs)
        .catch(() => {
          this.$message.error('有请求出错啦！')
        })
        .finally(() => {
          this.$emit('finish-save')
          this.loading = false
        })
    },
    setTimeEnd (index) {
      if (index < 0 || this.shownTimes.length <= index + 1) return
      const item = {
        ...this.shownTimes[index + 1],
        start_at: this.shownTimes[index].end_at
      }
      this.shownTimes.splice(index + 1, 1, item)
    }
  }
}
</script>

<style scoped>
  .title-div {
    /*margin-left: 10px;*/
    margin-bottom: 10px;
  }
  .demo-table-expand {
    padding: 20px;
  }
  .button-container {
    overflow: hidden;
    width: 100%;
  }
  .button-container-item {
    float: right;
    /*margin-left: 10px;*/
  }
  .el-input {
    max-width: 200px;
  }
  .form-label {
    line-height: 40px;
  }
  .form-col {
    display: flex;
    align-items: center;
  }
  .form-row {
    padding: 10px 20px;
  }
  .form-btn {
    margin: 0 20px;
  }
  .line {
    text-align: center;
    width: 20px;
  }
</style>
