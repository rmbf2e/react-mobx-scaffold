import { Select } from 'antd'
import React from 'react'
import PropTypes from 'prop-types'
import Layout from 'antd/lib/layout'
import { observer, inject } from 'mobx-react'
import Menu from 'component/Menu'
import Theme from 'component/Theme'
import s from './style.m.less'

const { Header } = Layout

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
          <Theme />
          <Select
            className={s.langSelect}
            defaultValue="zhCN"
            onChange={this.onLangSwitch}
          >
            {Object.keys(langs).map(l => (
              <Select.Option key={l} value={l}>
                {langs[l].language}
              </Select.Option>
            ))}
          </Select>
          {app.me.name}
          <button
            type="button"
            className="link-button"
            onClick={app.logout}
            onKeyPress={app.logout}
          >
            [{lang.Header.logout}]
          </button>
        </figure>
      </Header>
    )
  }
}
export { AppHeader as Header }
