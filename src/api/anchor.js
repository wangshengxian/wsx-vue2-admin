/*
 * @Author: wangshengxian
 * @Date: 2020-08-19 09:57:01
 * @LastEditors: wangshengxian
 * @LastEditTime: 2020-10-23 13:54:38
 * @Desc: 主播管理 -- api
 */
import request from '@/utils/request'
import Qs from 'qs'

// =================主播列表==================

/**
 * 获取所有公会
 */
export function getAllGuild() {
  return request({
    url: '/admin/guild/all',
    method: 'get',
    data: {}
  })
}
/**
 * 后台主播管理列表 -- 获取主播列表
 */
export function findAllRoomHotrank(data) {
  return request({
    url: '/admin/roomHotrank/findAllRoomHotrank',
    method: 'get',
    data
  })
}

/**
 * 后台主播管理列表 -- 淘汰主播
 */
export function delRoomHotrankbyidx(data) {
  return request({
    url: '/admin/roomHotrank/delRoomHotrankbyidx',
    method: 'get',
    data
  })
}

/**
 * 后台主播管理列表 -- 新增主播
 */
export function insertRoomHotrank(data) {
  return request({
    url: `/admin/roomHotrank/insertRoomHotrank?` + Qs.stringify(data),
    method: 'post'
    // data: {}
  })
}

/**
 * 后台主播管理列表 -- 排序号设置
 */
export function addSortOrder(data) {
  return request({
    url: '/admin/roomHotrank/weightOrder',
    method: 'post',
    data
  })
}

/**
 * 后台主播管理列表 -- 删除排序号
 */
export function delSortOrder({ anchorId }) {
  console.log('-params-', anchorId)
  return request({
    url: `/admin/roomHotrank/weightOrder/del/${anchorId}`,
    method: 'post',
    data: {}
  })
}

/**
 *后台主播管理列表 -- 给主播设置公会
 */
export function setAnchorGuild(data) {
  return request({
    url: '/admin/roomHotrank/guild/manage',
    method: 'post',
    data
  })
}

/**
 * 后台主播管理列表 -- 获取主播房间创立列表
 */
export function getAnchorRoomList(data) {
  return request({
    url: '/admin/roomHotrank/room/manage/list',
    method: 'get',
    data
  })
}

/**
 * 后台主播管理列表 -- 主播房间的创立和删除
 * @param {number} anchorId 主播id
 * @param {number} type 类型： 1-创建 2-删除
 */
export function operateAnchorRoom({ anchorId, type }) {
  return request({
    url: `/admin/roomHotrank/room/manage/${anchorId}/${type}`,
    method: 'post',
    data: {}
  })
}

// 录制开始/结束 api
const recordedApi = {
  start: '/admin/userPlayback/record/start',
  end: '/admin/userPlayback/record/end'
}

/**
 * 后台直播回放列表 -- 直播开始/结束录制
 * @param {object} data {userId: 2008200}
 * @param {string} type 录制状态: start-开始；end-结束
 */
export function startOrEndRecorded(data, type) {
  return request({
    url: `${recordedApi[type]}/${data.userId}`,
    method: 'post',
    data: {}
  })
}

// ====================主播申请=====================

/**
 * 主播申请接口地址 (client/guild)
 */
const anchor = {
  client: '/admin/userInfoApply/findAllUserInfoApply',
  guild: '/admin/guildAnchor/findGuildAnchoroApplylist'
}

/**
 * 后台主播申请管理列表 -- 主播申请
 */
export function findAllApply(data, type) {
  return request({
    url: anchor[type],
    method: 'get',
    data
  })
}

const anchorAudit = {
  client: '/admin/userInfoApply/updateUserInfoApplyStatus',
  guild: '/admin/guildAnchor/updateAnchoroApplyStatus'
}

/**
 * 后台主播申请管理列表 -- 主播申请审核
 */
export function updateStatus(data, type) {
  return request({
    url: `${anchorAudit[type]}?${Qs.stringify(data)}`,
    method: 'post',
    data: {}
  })
}

// =======================推荐配置========================

/**
 * 推荐排序配置 -- 获取配置详情
 */
export function getRecommendSort(data) {
  return request({
    url: '/admin/anchor/sort/info',
    method: 'get',
    data
  })
}

/**
 * 推荐排序配置 -- 更新时间配置
 */
export function updateSortTime(data) {
  return request({
    url: '/admin/anchor/sort/time',
    method: 'post',
    data
  })
}

/**
 * 推荐排序配置 -- 更新权重配置
 */
export function updateSortWeight(data) {
  return request({
    url: '/admin/anchor/sort/weight',
    method: 'post',
    data
  })
}

// =======================收入明细=======================

/**
 * 后台工会主播管理 -- 获取收入明细list
 */
export function getIncomeList(data) {
  return request({
    url: `/admin/guildAnchor/incomeList?${Qs.stringify(data)}`,
    method: 'get',
    data: {}
  })
}

/**
 * 后台工会主播管理 -- 获取礼物流水明细(单个用户)
 */
export function getGiftDetailsList(data) {
  return request({
    url: `/admin/guildAnchor/incomeDetail?${Qs.stringify(data)}`,
    method: 'get',
    data: {}
  })
}
