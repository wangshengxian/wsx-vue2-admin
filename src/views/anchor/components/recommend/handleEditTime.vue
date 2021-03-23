<!--
 * @Author: wangshengxian
 * @Date: 2020-10-13 15:13:20
 * @LastEditors: wangshengxian
 * @LastEditTime: 2020-10-22 11:47:32
 * @Desc:
-->
<template>
  <div class="edit-recommend">
    <el-dialog
      :title="title"
      :width="width"
      :close-on-click-modal="true"
      :close-on-press-escape="true"
      :visible.sync="dialogVisible"
      :before-close="handleBeforeClose"
      @closed="handleClosed"
    >
      <el-form :model="formData" ref="formRef" :rules="rules">
        <el-form-item>
          <el-radio-group v-model="formData.timeType">
            <el-radio label="0"
              >最近<el-input-number
                v-model="formData.dateNum"
                controls-position="right"
                :min="0"
                :max="120"
                :step="1"
                step-strictly
                size="mini"
              ></el-input-number
              >天</el-radio
            >
            <el-radio label="1">
              <el-date-picker
                v-model="formData.startTime"
                type="date"
                :picker-options="pickerOptions"
                size="mini"
                placeholder="请选择日期"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
              >
              </el-date-picker>

              <span>—</span>
              <el-date-picker
                v-model="formData.endTime"
                type="date"
                :picker-options="pickerOptions"
                size="mini"
                placeholder="请选择日期"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
              >
              </el-date-picker>
            </el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div class="dialog-fotter" slot="footer">
        <el-button type="primary" size="small" :loading="isLoading" @click="onSave">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import picker from '@/const/pickerOptions'
import { updateSortTime } from '@/api/anchor'
import tools from '@/utils/tools'
export default {
  name: '',
  data() {
    return {
      isLoading: false,
      rules: {
        startTime: [{ required: true, message: '请选择开始时间', trigger: 'change' }]
      },
      pickerOptions: picker.pickerComOptions
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
        console.log('-watch-', val)
      },
      deep: true
    }
  },
  created() {},
  mounted() {},
  methods: {
    onChange(type) {
      console.log('-type-', type)
    },
    onSave() {
      this.$refs.formRef.validate(valid => {
        if (valid) {
          console.log('保存', this.formData)
          const { id, dateNum, startTime, endTime, timeType } = this.formData
          let st, et
          if (timeType === '0') {
            st = tools.getLatelyDays(dateNum)[0]
            et = ''
          } else {
            if (!startTime) {
              this.msgFunc('当前选项需要选择开始时间！')
              return
            }
            if (!endTime) {
              et = ''
            } else {
              if (new Date(startTime) >= new Date(endTime)) {
                this.msgFunc('开始时间不能大于或等于结束时间！')
                return
              }
              et = tools.formatDate(new Date(endTime), '{y}-{m}-{d}')
            }
            st = tools.formatDate(new Date(startTime), '{y}-{m}-{d}')
          }

          let params = { id, dateNum, endTime: et, startTime: st, timeType: +timeType }
          console.log('-params-', params)
          this.isLoading = true
          updateSortTime(params)
            .then(res => {
              console.log('-res-', res)
              this.isLoading = false
              this.dialogVisible = false
              this.$emit('save', params)
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
    handleBeforeClose(done) {
      console.log('关闭图标关闭dialog')
      done()
    },
    handleClosed() {
      console.log('-close-dialog-')
    },
    msgFunc(message, type = 'warning', duration = 2000) {
      this.$message({
        message,
        type,
        duration
      })
    },
    resetForm() {
      console.log('重置')
      this.$refs.formRef.resetFields()
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

.el-input {
  width: 120px;
}
.el-input-number {
  width: 140px;
}
.el-input__inner {
  text-align: center;
}

.el-radio-group {
  display: flex;
  flex-direction: column;

  .el-radio {
    margin-bottom: 20px;

    &:last-child {
      margin-bottom: 0;
    }
  }
}
</style>
