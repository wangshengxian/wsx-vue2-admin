<!--
 * @Author: wangshengxian
 * @Date: 2020-10-14 16:41:48
 * @LastEditors: wangshengxian
 * @LastEditTime: 2021-01-20 10:36:52
 * @Desc: 主播列表 - 添加主播
-->
<template>
  <div class="">
    <el-dialog
      :title="(type === 'add' ? '添加' : '编辑') + '主播'"
      :width="width"
      center
      :close-on-click-modal="true"
      :close-on-press-escape="true"
      :before-close="handleBeforeClose"
      :visible.sync="dialogVisible"
    >
      <el-form :model="formData" ref="formRef" :rules="rules">
        <el-form-item label="添加主播ID:" prop="useridx">
          <el-input v-model="formData.useridx" clearable maxlength="8" placeholder="请输入主播ID"></el-input>
        </el-form-item>
        <el-form-item label="姓名:" prop="username">
          <el-input v-model="formData.username" clearable maxlength="5" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item label="身份证号:" prop="idcard">
          <el-input v-model="formData.idcard" clearable maxlength="18" placeholder="请输入身份证号"></el-input>
        </el-form-item>
        <!-- <el-form-item label="公会名:" prop="guildName">
          <el-input v-model="formData.guildName" clearable maxlength="18" placeholder="请输入公会名"></el-input>
        </el-form-item> -->
      </el-form>
      <div class="dialog-footer" slot="footer">
        <el-button @click="onReset">重置</el-button>
        <el-button type="primary" :loading="isLoading" @click="onConfirm">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { insertRoomHotrank } from '@/api/anchor'
export default {
  name: '',
  data() {
    return {
      isLoading: false,
      formData: {
        useridx: '',
        username: '',
        idcard: '',
        guildName: ''
      },
      rules: {
        useridx: [{ required: true, message: '请输入主播ID', trigger: 'blur' }],
        username: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        idcard: [{ required: true, message: '请输入身份证号码', trigger: 'blur' }]
      }
    }
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'add'
    },
    width: {
      type: String,
      default: '800px'
    }
  },
  computed: {
    dialogVisible: {
      get() {
        return this.visible
      },
      set(val) {
        this.$emit('update:visible', val)
      }
    }
  },
  created() {},
  mounted() {},
  methods: {
    handleBeforeClose(done) {
      console.log('-before-close-')
      done()
    },
    onReset() {
      this.$refs.formRef.resetFields()
    },
    onConfirm() {
      this.$refs.formRef.validate(valid => {
        if (valid) {
          console.log('-formData-', this.formData)
          this.isLoading = true
          const params = { ...this.formData }
          console.log('-params-', params)
          insertRoomHotrank(params)
            .then(res => {
              console.log('--res--', res)
              this.isLoading = false
              this.dialogVisible = false
              this.$message({
                message: '添加主播成功！',
                type: 'success'
              })
              this.$emit('success')
            })
            .catch(err => {
              console.log('-add-anchor-error-', err)
              this.isLoading = false
              this.$message({ type: 'error', message: err.msg })
            })
        } else {
          return false
        }
      })
    }
  },
  components: {}
}
</script>
<style lang="less" scoped>
//@import url(); 引入公共css类

.el-form-item {
  display: flex;
  justify-content: center;

  /deep/ .el-form-item__label {
    width: 100px;
  }

  .el-input {
    width: 280px;
  }
}
</style>
