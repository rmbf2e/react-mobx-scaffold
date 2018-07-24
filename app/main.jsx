import React from 'react'
import { render } from 'react-dom'
import { configure } from 'mobx'
import moment from 'moment'
import App from 'component/App'
import 'moment/locale/zh-cn'
import 'style/index.less'

// 设置moment语言
moment.locale('zh-cn')

// 设置mobx校验必须通过action更新数据
configure({ enforceActions: true })

render(<App />, global.document.getElementById('app'))

if (module.hot) {
  module.hot.accept()
}
