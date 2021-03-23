<!--
  添加/修改banner
-->
<template>
  <div class="addVideo">
    <el-dialog
      title="上传视频"
      width="600px"
      center
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="dialogVisiable"
      @close="handleClose"
    >
      <div class="content">
        <el-row class="row">
          <el-col class="labelTxt" :span="4"><span class="redIcon">*</span>ID</el-col>
          <el-col :span="19">
            <el-input v-model="infoData.userId" maxlength="100" placeholder="请输入ID"></el-input>
          </el-col>
        </el-row>
        <el-row class="row">
          <el-col class="labelTxt" :span="4"><span class="redIcon">*</span>标题</el-col>
          <el-col :span="19">
            <el-input v-model="infoData.word" maxlength="100" placeholder="请输入标题"></el-input>
          </el-col>
        </el-row>
        <el-row class="row">
          <el-col class="labelTxt" :span="4"><span class="redIcon">*</span>短视频主题</el-col>
          <el-col :span="19">
            <el-input
              v-model="infoData.categoryName"
              :disabled="true"
              maxlength="100"
              placeholder="请选择短视频主题"
            ></el-input>

            <template v-if="isHaveTagList">
              <div class="tagBox">
                <el-tag v-for="(tag, index) in tagList" :key="index" :type="tag.type" @click="onSelect(tag)">{{
                  tag.name
                }}</el-tag>
              </div>
            </template>
            <template v-else>
              <div class="no-list-box">
                <p class="tipsTxt">没有可选的主题，请先去配置</p>
              </div>
            </template>
          </el-col>
        </el-row>
        <el-row class="row">
          <el-col class="labelTxt" :span="4"><span class="redIcon">*</span>视频封面</el-col>
          <el-col :span="19">
            <imgUpload ref="imgUploadRef" v-model="imgUrl" :limit="1" />
          </el-col>
        </el-row>

        <el-row class="row" style="margin-top:10px">
          <el-col class="labelTxt" :span="4"><span class="redIcon">*</span>上传视频</el-col>
          <el-col :span="19">
            <videoUpload
              ref="videoUploadRef"
              v-model="videoUrl"
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
import { insertShortVideo } from '@/api/content'
import wsObj from '@/utils/wcsUpload'
export default {
  name: '',
  data() {
    return {
      imgUrl: [],
      videoUrl: [],
      infoData: {
        userId: '',
        word: '',
        categoryId: '',
        categoryName: '',
        photo: '',
        url: ''
      },
      // 是否显示进度条
      isShowProgress: false,
      // 视频上传进度条
      uploadProgressVal: 0
    }
  },
  props: {
    dialogVis: {
      type: Boolean,
      default: false
    },
    tagList: {
      type: Array,
      default() {
        return []
      }
    }
  },
  computed: {
    dialogVisiable: {
      get() {
        return this.dialogVis
      },
      set(val) {
        this.$emit('update:dialogVis', val)
      }
    },
    isHaveTagList() {
      let len = this.tagList.length
      return len > 0
    }
  },
  components: { imgUpload, videoUpload },
  mounted() {},
  methods: {
    initAddVideoData() {
      this.dialogVisiable = false
      this.isShowProgress = false
      this.uploadProgressVal = 0
      this.imgUrl = []
      this.videoUrl = []
      this.infoData = {
        userId: '',
        word: '',
        categoryId: '',
        categoryName: '',
        photo: '',
        url: ''
      }
      this.$refs.imgUploadRef.syncElUpload([])
      this.$refs.videoUploadRef.syncVideoList([])
      // TODO: 取消文字按钮操作会多触发一次syncElUpload、syncVideoList方法，暂时不知怎么引起的
    },
    // 关闭dialog
    handleClose() {
      this.initAddVideoData()
    },
    // 取消
    onCancel() {
      this.initAddVideoData()
    },
    onSelect(data) {
      console.log('-sel-tag-', data)
      const { id, name } = data
      this.infoData.categoryName = name
      this.infoData.categoryId = id
    },
    // 确认提交
    onComfirm() {
      this.validFunc(() => {
        const midArr = this.videoUrl[0].split('/')
        let params = { ...this.infoData }
        params.url = midArr[midArr.length - 1]
        params.photo = this.imgUrl[0]
        delete params.categoryName
        console.log('-params-', params)
        insertShortVideo(params)
          .then(res => {
            this.$message({ type: 'success', message: '上传成功！' })
            this.initAddVideoData()
            this.$emit('success')
          })
          .catch(err => {
            console.log('-error-', err)
            this.$message({ type: 'error', message: err.msg })
          })
      })
    },
    validFunc(callback) {
      if (!this.infoData.userId) {
        this.$message({ type: 'warning', message: '请输入ID' })
        return
      }
      if (!this.infoData.word) {
        this.$message({ type: 'warning', message: '请输入标题' })
        return
      }
      if (!this.infoData.categoryId) {
        this.$message({ type: 'warning', message: '请选择短视频主题' })
        return
      }
      if (JSON.stringify(this.imgUrl) === '[]') {
        this.$message({ type: 'warning', message: '请上传视频封面' })
        return
      }
      if (JSON.stringify(this.videoUrl) === '[]') {
        this.$message({ type: 'warning', message: '请上传视频' })
        return
      }
      callback()
    },
    // 视频上传 (自定义上传)
    handleHttpRequest(a) {
      // console.log('-自定义上传-', a)
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
          this.videoUrl = [`http://video.85tstss.com/${fileName}`]
          console.log('-video-url-', this.videoUrl)
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

.tagBox {
  display: flex;
  flex-wrap: wrap;

  .el-tag {
    margin-right: 10px;
    margin-bottom: 12px;
    cursor: pointer;
  }
}

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
</style>
