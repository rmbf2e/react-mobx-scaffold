import React from 'react'
import { toJS } from 'mobx'
import PropTypes from 'prop-types'
import { Menu } from 'antd'
import { observer, inject } from 'mobx-react'
import { history } from 'store/router'
import Link from './Link'

const { SubMenu } = Menu
// const MenuItemGroup = Menu.ItemGroup

@inject('store')
@observer
export default class Menus extends React.Component {
  static propTypes = {
    store: PropTypes.shape({
      sider: PropTypes.object,
      menu: PropTypes.object,
      router: PropTypes.object,
    }).isRequired,
  }

  componentWillMount() {
    this.stopSubscribeHistory = history.subscribe(location => {
      const { menu } = this.props.store
      const key = location.pathname
      menu.setCurrent({ key })
    })
  }

  componentWillUnmount() {
    if (this.stopSubscribeHistory) {
      this.stopSubscribeHistory()
    }
  }

  // 检测重复进入同一个路由的路径
  checkSamePathname = e => {
    const {
      router: { location },
    } = this.props.store
    const href = e.target.getAttribute('href')
    if (href === location.pathname) {
      e.preventDefault()
      e.stopPropagation()
      return false
    }
    return true
  }

  renderMenus = () => {
    const {
      menu,
      sider,
      router: { push },
    } = this.props.store
    const menus = toJS(menu.menus)
    if (sider.collapsed) {
      return menus.map(topMenu => (
        <SubMenu key={topMenu.name} title={topMenu.name}>
          {topMenu.children.map(m => (
            <Menu.Item key={m.to}>
              <Link to={m.to}>{m.name}</Link>
            </Menu.Item>
          ))}
        </SubMenu>
      ))
    }
    return menus.map(topMenu => {
      const m = topMenu.children[0]
      return (
        <SubMenu
          key={topMenu.name}
          title={topMenu.name}
          onTitleClick={() => push(m.to)}
        />
      )
    })
  }

  render() {
    const { menu } = this.props.store
    const selectedKeys = toJS(menu.selectedKeys)
    const props = {
      selectedKeys,
      // onSelect: menu.setCurrent,
      mode: 'horizontal',
      // onOpenChange: menu.onOpenChange,
      // openKeys: toJS(menu.openKeys),
    }
    return <Menu {...props}>{this.renderMenus()}</Menu>
  }
}
