<!--
 * @Author: wangshengxian
 * @Date: 2020-08-19 09:57:01
 * @LastEditors: wangshengxian
 * @LastEditTime: 2021-01-20 10:22:04
 * @Desc: 主播管理 - 主播列表
-->
<template>
  <div class="userList">
    <searchForm :formOptions="formOptions" @onSearch="handleSearch">
      <el-button slot="button" type="primary" size="mini" @click="onAddAnchor">添加主播</el-button>
    </searchForm>

    <div class="listBox">
      <div class="tableBox">
        <el-table :data="tableList" tooltip-effect="dark" style="width: 100%">
          <el-table-column prop="userId" label="ID" min-width="120"></el-table-column>
          <el-table-column prop="myname" label="昵称" min-width="140"></el-table-column>
          <el-table-column prop="username" label="姓名" min-width="140"></el-table-column>
          <el-table-column
            prop="guildName"
            label="所属公会"
            :formatter="guildFormatter"
            min-width="140"
          ></el-table-column>
          <el-table-column prop="mobile" label="手机号" min-width="160"></el-table-column>
          <el-table-column prop="idcard" label="身份证号" min-width="200"></el-table-column>
          <el-table-column label="排序号" min-width="120">
            <template slot-scope="scope">
              <div class="sortCol">
                <p>{{ scope.row.weight || '/' }}</p>
                <p>{{ scope.row.endTime | surplusTime(scope.row.startTime) }}</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="ndate" label="时间" min-width="180"></el-table-column>

          <template>
            <el-table-column label="操作" fixed="right" min-width="360">
              <template slot-scope="scope">
                <el-button
                  :type="scope.row.guildId ? 'warning' : 'primary'"
                  size="mini"
                  @click="onSetGuild(scope.row)"
                  >{{ scope.row.guildId ? '修改公会' : '添加公会' }}</el-button
                >
                <el-button size="mini" type="primary" @click="onWeedOut(scope.row)">淘汰</el-button>
                <el-button size="mini" type="primary" @click="onAddSort(scope.row)">添加排序号</el-button>
                <el-button size="mini" type="primary" @click="onDelSort(scope.row)">删除排序号</el-button>
              </template>
            </el-table-column>
          </template>
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

    <addAnchor :visible.sync="isAddAnchor" @success="handleAddAnchor" />

    <setGuild :formData="guildFormData" :visible.sync="isSetGuild" @success="handleSetGuild" />

    <serialSort :formData="sortFormData" :visible.sync="isSerialSort" @success="handleSerialSort" />
  </div>
</template>

