<!--
 * @Author: wangshengxian
 * @Date: 2020-10-13 15:13:20
 * @LastEditors: wangshengxian
 * @LastEditTime: 2020-12-15 10:14:56
 * @Desc: 主播列表 - 序号排序
-->
<template>
  <div class="dialogWrap">
    <el-dialog
      title="序号排序"
      :width="width"
      :close-on-click-modal="true"
      :close-on-press-escape="true"
      :visible.sync="dialogVisible"
      @closed="handleClosed"
    >
      <el-form :model="formData" ref="formRef" :rules="rules">
        <el-form-item label="序号:" prop="num">
          <el-input-number
            v-model="formData.num"
            controls-position="right"
            :min="1"
            :step="1"
            step-strictly
            size="mini"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="时间">
          <el-date-picker
            v-model="formData.startTime"
            type="datetime"
            :picker-options="pickerOptions"
            size="mini"
            placeholder="请选择日期"
            value-format="yyyy-MM-dd HH:mm:ss"
          >
          </el-date-picker>

          <span>—</span>
          <el-date-picker
            v-model="formData.endTime"
            type="datetime"
            :picker-options="pickerOptions"
            size="mini"
            placeholder="请选择日期"
            value-format="yyyy-MM-dd HH:mm:ss"
          >
          </el-date-picker>
          <div>
            <el-popover
              class="tipsBox"
              slot="other"
              placement="bottom"
              width="100"
              trigger="hover"
              content="时间结束后，序号排序将取消。"
            >
              <img class="icon" slot="reference" src="@/assets/images/question.png" alt="" />
            </el-popover>
          </div>
        </el-form-item>
      </el-form>
      <div class="dialog-footer" slot="footer">
        <el-button type="primary" size="small" :loading="isLoading" @click="onSave">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import picker from '@/const/pickerOptions'
import { addSortOrder } from '@/api/anchor'
export default {
  name: '',
  data() {
    return {
      isLoading: false,
      rules: {
        num: [{ required: true, message: '请输入序号', trigger: 'blur' }]
      },
      pickerOptions: picker.pickerComOptions
    }
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    width: {
      type: String,
      default: '800px'
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
        return this.visible
      },
      set(val) {
        this.$emit('update:visible', val)
      }
    }
  },
  watch: {
    formData: {
      handler(val) {
        console.log('-watch-', val)
      },
      deep: true
    }
  },
  created() {},
  mounted() {},
  methods: {
    handleClosed() {
      this.resetForm()
    },
    onSave() {
      this.$refs.formRef.validate(valid => {
        if (valid) {
          // console.log('保存', this.formData)
          const { num, startTime, endTime, anchorId } = this.formData
          if (!startTime) {
            this.msgFunc('请选择开始时间！')
            return
          }
          if (!endTime) {
            this.msgFunc('请选择结束时间！')
            return
          }
          if (new Date(startTime) >= new Date(endTime)) {
            this.msgFunc('开始时间不能大于或等于结束时间！')
            return
          }
          let params = { anchorId, startTime, endTime, weight: num }
          console.log('-add-params-', params)
          this.isLoading = true
          addSortOrder(params)
            .then(res => {
              console.log('-res-', res)
              this.isLoading = false
              this.dialogVisible = false
              this.msgFunc('排序号添加成功！', 'success')
              this.$emit('success')
            })
            .catch(err => {
              this.isLoading = false
              this.msgFunc(err.msg, 'error')
            })
        } else {
          return false
        }
      })
    },
    resetForm() {
      // console.log('重置')
      this.$refs.formRef.resetFields()
    },
    msgFunc(message, type = 'warning', duration = 2000) {
      this.$message({
        message,
        type,
        duration
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
  // justify-content: center;

  /deep/ .el-form-item__label {
    width: 240px;
  }
  /deep/ .el-form-item__content {
    display: flex;
    align-items: center;
  }
  .el-input-number {
    margin-right: 6px;
  }
}

.el-input {
  // width: 120px;
}
.el-input-number {
  width: 140px;
}
.el-input__inner {
  text-align: center;
}

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
</style>
