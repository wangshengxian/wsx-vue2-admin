<!--
   设置公会
-->
<template>
  <div class="dialog">
    <el-dialog title="设置公会" width="700px" :visible.sync="dialogVisible" @close="handleClose">
      <el-form :model="formData" ref="formRef" :rules="rules" label-width="200px">
        <el-form-item label="公会名:" prop="guildId">
          <el-select v-model="formData.guildId" placeholder="全部">
            <el-option
              v-for="item in formData.guildList"
              :label="item.label"
              :value="item.value"
              :key="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <div class="dialog-footer" slot="footer">
        <el-button type="primary" :loading="isLoading" @click="onConfirm">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { setAnchorGuild } from '@/api/anchor'
export default {
  name: '',
  data() {
    return {
      isLoading: false,
      rules: {
        // guildId: [{ required: true, message: '请选择公会', trigger: 'change' }]
      }
    }
  },
  props: {
    visible: {
      type: Boolean,
      default: false
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
  components: {},
  created() {},
  mounted() {},
  methods: {
    onConfirm() {
      this.validateFunc(() => {
        const { userId, guildId } = this.formData
        const params = { userId, guildId }
        console.log('-params-', params)
        this.isLoading = true
        setAnchorGuild(params)
          .then(res => {
            console.log('-res-', res)
            this.$message({
              message: '设置公会成功!',
              type: 'success'
            })
            this.isLoading = false
            this.dialogVisible = false
            this.$emit('success')
          })
          .catch(err => {
            console.log(err)
            this.isLoading = false
          })
      })
    },
    handleClose() {
      this.onReset()
    },
    onReset() {
      this.$refs.formRef.resetFields()
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
  }
}
</script>
<style lang="less" scoped>
//@import url(); 引入公共css类
</style>
