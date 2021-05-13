<template>
  <div class="app-container">
    <el-button type="primary" @click="addDirective">添加</el-button>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="name" label="姓名" />
      <el-table-column prop="sex" label="性别" />
      <el-table-column prop="birthday" label="出生日期" />
      <el-table-column prop="company" label="所在单位" />
      <el-table-column prop="duty" label="职务" />
      <el-table-column prop="title" label="职称" />
      <el-table-column prop="phone" label="电话" />
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
          <el-button type="text" size="small" @click="editFn(scope.row)">编辑</el-button>
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
    ><el-form ref="form" :model="peoperForm" label-width="200px" :disabled="dialogVisibleTitle == '查看员工'" style="display: flex;flex-wrap: wrap">
      <el-form-item label="姓名" style="width: 48%">
        <el-input v-model="peoperForm.name" />
      </el-form-item>
      <el-form-item label="性别" style="width: 48%">
        <el-radio-group v-model="peoperForm.sex">
          <el-radio label="男" />
          <el-radio label="女" />
        </el-radio-group>
      </el-form-item>
      <el-form-item label="出生日期" style="width: 48%">
        <el-date-picker
          v-model="peoperForm.birthday"
          type="date"
          placeholder="选择日期"
          :disabled="dialogVisibleTitle == '查看员工'"
          value-format="yyyy-MM-dd"
          style="width: 100%"
        />
      </el-form-item>
      <el-form-item label="所在单位" style="width: 48%">
        <el-input v-model="peoperForm.company" />
      </el-form-item>
      <el-form-item label="参加巡查轮次" style="width: 48%">
        <el-input v-model="peoperForm.turn" />
      </el-form-item>
      <el-form-item label="入党时间" style="width: 48%">
        <el-date-picker
          v-model="peoperForm.partyTime"
          type="date"
          placeholder="选择日期"
          :disabled="dialogVisibleTitle == '查看员工'"
          value-format="yyyy-MM-dd"
          style="width: 100%"
        />
      </el-form-item>
      <el-form-item label="参加工作时间" style="width: 48%">
        <el-date-picker
          v-model="peoperForm.workTime"
          type="date"
          placeholder="选择日期"
          :disabled="dialogVisibleTitle == '查看员工'"
          value-format="yyyy-MM-dd"
          style="width: 100%"
        />
      </el-form-item>
      <el-form-item label="职务" style="width: 48%">
        <el-input v-model="peoperForm.duty" />
      </el-form-item>
      <el-form-item label="职称" style="width: 48%">
        <el-input v-model="peoperForm.title" />
      </el-form-item>
      <el-form-item label="电话" style="width: 48%">
        <el-input v-model="peoperForm.phone" />
      </el-form-item>
      <el-form-item label="邮箱" style="width: 48%">
        <el-input v-model="peoperForm.email" />
      </el-form-item>
      <el-form-item label="本科院校及专业" style="width: 48%">
        <el-input v-model="peoperForm.undergraduate" />
      </el-form-item>
      <el-form-item label="硕士研究生院校及专业" style="width: 48%">
        <el-input v-model="peoperForm.master" />
      </el-form-item>
      <el-form-item label="博士研究生院校及专业" style="width: 48%">
        <el-input v-model="peoperForm.doctor" />
      </el-form-item>
      <el-form-item label="工作经历1" style="width: 48%">
        <el-input v-model="peoperForm.jobOne" />
      </el-form-item>
      <el-form-item label="工作经历2" style="width: 48%">
        <el-input v-model="peoperForm.jobTwo" />
      </el-form-item>
      <el-form-item label="工作经历3" style="width: 48%">
        <el-input v-model="peoperForm.jobThree" />
      </el-form-item>
      <el-form-item v-if="dialogVisibleTitle == '添加员工' || dialogVisibleTitle == '编辑员工'">
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
      <div class="uploader">
        <!-- <button class="upload_images_input"></button> -->
        <el-form
          ref="form"
          :model="peoperForm"
          label-width="200px"
          style="display: flex; flex-wrap: wrap"
        >
          <el-form-item label="文件类型" style="width: 48%">
            <el-select v-model="fileType" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :disabled="dialogVisibleTitle == '查看员工'"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
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
          <el-form-item label="文件类型" style="width: 50%">
            <el-select
              v-model="item.filetype"
              :disabled="true"
              placeholder="请选择"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
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
      options: [
        {
          value: '1',
          label: '抽调表'
        },
        {
          value: '2',
          label: '工作总结'
        },
        {
          value: '3',
          label: '鉴定'
        },
        {
          value: '4',
          label: '承诺书'
        }
      ],
      fileList: [],
      pageNumber: 1,
      pageSize: 10,
      fileType: '',
      total: 0,
      peoperForm: {
        name: '', // 姓名
        sex: '', // 性别
        birthday: '', // 生日
        company: '', // 所在单位
        turn: '', // 轮次
        partyTime: '', // 入党时间
        workTime: '', // 参加工作时间
        duty: '', // 职务
        title: '', // 职称
        phone: '', // 电话
        email: '', // 邮箱
        undergraduate: '', // 本科院校及专业
        master: '', // 研究生院校及专业
        doctor: '', // 博士研究生
        jobOne: '', // 工作经历1
        jobTwo: '', // 工作经历3
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
      row.inspectionTeamMemberBodyEntities.filter((item) => {
        item.name = item.filename
      })
      this.fileList = row.inspectionTeamMemberBodyEntities
    },
    // 初始化获取
    inspectionSurveySelect() {
      this.apiPost('/inspectionTeamMemberEntity/select', {
        pageSize: this.pageSize,
        pageNumber: this.pageNumber
      }).then(res => {
        if (res.code == 200) {
          this.tableData = res.data
          this.total = res.tel
        }
      })
    },
    carImgChange(e) {
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
        this.apiPost(
          'inspectionTeamMemberEntity/savebody',
          form
        ).then((res) => {
          if (res.code == 200) {
            this.$message({
              message: '文件上传成功',
              type: 'success'
            })
            this.inspectionSurveySelect()
            this.handleClose()
          }
        })
      }
    },
    handleRemove(item) {
      const that = this
      this.apiPost('inspectionTeamMemberEntity/delete', {
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
    downloadFile(item) {
      window.location.href = 'http://192.168.43.6:8083/filedownload?filepath=' + item.fileurl
    },
    // 点击新增
    addDirective() {
      this.isEdit = false
      this.dialogVisible = true
      this.dialogVisibleTitle = '添加员工'
      this.fileId = ''
      this.peoperForm = {
        name: '', // 姓名
        sex: '', // 性别
        birthday: '', // 生日
        company: '', // 所在单位
        turn: '', // 轮次
        partyTime: '', // 入党时间
        workTime: '', // 参加工作时间
        duty: '', // 职务
        title: '', // 职称
        phone: '', // 电话
        email: '', // 邮箱
        undergraduate: '', // 本科院校及专业
        master: '', // 研究生院校及专业
        doctor: '', // 博士研究生
        jobOne: '', // 工作经历1
        jobTwo: '', // 工作经历3
        jobThree: '' // 工作经历3
      }
    },
    handleClick(row) {
      this.fileId = row.id
      this.dialogVisible = true
      this.dialogVisibleTitle = '查看员工'
      this.peoperForm = row
      row.inspectionTeamMemberBodyEntities.filter((item) => {
        item.name = item.filename
      })
      this.fileList = row.inspectionTeamMemberBodyEntities
    },
    // 点击编辑
    editFn(row) {
      this.fileId = row.id
      this.isEdit = true
      this.dialogVisible = true
      this.dialogVisibleTitle = '编辑员工'
      this.peoperForm = row
      row.inspectionTeamMemberBodyEntities.filter((item) => {
        item.name = item.filename
      })
      this.fileList = row.inspectionTeamMemberBodyEntities
    },
    handleClose() {
      this.dialogVisible = false
      this.fileUploadShow = false
      this.fileSeeShow = false
      this.peoperForm = {
        name: '', // 姓名
        sex: '', // 性别
        birthday: '', // 生日
        company: '', // 所在单位
        turn: '', // 轮次
        partyTime: '', // 入党时间
        workTime: '', // 参加工作时间
        duty: '', // 职务
        title: '', // 职称
        phone: '', // 电话
        email: '', // 邮箱
        undergraduate: '', // 本科院校及专业
        master: '', // 研究生院校及专业
        doctor: '', // 博士研究生
        jobOne: '', // 工作经历1
        jobTwo: '', // 工作经历3
        jobThree: '' // 工作经历3
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
        delete this.peoperForm.inspectionTeamMemberBodyEntities
        url = '/inspectionTeamMemberEntity/update'
      } else {
        url = '/inspectionTeamMemberEntity/save'
      }
      this.apiPost(url, this.peoperForm).then(res => {
        if (res.code == 200) {
          this.fileId = res.data.id
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

