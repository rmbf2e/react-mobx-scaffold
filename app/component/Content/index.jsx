import React from 'react'
// import { observer, inject } from 'mobx-react'
// import PropTypes from 'prop-types'
import { Layout } from 'antd'
// import Loading from 'component/Loading'
import TransitionRoute from 'component/TransitionRoute'
import router from 'app/router'

const Content = () => (
  <Layout.Content>
    <TransitionRoute routers={router} />
  </Layout.Content>
)

// Content.propTypes = {
//   store: PropTypes.shape({
//     app: PropTypes.shape({
//       loading: PropTypes.bool,
//     }),
//   }).isRequired,
// }

export default Content
