<template>
  <div class="app-container">
    <el-button type="primary" @click="addDirective">添加</el-button>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="date" label="角色名称" />
      <el-table-column prop="name" label="姓名" />
      <el-table-column prop="address" label="地址" />
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [
        {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        },
        {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        },
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        }
      ]
    }
  },
  methods: {
    addDirective() {

    }
  }
}
</script>
<style lang="scss" scoped>
.app-container {
  width: 100%;
  height: 100%;
  padding: 20px;
}
</style>

