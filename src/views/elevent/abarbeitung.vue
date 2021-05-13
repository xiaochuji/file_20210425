<template>
  <div class="general_box">
    <div class="general_title">
      <el-button type="primary" @click="addGeneral">添加</el-button>
    </div>
    <div class="general_table">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="turn" label="轮次" />
        <el-table-column
          prop="departmentName"
          label="被巡察院级/党组织名称"
        />
        <el-table-column prop="feedback" label="巡察反馈问/题应整改数" />
        <el-table-column
          prop="alreadyFeedback"
          label="巡察反馈问题/已整改数"
        />
        <el-table-column prop="immediately" label="完成率" />
        <el-table-column prop="accountability" label="整改不力问责/党组织数" />
        <el-table-column prop="accountabilityPeople" label="整改不力/问责人员数" />
        <el-table-column label="操作">
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
            <el-button type="text" size="small" @click="lookRow(scope.row)">查看</el-button>
            <el-button type="text" size="small" @click="editRow(scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <Pagination
        :total="total"
        :page="pageNumber"
        :limit="pageSize"
        @pagination="pagination"
      />
    </div>
    <div class="general_dialog">
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
            <el-form-item label="轮次" style="width: 48%">
              <el-input v-model="peoperForm.turn" :disabled="dialogVisibleTitle == '查看概况'" />
            </el-form-item>
            <el-form-item label="被巡察院级党组织名称" style="width: 48%">
              <el-input v-model="peoperForm.departmentName" :disabled="dialogVisibleTitle == '查看概况'" />
            </el-form-item>
            <el-form-item label="巡察反馈问题应整改数" style="width: 48%">
              <el-input v-model="peoperForm.feedback" :disabled="dialogVisibleTitle == '查看概况'" />
            </el-form-item>
            <el-form-item label="巡察反馈问题已整改数" style="width: 48%">
              <el-input v-model="peoperForm.alreadyFeedback" :disabled="dialogVisibleTitle == '查看概况'" />
            </el-form-item>
            <el-form-item label="完成率" style="width: 48%">
              <el-input v-model="peoperForm.complete" :disabled="dialogVisibleTitle == '查看概况'" />
            </el-form-item>
            <el-form-item label="立行立改应整改数" style="width: 48%">
              <el-input v-model="peoperForm.immediately" :disabled="dialogVisibleTitle == '查看概况'" />
            </el-form-item>
            <el-form-item label="立行立改已整改数" style="width: 48%">
              <el-input v-model="peoperForm.alreadyImmediately" :disabled="dialogVisibleTitle == '查看概况'" />
            </el-form-item>
            <el-form-item label="完成率" style="width: 48%">
              <el-input v-model="peoperForm.immediatelyComplete" :disabled="dialogVisibleTitle == '查看概况'" />
            </el-form-item>
            <el-form-item label="相关职能部门应落实意见数" style="width: 48%">
              <el-input v-model="peoperForm.function" :disabled="dialogVisibleTitle == '查看概况'" />
            </el-form-item>
            <el-form-item label="相关职能部门已落实意见数" style="width: 48%">
              <el-input v-model="peoperForm.alreadyFunction" :disabled="dialogVisibleTitle == '查看概况'" />
            </el-form-item>
            <el-form-item label="完成率" style="width: 48%">
              <el-input v-model="peoperForm.functionComplete" :disabled="dialogVisibleTitle == '查看概况'" />
            </el-form-item>
            <el-form-item label="整改不力问责党组织数" style="width: 48%">
              <el-input v-model="peoperForm.accountability" :disabled="dialogVisibleTitle == '查看概况'" />
            </el-form-item>
            <el-form-item label="	整改不力问责人员数" style="width: 48%">
              <el-input v-model="peoperForm.accountabilityPeople" :disabled="dialogVisibleTitle == '查看概况'" />
            </el-form-item>
          </el-form>
          <div v-if="dialogVisibleTitle == '查看概况'" style="text-align: center">
            <el-button @click="closeGeneral">关闭</el-button>
          </div>
          <div v-else style="text-align: center">
            <el-button type="primary" @click="onSubmit">立即创建</el-button>
            <el-button @click="closeGeneral">取消</el-button>
          </div>
        </div>
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
      fileType: '1',
      fileList: [],
      tableData: [],
      fileId: '',
      pageNumber: 1,
      pageSize: 10,
      total: 0,
      isUpdate: false,
      dialogVisible: false,
      dialogVisibleTitle: '',
      peoperForm: {
        turn: '', // 轮次
        departmentName: '', // 被巡察院级党组织名称
        departmentid: '', // 被巡察院级党组织id
        feedback: '', // 巡察反馈问题应整改数
        alreadyFeedback: '', // 巡察反馈问题已整改数
        complete: '', // 完成率
        immediately: '', // 立行立改应整改数
        alreadyImmediately: '', // 立行立改已整改数
        immediatelyComplete: '', // 完成率
        function: '', // 相关职能部门应落实意见数
        alreadyFunction: '', // 相关职能部门已落实意见数
        functionComplete: '', // 完成率
        accountability: '', // 整改不力问责党组织数
        accountabilityPeople: '' // 整改不力问责人员数
      }
    }
  },
  created() {
    this.inspectionSurveySelect()
  },
  methods: {
    renderheader(h, { column, $index }) {
      return h('span', {}, [
        h('span', {}, column.label.split('/')[0]),
        h('br'),
        h('span', {}, column.label.split('/')[1])
      ])
    },
    downloadFile(item) {
      window.location.href = 'http://192.168.43.6:8083/filedownload?filepath=' + item.fileurl
    },
    fileUploadDialog(row) {
      this.fileUploadShow = true
      this.fileId = row.id
    },
    fileSeeDialog(row) {
      this.fileSeeShow = true
      row.inspectionRectificationBodyEntities.filter((item) => {
        item.name = item.filename
      })
      this.fileList = row.inspectionRectificationBodyEntities
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
        this.apiPostJson('inspectionRectification/savebody', form).then(
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
    handleRemove(item) {
      const that = this
      this.apiPost('inspectionRectification/delete', {
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
    // 初始化查询
    inspectionSurveySelect() {
      this.apiPost('inspectionRectification/select', {
        pageNumber: this.pageNumber,
        pageSize: this.pageSize
      }).then((res) => {
        if (res.code == 200) {
          this.tableData = res.data
          this.total = res.tel
        }
      })
    },
    // 查看
    lookRow(row) {
      this.dialogVisibleTitle = '查看概况'
      this.dialogVisible = true
      this.peoperForm = row
      this.fileId = row.id
    },
    // 编辑
    editRow(row) {
      this.isUpdate = true
      this.fileId = row.id
      this.dialogVisibleTitle = '编辑概况'
      this.dialogVisible = true
      this.peoperForm = row
    },
    // 点击新增
    addGeneral() {
      this.isUpdate = false
      this.dialogVisible = true
      this.dialogVisibleTitle = '新增概况'
      this.fileId = ''
      this.peoperForm = {
        turn: '', // 轮次
        departmentName: '', // 被巡察院级党组织名称
        departmentid: '', // 被巡察院级党组织id
        feedback: '', // 巡察反馈问题应整改数
        alreadyFeedback: '', // 巡察反馈问题已整改数
        complete: '', // 完成率
        immediately: '', // 立行立改应整改数
        alreadyImmediately: '', // 立行立改已整改数
        immediatelyComplete: '', // 完成率
        function: '', // 相关职能部门应落实意见数
        alreadyFunction: '', // 相关职能部门已落实意见数
        functionComplete: '', // 完成率
        accountability: '', // 整改不力问责党组织数
        accountabilityPeople: '' // 整改不力问责人员数
      }
    },
    // 取消
    closeGeneral() {
      this.handleClose()
    },
    onSubmit() {
      let url = ''
      if (this.isUpdate) {
        url = 'inspectionRectification/update'
      } else {
        url = 'inspectionRectification/save'
      }
      this.apiPost(url, this.peoperForm).then((res) => {
        if (res.code == 200) {
          this.$message({
            message: '保存成功',
            type: 'success'
          })
          this.handleClose()
          this.inspectionSurveySelect()
        }
      })
    },
    handleClose() {
      this.dialogVisible = false
      this.fileUploadShow = false
      this.fileSeeShow = false
      this.fileList = []
      this.peoperForm = {
        turn: '', // 轮次
        departmentName: '', // 被巡察院级党组织名称
        departmentid: '', // 被巡察院级党组织id
        feedback: '', // 巡察反馈问题应整改数
        alreadyFeedback: '', // 巡察反馈问题已整改数
        complete: '', // 完成率
        immediately: '', // 立行立改应整改数
        alreadyImmediately: '', // 立行立改已整改数
        immediatelyComplete: '', // 完成率
        function: '', // 相关职能部门应落实意见数
        alreadyFunction: '', // 相关职能部门已落实意见数
        functionComplete: '', // 完成率
        accountability: '', // 整改不力问责党组织数
        accountabilityPeople: '' // 整改不力问责人员数
      }
    },
    pagination(val) {
      (this.pageNumber = val.page),
      (this.pageSize = val.limit),
      this.inspectionSurveySelect()
    }
  }
}
</script>
<style scoped>
.general_box {
  width: 100%;
  height: 100%;
  padding: 20px;
}

.upload_images_input{
  width: 100px;
  height: 100px;
  border: 1px solid #ccc;
  background: url('../../assets/images/OIP.jpg');
  background-size: cover;
}
.uploader{
  position: relative;
}
.upload_images_inputs{
  position: absolute;
  top: 0;
  opacity: 0;
  z-index: 99;
  left: 0;
  width: 100px;
  height: 100px
}
.el-icon-circle-close {
  color: red;
  cursor: pointer;
}
</style>
