// 主播管理 - api
import request from '@/utils/request'
import Qs from 'qs'

/**
 * 主播管理 - 主播列表 - 主播 - list
 */
export function getAnchorData(data) {
  return request({
    url: '/lms/guildAnchor/findGuildAnchor',
    method: 'get',
    data
  })
}

/**
 * 主播管理 - 主播列表 - 主播审核 - list
 */
export function getAuditData(data) {
  return request({
    url: '/lms/guildAnchor/findGuildAnchorApply',
    method: 'get',
    data
  })
}

/**
 * 主播管理 - 主播列表 - 主播审核 - 审核未通过
 */
export function getEditAnchorInfo(data) {
  return request({
    url: `/lms/guildAnchor/findGuildAnchorInfo`,
    method: 'post',
    params: data
  })
}

/**
 * 主播管理 - 主播列表 - 添加主播申请
 */
export function addAnchor(data) {
  return request({
    url: '/lms/guildAnchor/insertguildAnchor',
    method: 'post',
    data
  })
}

/**
 * 主播管理 - 主播列表 - 修改主播申请
 */
export function editAnchor(data) {
  return request({
    url: '/lms/guildAnchor/updateGuildAnchor',
    method: 'post',
    data
  })
}

// ===========================直播时长================================

/**
 * 获取直播时长列表
 */
export function getLiveTimeList(data) {
  return request({
    url: '/lms/userLiveRecord/findAllLiveUserInfo',
    method: 'get',
    data
  })
}

// =======================收入明细=======================

/**
 * 获取收入明细list
 */
export function getIncomeList(data) {
  return request({
    url: `/lms/guildAnchor/incomeList?${Qs.stringify(data)}`,
    method: 'get',
    data: {}
  })
}

/**
 * 获取礼物流水明细(单个用户)
 */
export function getGiftDetailsList(data) {
  return request({
    url: `/lms/guildAnchor/incomeDetail?${Qs.stringify(data)}`,
    method: 'get',
    data: {}
  })
}
