<!--
   录播列表
-->
<template>
  <div class="recordedList">
    <el-button type="primary" size="mini" @click="onAddRecorded">创建主播房间</el-button>

    <div class="listWrap">
      <div class="tableBox">
        <el-table :data="tableList" tooltip-effect="dark" style="width: 100%">
          <el-table-column label="主播ID" prop="useridx" min-width="120"></el-table-column>
          <el-table-column label="主播昵称" prop="myname" min-width="120"></el-table-column>
          <!-- <el-table-column label="房间状态" prop="roomStatus" min-width="120"></el-table-column>
          <el-table-column label="录播状态" prop="recordedStatus" min-width="120"></el-table-column>

          <el-table-column label="开始时间" prop="startTime" min-width="180"></el-table-column>
          <el-table-column
            label="结束时间"
            prop="endTime"
            :formatter="endTimeFormatter"
            min-width="180"
          ></el-table-column> -->
          <el-table-column label="操作" min-width="180">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" @click="onRecorded(scope.row, 'start')">开启录播</el-button>
              <el-button type="primary" size="mini" @click="onRecorded(scope.row, 'end')">结束录播</el-button>
              <el-button type="primary" size="mini" @click="onClearRoom(scope.row)">清除主播房间</el-button>
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

    <anchorRecorded :visible.sync="isAnchorRecorded" @success="handleSuccess" />
  </div>
</template>

<script>
import anchorRecorded from '@/views/anchor/components/recorded/handleAddAnchorRecorded'
import pagination from '@/components/pagination'
import { getAnchorRoomList, operateAnchorRoom, startOrEndRecorded } from '@/api/anchor'
export default {
  name: '',
  data() {
    return {
      isAnchorRecorded: false,
      pagination: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      tableList: []
    }
  },
  computed: {},
  components: { pagination, anchorRecorded },
  created() {
    this.getData()
  },
  mounted() {},
  methods: {
    // endTimeFormatter(row) {
    //   return row.endTime || '无'
    // },
    getInitData(pageNum = 1, pageSize = 10) {
      this.pagination.currentPage = pageNum
      this.pagination.pageSize = pageSize
      this.getData()
    },
    handleSuccess() {
      this.getInitData()
    },
    currentChange(pageNum) {
      this.getInitData(pageNum, this.pagination.pageSize)
    },
    sizeChange(pageSize) {
      this.getInitData(1, pageSize)
    },
    onAddRecorded() {
      this.isAnchorRecorded = true
    },
    onRecorded(row, type) {
      console.log('-开启/结束录播-', row, type)
      const params = { userId: row.useridx }
      this.recordedReq(params, type)
    },
    onClearRoom(row) {
      console.log('-clear-', row)
      const { useridx } = row
      const message = `是否清除ID:${useridx}主播房间?`
      this.confirmFunc(message, (instance, done) => {
        const params = { type: 2, anchorId: useridx }
        console.log('-params-', params)
        this.clearAnchorRoomReq(params, instance, done)
      })
    },
    recordedReq(params, type) {
      let typeText = type === 'start' ? '开启' : '结束'
      this.confirmFunc(`是否${typeText}录播`, (instance, done) => {
        startOrEndRecorded(params, type).then(res => {
          done()
          setTimeout(() => {
            instance.confirmButtonLoading = false
          }, 300)
          this.$message({
            message: `${typeText}录播成功`,
            type: 'success'
          })
        })
      })
    },
    clearAnchorRoomReq(params, instance, done) {
      operateAnchorRoom(params).then(res => {
        done()
        setTimeout(() => {
          instance.confirmButtonLoading = false
        }, 300)
        this.$message({
          message: '清除主播房间成功',
          type: 'success'
        })
        this.getData()
      })
    },
    getData() {
      const params = { pageNum: this.pagination.currentPage, pageSize: this.pagination.pageSize }
      getAnchorRoomList(params).then(res => {
        const { totalCount, result } = res.data
        if (!result || result.length === 0) return
        this.pagination.total = totalCount
        this.tableList = result
      })
    },
    confirmFunc(message, callback) {
      this.$confirm(message, '提示', {
        center: true,
        type: 'warning',
        beforeClose: (action, instance, done) => {
          if (action !== 'confirm') {
            done()
            return
          }
          instance.confirmButtonLoading = true
          instance.confirmButtonText = '执行中...'
          callback(instance, done)
        }
      })
        .then(() => {})
        .catch(() => {})
    }
  }
}
</script>
<style lang="less" scoped>
//@import url(); 引入公共css类
</style>
