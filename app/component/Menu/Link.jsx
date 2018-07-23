import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { inject } from 'mobx-react'

@inject('store')
export default class MenuLink extends React.Component {
  static propTypes = {
    store: PropTypes.shape({
      router: PropTypes.object,
    }).isRequired,
  }

  checkSamePathname = e => {
    const {
      router: { location },
    } = this.props.store
    const href = e.target.getAttribute('href')
    if (href === location.pathname) {
      e.preventDefault()
      e.stopPropagation()
      return false
    }
    return true
  }

  render() {
    // 避免store属性挂载到html中
    const { store, ...props } = this.props
    return <Link {...props} onClick={this.checkSamePathname} />
  }
}
