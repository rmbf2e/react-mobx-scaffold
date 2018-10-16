import { Select } from 'antd'
import React from 'react'
import PropTypes from 'prop-types'
import Layout from 'antd/lib/layout'
import { observer, inject } from 'mobx-react'
import Menu from 'component/Menu'
import s from './style.m.less'

const { Header } = Layout
const { Option } = Select

@inject('store')
@observer
class AppHeader extends React.Component {
  static propTypes = {
    store: PropTypes.shape({
      app: PropTypes.shape({
        logout: PropTypes.func,
        me: PropTypes.object,
      }),
    }).isRequired,
    className: PropTypes.string,
  }

  static defaultProps = {
    className: '',
  }

  onLangSwitch = localeCode => {
    const {
      store: { locale },
    } = this.props
    locale.setLang(locale.langs[localeCode])
  }

  render() {
    const {
      store: {
        app,
        locale: { lang, langs },
      },
      className,
    } = this.props
    return (
      <Header className={`${s.header} ${className}`}>
        <figure className={s.logo}>
          <img alt="logo" src="/asset/image/logo.png" />
          {lang.Header.title}
        </figure>
        <Menu />
        <figure className={s.me}>
          <Select
            className={s.lang}
            defaultValue="zhCN"
            onChange={this.onLangSwitch}
          >
            {Object.keys(langs).map(l => (
              <Option key={l} value={l}>
                {l}
              </Option>
            ))}
          </Select>
          {app.me.name}
          <a onClick={app.logout} onKeyPress={app.logout}>
            {lang.Header.logout}
          </a>
        </figure>
      </Header>
    )
  }
}
export default AppHeader
