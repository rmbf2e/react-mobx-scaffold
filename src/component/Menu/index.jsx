import { Icon, Menu } from 'antd'
import React from 'react'
import { toJS } from 'mobx'
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'
import getFirstPathname from 'tool/getFirstPathname'
import Link from './Link'
import s from './style.m.less'

// 用解构赋值jest --coverage会Menu is not defined
// eslint-disable-next-line
const SubMenu = Menu.SubMenu

/*
 * 在Header头文件中使用的菜单项组件
 * */
@inject('store')
@observer
class AppMenu extends React.Component {
  stopSubscribeHistory = null

  static propTypes = {
    store: PropTypes.shape({
      menu: PropTypes.object,
      router: PropTypes.object,
    }).isRequired,
  }

  componentWillMount() {
    const {
      store: {
        router: { history },
        menu,
      },
    } = this.props
    this.stopSubscribeHistory = history.subscribe(location => {
      const key = getFirstPathname(location.pathname)
      // 初始化在根路径上，key是'/'，不会为空
      menu.setCurrent({ key })
    })
  }

  componentWillUnmount() {
    this.stopSubscribeHistory()
  }

  renderMenus = () => {
    const {
      store: { menu },
    } = this.props
    const menus = toJS(menu.menus)
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

  render() {
    const {
      store: { menu },
    } = this.props
    const menus = toJS(menu.menus)
    const selectedKeys = toJS(menu.selectedKeys)
    return (
      <div
        className={s.menuAll}
        // eslint-disable-next-line react-native/no-inline-styles
        style={{ minWidth: `${menus.length * 66}px`, height: '64px' }}
      >
        <Menu selectedKeys={selectedKeys} mode="horizontal">
          {this.renderMenus()}
        </Menu>
      </div>
    )
  }
}
export default AppMenu
