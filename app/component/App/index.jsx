import fxios from 'util/fxios'
import React from 'react'
import { Layout, notification, LocaleProvider } from 'antd'
import { Provider } from 'mobx-react'
import { Router } from 'react-router-dom'
import zhCN from 'antd/lib/locale-provider/zh_CN'
import store from 'app/store'
import Header from 'component/Header'
import Content from 'component/Content'
import Sider from 'component/Sider'
import { history } from 'store/router'

// 监听后端接口错误函数
const onApiError = error => {
  notification.error({
    message: '接口错误',
    description: error.message || error.toString(),
    duration: 3,
  })
}

// 监听后端接口成功提示
const onApiSuccess = (res, req) => {
  if (req.method !== 'get') {
    notification.success({
      message: '操作成功',
      description: res.message,
      duration: 3,
    })
  }
}

class App extends React.PureComponent {
  state = {
    loadingMeta: true,
  }

  componentDidMount() {
    fxios.on('error', onApiError)
    fxios.on('success', onApiSuccess)
    store.app.load().then(() => {
      this.setState({
        loadingMeta: false,
      })
    })
  }

  // 监听页面错误
  componentDidCatch = error => {
    notification.error({
      message: '页面错误',
      description: error.toString(),
      placement: 'topLeft',
    })
  }

  // 解除监听接口错误
  componentWillUnmount() {
    fxios.removeListener('error', onApiError)
    fxios.removeListener('success', onApiSuccess)
  }

  render() {
    return (
      <Provider store={store}>
        <LocaleProvider locale={zhCN}>
          <Router history={history}>
            <Layout>
              <Header />
              <Layout>
                <Sider />
                <Content loading={this.state.loadingMeta} />
              </Layout>
            </Layout>
          </Router>
        </LocaleProvider>
      </Provider>
    )
  }
}

export default App
