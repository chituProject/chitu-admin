<template>
  <el-cascader
    style="width: 100%"
    expand-trigger="hover"
    size="large"
    filterable
    :options="areaCodes"
    :props="{label: 'AREA_NAME', value: 'AREA_ID', checkStrictly: true}"
    v-model="areaId">
  </el-cascader>
</template>

<script>
import areaCodes from '@/assets/eascs/areaCodes'

export default {
  data() {
    return {
      areaId: null,
      areaCodes
    }
  }
}
</script>
