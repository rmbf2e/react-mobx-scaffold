import React from 'react'
import { Route } from 'react-router-dom'
import Loadable from 'react-loadable'
import loading from 'share/component/Loading'

// 默认路由页面
const Home = Loadable({
  loader: () => import(/* webpackChunkName: "home" */ './page/Home'),
  loading,
})

const NoMatch = Loadable({
  loader: () =>
    import(/* webpackChunkName: "noMatch" */ 'share/component/NoMatch'),
  loading,
})

const routers = [
  <Route key="main" path="/" exact component={Home} />,
  /* template-placeholder */
]

// 这些单独配置的路由必须用unshift
// 以排在自动加载的路由前面

// 没有匹配到的默认路由，放到最后
routers.push(<Route key="noMatch" component={NoMatch} />)

export default routers
