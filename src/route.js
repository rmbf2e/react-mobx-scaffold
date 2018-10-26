import Loadable from 'react-loadable'
import loading from 'component/Loading'

// 默认路由页面
const Home = Loadable({
  loader: () => import(/* webpackChunkName: "home" */ './page/Home'),
  loading,
})

const routes = [
  { key: 'home', path: '/', exact: true, component: Home },
  {
    key: 'User',
    component: Loadable({
      loader: () => import('./page/User'),
      loading,
    }),
    path: '/user',
  },

  /* 本路由文件由src/route.template.js文件生成，不要手动更改 */
]

export default routes
