<template>
  <div>
    <p>{{text}}</p>
  </div>
</template>

<script>
import { Message } from 'element-ui'
export default {
  name: 'logout',
  data () {
    return {
      text: '登出中……'
    }
  },
  mounted () {
    let that = this
    this.$axios.delete('/insider/session/')
      .then(() => {
        Message.success('已登出')
        this.text = '已登出'
        that.$store.commit('SET_USERNAME', '')
        that.$router.replace({path: '/'})
      })
      .catch(err => {
        if (err.response) {
          console.log(err.response)
        }
      })
  }
}
</script>

<style scoped>

</style>
