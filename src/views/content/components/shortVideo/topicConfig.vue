<!--
 * @Author: wangshengxian
 * @Date: 2020-09-25 11:05:37
 * @LastEditors: wangshengxian
 * @LastEditTime: 2020-10-12 16:10:38
 * @Desc: 短视频 -- 话题配置弹框
-->
<template>
  <div class="topicConfig">
    <el-dialog title="话题配置" width="600px" :visible.sync="dialogVisible" @close="handleBeforeClose">
      <el-form :model="formData" :rules="rules" ref="formRef" :inline="true">
        <el-form-item label="" label-width="0px" prop="name">
          <el-input v-model="formData.name" clearable maxlength="5" placeholder="请输入话题(最多5个字)"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" @click="onAdd">添加</el-button>
        </el-form-item>
      </el-form>
      <div class="tagBox">
        <el-tag
          v-for="(tag, index) in tagList"
          :key="index"
          closable
          :type="tag.type"
          @close="handleCloseTag(tag, index)"
          >{{ tag.name }}</el-tag
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { addShortVideoCategory, delShortVideoCategory } from '@/api/content'
export default {
  name: '',
  data() {
    return {
      rules: {
        name: [
          { required: true, message: '请输入新建话题', trigger: 'blur' },
          { min: 1, max: 5, message: '最多5个字', trigger: 'blur' }
        ]
      },
      formData: {
        name: ''
      }
    }
  },
  props: {
    dialogVis: {
      type: Boolean,
      default: false
    },
    list: {
      type: Array,
      default() {
        return []
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
    },
    tagList: {
      get() {
        // console.log('-get-', this.list)
        return this.list
      },
      set(val) {
        // console.log('-set-', val)
        this.$emit('update:list', val)
      }
    }
  },
  watch: {},
  created() {},
  mounted() {},
  methods: {
    handleBeforeClose() {
      console.log('-close-')
      this.resetForm()
    },
    // 重置表单
    resetForm() {
      this.$refs['formRef'].resetFields()
    },
    onAdd() {
      // console.log(this.formData)
      this.$refs['formRef'].validate(valid => {
        const { name } = this.formData
        if (valid) {
          let midArr = this.tagList.filter(val => val.name === name)
          if (midArr.length > 0) {
            this.$message({
              message: '不能添加重复的标签，请重新选择！',
              type: 'warning'
            })
            return
          }
          // console.log('添加话题标签', name, this.formData)
          addShortVideoCategory(this.formData).then(res => {
            console.log('--add--', res)
            this.resetForm()
            let list = res.data
            let len = list.length
            let lastObj = { ...list[len - 1], type: this.setTagType(len - 1) }
            this.tagList = [...this.tagList, lastObj]

            this.$message({
              message: '恭喜你，添加成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                console.log('message消息提示框关闭回调')
              }
            })
          })
        } else {
          return false
        }
      })
    },
    handleCloseTag(item, index) {
      console.log(item, index)
      let params = { id: item.id }
      // console.log(params)
      delShortVideoCategory(params).then(res => {
        console.log('-del-tag-res-', res)
        this.$message({
          message: '删除成功！',
          type: 'success',
          duration: 1500,
          onClose: () => {
            this.tagList.splice(index, 1)
          }
        })
      })
    },

    // 设置标签类型
    setTagType(index) {
      let typeName = ''
      if (index % 4 === 0) {
        typeName = ''
      } else if (index % 4 === 1) {
        typeName = 'success'
      } else if (index % 4 === 2) {
        typeName = 'warning'
      } else {
        typeName = 'danger'
      }
      return typeName
    }
  },
  components: {}
}
</script>
<style lang="less" scoped>
//@import url(); 引入公共css类

/deep/ .el-dialog {
  // padding: 30px 60px;

  .el-dialog__body {
    padding: 40px 70px 40px;
  }
}

.el-form {
  .el-form-item {
    .el-input {
      width: 300px;
    }
  }
}

.tagBox {
  display: flex;
  flex-wrap: wrap;

  .el-tag {
    margin-right: 10px;
    margin-bottom: 12px;
  }
}
</style>
