<template>
  <div class="userList">
    <el-radio-group v-model="tabType" style="margin-bottom: 30px;" @change="onTabNav">
      <el-radio-button label="client">客户端</el-radio-button>
      <el-radio-button label="guild">公会</el-radio-button>
    </el-radio-group>
    <searchForm :formOptions="formOptions" @onSearch="handleSearch" />

    <div class="listBox">
      <div class="tableBox">
        <el-table :data="tableData" tooltip-effect="dark" style="width: 100%">
          <el-table-column prop="userId" label="id" min-width="100"></el-table-column>
          <el-table-column prop="myname" label="昵称" min-width="140"></el-table-column>
          <el-table-column prop="name" label="姓名" min-width="140"></el-table-column>
          <el-table-column prop="phone" label="手机号" min-width="120"></el-table-column>
          <el-table-column prop="mobile" label="证件类型" min-width="80" :formatter="certificateFormatter">
          </el-table-column>
          <el-table-column prop="certificateNo" label="证件号码" min-width="180"></el-table-column>
          <el-table-column :key="Math.random()" prop="photoPositive" label="证件照" min-width="80">
            <template slot-scope="scope">
              <el-button size="mini" type="success" @click="onCheckImg(scope.row)">查看</el-button>
            </template>
          </el-table-column>
          <el-table-column :key="Math.random()" prop="videoUrl" label="视频" min-width="80">
            <template slot-scope="scope">
              <el-button size="mini" type="success" @click="onCheckVideo(scope.row)">查看</el-button>
            </template>
          </el-table-column>

          <el-table-column
            v-if="tabType == 'guild'"
            :key="Math.random()"
            prop="photoPositive"
            label="个人简介"
            min-width="80"
          >
            <template slot-scope="scope">
              <el-button type="text" @click="onCheckIntro(scope.row)">查看</el-button>
            </template>
          </el-table-column>

          <el-table-column
            prop="guildName"
            v-if="tabType == 'guild'"
            label="隶属工会"
            min-width="160"
          ></el-table-column>

          <el-table-column label="审核状态" prop="status" min-width="80">
            <template slot-scope="scope">
              <span v-if="scope.row.status == 0" class="fz-primary-status">审核中</span>
              <span v-else-if="scope.row.status == 1" class="fz-success-status">通过</span>
              <span v-else class="fz-danger-status">未通过</span>
            </template>
          </el-table-column>

          <el-table-column v-if="tabType == 'client'" prop="createTime" width="160" label="时间"></el-table-column>
          <el-table-column v-else prop="modifyTime" label="时间" min-width="160"></el-table-column>

          <el-table-column label="操作" min-width="160" fixed="right">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" :disabled="scope.row.status != 0" @click="onPass(scope.row)"
                >通过</el-button
              >
              <el-button size="mini" type="danger" :disabled="scope.row.status != 0" @click="onNotPass(scope.row)"
                >不通过</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>

      <pagination
        :currentPage.sync="pagination.currentPage"
        :pageSize.sync="pagination.pageSize"
        :total="pagination.total"
        @currentChange="currentChange"
        @sizeChange="sizeChange"
      />
    </div>

    <imgCheck :title="picTitle" :imgList="imgCheckList" :dialogVis.sync="isImgCheck" />

    <videoPlay :dialogVisible.sync="isVideoPlay" title="视频" width="300px" :isAutoPlay="true" :videoUrl="videoUrl" />

    <auditDialog
      :visible.sync="isNoPass"
      :reasonList="reasonList"
      :isLoading="isLoading"
      @success="handleAuditSuccess"
    />
  </div>
</template>

