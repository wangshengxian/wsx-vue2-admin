<!--
 * @Author: wangshengxian
 * @Date: 2020-10-13 11:20:59
 * @LastEditors: wangshengxian
 * @LastEditTime: 2020-12-14 14:38:38
 * @Desc: 主播管理 - 推荐配置
-->
<template>
  <div class="recommend">
    <header class="headerBox">
      <h2>推荐排序配置</h2>
      <el-button type="primary" size="mini" @click="onEditRate">权重标准编辑</el-button>
    </header>
    <div class="tableMain">
      <table class="tableBox" border="0" cellspacing="0" cellpadding="0">
        <thead class="tableHeader">
          <tr>
            <th class="headerItem" v-for="(item, index) in tableTitles" :key="index">
              <p>{{ item }}</p>
              <div class="itemTips" v-if="index === 2">
                <el-tooltip effect="dark" content="按照时间范围内的数据参与计算" placement="top-end">
                  <i class="el-icon-question"></i>
                </el-tooltip>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in tableList" :key="index">
            <td>{{ item.remark }}</td>
            <td>{{ item.rate }}%</td>
            <td>
              <p v-if="item.timeType">
                <span>
                  {{ item.startTime | filterTime }}
                </span>
                —
                <span>{{ item.endTime | filterTime }}</span>
              </p>
              <p v-else>最近{{ item.dateNum }}天</p>
            </td>
            <td><el-button type="primary" size="mini" @click="onEditTime(item, index)">时间编辑</el-button></td>
          </tr>
        </tbody>
      </table>
    </div>

    <editRate :title="dialogTitle" :formData="rateObj" @save="handleSaveRate" :dialogVis.sync="isRate" />
    <editTime :title="dialogTitle" :formData="timeObj" @save="handleSaveTime" :dialogVis.sync="isTime" />
  </div>
</template>

<script>
import editRate from '@/views/anchor/components/recommend/handleEditRate'
import editTime from '@/views/anchor/components/recommend/handleEditTime'
import tools from '@/utils/tools'
import { getRecommendSort } from '@/api/anchor'
export default {
  name: '',
  data() {
    return {
      actIdx: -1,
      dialogTitle: '权重标准编辑',
      isRate: false,
      isTime: false,
      tableTitles: ['推荐标题', '权重标准', '推荐标准有效数据时间', '操作'],
      rateObj: {
        gift: 0,
        num: 0,
        time: 0
      },
      timeObj: {
        timeType: '1',
        startTime: '',
        endTime: '',
        dateNum: '',
        id: ''
      },
      tableList: []
    }
  },
  computed: {},
  watch: {},
  created() {
    this.getData()
  },
  mounted() {},
  filters: {
    filterTime(val) {
      let result = val ? tools.formatDate(val, '{y}-{m}-{d}') : '至今'
      return result
    }
  },
  methods: {
    onEditRate() {
      console.log('-data-', this.rateObj)
      this.isRate = true
      this.dialogTitle = '权重标准编辑'
    },
    onEditTime(data, idx) {
      console.log('-edit-', data)
      this.actIdx = idx
      this.isTime = true
      this.dialogTitle = '推荐标准有效数据时间'
      this.timeObj = { ...data }
      this.timeObj.timeType += ''
    },
    handleSaveRate(data) {
      console.log('-handle-rate-', data)
      this.getData()
    },
    handleSaveTime(data) {
      console.log('-handle-save-time', data)
      this.getData()
    },
    getData() {
      getRecommendSort().then(res => {
        console.log('-res-', res)
        this.tableList = res.data
        console.log('-table-data-', this.tableList)
        this.rateObj = {
          gift: this.tableList[0].rate,
          num: this.tableList[1].rate,
          time: this.tableList[2].rate
        }
      })
    }
  },
  components: { editRate, editTime }
}
</script>
<style lang="less" scoped>
//@import url(); 引入公共css类

.headerBox {
  display: flex;
  justify-content: space-between;
  padding: 10px 20px;

  h2 {
    font-weight: 600;
  }
}

.tableMain {
  padding: 10px 20px;
}

.tableBox {
  width: 100%;
  border: 1px solid #000;

  tr {
    display: flex;
    th,
    td {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 25%;
      line-height: 50px;
      border-bottom: 1px solid #000;
      border-right: 1px solid #000;

      &:last-child {
        border-right: none;
      }
    }
  }
  tbody {
    tr {
      &:last-child {
        td {
          border-bottom: none;
        }
      }
    }
  }

  thead {
    width: 100%;

    .itemTips {
      font-size: 16px;
      color: #409eff;
      cursor: pointer;
      margin-left: 10px;
    }
  }
}
</style>
