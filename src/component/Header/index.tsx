import { Layout, Select } from 'antd'
import { Menu } from 'component/Menu'
import { Theme } from 'component/Theme'
import { inject, observer } from 'mobx-react'
import React from 'react'
import DocumentTitle from 'react-document-title'
import appConfig from 'src/config'
import {
  AppStore,
  ILangs,
  IMenuToTopMenu,
  LocaleStore,
  MenuStore,
} from 'store/interface'
import { Router } from 'store/router'
import { getFirstPathname } from 'tool/getFirstPathname'
import s from './style.m.less'

interface IProps {
  store?: {
    router: Router
    menu: MenuStore
    locale: LocaleStore
    app: AppStore
  }
}

interface IState {
  title: string
}

const { Header } = Layout

@inject('store')
@observer
class AppHeader extends React.Component<IProps, IState> {
  public state = {
    title: appConfig.title,
  }

  private unsubscribe!: () => void

  public componentDidMount() {
    const {
      router: { history },
      menu,
    } = this.props.store!
    // 更新html title
    this.unsubscribe = history.subscribe(h => {
      const key = getFirstPathname(h.pathname)
      const flattenMenu = menu.topMenuMap[key] as IMenuToTopMenu
      if (!!flattenMenu) {
        const currentMenu = flattenMenu.menu
        this.setState({
          title: currentMenu
            ? `${currentMenu.name}-${appConfig.title}`
            : appConfig.title,
        })
      }
    })
  }

  public componentWillUnmount() {
    this.unsubscribe()
  }

  public onLangSwitch = (localeCode: keyof ILangs) => {
    const { locale } = this.props.store!
    locale.setLang(locale.langs[localeCode])
  }

  public render() {
    const { title } = this.state
    const {
      app,
      locale: { lang, langs },
    } = this.props.store!
    return (
      <Header className={s.header}>
        <figure className={s.logo}>
          <img alt="logo" src="/asset/image/logo.png" />
          {lang.Header.title}
        </figure>
        <Menu />
        <DocumentTitle title={title} />
        <figure className={s.me}>
          <Theme />
          <Select
            className={s.langSelect}
            defaultValue="zhCN"
            onChange={this.onLangSwitch}
          >
            {Object.keys(langs).map(l => (
              <Select.Option key={l} value={l}>
                {(langs as any)[l].language}
              </Select.Option>
            ))}
          </Select>
          <span className={`${s.name} username`}>{app.me.name}</span>
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
