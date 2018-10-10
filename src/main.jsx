import React from 'react'
import { render } from 'react-dom'
import { configure } from 'mobx'
import zhCN from 'antd/lib/locale-provider/zh_CN'
import moment from 'moment'
import routes from 'src/route'
import App from 'component/App'
import store from 'src/store'
import 'moment/locale/zh-cn'
import 'style/index.less'
import 'style/animate.less'

// 设置moment语言
moment.locale('zh-cn')

// 设置mobx校验必须通过action更新数据
configure({ enforceActions: 'observed' })

render(
  <App
    store={store}
    locale={zhCN}
    history={store.router.history}
    routes={routes}
  />,
  global.document.getElementById('app'),
)

if (module.hot) {
  module.hot.accept()
}
