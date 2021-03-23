<!--
 * @Author: wangshengxian
 * @Date: 2020-10-14 16:41:48
 * @LastEditors: wangshengxian
 * @LastEditTime: 2021-01-20 10:36:52
 * @Desc: 录播列表 - 添加录播主播
-->
<template>
  <div class="">
    <el-dialog
      :title="(type === 'add' ? '添加' : '编辑') + '主播房间'"
      width="700px"
      center
      top="30vh"
      :close-on-click-modal="true"
      :close-on-press-escape="true"
      :close="handleClose"
      :visible.sync="dialogVisible"
    >
      <el-form :model="formData" ref="formRef" :rules="rules">
        <el-form-item label="主播ID:" prop="anchorId">
          <el-input v-model="formData.anchorId" clearable maxlength="8" placeholder="请输入主播ID"></el-input>
        </el-form-item>
      </el-form>
      <div class="dialog-footer" slot="footer">
        <el-button @click="onReset">重置</el-button>
        <el-button type="primary" :loading="isLoading" @click="onConfirm">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { operateAnchorRoom } from '@/api/anchor'
export default {
  name: '',
  data() {
    return {
      isLoading: false,
      formData: {
        anchorId: ''
      },
      rules: {
        anchorId: [{ required: true, message: '请输入主播ID', trigger: 'blur' }]
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
    handleClose() {
      this.onReset()
    },
    onReset() {
      this.$refs.formRef.resetFields()
    },
    onConfirm() {
      this.validateFunc(() => {
        console.log('-formData-', this.formData)
        this.isLoading = true
        const params = { type: 1, ...this.formData }
        console.log('-params-', params)
        operateAnchorRoom(params)
          .then(res => {
            console.log('-res-', res)
            this.$message({
              message: '添加主播房间成功！',
              type: 'success'
            })
            this.isLoading = false
            this.dialogVisible = false
            this.$emit('success')
          })
          .catch(() => {
            this.isLoading = false
          })
      })
    },
    validateFunc(callback) {
      this.$refs.formRef.validate(valid => {
        if (valid) {
          callback()
          return
        }
        return false
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
