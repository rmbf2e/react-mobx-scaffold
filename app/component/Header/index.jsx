import React from 'react'
import PropTypes from 'prop-types'
import { observer, inject } from 'mobx-react'
import ShareHeader from 'share/component/Header'
import Menu from 'share/component/Menu'
import s from './style.m.less'

// const { Option } = Select

@inject('store')
@observer
export default class AppHeader extends React.Component {
  static propTypes = {
    store: PropTypes.shape({
      router: PropTypes.shape({
        location: PropTypes.object,
      }),
    }).isRequired,
  }

  // 通过路由获取当前页面名称

  render() {
    const { store } = this.props
    return (
      <ShareHeader store={store}>
        <figure className={s.logo}>
          <img alt="logo" src="/asset/image/logo.png" />
          站点标题
        </figure>
        <Menu />
      </ShareHeader>
    )
  }
}
