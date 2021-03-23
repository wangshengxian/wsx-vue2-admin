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
      <div class="content">
        <el-row class="row">
          <el-col class="labelTxt" :span="4"><span class="redIcon">*</span>用户ID</el-col>
          <el-col :span="18">
            <el-input v-model="infoData.userId" maxlength="100" placeholder="请输入ID"></el-input>
          </el-col>
        </el-row>
        <el-row class="row">
          <el-col class="labelTxt" :span="4"><span class="redIcon">*</span>标题</el-col>
          <el-col :span="18">
            <el-input v-model="infoData.title" maxlength="100" placeholder="请输入标题"></el-input>
          </el-col>
        </el-row>
        <el-row class="row">
          <el-col class="labelTxt" :span="4"><span class="redIcon">*</span>价格</el-col>
          <el-col :span="11">
            <el-input-number
              v-model="infoData.coin"
              :min="0"
              controls-position="right"
              placeholder="请输入价格"
              :precision="0"
              size="medium"
            ></el-input-number>
          </el-col>
          <el-col class="labelTxt" :span="3"
            >单位: TST
            <el-popover class="tipsBox" placement="bottom" width="100" trigger="hover" content="此处的价格只能为正整数">
              <img class="icon" slot="reference" src="@/assets/images/question.png" alt="" />
            </el-popover>
          </el-col>
        </el-row>

        <el-row class="row">
          <el-col class="labelTxt" :span="4"><span class="redIcon">*</span>视频封面</el-col>
          <el-col :span="18">
            <imgUpload ref="imgUploadRef" v-model="infoData.cover" :limit="1" />
          </el-col>
        </el-row>

        <el-row class="row" style="margin-top:10px">
          <el-col class="labelTxt" :span="4"><span class="redIcon">*</span>上传视频</el-col>
          <el-col :span="18">
            <videoUpload
              ref="videoUploadRef"
              v-model="currVideoUrl"
              :limit="1"
              :size="204800"
              :httpRequest="handleHttpRequest"
            />
            <el-progress :percentage="uploadProgressVal" v-if="isShowProgress"></el-progress>
          </el-col>
        </el-row>
      </div>
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
import { getWsUploadToken } from '@/api/common'
import { updateLargeVShortVideo } from '@/api/content'
import { resourceUrl } from '@/const/global'
import wsObj from '@/utils/wcsUpload'
export default {
  name: '',
  data() {
    return {
      // 是否显示进度条
      isShowProgress: false,
      // 视频上传进度条
      uploadProgressVal: 0
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
    infoData: {
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
    initAddVideoData() {
      this.dialogVisiable = false
      this.isShowProgress = false
      this.uploadProgressVal = 0
      this.$refs.imgUploadRef.syncElUpload([])
      this.$refs.videoUploadRef.syncVideoList([])
      // TODO: 取消文字按钮操作会多触发一次syncElUpload、syncVideoList方法，暂时不知怎么引起的
    },
    handleClosed() {
      this.initAddVideoData()
    },
    // 取消
    onCancel() {
      this.initAddVideoData()
    },
    // 确认提交
    onComfirm() {
      this.validFunc(() => {
        // console.log('-video-url-', this.currVideoUrl)
        let params = { ...this.infoData }
        params.url = this.currVideoUrl[0]
        params.cover = params.cover[0]
        console.log('-params-', params)
        updateLargeVShortVideo(params, this.type)
          .then(res => {
            this.$message({ type: 'success', message: '操作成功！' })
            this.initAddVideoData()
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

    validFunc(callback) {
      // console.log('-info-data-', this.infoData)
      if (!this.infoData.userId) {
        this.$message({ type: 'warning', message: '请输入ID' })
        return
      }
      if (!this.infoData.title) {
        this.$message({ type: 'warning', message: '请输入标题' })
        return
      }
      if (!this.infoData.coin) {
        this.$message({ type: 'warning', message: '请输入价格' })
        return
      }
      if (this.infoData.cover.length === 0) {
        this.$message({ type: 'warning', message: '请上传视频封面' })
        return
      }
      if (this.currVideoUrl.length === 0) {
        this.$message({ type: 'warning', message: '请上传视频' })
        return
      }
      callback()
    },
    // 视频上传 (自定义上传)
    handleHttpRequest(a) {
      console.log('-自定义上传-', a)
      const params = { fileName: a.file.name }
      getWsUploadToken(params).then(res => {
        console.log('-res-', res)
        const { fileName, token } = res.data
        const copyFile = new File([a.file], fileName) // 更改file.name,此处不可直接修改name
        this.uploadReqFunc(copyFile, token, data => {
          console.log('-data-', data)
          this.$message({
            message: '上传成功!',
            type: 'success'
          })
          this.currVideoUrl = [`${resourceUrl}/${fileName}`]
          console.log('-curr-video-url-', this.currVideoUrl)
        })
      })
    },
    // 网宿上传文件
    uploadReqFunc(file, token, callback) {
      const uploadObj = wsObj.createWcsUploadObj(file, token)
      // console.log('-upload-obj-', uploadObj)
      this.isShowProgress = true
      this.uploadProgressVal = 0
      uploadObj.putFile()
      uploadObj.uploadProgress = progress => {
        // console.log('-progress-', progress)
        this.uploadProgressVal = Math.floor(progress.total.percent)
        // console.log('-已经完成-', this.uploadProgressVal + '%')
      }
      uploadObj.onComplete = res => {
        console.log('-res-', res)
        this.isShowProgress = false
        this.uploadProgressVal = 0
        this.$refs.videoUploadRef.isUploading = false // 关闭上传状态
        if (res.data.code) {
          // callback('error')
          console.log('-error-')
          return
        }
        callback(res)
      }
      uploadObj.onError = error => {
        // {code: 401, message: "客户端认证授权失败。请重试或提交反馈。", isRequestError: true}
        console.log('error', error)
        this.$message({ type: 'error', message: error.message })
        this.$refs.videoUploadRef.isUploading = false
        this.$refs.videoUploadRef.syncVideoList()
      }
    }
  }
}
</script>
<style lang="less" scoped>
//@import url(); 引入公共css类

/deep/ .el-input.is-disabled .el-input__inner {
  color: #606266;
}

.no-list-box {
  line-height: 32px;
  color: red;
  padding-bottom: 12px;
}

.content {
  padding: 0px 40px;
  .row {
    line-height: 60px;
    .labelTxt {
      width: 86px;
    }
    .redIcon {
      color: red;
    }
    .img {
      width: 80px;
      height: 80px;
    }
    .videoWrap {
      position: relative;
      width: 250px;
      height: 150px;
      .delete {
        position: absolute;
        right: 7px;
        top: 7px;
        color: white;
        background: gray;
        padding: 5px;
      }
    }
    .imgWrap {
      position: relative;
      // margin-top: 18px;
      width: 100px;
      height: 100px;
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      img {
        width: 100%;
        height: 100%;
      }
      .delete {
        position: absolute;
        right: 7px;
        top: 7px;
        color: white;
        background: gray;
        padding: 5px;
      }
    }
  }
  .uploadSrc {
    line-height: 120px;
  }
}
.icon {
  width: 18px;
  vertical-align: middle;
  cursor: pointer;
}
</style>