<script>
import searchForm from '@/components/searchForm'
import pagination from '@/components/pagination'
import addAnchor from '@/views/anchor/components/anchorList/handleAddAnchor'
import setGuild from '@/views/anchor/components/anchorList/handleSetGuild'
import serialSort from '@/views/anchor/components/anchorList/handleSerialSort'
import { findAllRoomHotrank, delRoomHotrankbyidx, delSortOrder, getAllGuild } from '@/api/anchor'
import tools from '@/utils/tools'
export default {
  name: '',
  data() {
    return {
      isAddAnchor: false,
      isSetGuild: false,
      guildFormData: {},
      guildList: [],
      isSerialSort: false,
      sortFormData: {
        num: 1,
        startTime: tools.formatDate(),
        endTime: ''
      },
      searchData: {
        infoSearch: '',
        phone: '',
        guildId: '',
        startDate: '',
        endDate: ''
      },
      tableList: [],
      pagination: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      formOptions: [
        {
          label: 'ID/昵称',
          prop: 'title',
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
          label: '公会ID',
          prop: 'guildId',
          element: 'el-input',
          initValue: '',
          placeholder: '请输入公会ID'
        },
        {
          label: '时间',
          prop: 'times',
          element: 'el-date-picker',
          initValue: '',
          placeholder: ''
        }
      ]
    }
  },
  components: { searchForm, pagination, addAnchor, setGuild, serialSort },
  watch: {},
  computed: {},
  filters: {
    surplusTime(endTime, startTime) {
      // console.log('-start-', startTime, '-end-', endTime)
      let result = endTime ? tools.getSurplusTime(endTime, startTime) : '/'
      return result
    }
  },
  created() {
    this.getData()
    this.getGuildList()
  },
  mounted() {},
  methods: {
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
      console.log('-search-data-', data)
      this.searchData.infoSearch = data.title
      this.searchData.phone = data.phone
      this.searchData.guildId = data.guildId ? +data.guildId : data.guildId
      this.searchData.startDate = data.times ? data.times[0] : ''
      this.searchData.endDate = data.times ? data.times[1] : ''
      this.getInitData()
    },
    currentChange(pageNo) {
      this.getInitData(pageNo, this.pagination.pageSize)
    },
    sizeChange(pageSize) {
      // console.log('-pageSize-', pageSize)
      this.getInitData(1, pageSize)
    },
    onAddAnchor() {
      this.isAddAnchor = true
    },
    onSetGuild(row) {
      console.log('-row-', row)
      this.guildFormData = { userId: row.userId, guildId: row.guildId, guildList: this.guildList }
      this.isSetGuild = true
    },
    // 淘汰
    onWeedOut(row) {
      console.log('-淘汰-', row)
      this.$confirm('确认淘汰该主播，是否继续？', '提示', {
        type: 'warning',
        center: true,
        beforeClose(action, instance, done) {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            instance.confirmButtonText = '执行中...'
            console.log(this)
            const params = {
              idx: row.idx
            }
            delRoomHotrankbyidx(params)
              .then(res => {
                console.log(instance, done)
                console.log('-res-', res)
                instance.confirmButtonLoading = false
                done()
                this.$message({
                  type: 'success',
                  message: res.msg
                })
              })
              .catch(er => {
                instance.confirmButtonLoading = false
                done()
              })
          } else {
            done()
          }
        }
      })
        .then(action => {
          this.getData()
        })
        .catch(() => {})
    },
    onAddSort(row) {
      console.log('-add-', row)
      this.sortFormData = {
        num: row.weight,
        startTime: row.startTime,
        endTime: row.endTime,
        anchorId: row.userId
      }
      this.isSerialSort = true
    },
    onDelSort(row) {
      console.log('-del-', row)
      this.$confirm('删除排序号！', '提示', {
        center: true,
        type: 'warning',
        beforeClose(action, instance, done) {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            instance.confirmButtonText = '加载中...'
            const params = { anchorId: row.userId }
            delSortOrder(params)
              .then(res => {
                console.log('-res-', res)
                instance.confirmButtonLoading = false
                done()
                this.$message({
                  type: 'success',
                  message: '排序号删除成功！'
                })
              })
              .catch(er => {
                instance.confirmButtonLoading = false
                done()
              })
          } else {
            done()
          }
        }
      })
        .then(action => {
          this.getData()
        })
        .catch(() => {})
    },
    // 添加主播
    handleAddAnchor() {
      this.getInitData()
    },
    // 设置公会
    handleSetGuild() {
      this.getInitData()
    },
    // 添加排序号
    handleSerialSort() {
      this.getInitData()
    },
    getData() {
      let params = { pageSize: this.pagination.pageSize, pageNum: this.pagination.currentPage, ...this.searchData }
      // console.log('-params-', params)
      findAllRoomHotrank(params).then(res => {
        // console.log('--主播列表--', res)
        const { totalCount, result } = res.data.page
        this.pagination.total = totalCount
        this.tableList = result
        console.log('-list-', this.tableList, '-total-', this.pagination.total)
      })
    },
    getGuildList() {
      getAllGuild().then(res => {
        // console.log('-guild-res-', res)
        const list = res.data
        this.guildList = list.map((val, index) => ({ idx: index, value: val.id, label: val.guildName }))
        // console.log('-guild-list-', this.guildList)
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
.sortCol {
  text-align: center;
}
</style>
