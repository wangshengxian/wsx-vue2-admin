<!--
 * @Author: wangshengxian
 * @Date: 2020-08-17 15:58:27
 * @LastEditors: wangshengxian
 * @LastEditTime: 2021-01-08 14:35:56
 * @Desc: 主播列表
-->
<template>
  <div class="anchorList">
    <div class="headerWrap">
      <searchForm :formOptions="formOptions" :btnItems="btnItems" @onSearch="handleSearch" @onExport="handleExport">
        <el-button slot="button" type="primary" size="mini" class="btn-add" @click="onAdd">添加主播</el-button>
      </searchForm>
    </div>
    <div class="main">
      <el-tabs type="card" v-model="activeTabName" @tab-click="onTabClick">
        <el-tab-pane label="主播" name="first">
          <anchor :list="anchorList"></anchor>
        </el-tab-pane>
        <el-tab-pane label="主播审核" name="second">
          <anchorAudit :list="auditList" @openDialog="handleOpenDialog"></anchorAudit>
        </el-tab-pane>
      </el-tabs>

      <pagination
        :currentPage.sync="pagination.currentPage"
        :pageSize.sync="pagination.pageSize"
        :total="pagination.total"
        @currentChange="currentChange"
        @sizeChange="sizeChange"
      />
    </div>

    <addAnchor
      title="添加主播"
      :isEscClose="false"
      :isMaskClose="false"
      :type="dialogType"
      :dialogVis.sync="dialogVis"
      :initFormData="initFormData"
      :infoData.sync="addAnchorFD"
      @success="handleAddSuccess"
    />
  </div>
</template>

<script>
import searchForm from '@/components/searchForm'
import pagination from '@/components/pagination'
import anchor from '@/views/anchor/components/anchorList/handleAnchor'
import anchorAudit from '@/views/anchor/components/anchorList/handleAnchorAudit'
import addAnchor from '@/views/anchor/components/anchorList/handleAddAhchor'
import { getLiveType, getAnchorStatus } from '@/filters/transform'
import { getAuditStatus } from '@/filters/global'

import { getAnchorData, getAuditData, getEditAnchorInfo } from '@/api/anchor'
import { exportExcel } from '@/api/common'

