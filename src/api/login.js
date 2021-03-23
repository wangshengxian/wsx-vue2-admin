/*
 * @Author: wangshengxian
 * @Date: 2020-08-19 09:57:01
 * @LastEditors: wangshengxian
 * @LastEditTime: 2020-09-30 13:45:45
 * @Desc: 登录相关 - api
 */
import request from '@/utils/request'

// 登录
export function login(data) {
  return request({
    url: '/admin/login/login',
    method: 'post',
    data
  })
}

// 退出登录
export function logout() {
  return request({
    url: '/admin/login/logout',
    method: 'post'
  })
}
