import React from 'react'
import { RouteProps } from 'react-router'
import { IRouteProps } from 'store/interface'

const Home = React.lazy(() =>
  import(/* webpackChunkName: "home" */ './page/Home'),
)
const NoMatch = React.lazy(() =>
  import(/* webpackChunkName: "noMatch" */ 'component/NoMatch'),
)

const User = React.lazy(() =>
  import(/* webpackChunkName: "User" */ './page/User'),
)

const routes: IRouteProps[] = [
  {
    key: 'home',
    path: '/',
    exact: true,
    component: (props: any) => <Home {...props} />,
  },
  {
    key: 'User',
    component: (props: any) => <User {...props} />,
    path: '/user',
  },
]

// 这些单独配置的路由必须用unshift
// 以排在自动加载的路由前面

// 没有匹配到的默认路由，放到最后
// routes.push(<Route key="noMatch" component={NoMatch} />)
routes.push({
  key: 'noMatch',
  component: (props: any) => <NoMatch {...props} />,
})

export default routes
