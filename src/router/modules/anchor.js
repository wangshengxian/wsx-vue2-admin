/*
 * @Author: wangshengxian
 * @Date: 2020-08-17 16:11:33
 * @LastEditors: wangshengxian
 * @LastEditTime: 2020-10-22 14:23:12
 * @Desc: 主播管理路由模块
 */
import Layout from '@/views/layout'

// 直播列表
const AnchorList = () => import(/* webpackChunkName: 'anchorList' */ '@/views/anchor/anchorList')

// 直播时长
const LiveTime = () => import(/* webpackChunkName: 'liveTime' */ '@/views/anchor/liveTime')

// 收入明细
const IncomeDetails = () => import(/* webpackChunkName: 'incomeDetails' */ '@/views/anchor/incomeDetails')

// 直播分析
// const AnchorAnalyze = () => import(/* webpackChunkName: 'anchorAnalyze' */ '@/views/anchor/anchorAnalyze')
// const AnalyzeList = () => import(/* webpackChunkName: 'analyzeList' */ '@/views/anchor/anchorAnalyze/analyzeList')

const anchorRouter = {
  path: '/anchor',
  name: '/anchor',
  component: Layout,
  redirect: '/anchor/anchorList',
  alwaysShow: true,
  meta: {
    title: '主播管理',
    icon: 'union'
  },
  children: [
    {
      path: 'anchorList',
      name: 'AnchorList',
      component: AnchorList,
      meta: {
        title: '主播列表',
        icon: 'menu'
      }
    },
    {
      path: 'liveTime',
      name: 'LiveTime',
      component: LiveTime,
      meta: {
        title: '直播时长',
        icon: 'menu'
      }
    },
    {
      path: 'incomeDetails',
      name: 'IncomeDetails',
      component: IncomeDetails,
      meta: {
        title: '收入明细',
        icon: 'menu'
      }
    }
    // {
    //   path: 'anchorAnalyze',
    //   name: 'AnchorAnalyze',
    //   component: AnchorAnalyze,
    //   redirect: '/anchor/anchorAnalyze/analyzeList',
    //   alwaysShow: true,
    //   meta: {
    //     title: '主播分析',
    //     icon: 'menu'
    //   },
    //   children: [
    //     {
    //       path: 'analyzeList',
    //       name: 'AnalyzeList',
    //       component: AnalyzeList,
    //       meta: {
    //         title: '分析列表'
    //       }
    //     },

    //   ]
    // }
  ]
}

export default anchorRouter
