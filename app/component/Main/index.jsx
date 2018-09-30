import React from 'react'
import zhCN from 'antd/lib/locale-provider/zh_CN'
import { observer } from 'mobx-react'
import routes from 'app/route'
import mainListen, { onPageError } from 'mixin/mainListen'
import store from 'app/store'
import Combinator from 'component/Combinator'
import Loading from 'component/Loading'
import Layout from 'component/Layout'

/*
 * 项目启动器
 * 请求加载初始数据
 * 开启监听各种事件
 * */
@observer
class Main extends React.Component {
  componentDidMount() {
    store.app.load()
    this.dispose = mainListen()
  }

  componentWillUnmount() {
    this.dispose()
  }

  // 监听页面错误
  componentDidCatch = error => {
    onPageError(error)
  }

  render() {
    return store.app.loading ? (
      <Loading />
    ) : (
      <Combinator locale={zhCN} store={store} history={store.router.history}>
        <Layout routes={routes} />
      </Combinator>
    )
  }
}

export default Main
