import React from 'react'
import PropTypes from 'prop-types'
import { Layout } from 'antd'
// import { TransitionMotion } from 'react-motion'
import Loading from 'share/component/Loading'
import TransitionRoute from 'component/TransitionRoute'
// import ShareContent from 'share/component/Content'
import router from 'app/router'

const { Content } = Layout
const AppContent = ({ loading }) => {
  const content = loading ? (
    <Loading />
  ) : (
    <TransitionRoute>{router}</TransitionRoute>
  )
  return <Content id="appContent">{content}</Content>
}

AppContent.propTypes = {
  loading: PropTypes.bool,
}

AppContent.defaultProps = {
  loading: true,
}

export default AppContent
