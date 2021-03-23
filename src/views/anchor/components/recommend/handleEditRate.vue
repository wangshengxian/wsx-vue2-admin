<!--
 * @Author: wangshengxian
 * @Date: 2020-10-13 15:13:20
 * @LastEditors: wangshengxian
 * @LastEditTime: 2020-10-15 15:16:17
 * @Desc:
-->
<template>
  <div class="edit-recommend">
    <el-dialog
      :title="title"
      :width="width"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="dialogVisible"
      :before-close="handleBeforeClose"
      @closed="handleClosed"
    >
      <el-form :model="formData" ref="formRef" :rules="rules">
        <el-form-item label="礼物收益:" prop="gift">
          <el-input-number
            v-model="formData.gift"
            controls-position="right"
            :min="0"
            :max="100"
            :step="1"
            step-strictly
            @change="onChange"
          ></el-input-number>
          %
        </el-form-item>
        <el-form-item label="直播间人数:" prop="num">
          <el-input-number
            v-model="formData.num"
            controls-position="right"
            :min="0"
            :max="100"
            :step="1"
            step-strictly
            @change="onChange"
          ></el-input-number>
          %
        </el-form-item>
        <el-form-item label="直播时长:" prop="time">
          <el-input-number
            v-model="formData.time"
            controls-position="right"
            :min="0"
            :max="100"
            :step="1"
            step-strictly
            @change="onChange"
          ></el-input-number>
          %
        </el-form-item>
      </el-form>
      <div class="dialog-fotter" slot="footer">
        <el-button type="primary" size="small" :loading="isLoading" @click="onSave">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { updateSortWeight } from '@/api/anchor'
export default {
  name: '',
  data() {
    return {
      surplusNum: 0,
      isLoading: false,
      rules: {
        gift: [{ required: true, message: '请输入礼物收益权重比例', trigger: 'change' }],
        num: [{ required: true, message: '请输入直播间人数权重比例', trigger: 'change' }],
        time: [{ required: true, message: '请输入直播时长权重比例', trigger: 'change' }]
      }
    }
  },
  props: {
    dialogVis: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '标题'
    },
    width: {
      type: String,
      default: '50%'
    },
    formData: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  computed: {
    dialogVisible: {
      get() {
        return this.dialogVis
      },
      set(val) {
        this.$emit('update:dialogVis', val)
      }
    }
  },
  watch: {
    formData: {
      handler(val) {
        // console.log('-watch-', val)
      },
      deep: true
    }
  },
  created() {},
  mounted() {},
  methods: {
    onChange(val) {
      // console.log('-change-val-', val)
    },

    onSave() {
      this.$refs.formRef.validate(valid => {
        if (valid) {
          this.surplusNum = 100 - (this.formData.gift + this.formData.num + this.formData.time)
          console.log('-保存-', this.surplusNum)
          if (this.surplusNum > 0) {
            this.msgFunc('权重比例总和还不足100%！')
          } else if (this.surplusNum < 0) {
            this.msgFunc('权重比例总和超出100%了！')
          } else {
            this.isLoading = true
            console.log('-params-', this.formData)
            updateSortWeight(this.formData).then(res => {
              console.log('-res-', res)
              this.isLoading = false
              this.dialogVisible = false
              this.$emit('save', this.formData)
              this.msgFunc('修改成功！', 'success')
            })
          }
        } else {
          return false
        }
      })
    },
    handleBeforeClose(done) {
      console.log('关闭图标关闭dialog')
      this.resetForm()
      done()
    },
    handleClosed() {
      console.log('-按钮关闭dialog-')
    },
    resetForm() {
      console.log('重置')
      this.$refs.formRef.resetFields()
    },
    msgFunc(msg, type = 'warning', duration = 2000) {
      this.$message({
        type,
        message: msg,
        duration: duration
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
  .el-input-number {
    margin-right: 6px;
  }
}

.el-input-number {
  width: 140px;
}
</style>
