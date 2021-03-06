<template>
  <div class="userList">
    <searchForm :formOptions="formOptions" @onSearch="handleSearch">
      <el-button slot="button" size="mini" type="primary" class="btn-search" @click="onUploadVideo">上传视频</el-button>
    </searchForm>

    <div class="listWrap">
      <div class="tableBox">
        <el-table :data="tableList" tooltip-effect="dark" style="width: 100%">
          <el-table-column prop="userId" label="ID" min-width="120"></el-table-column>
          <el-table-column prop="nickName" label="昵称" min-width="120"></el-table-column>
          <el-table-column prop="title" label="标题" min-width="120"></el-table-column>
          <el-table-column prop="coin" label="价格" min-width="100"></el-table-column>
          <el-table-column prop="num" label="购买数量" min-width="80"></el-table-column>
          <el-table-column prop="url" label="短视频" min-width="80">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" @click="onOpenVideo(scope.row)">查看</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" min-width="80">
            <template slot-scope="scope">
              <span v-if="scope.row.status == 0" class="fz-primary-status">审核中</span>
              <span v-else-if="scope.row.status == 1" class="fz-success-status">通过</span>
              <span v-else class="fz-danger-status">未通过</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="shelves"
            label="视频状态"
            :formatter="shelvesFormatter"
            min-width="100"
          ></el-table-column>
          <el-table-column prop="createTime" label="上传时间" min-width="160"></el-table-column>
          <el-table-column label="操作" fixed="right" min-width="300">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" :disabled="scope.row.status !== 2" @click="onEditVideo(scope.row)"
                >编辑</el-button
              >
              <el-button size="mini" type="success" :disabled="scope.row.status != 0" @click="onPass(scope.row)"
                >通过</el-button
              >
              <el-button size="mini" type="danger" :disabled="scope.row.status != 0" @click="onNotPass(scope.row)"
                >不通过</el-button
              >

              <el-button
                size="mini"
                :type="scope.row.shelves ? 'danger' : 'primary'"
                :disabled="scope.row.status !== 1"
                @click="onDownUp(scope.row)"
                >{{ scope.row.shelves ? '下架' : '上架' }}</el-button
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

    <uploadVideo
      :type="dialogType"
      :formData="infoData"
      :videoUrl.sync="uploadVideoUrl"
      :visible.sync="isShowUploadVideo"
      @success="handleUploadVideoSuccess"
    />

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
import uploadVideo from '@/views/content/components/vshortVideo/handleUploadVideo'
import videoPlay from '@/components/videoPlayDialog'
import auditDialog from '@/components/auditDialog'
import { shortVideoAuditTemplate } from '@/filters/auditTemplate'
import { getAuditType } from '@/filters/transform'
import { findVideoList, auditShortVideo, updownVideo } from '@/api/content'
export default {
  name: '',
  data() {
    return {
      searchData: {
        keyword: '',
        status: '',
        startDate: '',
        endDate: ''
      },
      pagination: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      tableList: [],

      // 查看视频
      isVideoPlay: false,
      videoUrl: '',

      // 审核不通过相关
      isNotPass: false,
      isLoading: false,
      selectData: {},

      // 上传/编辑短视频
      dialogType: 'add',
      isShowUploadVideo: false,
      uploadVideoUrl: [],
      infoData: {
        userId: '', // 用户id
        title: '', // 标题
        coin: '', // 价格
        cover: [], // 封面地址
        url: '', // 视频地址
        num: 0 // 购买数量
      }
    }
  },
  components: { searchForm, pagination, auditDialog, uploadVideo, videoPlay },
  computed: {
    reasonList() {
      return shortVideoAuditTemplate()
    },
    formOptions() {
      let options = [
        {
          element: 'el-input',
          label: 'ID/昵称',
          prop: 'keyword',
          initValue: '',
          placeholder: '请输入ID/昵称'
        },
        {
          element: 'el-select',
          label: '状态',
          prop: 'status',
          initValue: '',
          placeholder: '',
          options: getAuditType()
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
  },
  mounted() {},
  methods: {
    shelvesFormatter(row) {
      return row.status !== 1 ? '/' : row.shelves ? '上架' : '下架'
    },
    getInitData(pageNum = 1, pageSize = 10) {
      this.pagination.currentPage = pageNum
      this.pagination.pageSize = pageSize
      this.getData()
    },
    // 搜索
    handleSearch(data) {
      console.log('-search-', data)
      const { times, ...otherObj } = data
      this.searchData = { ...otherObj }
      this.searchData.startDate = times ? times[0].split(' ')[0] : ''
      this.searchData.endDate = times ? times[1].split(' ')[0] : ''
      this.getInitData()
    },
    currentChange(pageNo) {
      this.getInitData(pageNo, this.pagination.pageSize)
    },
    sizeChange(pageSize) {
      this.getInitData(1, pageSize)
    },
    handleUploadVideoSuccess() {
      this.getInitData()
    },
    // 审核不通过
    handleAuditSuccess(data) {
      const content = typeof data === 'number' ? shortVideoAuditTemplate(data) : data
      const params = { content, status: 'FAIL', id: this.selectData.id }
      this.auditReq(params)
    },
    onUploadVideo() {
      this.infoData = { userId: '', title: '', coin: '', cover: [] }
      this.uploadVideoUrl = []
      this.dialogType = 'add'
      this.isShowUploadVideo = true
    },
    // 编辑
    onEditVideo(row) {
      console.log('-edit-', row)
      const { id, userId, title, coin, cover, url } = row
      this.infoData = { id, userId, title, coin, cover: [cover] }
      this.uploadVideoUrl = [url]
      this.dialogType = 'edit'
      this.isShowUploadVideo = true
    },
    // 上下架
    onDownUp(row) {
      // console.log('-row-', row)
      const txt = row.shelves ? '确认将该短视频下架' : '确认将该短视频上架'
      this.msgConfirmFunc({ txt }, () => {
        const params = { videoId: row.id }
        // console.log('-params-', params)
        updownVideo(params).then(res => {
          this.msgTipsFunc({ message: '操作成功!' })
          this.isLoading = false
          row.shelves = res.data
        })
      })
    },
    onOpenVideo(row) {
      console.log('-open-video-', row)
      this.isVideoPlay = true
      this.videoUrl = row.url
    },
    onPass(row) {
      console.log('-pass-', row)
      this.msgConfirmFunc({ txt: '通过本视频审核' }, () => {
        const params = { id: row.id, status: 'PASS' }
        this.auditReq(params)
      })
    },
    // 审核不通过
    onNotPass(row) {
      // console.log('-not-pass-', row)
      this.isNotPass = true
      this.selectData = row
    },
    auditReq(params) {
      // console.log('-params-', params)
      this.isLoading = true
      auditShortVideo(params)
        .then(res => {
          this.msgTipsFunc({ message: '操作成功!' })
          this.isLoading = false
          this.isNotPass = false
          this.getData()
        })
        .catch(() => {
          this.isLoading = false
        })
    },

    getData() {
      const { currentPage, pageSize } = this.pagination
      const params = { pageSize, pageNum: currentPage, ...this.searchData }
      console.log('-params-', params)
      findVideoList(params).then(res => {
        // console.log('--res--', res)
        const { result, totalCount } = res.data
        this.pagination.total = totalCount
        this.tableList = result
        console.log('-table-list-', this.tableList, '-total-', this.pagination.total)
      })
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

<style lang="less" scoped></style>
