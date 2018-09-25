import React from 'react'
import PropTypes from 'prop-types'
import { TransitionMotion, spring } from 'react-motion'
import { Route, matchPath } from 'react-router-dom'
import NoMatch from 'share/component/NoMatch'
import s from './style.m.less'

const willEnter = () => ({
  top: -30,
  opacity: 0,
})
const willLeave = () => ({
  top: spring(30),
  opacity: spring(0),
})

class Transition extends React.Component {
  static propTypes = {
    page: PropTypes.shape({
      component: PropTypes.func,
    }).isRequired,
  }

  defaultStyles = () => {
    const { page } = this.props
    return [
      {
        key: page.key,
        data: page.component,
        style: {
          top: -30,
          opacity: 1,
        },
      },
    ]
  }

  toStyles = () => {
    const { page } = this.props
    return [
      {
        key: page.key,
        data: page.component,
        style: {
          top: spring(0),
          opacity: spring(1),
        },
      },
    ]
  }

  render() {
    return (
      <TransitionMotion
        defaultStyles={this.defaultStyles()}
        styles={this.toStyles()}
        willEnter={willEnter}
        willLeave={willLeave}
      >
        {styles => (
          <div className={s.wrapper}>
            {styles.map(({ key, style, data: Component }) => (
              <div key={key} className={s.item} style={style}>
                <Component />
              </div>
            ))}
          </div>
        )}
      </TransitionMotion>
    )
  }
}

const TransitionRoute = props => {
  const { children } = props
  return (
    <Route
      render={({ location }) => {
        const page =
          children.find(
            child =>
              matchPath(location.pathname, {
                path: child.path,
                exact: !!child.exact,
                strict: !!child.strict,
              }),
            // 没有匹配到的默认路由，放到最后
          ) || children[children.length - 1]
        return <Transition page={page} />
      }}
    />
  )
}
TransitionRoute.propTypes = {
  children: PropTypes.arrayOf(PropTypes.object).isRequired,
}

export default TransitionRoute
