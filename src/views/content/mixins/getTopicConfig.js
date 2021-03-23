/*
 * @Author: wangshengxian
 * @Date: 2020-10-09 14:49:16
 * @LastEditors: wangshengxian
 * @LastEditTime: 2020-10-10 14:00:42
 * @Desc: 获取短视频 -- 话题list - 暂时没用上后续重构可能用的上
 */
import { getShortVideoCategory } from '@/api/content'
export default {
  data() {
    return {
      // 话题类型标签list
      tagList: []
    }
  },
  created() {
    this.getData()
  },
  mounted() {},
  methods: {
    getData() {
      getShortVideoCategory().then(res => {
        console.log('-topic-config-res-', res)
        const { data } = res
        let list = []
        data.map((val, index) => {
          let mid = { ...val, type: this.setTagType(index) }
          list.push(mid)
        })
        this.tagList = list
        console.log('-tag-list-', this.tagList)
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
  }
}
