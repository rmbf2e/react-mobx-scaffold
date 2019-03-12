import { Layout } from 'antd'
import Logo from 'component/Logo'
import { Menu } from 'component/Menu'
import Theme from 'component/Theme'
import { inject, observer } from 'mobx-react'
import React, { KeyboardEvent, MouseEvent } from 'react'
import DocumentTitle from 'react-document-title'
import appConfig from 'src/config'
import {
  AppStore,
  HeaderStore,
  IMenuToTopMenu,
  LocaleStore,
  MenuStore,
} from 'store/interface'
import { Router } from 'store/router'
import getFirstPathname from 'tool/getFirstPathname'
import s from './style.m.less'

interface IProps {
  store?: {
    router: Router
    header: HeaderStore
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
      const flattenMenu = (menu.flattenMenus as any)[key] as IMenuToTopMenu
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

  public showLogo = (event: MouseEvent | KeyboardEvent) => {
    event.preventDefault()
    const { header } = this.props.store!
    header.setLogoPlayed(false)
  }

  public render() {
    const { title } = this.state
    const {
      app,
      locale: { lang },
    } = this.props.store!
    return (
      <Header className={s.header}>
        <figure className={s.logo}>
          <button
            type="button"
            onClick={this.showLogo}
            onKeyDown={this.showLogo}
            className={s.logoButton}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 10 386 286"
              preserveAspectRatio="xMidYMid meet"
              className={`${s.svg} logoColor`}
            >
              <title>logo</title>
              <path d="M386.17,108.33,351.5,39a3.91,3.91,0,0,0-7,0l-34.67,69.33a4,4,0,0,0-.41,1.76,3.91,3.91,0,0,0,3.91,3.91H335V241.29H239.05a12,12,0,0,0-5.62,1.4L200,260.42l-33.43-17.73a12,12,0,0,0-5.62-1.4H65V66h93l36.42,19.31a12,12,0,0,0,11.24,0L242,66h47.68a12,12,0,0,0,0-24H239.05a12,12,0,0,0-5.62,1.4L200,61.12,166.57,43.4A12,12,0,0,0,161,42H63.41A22.41,22.41,0,0,0,41,64.35V242.94a22.4,22.4,0,0,0,22.41,22.35H158l36.42,19.31a12,12,0,0,0,11.24,0L242,265.29h94.55A22.4,22.4,0,0,0,359,242.94V114h23.67a4,4,0,0,0,1.75-.41A3.93,3.93,0,0,0,386.17,108.33Z" />
              <path d="M192,116V228a8,8,0,0,0,16,0V116a8,8,0,0,0-16,0Z" />
            </svg>
          </button>
          <div className={`${s.title} siteTitle`}>
            <span>{appConfig.title}</span>
            <span className={s.subTitle}>Book Pricing Platform</span>
          </div>
        </figure>
        <Menu />
        <Logo />
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
                {langs[l].language}
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
