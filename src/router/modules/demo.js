/**
 * demo菜单 - router
 */

import Layout from '@/views/layout'

const OneList = () => import(/* webpackChunkName: 'oneList' */ '@/views/demo/oneList')

const TwoList = () => import(/* webpackChunkName: 'twoList' */ '@/views/demo/twoList')

const demoRouter = {
  path: '/demo',
  name: 'Demo',
  component: Layout,
  redirect: '/demo/oneList',
  alwaysShow: true,
  meta: {
    title: 'demo管理',
    icon: 'content'
  },
  children: [
    {
      path: 'oneList',
      name: 'OneList',
      component: OneList,
      meta: {
        title: 'demo-one列表',
        icon: 'menu'
      }
    },
    {
      path: 'twoList',
      name: 'TwoList',
      component: TwoList,
      meta: {
        title: 'demo-two列表',
        icon: 'menu'
      }
    }
  ]
}

export default demoRouter
