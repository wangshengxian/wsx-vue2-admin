<template>
  <div class="userList">
    <searchForm :formOptions="formOptions" @onSearch="handleSearch">
      <el-button slot="button" size="mini" type="primary" class="btn-search" @click="onOpenDialog('upload')"
        >上传视频</el-button
      >
      <el-button slot="button" size="mini" type="primary" class="btn-topic" @click="onOpenDialog('topic')"
        >话题配置</el-button
      >
    </searchForm>

    <div class="listBox">
      <div class="tableBox">
        <el-table :data="tableData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelChange">
          <el-table-column type="selection" min-width="60"> </el-table-column>
          <el-table-column prop="userId" label="ID" min-width="120"></el-table-column>
          <el-table-column prop="name" label="昵称" min-width="140"></el-table-column>
          <el-table-column
            prop="category"
            label="话题"
            min-width="100"
            :formatter="categoryFormatter"
          ></el-table-column>
          <el-table-column prop="url" label="短视频" min-width="80">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" @click="onOpenVideo(scope.row)">查看</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="word" label="标题" min-width="160"></el-table-column>
          <el-table-column prop="status" label="状态" min-width="80">
            <template slot-scope="scope">
              <span v-if="scope.row.status == 0" class="fz-primary-status">审核中</span>
              <span v-else-if="scope.row.status == 1" class="fz-success-status">通过</span>
              <span v-else class="fz-danger-status">未通过</span>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="时间" min-width="160"></el-table-column>
          <el-table-column label="操作" fixed="right" min-width="220">
            <template slot-scope="scope">
              <el-button size="mini" type="success" :disabled="scope.row.status != 0" @click="onPass(scope.row)"
                >通过</el-button
              >
              <el-button size="mini" type="danger" :disabled="scope.row.status != 0" @click="onNotPass(scope.row)"
                >不通过</el-button
              >
              <el-button size="mini" type="primary" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="operateBtnBox" style="margin-top: 20px">
        <el-button type="success" @click="onOperateBtn('pass')">批量通过</el-button>
        <el-button type="danger" @click="onOperateBtn('notPass')">批量不通过</el-button>
        <el-button type="primary" @click="onOperateBtn('delete')">批量删除</el-button>
      </div>

      <pagination
        :currentPage.sync="pagination.currentPage"
        :pageSize.sync="pagination.pageSize"
        :total="pagination.total"
        @currentChange="currentChange"
        @sizeChange="sizeChange"
      />
    </div>

    <addVideo :dialogVis.sync="isShowAddVideo" :tagList="tagList" @success="handleAddVideo" />

    <topicConfig :dialogVis.sync="isShowTopicConfig" :list.sync="tagList" />

    <videoPlay :dialogVisible.sync="isVideoPlay" width="300px" :videoUrl="videoUrl" />

    <auditDialog
      :visible.sync="isNotPass"
      :isLoading="isLoading"
      :reasonList="reasonList"
      @success="handleAuditSuccess"
    />
  </div>
</template>

<script>
import searchForm from '@/components/searchForm'
import pagination from '@/components/pagination'
import auditDialog from '@/components/auditDialog'
import addVideo from '@/views/content/components/shortVideo/addVideo'
import topicConfig from '@/views/content/components/shortVideo/topicConfig'
import videoPlay from '@/components/videoPlayDialog'
import { getAuditStatus } from '@/filters/global'
import { shortVideoAuditTemplate } from '@/filters/auditTemplate'
import {
  getShortVideoCategory,
  getVideoList,
  delShortVideoByid,
  updateStatus,
  delShortVideoByIds,
  updateStatusByIds
} from '@/api/content'

