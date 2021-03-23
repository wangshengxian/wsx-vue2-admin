/**
 * 网宿上传大文件
 */

import * as wsObj from 'wcs-js-sdk'
import { wcsUploadUrl } from '@/const/global'

/**
 * 网宿上传配置信息
 */
const extraConfig = {
  timeout: 10 * 60 * 1000, // 超时时间, 默认为0 超时错误可以重试上传
  concurrentRequestLimit: 3, // 并发数,默认为3。注：浏览器对连接的请求资源是有限的, 比如Chrome的请求资源是6, 所以会有这样的情况, 如果并发数写10, 虽然发起了10个请求, 但是只有6个真正在上传
  retryCount: 0 // 上传重试, 默认为0
}

/**
 * 上传大文件
 * @param {string} file 要上传的文件
 * @param {string} token 后台服务器获取的token
 */
function createWcsUploadObj(file, token) {
  return wsObj.wcsUpload(file, token, wcsUploadUrl, extraConfig)
}

export default {
  createWcsUploadObj
}
