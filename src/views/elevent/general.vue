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
          :render-header="renderheader"
        />
        <el-table-column prop="talk" label="谈话人数" />
        <el-table-column
          prop="departmentPeople"
          label="被巡察单位/人员总数"
          :render-header="renderheader"
        />
        <el-table-column prop="questionnaire" label="问卷调查份数" :render-header="renderheader" />
        <el-table-column prop="clueNumber" label="问题线索/涉及人数" :render-header="renderheader" />
        <el-table-column prop="address" label="地址" />
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
            <el-form-item label="被巡察单位党员总数" style="width: 48%">
              <el-input v-model="peoperForm.departmentPeople" :disabled="dialogVisibleTitle == '查看概况'" />
            </el-form-item>
            <el-form-item label="谈话人数" style="width: 48%">
              <el-input v-model="peoperForm.talk" :disabled="dialogVisibleTitle == '查看概况'" />
            </el-form-item>
            <el-form-item label="参加巡查轮次" style="width: 48%">
              <el-input v-model="peoperForm.name" :disabled="dialogVisibleTitle == '查看概况'" />
            </el-form-item>
            <el-form-item label="问卷调查份数" style="width: 48%">
              <el-input v-model="peoperForm.questionnaire" :disabled="dialogVisibleTitle == '查看概况'" />
            </el-form-item>
            <el-form-item label="听取专题汇报数量" style="width: 48%">
              <el-input v-model="peoperForm.report" :disabled="dialogVisibleTitle == '查看概况'" />
            </el-form-item>
            <el-form-item label="召开座谈会数量" style="width: 48%">
              <el-input v-model="peoperForm.forum" :disabled="dialogVisibleTitle == '查看概况'" />
            </el-form-item>
            <el-form-item label="列席会议数量" style="width: 48%">
              <el-input v-model="peoperForm.meeting" :disabled="dialogVisibleTitle == '查看概况'" />
            </el-form-item>
            <el-form-item label="来信、来电、来访数量" style="width: 48%">
              <el-input v-model="peoperForm.visitors" :disabled="dialogVisibleTitle == '查看概况'" />
            </el-form-item>
            <el-form-item label="领导干部问题线索数量" style="width: 48%">
              <el-input v-model="peoperForm.clue" :disabled="dialogVisibleTitle == '查看概况'" />
            </el-form-item>
            <el-form-item label="问题线索涉及人数" style="width: 48%">
              <el-input v-model="peoperForm.clueNumber" :disabled="dialogVisibleTitle == '查看概况'" />
            </el-form-item>
            <el-form-item label="处级干部问题线索数量" style="width: 48%">
              <el-input v-model="peoperForm.cadre" :disabled="dialogVisibleTitle == '查看概况'" />
            </el-form-item>
            <el-form-item label="问题线索涉及处级干部人数" style="width: 48%">
              <el-input v-model="peoperForm.cadreNumber" :disabled="dialogVisibleTitle == '查看概况'" />
            </el-form-item>
            <el-form-item label="科级干部问题线索数量" style="width: 48%">
              <el-input v-model="peoperForm.administrative" :disabled="dialogVisibleTitle == '查看概况'" />
            </el-form-item>
            <el-form-item label="问题线索涉及科级干部人数" style="width: 48%">
              <el-input v-model="peoperForm.administrativeNumber" :disabled="dialogVisibleTitle == '查看概况'" />
            </el-form-item>
            <el-form-item label="问题线索涉及主要负责人数量" style="width: 48%">
              <el-input v-model="peoperForm.person" :disabled="dialogVisibleTitle == '查看概况'" />
            </el-form-item>
            <el-form-item label="列入进一步了解关注类人数" style="width: 48%">
              <el-input v-model="peoperForm.follow" :disabled="dialogVisibleTitle == '查看概况'" />
            </el-form-item>
            <el-form-item label="列入了解关注类人数" style="width: 48%">
              <el-input v-model="peoperForm.followNumber" :disabled="dialogVisibleTitle == '查看概况'" />
            </el-form-item>
            <el-form-item label="列入参考类人数" style="width: 48%">
              <el-input v-model="peoperForm.reference" :disabled="dialogVisibleTitle == '查看概况'" />
            </el-form-item>
            <el-form-item label="巡察发现的问题总数" style="width: 48%">
              <el-input v-model="peoperForm.total" :disabled="dialogVisibleTitle == '查看概况'" />
            </el-form-item>
            <el-form-item label="第一个落实方面问题数" style="width: 48%">
              <el-input v-model="peoperForm.first" :disabled="dialogVisibleTitle == '查看概况'" />
            </el-form-item>
            <el-form-item label="第二个落实方面问题数" style="width: 48%">
              <el-input v-model="peoperForm.second" :disabled="dialogVisibleTitle == '查看概况'" />
            </el-form-item>
            <el-form-item label="第三个落实方面问题数" style="width: 48%">
              <el-input v-model="peoperForm.third" :disabled="dialogVisibleTitle == '查看概况'" />
            </el-form-item>
            <el-form-item label="第四个落实方面问题数" style="width: 48%">
              <el-input v-model="peoperForm.fourth" :disabled="dialogVisibleTitle == '查看概况'" />
            </el-form-item>
            <el-form-item
              label="向被巡察单位提出整改意见数量"
              style="width: 48%"
            >
              <el-input v-model="peoperForm.rectification" :disabled="dialogVisibleTitle == '查看概况'" />
            </el-form-item>
            <el-form-item label="专项报告数量" style="width: 48%">
              <el-input v-model="peoperForm.special" :disabled="dialogVisibleTitle == '查看概况'" />
            </el-form-item>
            <el-form-item label="向职能部门提出的意见数量" style="width: 48%">
              <el-input v-model="peoperForm.function" :disabled="dialogVisibleTitle == '查看概况'" />
            </el-form-item>
            <el-form-item label="立行立改意见数量" style="width: 48%">
              <el-input v-model="peoperForm.immediately" :disabled="dialogVisibleTitle == '查看概况'" />
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
      fileSeeShow: false,
      fileUploadShow: false,
      fileType: '1',
      fileList: [],
      tableData: [],
      isUpdate: false,
      fileId: '',
      pageNumber: 1,
      pageSize: 10,
      total: 0,
      dialogVisible: false,
      dialogVisibleTitle: '',
      peoperForm: {
        turn: '', // 轮次
        departmentName: '', // 被巡察院级党组织名称
        departmentid: '', // 被巡察院级党组织id
        departmentPeople: '', // 被巡察单位人员总数
        talk: '', // 谈话次数
        questionnaire: '', // 问卷调查份数
        report: '', // 听取专题汇报数量
        forum: '', // 召开座谈会数量
        meeting: '', // 列席会议数量
        visitors: '', // 来信、来电、来访数量
        clue: '', // 领导干部问题线索数量
        clueNumber: '', // 问题线索涉及人数
        cadre: '', // 处级干部问题线索数量
        cadreNumber: '', // 问题线索涉及处级干部人数
        administrative: '', // 科级干部问题线索数量
        administrativeNumber: '', // 问题线索涉及科级干部人数
        person: '', // 问题线索涉及主要负责人数量
        follow: '', // 列入进一步了解关注类人数
        followNumber: '', // 列入了解关注类人数
        reference: '', // 列入参考类人数
        total: '', // 巡察发现的问题总数
        first: '', // 第一个落实方面问题数
        second: '', // 第二个落实方面问题数
        third: '', // 第三个落实方面问题数
        fourth: '', // 第四个落实方面问题数
        rectification: '', // 向被巡察单位提出整改意见数量
        special: '', // 专项报告数量
        function: '', // 向职能部门提出的意见数量
        immediately: '' // 立行立改意见数量
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
      row.inspectionSurveyBodyEntities.filter((item) => {
        item.name = item.filename
      })
      this.fileList = row.inspectionSurveyBodyEntities
    },
    // 初始化查询
    inspectionSurveySelect() {
      this.apiPost('inspectionSurvey/select', {
        pageNumber: this.pageNumber,
        pageSize: this.pageSize
      }).then((res) => {
        console.log(res)
        if (res.res) {
          this.tableData = res.data
          this.total = res.tel
        }
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
        this.apiPostJson('inspectionSurvey/savebody', form).then(
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
      this.apiPost('inspectionSurvey/delete', {
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
      this.dialogVisible = true
      this.dialogVisibleTitle = '新增概况'
      this.fileId = ''
      this.isUpdate = false
      this.peoperForm = {
        turn: '', // 轮次
        departmentName: '', // 被巡察院级党组织名称
        departmentid: '', // 被巡察院级党组织id
        departmentPeople: '', // 被巡察单位人员总数
        talk: '', // 谈话次数
        questionnaire: '', // 问卷调查份数
        report: '', // 听取专题汇报数量
        forum: '', // 召开座谈会数量
        meeting: '', // 列席会议数量
        visitors: '', // 来信、来电、来访数量
        clue: '', // 领导干部问题线索数量
        clueNumber: '', // 问题线索涉及人数
        cadre: '', // 处级干部问题线索数量
        cadreNumber: '', // 问题线索涉及处级干部人数
        administrative: '', // 科级干部问题线索数量
        administrativeNumber: '', // 问题线索涉及科级干部人数
        person: '', // 问题线索涉及主要负责人数量
        follow: '', // 列入进一步了解关注类人数
        followNumber: '', // 列入了解关注类人数
        reference: '', // 列入参考类人数
        total: '', // 巡察发现的问题总数
        first: '', // 第一个落实方面问题数
        second: '', // 第二个落实方面问题数
        third: '', // 第三个落实方面问题数
        fourth: '', // 第四个落实方面问题数
        rectification: '', // 向被巡察单位提出整改意见数量
        special: '', // 专项报告数量
        function: '', // 向职能部门提出的意见数量
        immediately: '' // 立行立改意见数量
      }
    },
    // 取消
    closeGeneral() {
      this.handleClose()
    },
    onSubmit() {
      let url = ''
      if (this.isUpdate) {
        url = 'inspectionSurvey/update'
      } else {
        url = 'inspectionSurvey/save'
      }
      this.apiPost(url, this.peoperForm).then((res) => {
        if (res.code == 200) {
          this.$message({
            message: '保存成功',
            type: 'success'
          })
          this.inspectionSurveySelect()
          this.handleClose()
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
        departmentPeople: '', // 被巡察单位人员总数
        talk: '', // 谈话次数
        questionnaire: '', // 问卷调查份数
        report: '', // 听取专题汇报数量
        forum: '', // 召开座谈会数量
        meeting: '', // 列席会议数量
        visitors: '', // 来信、来电、来访数量
        clue: '', // 领导干部问题线索数量
        clueNumber: '', // 问题线索涉及人数
        cadre: '', // 处级干部问题线索数量
        cadreNumber: '', // 问题线索涉及处级干部人数
        administrative: '', // 科级干部问题线索数量
        administrativeNumber: '', // 问题线索涉及科级干部人数
        person: '', // 问题线索涉及主要负责人数量
        follow: '', // 列入进一步了解关注类人数
        followNumber: '', // 列入了解关注类人数
        reference: '', // 列入参考类人数
        total: '', // 巡察发现的问题总数
        first: '', // 第一个落实方面问题数
        second: '', // 第二个落实方面问题数
        third: '', // 第三个落实方面问题数
        fourth: '', // 第四个落实方面问题数
        rectification: '', // 向被巡察单位提出整改意见数量
        special: '', // 专项报告数量
        function: '', // 向职能部门提出的意见数量
        immediately: '' // 立行立改意见数量
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
