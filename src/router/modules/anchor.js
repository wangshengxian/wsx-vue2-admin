/*
 * @Author: wangshengxian
 * @Date: 2020-08-19 09:57:01
 * @LastEditors: wangshengxian
 * @LastEditTime: 2020-10-27 14:24:21
 * @Desc: 主播管理 - router
 */
import Layout from '@/views/layout'

const AnchorList = () => import(/* webpackChunkName: "AnchorList" */ '@/views/anchor/anchorList')
const AnchorApplication = () => import(/* webpackChunkName: "AnchorApplication" */ '@/views/anchor/anchorApplication')
const RecommendConfig = () => import(/* webpackChunkName: "RecommendConfig" */ '@/views/anchor/recommendConfig')
const IncomeDetails = () => import(/* webpackChunkName: 'IncomeDetails' */ '@/views/anchor/incomeDetails')
const RecordedList = () => import(/* webpackChunkName: 'recordedList' */ '@/views/anchor/recordedList')

const hidden = process.env.VUE_APP_SERVER_ENV === 'prod'
// console.log(process.env.VUE_APP_SERVER_ENV)

const anchorRouter = {
  path: '/anchor',
  component: Layout,
  name: 'Anchor',
  redirect: '/anchor/anchorList',
  alwaysShow: true,
  meta: {
    title: '主播管理',
    icon: 'anchor'
  },
  children: [
    {
      path: 'anchorList',
      component: AnchorList,
      name: 'AnchorList',
      meta: {
        title: '主播列表',
        icon: 'menu'
      }
    },
    {
      path: 'anchorApplication',
      component: AnchorApplication,
      name: 'AnchorApplication',
      meta: {
        title: '主播申请',
        icon: 'menu'
      }
    },
    {
      path: 'recommendConfig',
      component: RecommendConfig,
      name: 'RecommendConfig',
      meta: {
        title: '推荐配置',
        icon: 'menu'
      }
    },
    {
      path: 'incomeDetails',
      component: IncomeDetails,
      name: 'IncomeDetails',
      meta: {
        title: '收入明细',
        icon: 'menu'
      }
    },
    {
      path: 'recordedList',
      name: 'RecordedList',
      component: RecordedList,
      hidden: hidden,
      meta: {
        title: '录播列表',
        icon: 'menu'
      }
    }
  ]
}

export default anchorRouter
