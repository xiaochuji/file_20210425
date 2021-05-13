<template>
  <div class="general_box">
    <div>
      <el-form
        label-width="200px"
        style="display: flex; flex-wrap: wrap"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="类型：">
              <el-select v-model="operatetype" placeholder="请选择">
                <el-option
                  v-for="item in operatetypes"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="模块名称：" prop="principalTel">
              <el-input v-model="operatemodule" placeholder="请输入客户所属门店" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item>
          <el-button type="primary" size="mini" @click="inspectionSurveySelect">查询</el-button>
          <el-button size="mini" @click="clear">清空</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="general_table">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="operatedesc" label="操作说明" />
        <el-table-column prop="operatemodule" label="模块" />
        <el-table-column prop="operatestaffname" label="操作员" />
        <el-table-column prop="operatetype" label="类型" />
        <el-table-column prop="operatets" label="时间" />
      </el-table>
      <Pagination
        :total="total"
        :page="pageNumber"
        :limit="pageSize"
        @pagination="pagination"
      />
    </div>
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
      operatetypes: [
        {
          value: '新增',
          label: '新增'
        },
        {
          value: '修改',
          label: '修改'
        },
        {
          value: '删除',
          label: '删除'
        }
      ],
      tableData: [],
      pageNumber: 1,
      pageSize: 10,
      isUpdate: false,
      total: 0,
      operatetype: '',
      operatemodule: ''
    }
  },
  created() {
    this.inspectionSurveySelect()
  },
  methods: {
    // 初始化查询
    inspectionSurveySelect() {
      this.apiPost('operLog/select', {
        pageNumber: this.pageNumber,
        pageSize: this.pageSize,
        operatetype: this.operatetype,
        operatemodule: this.operatemodule
      }).then((res) => {
        if (res.code == 200) {
          this.tableData = res.data
          this.total = res.tel
        }
      })
    },
    clear() {
      this.pageNumber = 1
      this.pageSize = 10
      this.operatetype = ''
      this.operatemodule = ''
      this.inspectionSurveySelect()
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
</style>
