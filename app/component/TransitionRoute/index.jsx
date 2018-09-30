import React from 'react'
import PropTypes from 'prop-types'
import { observer, inject } from 'mobx-react'
import { TransitionGroup, CSSTransition } from 'react-transition-group'
import { Switch, Route } from 'react-router-dom'
import NoMatch from 'component/NoMatch'
import s from './style.m.less'

const RouteTransition = ({ routers, store: { router } }) => (
  <TransitionGroup className={s.wrapper}>
    <CSSTransition key={router.location.key} classNames="route" timeout={300}>
      <Switch location={router.location}>
        {routers.map(r => (
          <Route {...r} />
        ))}
        {/* 没有匹配到的默认路由，放到最后 */}
        <Route component={NoMatch} />
      </Switch>
    </CSSTransition>
  </TransitionGroup>
)

RouteTransition.propTypes = {
  routers: PropTypes.arrayOf(PropTypes.object).isRequired,
  store: PropTypes.shape({
    router: PropTypes.object,
  }).isRequired,
}

export default inject('store')(observer(RouteTransition))
