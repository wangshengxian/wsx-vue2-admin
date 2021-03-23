/*
 * @Author: wangshengxian
 * @Date: 2020-08-19 09:57:01
 * @LastEditors: wangshengxian
 * @LastEditTime: 2021-01-26 10:00:00
 * @Desc: 内容管理模块api
 */

import request from '@/utils/request'
import Qs from 'qs'

// ====================短视频=======================

/**
 * 获取短视频列表
 */
export function getVideoList(data) {
  return request({
    url: '/admin/shortVideo/findAllShortVideo',
    method: 'get',
    data
  })
}

/**
 * 删除单个短视频
 */
export function delShortVideoByid(data) {
  return request({
    url: '/admin/shortVideo/delShortVideoByid?id=' + data.id,
    method: 'post',
    data: {}
  })
}

/**
 * 批量删除短视频
 */
export function delShortVideoByIds(data) {
  return request({
    url: `/admin/shortVideo/delShortVideoByIds?${Qs.stringify(data)}`,
    method: 'post',
    data: {}
  })
}

/**
 * 审核单个短视频
 * @param {object} data  例如：{id: 1,status: 1, content: '不通过原因，可选'} ==》status = 1 通过；2 不通过
 */
export function updateStatus(data) {
  return request({
    url: `/admin/shortVideo/updateStatus?${Qs.stringify(data)}`,
    method: 'post',
    data: {}
  })
}

/**
 * 批量审核短视频
 */
export function updateStatusByIds(data) {
  return request({
    url: `/admin/shortVideo/updateStatusByIds?${Qs.stringify(data)}`,
    method: 'post',
    data: {}
  })
}

/**
 * 获取短视频话题类型
 */
export function getShortVideoCategory(data) {
  return request({
    url: '/admin/shortVideo/category',
    method: 'get',
    data
  })
}

/**
 * 添加短视频话题类型
 */
export function addShortVideoCategory(data) {
  return request({
    url: '/admin/shortVideo/category/add',
    method: 'post',
    data
  })
}

/**
 * 删除短视频话题类型
 */
export function delShortVideoCategory(data) {
  return request({
    url: `/admin/shortVideo/category/del`,
    method: 'post',
    data
  })
}

/**
 * 新增视频
 */
export function insertShortVideo(data) {
  return request({
    url: `/admin/shortVideo/insertShortVideo?` + Qs.stringify(data),
    method: 'post',
    data: {}
  })
}

// =======================直播回放======================

/**
 * 直播回放
 */
export function findUserPlaybacks(data) {
  return request({
    url: '/admin/userPlayback/findUserPlaybacks',
    method: 'get',
    data
  })
}

/**
 * 编辑直播回放
 */
export function updateUserPlayback(data) {
  return request({
    url: `/admin/userPlayback/updateUserPlayback?` + Qs.stringify(data),
    method: 'post',
    data: {}
  })
}

/**
 * 删除直播回放
 */
export function delUserPlaybackByid(data) {
  return request({
    url: `/admin/userPlayback/delUserPlaybackByid?` + Qs.stringify(data),
    method: 'post',
    data: {}
  })
}

// =======================大V短视频======================
/**
 * 获取短视频列表
 */
export function findVideoList(data) {
  return request({
    url: '/largeV/video/list',
    method: 'get',
    data
  })
}

/**
 * 审核单个短视频
 * @param {object} data  例如：{id: 1,status: 1, content: '不通过原因，可选'} ==》status = PASS 通过；FAIL:不通过
 */
export function auditShortVideo({ id, status }) {
  return request({
    url: `/largeV/video/audit/${id}/${status}`,
    method: 'post'
  })
}

/**
 * 删除单个短视频
 */
export function deleOnlyShortVideo({ id }) {
  return request({
    url: `/largeV/video/del/${id}`,
    method: 'post'
  })
}

const largeVApi = {
  add: '/largeV/video/add',
  edit: '/largeV/video/modify'
}

/**
 * 上传/编辑大V短视频
 */
export function updateLargeVShortVideo(data, type) {
  return request({
    url: largeVApi[type],
    method: 'post',
    data
  })
}

/**
 * 视频上下架
 */
export function updownVideo({ videoId }) {
  return request({
    url: `/largeV/video/shelves/operation/${videoId}`,
    method: 'post'
  })
}
