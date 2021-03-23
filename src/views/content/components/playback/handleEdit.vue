<!--
 * @Author: wangshengxian
 * @Date: 2020-10-09 18:25:11
 * @LastEditors: wangshengxian
 * @LastEditTime: 2020-10-10 10:45:32
 * @Desc: 直播回放 - 编辑
-->
<template>
  <div class="edit">
    <el-dialog title="编辑" width="40%" :visible.sync="dialogVisible" @closed="handleClosed">
      <el-form :model="formData" :rules="rules" ref="formRef" label-width="80px">
        <el-form-item label="视频标题" prop="title">
          <el-input v-model="formData.title"></el-input>
        </el-form-item>
        <el-form-item label="视频封面" prop="imgUrl">
          <imgUpload v-model="formData.imgUrl" :limit="1"></imgUpload>
        </el-form-item>
        <el-form-item label="视频展示">
          <el-switch v-model="formData.state"></el-switch>
        </el-form-item>
        <el-form-item>
          <el-button size="mini" type="primary" @click="onSave">保存</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import imgUpload from '@/components/imgUpload'
import { updateUserPlayback } from '@/api/content'
export default {
  name: '',
  data() {
    return {
      rules: {
        title: [{ required: true, message: '请输入视频标题', trigger: 'blur' }],
        imgUrl: [{ type: 'array', required: true, message: '请上传图片', trigger: 'change' }]
      }
    }
  },
  props: {
    dialogVis: {
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
        return this.dialogVis
      },
      set(val) {
        this.$emit('update:dialogVis', val)
      }
    }
  },
  watch: {
    formData: {
      handler(data) {
        // console.log('-watch-edit-', data)
      },
      deep: true
    }
  },
  created() {},
  mounted() {},
  methods: {
    handleClosed() {
      console.log('-closed-')
      this.handleReset()
    },
    onSave() {
      console.log('-save-')
      this.$refs.formRef.validate(valid => {
        if (valid) {
          this.handleReq()
        } else {
          return false
        }
      })
    },
    // 重置
    handleReset() {
      this.$refs.formRef.resetFields()
    },
    handleReq() {
      const { imgUrl } = this.formData
      const params = { ...this.formData, photo: imgUrl[0] }
      delete params.imgUrl
      console.log('-params-', params)
      updateUserPlayback(params).then(res => {
        // console.log('--res--', res)
        this.dialogVisible = false
        this.$emit('success')
        this.$message({
          type: 'success',
          message: '保存成功!'
        })
      })
    }
  },
  components: { imgUpload }
}
</script>
<style lang="less" scoped>
//@import url(); 引入公共css类
</style>
