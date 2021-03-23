<template>
  <div class="userList">
    <searchForm :formOptions="formOptions" @onSearch="handleSearch" />

    <div class="listBox">
      <div class="tableBox">
        <el-table :data="tableData" tooltip-effect="dark" style="width: 100%">
          <el-table-column prop="userId" label="ID" width="100"></el-table-column>
          <el-table-column prop="myname" label="昵称"></el-table-column>
          <el-table-column prop="playbackUrl" label="封面">
            <template slot-scope="scope">
              <img style="width:100px;height:100px" :src="scope.row.photo" alt="" />
            </template>
          </el-table-column>
          <el-table-column prop="title" label="视频标题"></el-table-column>
          <el-table-column prop="playbackUrl" label="直播回放">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" @click="onLookVideo(scope.row)">查看</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="state " label="显示状态">
            <template slot-scope="scope">
              <span v-if="scope.row.state == true">显示</span>
              <span v-if="scope.row.state == false">不显示</span>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="时间" :min-width="140"></el-table-column>
          <el-table-column label="操作" fixed="right" :min-width="130">
            <template slot-scope="scope">
              <el-button type="text" @click="editHandle(scope.row)">编辑</el-button>
              <el-button size="mini" type="primary" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
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

    <videoPlay :dialogVisible.sync="isVideoPlay" width="300px" :videoUrl="videoUrl" />

    <handleEdit :dialogVis.sync="isEdit" :formData="editObj" @success="handleSuccess" />
  </div>
</template>

<script>
import searchForm from '@/components/searchForm'
import pagination from '@/components/pagination'
import videoPlay from '@/components/videoPlayDialog'
import handleEdit from '@/views/content/components/playback/handleEdit'
import { getPlaybackStatus } from '@/filters/transform'
import { findUserPlaybacks, delUserPlaybackByid } from '@/api/content'

export default {
  name: '',
  data() {
    return {
      isVideoPlay: false,
      videoUrl: '',
      isEdit: false,
      editObj: {},
      formdata: {
        infoSearch: '',
        state: '',
        startTime: '',
        endTime: ''
      },
      tableData: [],
      pagination: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      }
    }
  },
  components: { searchForm, pagination, videoPlay, handleEdit },
  computed: {
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
          label: '显示状态',
          prop: 'state',
          options: getPlaybackStatus(),
          initValue: '',
          placeholder: '全部'
        },
        {
          element: 'el-date-picker',
          label: '日期',
          prop: 'times',
          initValue: '',
          placeholder: ''
        }
      ]
      return options
    }
  },
  created() {
    // TODO: 列表长度显示后期需要优化;
    this.getData()
  },
  mounted() {},
  methods: {
    getInitData(pageNo = 1, pageSize = 10) {
      this.pagination.currentPage = pageNo
      this.pagination.pageSize = pageSize
      this.getData()
    },
    // 搜索
    handleSearch(data) {
      console.log('-search-', data)
      this.formdata.infoSearch = data.infoSearch
      this.formdata.state = data.state
      this.formdata.startTime = data.times && data.times[0] ? data.times[0] : ''
      this.formdata.endTime = data.times && data.times[1] ? data.times[1] : ''
      this.getInitData()
    },

    currentChange(pageNo) {
      this.getInitData(pageNo, this.pagination.pageSize)
    },
    sizeChange(pageSize) {
      console.log('-pageSize-', pageSize)
      this.getInitData(1, pageSize)
    },

    onLookVideo(row) {
      console.log('-find-')
      this.isVideoPlay = true
      this.videoUrl = row.playbackUrl
    },

    editHandle(row) {
      console.log('-edit-', row)
      const { id, title, state, photo } = row
      this.editObj = { id, title, state, imgUrl: [photo] }
      this.isEdit = true
    },

    handleSuccess() {
      console.log('-edit-success-')
      this.getData()
    },

    // 删除视频审核
    handleDelete(index, row) {
      console.log('-row-', row)
      this.$confirm('确认删除本条记录?', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
        center: 'true'
      })
        .then(() => {
          const params = {
            id: row.id
          }
          delUserPlaybackByid(params).then(res => {
            console.log('--res--', res)
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getData()
          })
        })
        .catch(() => {})
    },

    // 数据请求
    getData() {
      const { currentPage, pageSize } = this.pagination
      const params = { pageSize, pageNum: currentPage, ...this.formdata }
      console.log('-params-', params)
      findUserPlaybacks(params).then(res => {
        console.log('--res--', res)
        const { totalCount, result } = res.data.page
        this.pagination.total = totalCount
        this.tableData = result
      })
    }
  }
}
</script>

<style lang="less" scoped></style>
