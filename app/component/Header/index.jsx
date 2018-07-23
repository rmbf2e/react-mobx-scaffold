import React from 'react'
import PropTypes from 'prop-types'
import { Layout } from 'antd'
import { observer, inject } from 'mobx-react'
import Menu from 'component/Menu'
import s from './style.m.less'

const { Header } = Layout

@inject('store')
@observer
export default class AppHeader extends React.Component {
  static propTypes = {
    store: PropTypes.shape({
      user: PropTypes.shape({
        fetchMe: PropTypes.func,
      }),
      site: PropTypes.shape({
        siteOption: PropTypes.object,
      }),
      app: PropTypes.shape({
        site: PropTypes.string,
        setSite: PropTypes.func,
      }),
      router: PropTypes.shape({
        location: PropTypes.object,
      }),
    }).isRequired,
  }

  render() {
    const { user } = this.props.store
    return (
      <Header className={s.header}>
        <figure className={s.logo}>项目名称</figure>
        <Menu />
        <figure className={s.me}>
          {user.me.name}
          <a onClick={user.logout} onKeyPress={user.logout}>
            注销
          </a>
        </figure>
      </Header>
    )
  }
}
