<!--
 * @Author: wangshengxian
 * @Date: 2020-08-18 14:28:01
 * @LastEditors: wangshengxian
 * @LastEditTime: 2020-08-21 17:00:07
 * @Desc: 主播分析列表
-->
<template>
  <div class="analyzeList">
    <ul class="dataCard">
      <li class="cardItem">
        <div class="title">总主播数</div>
        <div class="number">{{ infoData.totalNum }}</div>
      </li>
      <li class="cardItem">
        <el-tooltip effect="dark" :content="tipsContent" placement="top">
          <div class="content">
            <div class="title">有效主播数</div>
            <div class="number">{{ infoData.validNum }}</div>
          </div>
        </el-tooltip>
      </li>
      <li class="cardItem" @click="toIncomeDetails">
        <div class="title">主播总收入</div>
        <div class="number">{{ infoData.income }}</div>
      </li>
    </ul>
    <div class="main">
      <searchForm :formOptions="formOptions" :btnItems="btnItems" @onSearch="handleSearch" @onExport="handleExport" />
      <div class="listWrap">
        <el-table :data="tableData" tooltip-effect="dark" style="width: 100%">
          <el-table-column prop="userId" label="ID" min-width="80"></el-table-column>
          <el-table-column prop="nickname" label="昵称" min-width="90"></el-table-column>
          <el-table-column prop="username" label="姓名" min-width="90"></el-table-column>
          <el-table-column prop="tel" label="手机号" min-width="120"></el-table-column>
          <el-table-column prop="idCard" label="身份证号" min-width="140"></el-table-column>
          <el-table-column prop="income" label="直播收入" min-width="80"></el-table-column>
          <el-table-column prop="liveDay" label="直播天数" min-width="80"></el-table-column>
          <el-table-column prop="totalTime" label="直播时长/小时" min-width="100"></el-table-column>
        </el-table>
      </div>
      <pagination
        :currentPage.sync="pagination.currentPage"
        :total="pagination.total"
        @currentChange="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import searchForm from '@/components/searchForm'
import pagination from '@/components/pagination'
export default {
  name: '',
  data() {
    return {
      btnItems: 'search, export',
      formOptions: [
        {
          label: 'ID昵称',
          prop: 'nickname',
          element: 'el-input',
          initValue: '',
          placeholder: '请输入ID/昵称'
        },
        {
          label: '直播收入',
          prop: 'startIncome',
          element: 'el-input',
          initValue: '',
          placeholder: '',
          className: 'line-input'
        },
        {
          element: 'el-connect-line'
        },
        {
          label: '',
          prop: 'endIncome',
          element: 'el-input',
          initValue: '',
          placeholder: '',
          className: 'line-input'
        },
        {
          label: '直播天数',
          prop: 'startLiveDay',
          element: 'el-input',
          initValue: '',
          placeholder: '',
          className: 'line-input'
        },
        {
          element: 'el-connect-line'
        },
        {
          label: '',
          prop: 'endLiveDay',
          element: 'el-input',
          initValue: '',
          placeholder: '',
          className: 'line-input'
        },
        {
          label: '直播时长',
          prop: 'startLiveTime',
          element: 'el-input',
          initValue: '',
          placeholder: '',
          className: 'line-input'
        },
        {
          element: 'el-connect-line'
        },
        {
          label: '',
          prop: 'endLiveTime',
          element: 'el-input',
          initValue: '',
          placeholder: '',
          className: 'line-input'
        }
      ],
      pagination: {
        currentPage: 1,
        pageSize: 10,
        total: 20
      },
      tipsObj: {
        day: 22,
        time: 2
      },
      infoData: {
        totalNum: 240,
        validNum: 140,
        income: 20091
      },
      tableData: []
    }
  },
  computed: {
    tipsContent() {
      return `每月≥${this.tipsObj.day}天，每天≥${this.tipsObj.time}小时`
    }
  },
  created() {
    this.getData()
  },
  mounted() {},
  methods: {
    toIncomeDetails() {
      this.$router.push({ name: 'IncomeDetails' })
    },
    handleSearch(data) {
      console.log('-search-', data)
    },
    handleExport(data) {
      console.log('-export-', data)
    },
    handleCurrentChange(pageNo) {
      console.log('-pageNo-', pageNo)
    },
    getData() {
      let list = [
        {
          userId: '10092',
          nickname: '呵呵哒',
          username: '小样快过来',
          tel: '+8613111111111',
          idCard: '421190190001012231',
          income: '10009',
          liveDay: '29',
          totalTime: 61
        }
      ]
      setTimeout(() => {
        this.tableData = list
      }, 1000)
    }
  },
  components: { searchForm, pagination }
}
</script>
<style lang="less" scoped>
//@import url(); 引入公共css类
@import '~@/assets/styles/variables.less';

.dataCard {
  display: flex;
  margin-bottom: 15px;
  .cardItem {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: #fff;
    padding: 10px 36px;
    border-radius: 5px;
    margin-right: 10px;
    .content {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
    .title {
      font-size: 16px;
      padding-bottom: 10px;
    }
    .number {
      font-size: 14px;
    }
    &:nth-child(1) {
      background: @red;
    }
    &:nth-child(2) {
      background: @orange;
    }
    &:nth-child(3) {
      background: @blue;
    }
    &:hover {
      cursor: pointer;
      // transition: transform 0.1s ease;
      // transform: scale(1.1);
    }
  }
}

.el-table {
  /deep/ .cell {
    text-align: center;
  }
}
</style>
