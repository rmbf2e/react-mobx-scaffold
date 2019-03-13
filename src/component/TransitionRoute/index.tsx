import { Loading } from 'component/Loading'
import { NoMatch } from 'component/NoMatch'
import { inject, observer } from 'mobx-react'
import React, { Suspense } from 'react'
import { Route, Switch } from 'react-router-dom'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import { IRouteProps, RouterStore } from 'store/interface'
import s from './style.m.less'

interface IProps {
  routes: IRouteProps[]
  store?: {
    router: RouterStore
  }
}

const TransitionRouteComponent = (props: IProps) => {
  const { routes } = props
  const { router } = props.store!
  return (
    <TransitionGroup className={s.wrapper}>
      <CSSTransition
        key={router.location.pathname}
        classNames="route"
        timeout={300}
      >
        <Suspense fallback={<Loading />}>
          <Switch location={router.location}>
            {routes.map(r => (
              <Route {...r} />
            ))}
            {/* 没有匹配到的默认路由，放到最后 */}
            <Route component={NoMatch} />
          </Switch>
        </Suspense>
      </CSSTransition>
    </TransitionGroup>
  )
}

const TransitionRoute = inject('store')(observer(TransitionRouteComponent))

export { TransitionRoute }
