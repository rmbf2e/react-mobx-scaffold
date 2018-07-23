import React from 'react'
import PropTypes from 'prop-types'
import { AnimatedSwitch } from 'react-router-transition'
import { Switch } from 'react-router-dom'
import { Layout } from 'antd'
import Loading from 'component/Loading'
import router from 'app/router'
import s from './style.m.less'

const { Content } = Layout

// 配置路由切换动画
function mapStyles(styles) {
  return {
    opacity: styles.opacity,
    // top: `${styles.x}px`,
  }
}
const transition = {
  atEnter: {
    opacity: 0,
    // x: -100,
  },
  atLeave: {
    opacity: 0,
    // x: 100,
  },
  atActive: {
    opacity: 1,
    // x: 0,
  },
}

const AppContent = ({ loading }) => {
  const content = loading ? (
    <Loading />
  ) : (
    <Switch>
      <AnimatedSwitch
        id="animateWrapper"
        atEnter={transition.atEnter}
        atLeave={transition.atLeave}
        atActive={transition.atActive}
        mapStyles={mapStyles}
        className={s.animateWrapper}
      >
        {router}
      </AnimatedSwitch>
    </Switch>
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
