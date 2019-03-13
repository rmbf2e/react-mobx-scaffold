import { LocaleProvider } from 'antd'
import { Layout } from 'component/Layout'
import { Loading } from 'component/Loading'
import { SoundEffect } from 'component/SoundEffect'
// import MobxDevTools from 'mobx-react-devtools'
import { observer, Provider } from 'mobx-react'
import { SynchronizedHistory } from 'mobx-react-router'
import React from 'react'
import { Router } from 'react-router-dom'
import { AppStore, IRouteProps, RouterStore } from 'store/interface'
import { locale } from 'store/locale'
import { listen, onPageError } from './listen'

interface IProp {
  store: {
    app: AppStore
    router: RouterStore
  }
  routes: IRouteProps[]
  history: SynchronizedHistory
}

/*
 * 项目启动器
 * 请求加载初始数据
 * 开启监听各种事件
 * */
@observer
export class App extends React.Component<IProp> {
  // 监听页面错误
  public componentDidCatch = onPageError
  private dispose!: () => void

  public componentDidMount() {
    const { store, routes } = this.props
    store.app.load()
    this.dispose = listen()
    store.router.routes = routes
  }

  public componentWillUnmount() {
    this.dispose()
  }

  public render() {
    const { store, routes, history } = this.props
    return store.app.loading ? (
      <Loading />
    ) : (
      <>
        <Provider store={store}>
          <LocaleProvider locale={locale.lang}>
            <Router history={history}>
              <Layout routes={routes} />
            </Router>
          </LocaleProvider>
        </Provider>
        <SoundEffect />
      </>
    )
  }
}
