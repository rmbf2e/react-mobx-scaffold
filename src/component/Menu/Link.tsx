import { inject, observer } from 'mobx-react'
import React from 'react'
import { Link } from 'react-router-dom'
import { RouterStore } from 'store/interface'

interface IProp {
  store?: {
    router: RouterStore
  }
  to: string
}

@inject('store')
@observer
class MenuLink extends React.Component<IProp> {
  public checkSamePathname = (e: React.MouseEvent) => {
    const {
      router: { location },
    } = this.props.store!
    const href = (e.target as HTMLAnchorElement).getAttribute('href')
    if (href === location.pathname) {
      e.preventDefault()
      e.stopPropagation()
      return false
    }
    return true
  }

  public render() {
    // 避免store属性挂载到html中
    const { to, store, ...props } = this.props
    return <Link to={to} {...props} onClick={this.checkSamePathname} />
  }
}
export { MenuLink as Link }
