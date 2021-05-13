<template>
  <div class="page_right">
    <el-button type="primary" @click="saveDepartment">添加</el-button>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="date" label="部门名称" />
      <el-table-column prop="name" label="姓名" />
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="lookRow(scope.row)">查看</el-button>
          <el-button type="text" @click="editRow(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      :title="dialogVisibleTitle"
      :visible.sync="dialogVisible"
      width="65%"
      :before-close="handleClose"
    >
      <div>
        <el-form
          ref="form"
          :model="peoperForm"
          label-width="210px"
          style="display: flex; flex-wrap: wrap"
        >
          <el-form-item label="部门名称" style="width: 48%">
            <el-input v-model="peoperForm.departmentName" />
          </el-form-item>
          <el-form-item label="所属上级部门" style="width: 48%">
            <el-input v-model="peoperForm.type" />
          </el-form-item>
        </el-form>
        <div style="text-align: center">
          <el-button type="primary" @click="onSubmit">立即创建</el-button>
          <el-button @click="closeGeneral">取消</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      dialogVisibleTitle: '',
      dialogVisible: false,
      tableData: [],
      peoperForm: {
        departmentName: '',
        updepartmentName: '',
        updepartmentid: ''
      }
    }
  },
  methods: {
    saveDepartment() {
      this.dialogVisibleTitle = '添加部门'
      thisdialogVisible = true
      this.peoperForm = {
        departmentName: '',
        updepartmentName: '',
        updepartmentid: ''
      }
    },
    onSubmit() {
      let url = ''
      if (this.isUpdate) {
        url = 'college/update'
      } else {
        url = 'college/save'
      }
      this.apiPost(url, this.peoperForm).then((res) => {
        console.log(res)
      })
    },
    // 取消
    closeGeneral() {
      this.handleClose()
    },
    handleClose() {
      this.dialogVisible = false
      this.peoperForm = {
        departmentName: '',
        updepartmentName: '',
        updepartmentid: ''
      }
    },
    // 查看
    lookRow(row) {
      this.dialogVisibleTitle = '查看部门'
      this.dialogVisible = true
      this.peoperForm = row
    },
    // 编辑
    editRow(row) {
      this.dialogVisibleTitle = '编辑部门'
      this.dialogVisible = true
      this.peoperForm = row
    }
  }
}
</script>
  <style scoped>
    .page_right {
    flex: 1;
    min-height: calc(100vh - 84px);
    }
  </style>
