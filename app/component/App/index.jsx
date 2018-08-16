import React from 'react'
import { Layout } from 'antd'
import MobxDevTools from 'mobx-react-devtools'
import Sider from 'share/component/Sider'
import ShareApp from 'share/component/App'
import store from 'app/store'
import Header from 'component/Header'
import Content from 'component/Content'
// import s from './style.m.less'

const devTool = process.env.NODE_ENV !== 'production' ? <MobxDevTools /> : null

class App extends React.PureComponent {
  state = {
    loadingMeta: true,
  }

  componentDidMount() {
    store.app.load().then(() => {
      this.setState({
        loadingMeta: false,
      })
    })
  }

  render() {
    const { loadingMeta } = this.state
    return (
      <ShareApp store={store}>
        <Layout>
          <Header />
          <Layout>
            <Sider />
            <Content loading={loadingMeta} />
          </Layout>
          {devTool}
        </Layout>
      </ShareApp>
    )
  }
}

export default App
