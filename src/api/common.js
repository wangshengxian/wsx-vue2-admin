/*
 * @Author: wangshengxian
 * @Date: 2020-08-26 14:17:36
 * @LastEditors: wangshengxian
 * @LastEditTime: 2021-01-26 11:11:12
 * @Desc: 公共请求api, 例如导出excel, 上传图片/视频
 */
import request from '@/utils/request'
import Qs from 'qs'

const baseUrl = process.env.VUE_APP_SERVER_URL

const root = '/livecms'

// 方法一，导出excel地址
const exportUrl = {
  // 直播数据 - 直播时长
  liveList: root + '/admin/userLiveRecord/excel',
  // 订单管理 - 充值
  rechargeList: root + '/admin/recharge/excel',
  // 订单管理 - 提现
  withdrawList: root + '/admin/withdrawal/excel',
  // 主播管理 - 收入明细
  incomeList: root + '/admin/guildAnchor/excel'
}

/**
 * 方法一：导出excel，全局通用
 * @param {string} type 导出excel的类别
 * @param {object} data 参数对象
 */
export function exportExcel(type, data) {
  // console.log(`${baseUrl}${exportUrl[type]}?${Qs.stringify(data)}`)
  window.location.href = `${baseUrl}${exportUrl[type]}?${Qs.stringify(data)}`
}

// 方法二，导出excel地址
const Excel = {
  // 圣诞活动
  christmasList: root + '/admin/activity/christmas/lottery/export',
  // 购买记录
  buyRecord: root + '/admin/tst/cny/recharge/info/export'
}

/**
 * 方法二：form表单格式导出excel，全局通用
 * @param {string} type 导出excel的类别
 * @param {object} data 参数对象
 * @param {string} method 请求方式，默认为get
 */
export function formExportExcel(type, params, method = 'get') {
  let url = `${baseUrl}${Excel[type]}`
  // console.log('-url-', url)
  let form = document.createElement('form')
  form.style.display = 'none'
  form.action = url
  form.method = method
  form.enctype = 'multipart/form-data'
  document.body.appendChild(form)
  for (let key in params) {
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
 * 上传大视频获取网宿token
 * @param {object} data {fileName: 'file文件名'}
 */
export function getWsUploadToken(data = { fileName: '' }) {
  return request({
    url: '/admin/ws/upload/token',
    method: 'get',
    data
  })
}

/**
 * 上传图片/视频
 * @param {File} data file文件格式
 */
export function uploadImgOrVideo(data) {
  return request({
    url: '/admin/upload/uploadPic',
    method: 'post',
    data
  })
}