export default {
  name: '',
  data() {
    return {
      btnItems: 'search, export',
      searchData: {
        infoSearch: '',
        liveType: '',
        status: '',
        times: ''
      },
      dialogVis: false,
      dialogType: 'add',
      initFormData: {},
      addAnchorFD: {},
      activeTabName: 'first',
      anchorList: [],
      auditList: [],
      pagination: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      }
    }
  },
  computed: {
    formOptions() {
      return this.activeTabName === 'first' ? [...this.anchorFormOptions] : [...this.auditFormOptions]
    },
    anchorFormOptions() {
      let options = [
        {
          label: 'ID/昵称',
          prop: 'infoSearch',
          element: 'el-input',
          initValue: '',
          placeholder: '请输入ID/昵称'
        },
        {
          label: '直播状态',
          prop: 'liveType',
          element: 'el-select',
          initValue: '',
          placeholder: '全部',
          options: getLiveType(),
          events: {
            clear: val => {
              console.log(this)
            }
          }
        },
        {
          label: '状态',
          prop: 'status',
          element: 'el-select',
          initValue: '',
          placeholder: '全部',
          options: getAnchorStatus()
        },
        {
          label: '日期',
          prop: 'times',
          element: 'el-date-picker',
          initValue: '',
          placeholder: ''
        }
      ]
      return options
    },
    auditFormOptions() {
      let options = [
        {
          label: 'ID/昵称',
          prop: 'infoSearch',
          element: 'el-input',
          initValue: '',
          placeholder: '请输入ID/昵称'
        },
        {
          label: '手机号',
          prop: 'phone',
          element: 'el-input',
          initValue: '',
          placeholder: '请输入手机号'
        },

        {
          label: '审核状态',
          prop: 'status',
          element: 'el-select',
          initValue: '',
          placeholder: '全部',
          options: getAuditStatus()
        },
        {
          label: '日期',
          prop: 'times',
          element: 'el-date-picker',
          initValue: '',
          placeholder: ''
        }
      ]
      return options
    }
  },
  created() {
    this.getData()
  },
  mounted() {
    this.$nextTick(() => {
      this.addAnchorFD = this.initAddFD()
      this.initFormData = this.addAnchorFD
    })
  },
  methods: {
    initSearchFD() {
      let fd = {}
      if (this.activeTabName === 'first') {
        fd = {
          infoSearch: '',
          liveType: '',
          status: '',
          times: ''
        }
      } else {
        fd = {
          infoSearch: '',
          phone: '',
          status: '',
          times: ''
        }
      }
      return fd
    },
    initAddFD() {
      const initData = {
        userId: '',
        name: '',
        phone: '',
        type: '1',
        certificateNo: '',
        photoPositive: [],
        photoSide: [],
        videoUrl: [],
        introduction: ''
      }
      return initData
    },
    getInitData(pageNum = 1, pageSize = 10) {
      this.pagination.currentPage = pageNum
      this.pagination.pageSize = pageSize
      this.getData()
    },
    setReqParams(params) {
      if (params.times) {
        params.startTime = params.times[0]
        params.endTime = params.times[1]
      } else {
        params.startTime = ''
        params.endTime = ''
      }
      delete params.times
      return params
    },
    handleSearch(data) {
      console.log('-search-', data)
      this.searchData = data
      this.getInitData()
    },
    onTabClick(tab, event) {
      this.searchData = this.initSearchFD()
      this.getInitData()
    },
    currentChange(pageNum) {
      this.getInitData(pageNum, this.pagination.pageSize)
    },
    sizeChange(pageSize) {
      this.getInitData(1, pageSize)
    },
    handleExport(data) {
      console.log('导出', this.activeTabName, data)
      let type = this.activeTabName === 'first' ? 'anchor' : 'anchorAudit'
      let params = { ...this.setReqParams(data) }
      console.log(type, params)
      exportExcel(type, params)
    },
    onAdd() {
      console.log('-添加主播-')
      this.dialogVis = true
      this.dialogType = 'add'
      this.addAnchorFD = this.initAddFD()
    },
    // 获取重新审核数据
    handleOpenDialog(index) {
      console.log('-重新审核-', index, this.auditList[index])
      const { id } = this.auditList[index]
      getEditAnchorInfo({ id }).then(res => {
        this.dialogVis = true
        this.dialogType = 'edit'
        console.log('-res-', res)
        const { data } = res
        this.initFormData = { ...data }
        this.initFormData.type = this.initFormData.type + ''

        data.videoUrl = [data.videoUrl]
        data.type = data.type + ''
        data.photoPositive = [data.photoPositive]
        data.photoSide = [data.photoSide]
        this.addAnchorFD = JSON.parse(JSON.stringify(data))
      })
    },
    handleAddSuccess(type) {
      console.log('-add-success-type-', type, '-activeTableName-', this.activeTabName)
      if (this.activeTabName !== 'first') {
        // TODO 刷新主播审核数据
        this.searchData = this.initSearchFD()
        this.getInitData()
      }
    },
    getData() {
      const params = {
        pageSize: this.pagination.pageSize,
        pageNum: this.pagination.currentPage,
        ...this.setReqParams(this.searchData)
      }
      console.log('-params-', params)
      this.activeTabName === 'first' ? this.getAnchorData(params) : this.getAuditData(params)
    },
    getAnchorData(params) {
      getAnchorData(params).then(res => {
        const { page } = res.data
        this.pagination.total = page.totalCount
        this.anchorList = page.result
        // console.log('-total-count-', this.pagination.total, '-anchor-list-', this.anchorList)
      })
    },
    getAuditData(params) {
      getAuditData(params).then(res => {
        const { page } = res.data
        this.pagination.total = page.totalCount
        this.auditList = page.result
        // console.log('-total-count-', this.pagination.total, '-audit-list-', this.auditList)
      })
    }
  },
  components: { searchForm, pagination, anchor, anchorAudit, addAnchor }
}
</script>
<style lang="less" scoped>
//@import url(); 引入公共css类
.headerWrap {
  display: flex;
  justify-content: space-between;
  .operateBtnWrap {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
  }
}

/deep/ .el-table {
  .cell {
    text-align: center;
  }
}
</style>
