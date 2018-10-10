import React from 'react'
import PropTypes from 'prop-types'
import { Layout } from 'antd'
import Header from 'component/Header'
import TransitionRoute from 'component/TransitionRoute'

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
  </Layout>
)

AppLayout.propTypes = {
  routes: PropTypes.arrayOf(PropTypes.object).isRequired,
}

export default AppLayout
