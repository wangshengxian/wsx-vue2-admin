<!--
 * @Author: wangshengxian
 * @Date: 2020-08-20 16:19:04
 * @LastEditors: wangshengxian
 * @LastEditTime: 2020-08-28 16:09:35
 * @Desc: 主播列表 - 主播审核
-->
<template>
  <div class="auditTab">
    <div class="tableBox">
      <el-table :data="list" tooltip-effect="dark" style="width: 100%">
        <el-table-column prop="userId" label="ID" min-width="80"></el-table-column>
        <el-table-column prop="myname" label="昵称" min-width="90"></el-table-column>
        <el-table-column prop="name" label="姓名" min-width="90"></el-table-column>
        <el-table-column prop="phone" label="手机号" min-width="120"></el-table-column>
        <el-table-column prop="certificateNo" label="证件号码" min-width="140"></el-table-column>
        <el-table-column label="个人简介" min-width="60">
          <template slot-scope="scope">
            <p class="intro" @click="onLookIntro(scope.row)">查看</p>
          </template>
        </el-table-column>
        <el-table-column prop="modifyTime" label="时间" min-width="140"></el-table-column>
        <el-table-column prop="status" label="审核状态" min-width="60">
          <template slot-scope="scope">
            <div class="statusTxt">
              <p class="auditStatus" v-if="scope.row.status == 0">
                审核中
              </p>
              <p class="passStatus" v-if="scope.row.status == 1">
                通过
              </p>
              <p class="dangerStatus" v-if="scope.row.status == 2">
                未通过
              </p>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="60">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="onLookStatus(scope.row, scope.$index)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  name: '',
  data() {
    return {}
  },
  props: {
    list: {
      type: Array,
      default: function() {
        return []
      }
    }
  },
  filters: {},
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
  mounted() {},
  methods: {
    onLookIntro(data) {
      // console.log('-look-intro-', data)
      let { introduction } = data
      this.publicConfirmFunc('个人简介', introduction)
    },
    onLookStatus(data, index) {
      // console.log('-look-status-', data, index)
      const { status } = data
      let title = ''
      let content = ''
      if (status === 0) {
        title = '审核中'
        content = '主播信息已提交，正在审核中，请您耐心等待...'
        this.publicConfirmFunc(title, content)
        return
      }
      if (status === 1) {
        title = '审核通过'
        content = '恭喜您！主播信息通过审核！'
        this.publicConfirmFunc(title, content)
        return
      }
      if (status === 2) {
        title = '审核未通过'
        content = `主播身份信息因（${data.content}）审核未通过，请您重新进行认证`
        this.auditNotPassConfirmFunc(title, content, index)
      }
    },
    publicConfirmFunc(title, content) {
      this.$confirm(content, title, {
        showCancelButton: false,
        showClose: false,
        center: true,
        callback: (action, instance) => {}
      })
    },
    auditNotPassConfirmFunc(title, content, index) {
      this.$confirm(content, title, {
        confirmButtonText: '重新发起审核',
        showClose: false,
        center: true,
        callback: (action, instance) => {
          if (action === 'confirm') {
            this.$emit('openDialog', index)
          }
        }
      })
    }
  },
  components: {}
}
</script>
<style lang="less" scoped>
//@import url(); 引入公共css类
.auditTab {
  .tableBox {
    .intro {
      color: #409eff;
      cursor: pointer;
    }
  }
}
</style>
