import Loadable from 'react-loadable'
import loading from 'component/Loading'

// 默认路由页面
const Home = Loadable({
  loader: () => import(/* webpackChunkName: "home" */ './page/Home'),
  loading,
})

const routes = [
  { key: 'home', path: '/', exact: true, component: Home },
  /* template-placeholder */
]

export default routes
