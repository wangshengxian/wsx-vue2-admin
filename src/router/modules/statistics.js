/**
 * 统计管理 - router
 */

import Layout from '@/views/layout'

// 在线用户统计
const OnLine = () => import(/* webpackChunkName: 'onLine' */ '@/views/statistics/onLine')
// 会员统计
const Member = () => import(/* webpackChunkName: 'member' */ '@/views/statistics/member')
// 交易额统计
const Business = () => import(/* webpackChunkName: 'business' */ '@/views/statistics/business')

const statisticsRouter = {
  path: '/statistics',
  name: 'Statistics',
  component: Layout,
  redirect: '/statistic',
  alwaysShow: true,
  meta: {
    title: '统计管理',
    icon: 'statistics'
  },
  children: [
    {
      path: 'onLine',
      name: 'OnLine',
      component: OnLine,
      meta: {
        title: '在线用户统计',
        icon: 'menu'
      }
    },
    {
      path: 'member',
      name: 'Member',
      component: Member,
      meta: {
        title: '会员统计',
        icon: 'menu'
      }
    },
    {
      path: 'business',
      name: 'Business',
      component: Business,
      meta: {
        title: '交易额统计',
        icon: 'menu'
      }
    }
  ]
}

export default statisticsRouter
