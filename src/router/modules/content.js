import Layout from '@/views/layout'

const ShortVideo = () => import(/* webpackChunkName: "ShortVideo" */ '@/views/content/shortVideo')
const Playback = () => import(/* webpackChunkName: "Playback" */ '@/views/content/playback')
const VshortVideo = () => import(/* webpackChunkName: "VshortVideo" */ '@/views/content/vshortVideo')

const contentRouter = {
  path: '/content',
  component: Layout,
  name: 'Content',
  redirect: '/content/shortVideo',
  alwaysShow: true,
  meta: {
    title: '内容管理',
    icon: 'content'
  },
  children: [
    {
      path: 'shortVideo',
      component: ShortVideo,
      name: 'ShortVideo',
      meta: {
        title: '短视频',
        icon: 'menu'
      }
    },
    {
      path: 'vshortVideo',
      component: VshortVideo,
      name: 'VshortVideo',
      meta: {
        title: '大V短视频',
        icon: 'menu'
      }
    },
    {
      path: 'playback',
      component: Playback,
      name: 'Playback',
      meta: {
        title: '直播回放',
        icon: 'menu'
      }
    }
  ]
}

export default contentRouter
