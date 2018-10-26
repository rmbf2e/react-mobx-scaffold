import { LocaleProvider } from 'antd'
import { Router } from 'react-router-dom'
// import MobxDevTools from 'mobx-react-devtools'
import { Provider, observer } from 'mobx-react'
import React from 'react'
import PropTypes from 'prop-types'
import Loading from 'component/Loading'
import SoundEffect from 'component/SoundEffect'
import Layout from 'component/Layout'
import locale from 'store/locale'
import listen, { onPageError } from './listen'

/*
 * 项目启动器
 * 请求加载初始数据
 * 开启监听各种事件
 * */
@observer
class App extends React.Component {
  static propTypes = {
    store: PropTypes.shape({
      app: PropTypes.shape({
        load: PropTypes.func,
      }),
    }).isRequired,
    history: PropTypes.shape({
      push: PropTypes.func,
    }).isRequired,
    routes: PropTypes.arrayOf(PropTypes.object).isRequired,
  }

  // 监听页面错误
  componentDidCatch = onPageError

  componentDidMount() {
    const { store } = this.props
    store.app.load()
    this.dispose = listen()
  }

  componentWillUnmount() {
    this.dispose()
  }

  render() {
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

export default App