<script>
import searchForm from '@/components/searchForm'
import pagination from '@/components/pagination'
import imgCheck from '@/components/imgCheck'
import videoPlay from '@/components/videoPlayDialog'
import auditDialog from '@/components/auditDialog'
import { findAllApply, updateStatus } from '@/api/anchor'
import { getCertificateType, getAuditStatus } from '@/filters/global'
import { anchorAuditTemplate } from '@/filters/auditTemplate'
export default {
  name: '',
  data() {
    return {
      tabType: 'client',
      isImgCheck: false, // 图片弹出框
      imgCheckList: [],
      isVideoPlay: false, // 视频
      videoUrl: '',
      picTitle: '', // 证件照dialog标题

      tableData: [],
      pagination: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      formdata: {
        infoSearch: '',
        type: '',
        status: '',
        startTime: '',
        endTime: ''
      },
      // 审核不通过相关
      isNoPass: false,
      isLoading: false,
      selectData: {}
    }
  },
  components: { searchForm, pagination, imgCheck, videoPlay, auditDialog },
  created() {
    this.getData()
  },
  watch: {},
  mounted() {},
  computed: {
    reasonList() {
      return anchorAuditTemplate()
    },
    formOptions() {
      let options = this.tabType === 'client' ? this.clientOptions : this.guildOptions
      return options
    },
    clientOptions() {
      return [...this.baseOptions, this.timeObj]
    },
    guildOptions() {
      return [...this.baseOptions, this.guildObj, this.timeObj]
    },
    baseOptions() {
      let options = [
        {
          label: 'ID/昵称',
          prop: 'infoSearch',
          element: 'el-input',
          initValue: '',
          placeholder: '请输入ID/昵称'
        },
        {
          label: '证件类型',
          prop: 'type',
          element: 'el-select',
          initValue: '',
          options: getCertificateType()
        },
        {
          label: '状态',
          prop: 'status',
          element: 'el-select',
          initValue: '',
          options: getAuditStatus()
        }
      ]
      return options
    },
    timeObj() {
      return {
        label: '时间',
        prop: 'times',
        element: 'el-date-picker',
        initValue: '',
        placeholder: ''
      }
    },
    guildObj() {
      return {
        label: '隶属公会',
        prop: 'guildName',
        element: 'el-input',
        initValue: '',
        placeholder: '请输入公会名称'
      }
    }
  },
  methods: {
    certificateFormatter(row) {
      // console.log('-formatter-', row)
      return getCertificateType(row.type)
    },
    getInitData(pageNum = 1, pageSize = 10) {
      this.pagination.currentPage = pageNum
      this.pagination.pageSize = pageSize
      this.getData()
    },
    initFormData() {
      this.formdata = {
        infoSearch: '',
        type: '',
        status: '',
        startTime: '',
        endTime: ''
      }
      if (this.tabType === 'guild') this.formdata.guildName = ''
    },
    onTabNav(data) {
      console.log('-tab-change-val-', data)
      this.initFormData()
      this.getInitData()
    },
    // 搜索
    handleSearch(data) {
      console.log('-search-data-', data)
      this.formdata.infoSearch = data.infoSearch
      this.formdata.type = data.type
      this.formdata.status = data.status
      data.guildName && (this.formdata.guildName = data.guildName)
      this.formdata.startTime = data.times ? data.times[0] : ''
      this.formdata.endTime = data.times ? data.times[1] : ''
      this.getInitData()
    },
    currentChange(pageNum) {
      this.getInitData(pageNum, this.pagination.pageSize)
    },
    sizeChange(pageSize) {
      console.log('-pageSize-', pageSize)
      this.getInitData(1, pageSize)
    },
    onCheckImg(row) {
      console.log('-look-img-', row)
      const { type, photoPositive, photoSide, idCard } = row
      this.picTitle = type === 1 ? '身份证' : '护照'
      this.imgCheckList = [photoPositive, photoSide]
      idCard && this.imgCheckList.push(idCard)
      this.isImgCheck = true
    },
    onCheckVideo(row) {
      console.log('-look-video-', row)
      this.videoUrl = row.videoUrl
      this.isVideoPlay = true
    },
    onCheckIntro(row) {
      this.$alert(row.introduction, '个人简介', {
        confirmButtonText: '确定',
        center: true,
        closeOnClickModal: true,
        closeOnPressEscape: true,
        callback: action => {}
      })
    },
    handleAuditSuccess(data) {
      const content = typeof data === 'number' ? anchorAuditTemplate(data) : data
      const params = { content, status: 2, id: this.selectData.id }
      this.auditReq(params)
    },
    // 通过
    onPass(row) {
      console.log('-pass-', row)
      this.$confirm('确认通过该账号', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
        center: 'true'
      })
        .then(() => {
          let params = { status: 1, id: row.id }
          this.auditReq(params)
        })
        .catch(() => {})
    },
    // 不通过
    onNotPass(row) {
      console.log('-not-pass-', row)
      this.isNoPass = true
      this.selectData = row
    },
    // 审核请求
    auditReq(params) {
      console.log('-params-', params)
      this.isLoading = true
      updateStatus(params, this.tabType)
        .then(res => {
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
          this.isLoading = false
          this.isNoPass = false
          this.getData()
        })
        .catch(() => {
          this.isLoading = false
        })
    },
    // 数据请求
    getData() {
      const { currentPage, pageSize } = this.pagination
      let params = { pageSize, pageNum: currentPage, ...this.formdata }
      console.log('-params-', params, this.tabType)
      findAllApply(params, this.tabType).then(res => {
        console.log('--res--', res)
        const { totalCount, result } = res.data.page
        this.pagination.total = totalCount
        this.tableData = result
      })
    }
  }
}
</script>

<style lang="less" scoped>
.content {
  padding: 0px 40px;
  .redIcon {
    color: red;
  }
  .row {
    line-height: 60px;
  }
}
</style>
