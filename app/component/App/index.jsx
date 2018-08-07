import React from 'react'
import { Layout } from 'antd'
import Sider from 'share/component/Sider'
import ShareApp from 'share/component/App'
import store from 'app/store'
import Header from 'component/Header'
import Content from 'component/Content'
// import s from './style.m.less'

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
        </Layout>
      </ShareApp>
    )
  }
}

export default App
