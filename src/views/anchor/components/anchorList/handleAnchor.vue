<!--
 * @Author: wangshengxian
 * @Date: 2020-08-20 16:19:04
 * @LastEditors: wangshengxian
 * @LastEditTime: 2020-08-28 16:11:05
 * @Desc: 主播列表 - 主播
-->
<template>
  <div class="anchorTab">
    <div class="tableBox">
      <el-table :data="list" tooltip-effect="dark" style="width: 100%">
        <el-table-column prop="userId" label="ID" min-width="80"></el-table-column>
        <el-table-column prop="myname" label="昵称" min-width="90"></el-table-column>
        <el-table-column prop="name" label="姓名" min-width="90"></el-table-column>
        <el-table-column prop="phone" label="手机号" min-width="120"></el-table-column>
        <el-table-column prop="certificateNo" label="证件号码" min-width="160"></el-table-column>
        <el-table-column label="个人简介" min-width="80">
          <template slot-scope="scope">
            <p class="intro" @click="onLook(scope.row)">查看</p>
          </template>
        </el-table-column>
        <el-table-column
          prop="liveType"
          label="直播状态"
          min-width="80"
          :formatter="formatterLiveType"
        ></el-table-column>
        <el-table-column prop="modifyTime" label="时间" min-width="140"></el-table-column>
        <el-table-column prop="status" label="状态" min-width="80">
          <template slot-scope="scope">
            <p class="successStatus" v-if="scope.row.status === anchorStatus">
              正常
            </p>
            <p class="dangerStatus" v-else>
              封禁
            </p>
          </template>
        </el-table-column>

        <el-table-column label="封禁截止时间" min-width="200">
          <template slot-scope="scope">
            <div class="dangerStatus" v-if="scope.row.endTime">
              <p>{{ scope.row.endTime }}</p>
              <p>
                (封禁{{ scope.row.endTime | filterTime(scope.row.startTime) }}天，距离解封还有{{
                  scope.row.endTime | filterTime
                }}天)
              </p>
            </div>
            <div v-else>
              <p>0000-00-00</p>
              <p>
                (封禁0天，距离解封还有0天)
              </p>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import tools from '@/utils/tools'
export default {
  name: '',
  data() {
    return {
      // 主播状态 (0正常，1封禁)
      anchorStatus: 0,
      // 主播直播状态(0直播中，1离线)
      liveStatus: 0
    }
  },
  props: {
    list: {
      type: Array,
      default: function() {
        return []
      }
    }
  },
  filters: {
    filterTime(start, end) {
      return tools.getRemainDay(start, end)
    }
  },
  watch: {
    list: {
      handler(newVal, oldVal) {
        // console.log('-watch-list-', newVal)
      },
      deep: true
    }
  },
  computed: {},
  created() {},
  mounted() {
    // console.log(new Date('2020-08-25 15:28:56').getTime())
  },
  methods: {
    formatterLiveType({ liveType }, col) {
      return liveType === this.liveStatus ? '直播中' : '离线'
    },
    onLook(data) {
      console.log(data)
      let { introduction } = data
      this.$confirm(introduction, '个人简介', {
        showCancelButton: false,
        showClose: false,
        center: true,
        callback: (action, instance) => {}
      })
    }
  },
  components: {}
}
</script>
<style lang="less" scoped>
//@import url(); 引入公共css类
.anchorTab {
  .tableBox {
    .intro {
      color: #409eff;
      cursor: pointer;
    }
    .dangerStatus {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .txt {
        color: red;
      }
      .explainTxt {
        color: #999;
      }
    }
  }
}
</style>
