import React from 'react'
// import PropTypes from 'prop-types'
import { Layout } from 'antd'
import MobxDevTools from 'mobx-react-devtools'
import Header from 'component/Header'
import Content from 'component/Content'
import SoundEffect from 'component/SoundEffect'
// import { observer, inject } from 'mobx-react'

const devTool = process.env.NODE_ENV !== 'production' ? <MobxDevTools /> : null

/*
 * 项目最外层组件，负责监听事件
 * */
const AppLayout = () => (
  <Layout>
    <Header />
    <Layout>
      <Content />
    </Layout>
    {devTool}
    <SoundEffect />
  </Layout>
)

export default AppLayout
