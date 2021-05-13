<template>
  <div class="app-container">
    <el-button type="primary" @click="addDirective">添加</el-button>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="name" label="项目名称" />
      <el-table-column prop="moneyCardName" label="经费卡名称" />
      <el-table-column prop="moneyCardId" label="经费卡号" />
      <el-table-column prop="budget" label="预算申报金额" />
      <el-table-column prop="execute" label="执行金额" />
      <el-table-column prop="allocate" label="批复金额" />
      <el-table-column prop="proportion" label="完成比例" />
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            @click="fileUploadDialog(scope.row)"
          >文件上传</el-button>
          <el-button
            type="text"
            size="small"
            @click="fileSeeDialog(scope.row)"
          >文件查看</el-button>
          <el-button
            type="text"
            size="small"
            @click="handleClick(scope.row)"
          >查看</el-button>
          <el-button
            type="text"
            size="small"
            @click="editFn(scope.row)"
          >编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <Pagination
      :total="total"
      :page="pageNumber"
      :limit="pageSize"
      @pagination="pagination"
    />
    <el-dialog
      :title="dialogVisibleTitle"
      :visible.sync="dialogVisible"
      width="65%"
      :before-close="handleClose"
    ><el-form
      ref="form"
      :model="peoperForm"
      label-width="200px"
      style="display: flex; flex-wrap: wrap"
    >
      <el-form-item label="项目名称" style="width: 48%">
        <el-input
          v-model="peoperForm.name"
          :disabled="dialogVisibleTitle == '查看经费'"
        />
      </el-form-item>
      <el-form-item label="经费卡名称" style="width: 48%">
        <el-input
          v-model="peoperForm.moneyCardName"
          :disabled="dialogVisibleTitle == '查看经费'"
        />
      </el-form-item>
      <el-form-item label="经费卡号" style="width: 48%">
        <el-input
          v-model="peoperForm.moneyCardId"
          :disabled="dialogVisibleTitle == '查看经费'"
          @input="peoperForm.moneyCardId = peoperForm.moneyCardId.replace(/[^\d]/g, '')"
        />
      </el-form-item>
      <el-form-item label="预算申报金额" style="width: 48%">
        <el-input
          v-model="peoperForm.budget"
          :disabled="dialogVisibleTitle == '查看经费'"
          @input="peoperForm.budget = peoperForm.budget.replace(/[^\d]/g, '')"
        />
      </el-form-item>
      <el-form-item label="批复金额" style="width: 48%">
        <el-input
          v-model="peoperForm.allocate"
          :disabled="dialogVisibleTitle == '查看经费'"
          @input="peoperForm.allocate = peoperForm.allocate.replace(/[^\d]/g, '')"
        />
      </el-form-item>
      <el-form-item label="执行金额" style="width: 48%">
        <el-input
          v-model="peoperForm.execute"
          :disabled="dialogVisibleTitle == '查看经费'"
          @input="peoperForm.execute = peoperForm.execute.replace(/[^\d]/g, '')"
        />
      </el-form-item>
      <el-form-item label="完成比例" style="width: 48%">
        <el-input
          v-model="peoperForm.proportion"
          :disabled="dialogVisibleTitle == '查看经费'"
          @input="peoperForm.proportion = peoperForm.proportion.replace(/[^\d]/g, '')"
        />
      </el-form-item>
      <el-form-item style="width: 48%" />
      <el-form-item
        v-if="
          dialogVisibleTitle == '添加经费' || dialogVisibleTitle == '编辑经费'
        "
        style="width: 100%"
      >
        <el-button type="primary" @click="onSubmit">立即创建</el-button>
        <el-button @click="handleClose">取消</el-button>
      </el-form-item>
      <el-form-item v-else>
        <el-button @click="handleClose">关闭</el-button>
      </el-form-item>
    </el-form>
    </el-dialog>

    <el-dialog
      title="文件"
      :visible.sync="fileUploadShow"
      width="65%"
      :before-close="handleClose"
    >
      <div v-if="fileId != ''" class="uploader">
        <!-- <button class="upload_images_input"></button> -->
        <el-form
          ref="form"
          :model="peoperForm"
          label-width="200px"
          style="display: flex; flex-wrap: wrap"
        >
          <el-form-item label="文件选择" style="width: 48%">
            <el-upload
              ref="upload"
              class="upload-demo"
              action="123"
              :http-request="carImgChange"
              :disabled="dialogVisibleTitle == '查看员工'"
              :show-file-list="false"
            >
              <el-button type="primary">文件导入</el-button>
            </el-upload>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>

    <el-dialog
      title="文件查看"
      :visible.sync="fileSeeShow"
      width="65%"
      :before-close="handleClose"
    >
      <div v-for="item in fileList" :key="item.id">
        <el-form
          ref="form"
          :model="peoperForm"
          label-width="200px"
          style="display: flex; flex-wrap: wrap"
        >
          <el-form-item label="文件查看" style="width: 48%">
            <span>{{ item.name }}
              <i
                class="el-icon-circle-close"
                @click="handleRemove(item)"
              /></span>
            <el-button type="text" @click="downloadFile(item)">下载</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import http from '@/config/http.js'
