import React from 'react'
import PropTypes from 'prop-types'
import { Layout } from 'antd'
import MobxDevTools from 'mobx-react-devtools'
import Header from 'component/Header'
import TransitionRoute from 'component/TransitionRoute'
import SoundEffect from 'component/SoundEffect'

/*
 * 项目最外层组件，负责监听事件
 * */
const AppLayout = ({ routes }) => (
  <Layout>
    <Header />
    <Layout>
      <Layout.Content>
        <TransitionRoute routes={routes} />
      </Layout.Content>
    </Layout>
    <MobxDevTools />
    <SoundEffect />
  </Layout>
)

AppLayout.propTypes = {
  routes: PropTypes.arrayOf(PropTypes.object).isRequired,
}

export default AppLayout
