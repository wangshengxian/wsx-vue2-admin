/*
 * @Author: wangshengxian
 * @Date: 2020-08-19 09:57:01
 * @LastEditors: wangshengxian
 * @LastEditTime: 2021-01-26 11:32:48
 * @Desc: 字段转中文
 */

/**
 * 传v时返回匹配的label(用于转换中文)，
 * 不传v时返回data数组(用于el-select等数据)
 */
const getData = (data, v) => {
  if (v === undefined) {
    return data
  } else {
    for (let i = 0; i < data.length; i++) {
      if (data[i].value === v) {
        return data[i].label
      }
    }
  }
}

/**
 * 内容管理 - 直播回放 - 显示状态
 */
export function getPlaybackStatus(v) {
  const data = [
    { value: 0, label: '不显示' },
    { value: 1, label: '显示' }
  ]
  return getData(data, v)
}

/**
 * 直播数据 - 直播时长 - 身份
 */
export function getUserIdentity(v) {
  const data = [
    { value: 1, label: '会员' },
    { value: 2, label: '主播' }
  ]
  return getData(data, v)
}

/**
 * 公会管理 - 主播入会申请 - 状态
 */
export function getGuildApplyStatus(v) {
  const data = [
    { value: '', label: '全部' },
    { value: 1, label: '正常' },
    { value: 2, label: '封禁' }
  ]
  return getData(data, v)
}

/**
 * 订单管理 - 提现管理 - 状态
 */
export function getWithdrawStatus(v) {
  const data = [
    { value: '', label: '全部' },
    { value: 1, label: '审核中' },
    { value: 2, label: '已通过' },
    { value: 3, label: '已成功' },
    { value: 4, label: '未通过' },
    // { value: 5, label: '已取消' },
    { value: 6, label: '已失败' }
  ]
  return getData(data, v)
}

/**
 * 订单管理 - 购买订单 - 支付方式
 */
export function getPaymentType(v) {
  const data = [
    { value: '', label: '全部' },
    { value: 1, label: 'WECHAT' },
    { value: 2, label: 'ALIPAY' }
  ]
  return getData(data, v)
}

/**
 * 活动管理 - 圣诞活动 - 礼物类型/奖品类型
 */
export function getGiftType(v) {
  const data = [
    { value: '', label: '全部' },
    { value: 0, label: '空' },
    { value: 1, label: '虚拟奖品' },
    { value: 2, label: '实物奖励' }
  ]
  return getData(data, v)
}

/**
 *活动管理 - 新年活动 - 合成状态
 */
export function getCollectStatus(v) {
  const data = [
    { value: '', label: '全部' },
    { value: 0, label: '否' },
    { value: 1, label: '是' }
  ]
  return getData(data, v)
}

/**
 * 地址管理 - app登录日志列表 - 登录类型
 */
export function getLoginType(v) {
  const data = [
    { value: '', label: '全部' },
    { value: 2, label: '用户名密码' },
    { value: 10, label: '手机号验证码' }
  ]
  return getData(data, v)
}

/**
 * 内容管理 - 大V短视频 - 状态
 */
export function getAuditType(v) {
  const data = [
    { value: '', label: '全部' },
    { value: 'AUDIT', label: '审核中' },
    { value: 'PASS', label: '已通过' },
    { value: 'FAIL', label: '未通过' }
  ]
  return getData(data, v)
}
