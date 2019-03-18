import { Icon, Menu } from 'antd'
import { toJS } from 'mobx'
import { inject, observer } from 'mobx-react'
import React from 'react'
import { Imenu, MenuStore, RouterStore } from 'store/interface'
import { Link } from './Link'
import s from './style.m.less'

const { SubMenu } = Menu

interface IProp {
  store?: {
    router: RouterStore
    menu: MenuStore
  }
}

/*
 * 在Header头文件中使用的菜单项组件
 * */
@inject('store')
@observer
class AppMenu extends React.Component<IProp> {
  public stopSubscribeHistory: () => void

  public componentWillMount() {
    const {
      router: { history },
      menu,
    } = this.props.store!
    this.stopSubscribeHistory = history.subscribe(location => {
      // 初始化在根路径上，key是'/'，不会为空
      menu.setActiveMenu(location.pathname)
    })
  }

  public componentWillUnmount() {
    this.stopSubscribeHistory()
  }

  // 递归显示目录
  public renderMenus = (menus?: Imenu[]) => {
    if (!menus) {
      const { menu } = this.props.store!
      menus = toJS(menu.menus)
    }
    return menus.map(menu => {
      const key = `${menu.name}-${menu.to}`
      if (menu.children) {
        return (
          <SubMenu key={key} title={menu.name}>
            {menu.children && this.renderMenus(menu.children)}
          </SubMenu>
        )
      }
      return (
        <Menu.Item key={key}>
          <Link to={menu.to}>
            {menu.icon ? <Icon type={menu.icon} /> : null}
            {menu.name}
          </Link>
        </Menu.Item>
      )
    })
  }

  public render() {
    const { menu } = this.props.store!
    const menus = toJS(menu.menus)
    const selectedKeys = toJS(menu.selectedKeys)
    return (
      <div
        className={s.menuAll}
        // eslint-disable-next-line react-native/no-inline-styles
        style={{ minWidth: `${menus.length * 66}px`, height: '64px' }}
      >
        <Menu
          getPopupContainer={() => document.body}
          selectedKeys={selectedKeys}
          mode="horizontal"
        >
          {this.renderMenus()}
        </Menu>
      </div>
    )
  }
}
export { AppMenu as Menu }