export default {
  name: '',
  data() {
    return {
      formData: {
        infoSearch: '',
        status: '',
        startDate: '',
        endDate: ''
      },
      pagination: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      tagList: [], // 话题类型list
      tableData: [],
      multipleSelList: [], // 多选list
      isShowAddVideo: false,
      isShowTopicConfig: false,
      isVideoPlay: false,
      videoUrl: '',
      // 审核不通过相关
      isNotPass: false,
      isLoading: false,
      selectData: {}
    }
  },
  components: { searchForm, pagination, auditDialog, addVideo, topicConfig, videoPlay },
  computed: {
    reasonList() {
      return shortVideoAuditTemplate()
    },
    formOptions() {
      let options = [
        {
          element: 'el-input',
          label: 'ID/昵称',
          prop: 'infoSearch',
          initValue: '',
          placeholder: '请输入ID/昵称'
        },
        {
          element: 'el-select',
          label: '状态',
          prop: 'status',
          initValue: '',
          placeholder: '',
          options: getAuditStatus()
        },
        {
          element: 'el-date-picker',
          label: '时间',
          prop: 'times',
          initValue: '',
          type: 'daterange'
        }
      ]
      return options
    }
  },
  created() {
    // 状态status：0 待审核 1 通过 2 未通过
    this.getData()
    this.getTagsData()
  },
  mounted() {},
  methods: {
    categoryFormatter(row) {
      // console.log('-row-', row.category)
      return row.category ? row.category : '无'
    },
    // 获取初始化数据，pageNum = 页码默认为 1, pageSize默认为 10
    getInitData(pageNum = 1, pageSize = 10) {
      this.pagination.currentPage = pageNum
      this.pagination.pageSize = pageSize
      this.getData()
    },
    // 搜索
    handleSearch(data) {
      console.log('-search-', data)
      const { infoSearch, status, times } = data
      this.formData.infoSearch = infoSearch
      this.formData.status = status
      if (times) {
        this.formData.startDate = times[0].split(' ')[0]
        this.formData.endDate = times[1].split(' ')[0]
      } else {
        this.formData.startDate = ''
        this.formData.endDate = ''
      }
      this.getInitData()
    },
    currentChange(pageNo) {
      this.getInitData(pageNo, this.pagination.pageSize)
    },
    sizeChange(pageSize) {
      this.getInitData(1, pageSize)
    },
    handleAddVideo() {
      this.getInitData()
    },
    // 审核不通过
    handleAuditSuccess(data) {
      const content = typeof data === 'number' ? shortVideoAuditTemplate(data) : data
      const params = { content, status: 2, id: this.selectData.id }
      this.auditReq(params)
    },
    // 打开dialog
    onOpenDialog(type) {
      switch (type) {
        case 'upload':
          this.isShowAddVideo = true
          break
        case 'topic':
          this.isShowTopicConfig = true
          break
        default:
          break
      }
    },
    onOpenVideo(row) {
      console.log('-open-video-', row.url)
      this.isVideoPlay = true
      this.videoUrl = row.url
    },
    // 多选
    handleSelChange(val) {
      this.multipleSelList = val
    },
    onOperateBtn(type) {
      // console.log('-type-', type)
      if (this.multipleSelList.length === 0) {
        this.msgTipsFunc({ message: '请先选择需要操作的选项', type: 'warning' })
        return
      }
      switch (type) {
        case 'pass':
          this.handleMultipleAudit('1')
          break
        case 'notPass':
          this.handleMultipleAudit('2')
          break
        case 'delete':
          this.handleMultipleDel()
          break
        default:
          break
      }
    },
    /**
     * 设置ids参数
     * @param {Array} list 数据源
     * @param {Boolean} isFilter 是否过滤多选的list,默认为false
     * @param {String} filterAttr 需要过滤的属性，默认为'status'
     * @param {Number} filterAttrVal 过滤的属性的属性值，默认为 0
     * @return '194,168,136' || undefined
     */
    setIdsVal(list, isFilter = false, filterAttr = 'status', filterAttrVal = 0) {
      let result = []
      list.map(val => {
        if (!isFilter) {
          result.push(val.id)
        } else {
          if (val[filterAttr] === filterAttrVal) {
            result.push(val.id)
          }
        }
      })
      return result.toString()
    },
    onPass(row) {
      console.log('-pass-', row)
      this.msgConfirmFunc({ txt: '通过本视频审核' }, () => {
        const params = { status: 1, id: row.id }
        this.auditReq(params)
      })
    },
    // 审核不通过
    onNotPass(row) {
      console.log('-not-pass-', row)
      this.isNotPass = true
      this.selectData = row
    },
    auditReq(params) {
      console.log('-params-', params)
      this.isLoading = true
      updateStatus(params)
        .then(res => {
          this.msgTipsFunc({ message: '审核通过!' })
          this.isLoading = false
          this.isNotPass = false
          this.getData()
        })
        .catch(() => {
          this.isLoading = false
        })
    },
    // 视频删除
    handleDelete(index, row) {
      // console.log(row)
      let msgObj = { txt: '确认删除本视频?' }
      this.msgConfirmFunc(msgObj, () => {
        const params = { id: row.id }
        delShortVideoByid(params).then(res => {
          this.getData()
          this.msgTipsFunc({ message: '删除成功!' })
        })
      })
    },
    // 批量审核
    handleMultipleAudit(status) {
      // status 1 通过，2 不通过
      // console.log('-status-', status)
      let ids = this.setIdsVal(this.multipleSelList, true) || undefined
      // console.log('-ids-', ids)
      if (!ids) {
        this.msgTipsFunc({ message: '当前页没有可以审核的选项', type: 'warning', duration: 2000 })
        return
      }
      let params = { ids, status }
      console.log('-params-', params)
      let txt = status === '1' ? '批量通过视频审核？' : '批量不通过视频审核？'
      this.msgConfirmFunc({ txt }, () => {
        updateStatusByIds(params).then(res => {
          // console.log('-批量审核-', res)
          const { msg } = res
          this.msgTipsFunc({ message: msg }, () => {
            this.multipleSelList = []
            this.getData()
          })
        })
      })
    },
    // 批量删除
    handleMultipleDel() {
      let ids = this.setIdsVal(this.multipleSelList)
      let params = { ids }
      console.log('-params-', params)
      this.msgConfirmFunc({ txt: '确认批量删除视频？' }, () => {
        delShortVideoByIds(params).then(res => {
          // console.log('-批量删除-', res)
          const { msg } = res
          this.msgTipsFunc({ message: msg }, () => {
            this.multipleSelList = []
            this.getData()
          })
        })
      })
    },
    getData() {
      const { currentPage, pageSize } = this.pagination
      const params = { pageSize, pageNum: currentPage, ...this.formData }
      console.log('-params-', params)
      getVideoList(params).then(res => {
        // console.log('--res--', res)
        const { result, totalCount } = res.data.page
        this.pagination.total = totalCount
        this.tableData = result
        console.log('-table-list-', this.tableData, '-total-count-', this.pagination.total)
      })
    },
    getTagsData() {
      getShortVideoCategory().then(res => {
        // console.log('-tag-res-', res)
        const { data } = res
        let list = []
        data.map((val, index) => {
          let mid = { ...val, type: this.setTagType(index) }
          list.push(mid)
        })
        this.tagList = list
        // console.log('-tag-list-', this.tagList)
      })
    },
    // 设置标签类型
    setTagType(index) {
      let typeName = ''
      if (index % 4 === 0) {
        typeName = ''
      } else if (index % 4 === 1) {
        typeName = 'success'
      } else if (index % 4 === 2) {
        typeName = 'warning'
      } else {
        typeName = 'danger'
      }
      return typeName
    },
    // 公共的提示信息 type = success/info/warning/danger;默认为success
    msgTipsFunc({ message, type = 'success', duration = 1500 }, callback) {
      callback = callback || (() => {})
      this.$message({
        message,
        type,
        duration,
        onClose: callback
      })
    },
    // 公共的confirm弹框func
    msgConfirmFunc({ txt, title = '提示', iconType = 'warning', isCenter = true }, callback) {
      this.$confirm(txt, title, {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: iconType,
        center: isCenter
      })
        .then(() => {
          callback()
        })
        .catch(() => {})
    }
  }
}
</script>

<style lang="less" scoped>
.pagination {
  padding-top: 15px;
  text-align: center;
}
</style>
