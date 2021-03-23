<!--
 * @Author: wangshengxian
 * @Date: 2020-09-28 11:45:53
 * @LastEditors: wangshengxian
 * @LastEditTime: 2021-01-16 17:09:32
 * @Desc: 查看证件照
-->
<template>
  <div class="dialog">
    <el-dialog
      :title="title"
      :center="true"
      top="0"
      :fullscreen="true"
      :visible.sync="dialogVisible"
      :before-close="handleBeforeClose"
      @opened="handleOpened"
      @closed="handleClosed"
    >
      <div class="dialogMain">
        <div class="imgWrap">
          <div class="imgBox" :class="classObj">
            <div class="imgItem" v-for="(imgUrl, index) in imgList" :key="index">
              <el-image
                class="img"
                :src="imgUrl"
                :preview-src-list="previewList"
                alt=""
                @click="onPreview(imgUrl, index)"
              />
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: '',
  data() {
    return {
      previewList: []
    }
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    imgList: {
      type: Array,
      default() {
        return []
      }
    },
    title: {
      type: String,
      default: '提示'
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
    },
    classObj() {
      return {
        imgCenter: this.imgList.length <= 4
      }
    }
  },
  created() {},
  mounted() {},
  methods: {
    onPreview(url, index) {
      // console.log("-预览-", url, index);
      // this.previewList = [url];
    },
    handleBeforeClose(done) {
      done()
    },
    handleOpened() {
      // console.log('dialog打开动画结束时的回调')
    },
    handleClosed() {
      // console.log('dialog关闭动画结束时的回调')
    }
  },
  components: {}
}
</script>
<style lang="less" scoped>
//@import url(); 引入公共css类

/deep/ .el-dialog--center {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  display: flex;
  flex-direction: column;
  width: 920px;
  height: 600px;

  .el-dialog__body {
    flex: 1;
    display: flex;
    align-items: center;
    padding: 30px;
  }
}

.dialogMain {
  width: 100%;
}

.imgWrap {
  .imgBox {
    display: flex;
    overflow-x: auto;

    &.imgCenter {
      justify-content: center;
    }

    .imgItem {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-right: 20px;

      &:last-child {
        margin-right: 0;
      }

      .img {
        width: 200px;
      }
    }
  }
}
</style>
