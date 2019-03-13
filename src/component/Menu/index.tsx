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

  public renderMenus = () => {
    const { menu } = this.props.store!
    const menus: Imenu[] = toJS(menu.menus)
    return menus.map(topMenu => (
      <SubMenu key={topMenu.name} title={topMenu.name}>
        {topMenu.children &&
          topMenu.children.map(m => {
            if (m.children) {
              return (
                <SubMenu key={m.name} title={m.name}>
                  {m.children.map(c => (
                    <Menu.Item key={c.to}>
                      <Link to={c.to}>
                        {c.icon ? <Icon type={c.icon} /> : null}
                        {c.name}
                      </Link>
                    </Menu.Item>
                  ))}
                </SubMenu>
              )
            }
            return (
              <Menu.Item key={m.to}>
                <Link to={m.to}>
                  {m.icon ? <Icon type={m.icon} /> : null}
                  {m.name}
                </Link>
              </Menu.Item>
            )
          })}
      </SubMenu>
    ))
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
