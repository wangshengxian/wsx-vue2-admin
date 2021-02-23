// 字段转中文 - 局部
/**
 * 字段转中文
 * 传v时返回匹配的label(用于转换中文)，不传v时返回data数组(用于el-select等数据)
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
 * 主播管理 - 主播列表 - 直播状态
 */
export function getLiveType(v) {
  const data = [
    { value: '', label: '全部' },
    { value: 0, label: '直播中' },
    { value: 1, label: '离线' }
  ]
  return getData(data, v)
}

/**
 * 主播管理 - 主播列表 - 状态
 */
export function getAnchorStatus(v) {
  const data = [
    { value: '', label: '全部' },
    { value: 0, label: '正常' },
    { value: 1, label: '封禁' }
  ]
  return getData(data, v)
}

/**
 * 主播管理 - 直播时长 - 身份
 */
export function getUserIdentity(v) {
  const data = [
    { value: 1, label: '会员' },
    { value: 2, label: '主播' }
  ]
  return getData(data, v)
}