export default {
  components: {
    Pagination
  },
  mixins: [http],
  data() {
    return {
      fileSeeShow: false,
      fileUploadShow: false,
      fileList: [],
      pageNumber: 1,
      pageSize: 10,
      fileType: '1',
      total: 0,
      peoperForm: {
        year: '2019',
        name: '', // 姓名
        moneyCardName: '', // 性别
        moneyCardId: '', // 生日
        execute: '', // 所在单位
        execute: '', // 轮次
        allocate: '', // 入党时间
        budget: '', // 参加工作时间
        jobThree: '' // 工作经历3
      },
      dialogVisibleTitle: '',
      dialogVisible: false,
      tableData: [],
      isEdit: false,
      fileId: ''
    }
  },
  created() {
    this.inspectionSurveySelect()
  },
  methods: {
    fileUploadDialog(row) {
      this.fileUploadShow = true
      this.fileId = row.id
    },
    fileSeeDialog(row) {
      this.fileSeeShow = true
      row.yearBodyEntities.filter((item) => {
        item.name = item.filename
      })
      this.fileList = row.yearBodyEntities
    },
    // 初始化获取
    inspectionSurveySelect() {
      this.apiPost('/yearEntity/select', {
        pageSize: this.pageSize,
        pageNumber: this.pageNumber,
        year: this.peoperForm.year
      }).then((res) => {
        this.tableData = res.data
        this.total = res.tel
      })
    },
    // 文件上传
    carImgChange(e) {
      console.log(e)
      const carImgList = e.file
      if (this.fileType == 0) {
        this.$message({
          message: '请先选择文件类型',
          type: 'info'
        })
        return false
      } else if (carImgList.length > 1) {
        this.$message({
          message: '单次最多上传1张，请重新选择',
          type: 'info'
        })
        return false
      } else {
        const { uploadFiles } = this.$refs.upload
        const form = new FormData()
        // 每次传文件列表的最后一项
        const item = uploadFiles[uploadFiles.length - 1]
        form.append('multipartFile', item.raw)
        form.append('headId', this.fileId)
        form.append('fileType', this.fileType)
        this.apiPostJson('yearEntity/savebody', form).then(
          (res) => {
            if (res.code == 200) {
              this.$message({
                message: '文件上传成功',
                type: 'success'
              })
              this.handleClose()
              this.inspectionSurveySelect()
            }
          }
        )
      }
    },
    downloadFile(item) {
      window.location.href = 'http://192.168.43.6:8083/filedownload?filepath=' + item.fileurl
    },
    handleRemove(item) {
      const that = this
      this.apiPost('yearEntity/delete', {
        id: item.id
      }).then((res) => {
        if (res.code == 200) {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          that.handleClose()
        } else {
          this.$message({
            message: '服务器繁忙,请稍后重试'
          })
          that.handleClose()
        }
        this.handleClose()
        this.inspectionSurveySelect()
      })
    },
    // 点击新增
    addDirective() {
      this.isEdit = false
      this.dialogVisible = true
      this.dialogVisibleTitle = '添加经费'
      this.fileId = ''
      this.fileList = []
      this.peoperForm = {
        year: '2019',
        name: '', // 姓名
        moneyCardName: '', // 性别
        moneyCardId: '', // 生日
        execute: '', // 所在单位
        execute: '', // 轮次
        allocate: '', // 入党时间
        budget: '' // 参加工作时间
      }
    },
    handleClick(row) {
      this.fileId = row.id
      this.dialogVisible = true
      this.dialogVisibleTitle = '查看经费'
      this.peoperForm = row
      row.yearBodyEntities.filter((item) => {
        item.name = item.filename
      })
      this.fileList = row.yearBodyEntities
    },
    // 点击编辑
    editFn(row) {
      this.fileId = row.id
      this.isEdit = true
      this.dialogVisible = true
      this.dialogVisibleTitle = '编辑经费'
      this.peoperForm = row
      row.yearBodyEntities.filter((item) => {
        item.name = item.filename
      })
      this.fileList = row.yearBodyEntities
    },
    handleClose() {
      this.dialogVisible = false
      this.fileUploadShow = false
      this.fileSeeShow = false
      this.fileList = []
      this.peoperForm = {
        year: '2019',
        name: '', // 姓名
        moneyCardName: '', // 性别
        moneyCardId: '', // 生日
        execute: '', // 所在单位
        execute: '', // 轮次
        allocate: '', // 入党时间
        budget: '' // 参加工作时间
      }
    },
    pagination(val) {
      (this.pageNumber = val.page),
      (this.pageSize = val.limit),
      this.inspectionSurveySelect()
    },
    // 点击确认添加
    onSubmit() {
      let url = ''
      if (this.isEdit) {
        delete this.peoperForm.yearBodyEntities
        url = '/yearEntity/update'
      } else {
        url = '/yearEntity/save'
      }
      this.apiPost(url, this.peoperForm).then((res) => {
        if (res.code == 200) {
          this.$message({
            message: '保存成功',
            type: 'success'
          })
          this.fileId = res.data.id
          this.inspectionSurveySelect()
        }
      })
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
.el-icon-circle-close {
  color: red;
  cursor: pointer;
}
</style>

