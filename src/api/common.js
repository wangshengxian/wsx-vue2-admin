// 公共请求api, 例如导出excel, 上传图片/视频
import request from '@/utils/request'
import Qs from 'qs'
import store from '@/store'

const root = '/livelms'

const baseUrl = process.env.VUE_APP_SERVER_URL

const guildId = store.state.user.guildId

// console.log('-guildId-', store.state.user.guildId)

/**
 * 导出excel地址url集合
 */
const Excel = {
  // 主播管理 - 主播列表 - 主播
  anchor: root + '/lms/guildAnchor/excel',
  // 主播管理 - 主播列表 - 主播审核
  anchorAudit: root + '/lms/guildAnchor/anchorApplyExcel',
  // 主播管理 - 直播时长
  liveTime: root + '/lms/userLiveRecord/excel',
  // 主播管理 - 收入明细
  incomeList: root + '/lms/guildAnchor/incomeList/excel'
}

/**
 * 方法一：导出excel，全局通用 （注意：后台接口不要验证key）
 * @param {string} type 导出excel的类别
 * @param {object} params 参数对象
 * @param {string} method 请求方法，默认为get
 */
export function exportExcel(type, params, method = 'get') {
  params = { guildId, ...params }
  var url = `${baseUrl}${Excel[type]}`
  console.log('-excel-url-', url)
  var form = document.createElement('form')
  form.style.display = 'none'
  form.action = url
  form.method = method
  form.enctype = 'multipart/form-data'
  document.body.appendChild(form)
  for (var key in params) {
    var input = document.createElement('input')
    input.type = 'hidden'
    input.name = key
    input.value = params[key]
    form.appendChild(input)
  }
  form.submit()
  form.remove()
}

/**
 * 方法二：导出excel，全局通用
 * @param {string} type 导出excel的类别
 * @param {object} params 参数对象
 * @param {string} fileName 导出表格的文件名，可选默认为空
 */
export function exportExcelTwo(type, params, fileName = '') {
  console.log('-type-', type, '-params-', params, '-file-name-', fileName)
  params = { guildId, ...params }
  if (baseUrl) {
    let url = `${baseUrl}${Excel[`${type}`]}?${Qs.stringify(params)}`
    console.log('-url-', url)
    // tools.downloadFile(url, fileName)
    window.location.href = url
  }
}

/**
 * 上传图片/视频，全局通用
 */
export function uploadImgOrVideo(data) {
  return request({
    url: `/lms/upload/uploadPic`,
    method: 'post',
    data
  })
}
