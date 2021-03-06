<!--
  上传视频/修改视频
-->
<template>
  <div class="addVideo">
    <el-dialog
      :title="type === 'add' ? '上传视频' : '编辑视频'"
      width="600px"
      center
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="dialogVisiable"
      @closed="handleClosed"
    >
      <el-form :model="formData" :rules="rules" ref="formRef" label-width="120px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="formData.title" maxlength="100" placeholder="请输入标题"></el-input>
        </el-form-item>

        <el-form-item label="价格" prop="coin">
          <el-input-number
            v-model="formData.coin"
            :min="0"
            controls-position="right"
            placeholder="请输入价格"
            :precision="0"
            size="medium"
          ></el-input-number>
          <div class="tipsWrap">
            单位: TST
            <el-popover class="tipsBox" placement="bottom" width="100" trigger="hover" content="此处的价格只能为正整数">
              <img class="icon" slot="reference" src="@/assets/images/question.png" alt="" />
            </el-popover>
          </div>
        </el-form-item>

        <el-form-item label="视频封面" prop="cover">
          <imgUpload ref="imgUploadRef" v-model="formData.cover" :limit="1" @success="handleImgUploadSuccess" />
        </el-form-item>

        <el-form-item label="上传视频">
          <videoUpload
            ref="videoUploadRef"
            v-model="currVideoUrl"
            :limit="1"
            :size="204800"
            :httpRequest="handleHttpRequest"
          />
          <el-progress :percentage="uploadProgressVal" v-if="isShowProgress"></el-progress>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click.stop="onCancel">取 消</el-button>
        <el-button type="primary" @click="onComfirm">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import imgUpload from '@/components/imgUpload'
import videoUpload from '@/components/videoUpload'
import { updateLargeVShortVideo } from '@/api/content'
import { resourceUrl } from '@/const/global'
import largeFileUpload from '@/utils/wcsUpload'
export default {
  name: '',
  data() {
    return {
      uploadObj: null, // 上传文件实例
      isShowProgress: false, // 是否显示进度条
      uploadProgressVal: 0, // 视频上传进度条
      rules: {
        title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
        coin: [{ required: true, message: '请输入价格', trigger: 'blur' }],
        cover: [{ type: 'array', required: true, message: '请上传图片', trigger: 'change' }]
      }
    }
  },
  props: {
    type: {
      type: String,
      default: 'add'
    },
    visible: {
      type: Boolean,
      default: false
    },
    videoUrl: {
      type: Array,
      default() {
        return []
      }
    },
    formData: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  computed: {
    currVideoUrl: {
      get() {
        return this.videoUrl
      },
      set(val) {
        this.$emit('update:videoUrl', val)
      }
    },
    dialogVisiable: {
      get() {
        return this.visible
      },
      set(val) {
        this.$emit('update:visible', val)
      }
    }
  },
  components: { imgUpload, videoUpload },
  mounted() {},
  methods: {
    handleClosed() {
      this.dialogVisiable = false
      this.isShowProgress = false
      this.uploadProgressVal = 0
      this.$refs.formRef.clearValidate()
      this.$refs.imgUploadRef.syncElUpload([])
      this.$refs.videoUploadRef.syncVideoList([])
    },
    handleImgUploadSuccess() {
      this.$refs.formRef.clearValidate('cover')
    },
    // 取消
    onCancel() {
      this.dialogVisiable = false
    },
    // 确认提交
    onComfirm() {
      this.validFunc(() => {
        // console.log('-video-url-', this.currVideoUrl)
        let params = { ...this.formData }
        params.url = this.currVideoUrl[0]
        params.cover = params.cover[0]
        console.log('-params-', params)
        updateLargeVShortVideo(params, this.type)
          .then(res => {
            this.$message({ type: 'success', message: '操作成功！' })
            this.dialogVisiable = false
            this.$emit('success')
          })
          .catch(err => {
            // console.log('-err-', err)
            if (+err.code === 3006) {
              this.$message({ type: 'error', message: '用户ID不存在' })
            }
          })
      })
    },
    // 视频上传 (自定义上传)
    handleHttpRequest(a) {
      // console.log('-自定义上传-', a)
      largeFileUpload(a.file).then(res => {
        this.uploadObj = res
        // console.log('-upload-obj-', uploadObj, uploadObj.file.name)
        this.isShowProgress = true
        this.uploadProgressVal = 0
        this.uploadObj.uploadProgress = this.handleProgress
        this.uploadObj.onComplete = this.handleComplete
        this.uploadObj.onError = this.handleError
      })
    },
    handleProgress(progress) {
      // console.log('-progress-', progress)
      this.uploadProgressVal = Math.floor(progress.total.percent)
      // console.log('-已经完成-', this.uploadProgressVal + '%')
    },
    handleComplete(res) {
      // console.log('-res-', res)
      this.isShowProgress = false
      this.uploadProgressVal = 0
      this.$refs.videoUploadRef.isUploading = false // 关闭上传状态
      if (res.data.code) {
        console.log('-error-')
        return
      }
      this.$message({
        message: '上传成功!',
        type: 'success'
      })
      this.videoUrl.push(`${resourceUrl}/${this.uploadObj.file.name}`)
      console.log('-video-url-', this.videoUrl)
    },
    handleError(error) {
      // {code: 401, message: "客户端认证授权失败。请重试或提交反馈。", isRequestError: true}
      console.log('error', error)
      this.$message({ type: 'error', message: error.message })
      this.isShowProgress = false
      this.uploadProgressVal = 0
      this.$refs.videoUploadRef.isUploading = false
      this.$refs.videoUploadRef.syncVideoList()
    },
    validFunc(callback) {
      this.$refs.formRef.validate(valid => {
        if (!valid) {
          return false
        }
        if (this.currVideoUrl.length === 0) {
          this.$message({ type: 'warning', message: '请上传视频' })
          return false
        }
        callback()
      })
    }
  }
}
</script>
<style lang="less" scoped>
//@import url(); 引入公共css类

/deep/ .el-input {
  width: 200px;
}

/deep/ .el-input.is-disabled .el-input__inner {
  color: #606266;
}

.no-list-box {
  line-height: 32px;
  color: red;
  padding-bottom: 12px;
}

.tipsWrap {
  display: inline-block;
  margin-left: 10px;
}

.icon {
  width: 18px;
  vertical-align: middle;
  cursor: pointer;
}
</style>
