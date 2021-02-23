<!--
 主播管理 - 直播时长
-->
<template>
  <div class="userList">
    <searchForm :formOptions="formOptions" :btnItems="btnItems" @onSearch="handleSearch" @onExport="handleExport">
      <!-- <el-popover
        class="tipsBox"
        slot="other"
        placement="bottom"
        width="100"
        trigger="hover"
        content="可以导出添加筛选条件后的内容。"
      >
        <img class="icon" slot="reference" src="@/assets/images/question.png" alt="" />
      </el-popover> -->
    </searchForm>

    <div class="listBox">
      <div class="tableBox">
        <el-table :data="tableData" tooltip-effect="dark" style="width: 90%">
          <el-table-column prop="userId" label="Id" min-width="140"></el-table-column>
          <el-table-column prop="myname" label="昵称" min-width="180"></el-table-column>
          <el-table-column prop="type" label="身份" :formatter="typeFormatter" min-width="100"> </el-table-column>
          <el-table-column prop="guildName" label="所属公会" :formatter="guildFormatter" min-width="140">
          </el-table-column>
          <el-table-column prop="startTime" label="直播开始" min-width="220"></el-table-column>
          <el-table-column prop="endTime" label="直播结束" min-width="220"></el-table-column>
          <el-table-column prop="duration" label="时长" min-width="140"></el-table-column>
        </el-table>
      </div>
    </div>

    <pagination
      :currentPage.sync="pagination.currentPage"
      :pageSize.sync="pagination.pageSize"
      :total="pagination.total"
      @currentChange="currentChange"
      @sizeChange="sizeChange"
    />
  </div>
</template>

<script>
import searchForm from '@/components/searchForm'
import pagination from '@/components/pagination'
import { getUserIdentity } from '@/filters/transform'
import { getLiveTimeList } from '@/api/anchor'
import { exportExcel } from '@/api/common'
import tools from '@/utils/tools'
export default {
  name: '',
  data() {
    return {
      btnItems: 'search,export',
      searchData: {
        infoSearch: '',
        type: '',
        startTime: '',
        endTime: ''
      },
      tableData: [],
      pagination: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      initTimes: tools.getLatelyDays(7, '{y}-{m}-{d} {h}:{i}:{s}')
    }
  },
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
          label: '身份',
          prop: 'type',
          initValue: '',
          placeholder: '全部',
          options: getUserIdentity()
        },

        {
          element: 'el-date-picker',
          label: '时间',
          prop: 'times',
          initValue: this.initTimes,
          placeholder: ''
        }
      ]
      return options
    }
  },
  created() {
    // console.log(this.initTimes)
    this.searchData.startTime = this.initTimes[0]
    this.searchData.endTime = this.initTimes[1]
    this.getData()
  },
  methods: {
    typeFormatter(row) {
      return getUserIdentity(row.type)
    },
    guildFormatter(row) {
      return row.guildName || '/'
    },
    getInitData(pageNum = 1, pageSize = 10) {
      this.pagination.currentPage = pageNum
      this.pagination.pageSize = pageSize
      this.getData()
    },
    // 搜索
    handleSearch(data) {
      // console.log('-search-', data)
      const { infoSearch, type, times } = data
      let startTime = times ? times[0] : ''
      let endTime = times ? times[1] : ''
      this.searchData = { infoSearch, type, startTime, endTime }
      this.getInitData()
    },
    currentChange(pageNo) {
      this.getInitData(pageNo, this.pagination.pageSize)
    },
    // 导出
    handleExport() {
      console.log('-params-', this.searchData)
      exportExcel('liveTime', this.searchData)
    },
    sizeChange(pageSize) {
      this.getInitData(1, pageSize)
    },
    // 数据请求
    getData() {
      const params = { pageSize: this.pagination.pageSize, pageNum: this.pagination.currentPage, ...this.searchData }
      console.log('-params-', params)
      getLiveTimeList(params).then(res => {
        console.log('-res-', res)
        const { totalCount, result } = res.data.page
        this.pagination.total = totalCount
        this.tableData = result
      })
    }
  },
  components: { searchForm, pagination }
}
</script>

<style lang="less" scoped>
.userList {
  .tipsBox {
    display: flex;
    align-items: center;
    height: 28px;
    padding-left: 6px;

    .icon {
      width: 18px;
      vertical-align: middle;
      cursor: pointer;
    }
  }
}
</style>
