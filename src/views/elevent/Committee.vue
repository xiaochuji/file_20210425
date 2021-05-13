<template>
  <div class="general_box">
    <div class="general_title">
      <el-button type="primary" @click="addGeneral">添加</el-button>
    </div>
    <div class="general_table">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="turn" label="会议序号" />
        <el-table-column prop="meetingTime" label="会议时间" />
        <el-table-column prop="endTime" label="现场巡视结束时间" />
        <el-table-column prop="closure" label="听汇报距现场巡视结束天数" />
        <el-table-column prop="meetingOne" label="会议议题1" />
        <el-table-column prop="meetingTwo" label="会议议题2" />
        <el-table-column prop="meetingThree" label="会议议题3" />
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
            <el-form-item label="会议序号" style="width: 48%">
              <el-input v-model="peoperForm.turn" :disabled="dialogVisibleTitle == '查看概况'" />
            </el-form-item>
            <el-form-item label="会议时间" style="width: 48%">
              <el-date-picker
                v-model="peoperForm.meetingTime"
                type="date"
                style="width:100%"
                :disabled="dialogVisibleTitle == '查看概况'"
                value-format="yyyy-MM-dd"
                placeholder="选择日期"
              />
            </el-form-item>
            <el-form-item label="会议类型" style="width: 48%">
              <el-select
                v-model="peoperForm.type"
                style="width:100%"
                placeholder="请选择"
                :disabled="dialogVisibleTitle == '查看概况'"
              >
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="现场巡视结束时间" style="width: 48%">
              <el-date-picker
                v-model="peoperForm.endTime"
                type="date"
                style="width:100%"
                :disabled="dialogVisibleTitle == '查看概况'"
                value-format="yyyy-MM-dd"
                placeholder="选择日期"
              />
            </el-form-item>
            <el-form-item label="听汇报距现场巡视结束天数" style="width: 48%">
              <el-input v-model="peoperForm.closure" :disabled="dialogVisibleTitle == '查看概况'" />
            </el-form-item>
            <el-form-item label="会议地点" style="width: 48%">
              <el-input v-model="peoperForm.meetingPlace" :disabled="dialogVisibleTitle == '查看概况'" />
            </el-form-item>
            <el-form-item label="参会人员" style="width: 48%">
              <el-input v-model="peoperForm.people" :disabled="dialogVisibleTitle == '查看概况'" />
            </el-form-item>
            <el-form-item label="会议议题1" style="width: 48%">
              <el-input v-model="peoperForm.meetingOne" :disabled="dialogVisibleTitle == '查看概况'" />
            </el-form-item>
            <el-form-item label="会议议题2" style="width: 48%">
              <el-input v-model="peoperForm.meetingTwo" :disabled="dialogVisibleTitle == '查看概况'" />
            </el-form-item>
            <el-form-item label="会议议题3" style="width: 48%">
              <el-input v-model="peoperForm.meetingThree" :disabled="dialogVisibleTitle == '查看概况'" />
            </el-form-item>
            <el-form-item label="涉及问题线索情况" style="width: 48%">
              <el-input v-model="peoperForm.clue" :disabled="dialogVisibleTitle == '查看概况'" />
            </el-form-item>
            <el-form-item label="党委书记点具体人数" style="width: 48%">
              <el-input v-model="peoperForm.specificNumber" :disabled="dialogVisibleTitle == '查看概况'" />
            </el-form-item>
            <el-form-item label="党委书记点具体人姓名" style="width: 48%">
              <el-input v-model="peoperForm.specificName" :disabled="dialogVisibleTitle == '查看概况'" />
            </el-form-item>
            <el-form-item label="党委书记点具体问题数" style="width: 48%">
              <el-input v-model="peoperForm.specificProblemNumber" :disabled="dialogVisibleTitle == '查看概况'" />
            </el-form-item>
            <el-form-item label="党委书记点具体问题" style="width: 48%">
              <el-input v-model="peoperForm.specificProblem" :disabled="dialogVisibleTitle == '查看概况'" />
            </el-form-item>
          </el-form>
          <div v-if="dialogVisibleTitle == '查看概况'" style="text-align: center">
            <el-button @click="closeGeneral">关闭</el-button>
          </div>
          <div v-else style="text-align: center">
            <el-button type="primary" @click="onSubmit">保存</el-button>
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
      tableData: [],
      fileSeeShow: false,
      fileUploadShow: false,
      fileType: '1',
      fileList: [],
      options: [
        {
          value: '1',
          label: '听取汇报'
        },
        {
          value: '2',
          label: '研究巡察相关工作'
        }
      ],
      fileId: '',
      pageNumber: 1,
      pageSize: 10,
      isUpdate: false,
      total: 0,
      dialogVisible: false,
      dialogVisibleTitle: '',
      peoperForm: {
        turn: '', //		会议序号
        meetingTime: '', //		会议时间
        type: '', //		会议类型（听取汇报/研究巡察相关工作）
        endTime: '', //		现场巡视结束时间
        closure: '', //		听汇报距现场巡视结束天数
        meetingPlace: '', //		会议地点
        people: '', //		参会人员
        meetingOne: '', //		会议议题1
        meetingTwo: '', //		会议议题2
        meetingThree: '', //		会议议题3
        clue: '', //		涉及问题线索情况
        specificNumber: '', //		党委书记点具体人数
        specificName: '', //		党委书记点具体人姓名
        specificProblemNumber: '', //		党委书记点具体问题数
        specificProblem: '' //		党委书记点具体问题
      }
    }
  },
  created() {
    this.inspectionSurveySelect()
  },
  methods: {
    downloadFile(item) {
      window.location.href = 'http://192.168.43.6:8083/filedownload?filepath=' + item.fileurl
    },
    fileUploadDialog(row) {
      this.fileUploadShow = true
      this.fileId = row.id
    },
    fileSeeDialog(row) {
      this.fileSeeShow = true
      row.standingCommitteeBodyEntities.filter((item) => {
        item.name = item.filename
      })
      this.fileList = row.standingCommitteeBodyEntities
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
        this.apiPostJson('standingCommittee/savebody', form).then(
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
      this.apiPost('standingCommittee/delete', {
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
      this.apiPost('standingCommittee/select', {
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
        turn: '', //		会议序号
        meetingTime: '', //		会议时间
        type: '', //		会议类型（听取汇报/研究巡察相关工作）
        endTime: '', //		现场巡视结束时间
        closure: '', //		听汇报距现场巡视结束天数
        meetingPlace: '', //		会议地点
        people: '', //		参会人员
        meetingOne: '', //		会议议题1
        meetingTwo: '', //		会议议题2
        meetingThree: '', //		会议议题3
        clue: '', //		涉及问题线索情况
        specificNumber: '', //		党委书记点具体人数
        specificName: '', //		党委书记点具体人姓名
        specificProblemNumber: '', //		党委书记点具体问题数
        specificProblem: '' //		党委书记点具体问题
      }
    },
    // 取消
    closeGeneral() {
      this.handleClose()
    },
    onSubmit() {
      let url = ''
      if (this.isUpdate) {
        url = 'standingCommittee/update'
      } else {
        url = 'standingCommittee/save'
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
        turn: '', //		会议序号
        meetingTime: '', //		会议时间
        type: '', //		会议类型（听取汇报/研究巡察相关工作）
        endTime: '', //		现场巡视结束时间
        closure: '', //		听汇报距现场巡视结束天数
        meetingPlace: '', //		会议地点
        people: '', //		参会人员
        meetingOne: '', //		会议议题1
        meetingTwo: '', //		会议议题2
        meetingThree: '', //		会议议题3
        clue: '', //		涉及问题线索情况
        specificNumber: '', //		党委书记点具体人数
        specificName: '', //		党委书记点具体人姓名
        specificProblemNumber: '', //		党委书记点具体问题数
        specificProblem: '' //		党委书记点具体问题
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

.upload_images_input {
  width: 100px;
  height: 100px;
  border: 1px solid #ccc;
  background: url("../../assets/images/OIP.jpg");
  background-size: cover;
}
.uploader {
  position: relative;
}
.upload_images_inputs {
  position: absolute;
  top: 0;
  opacity: 0;
  z-index: 99;
  left: 0;
  width: 100px;
  height: 100px;
}
.el-icon-circle-close {
  color: red;
  cursor: pointer;
}
</style>
