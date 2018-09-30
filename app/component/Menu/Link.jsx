import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { inject, observer } from 'mobx-react'

@inject('store')
@observer
class MenuLink extends React.Component {
  static propTypes = {
    store: PropTypes.shape({
      router: PropTypes.object,
    }).isRequired,
  }

  checkSamePathname = e => {
    const {
      store: {
        router: { location },
      },
    } = this.props
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
export default MenuLink
