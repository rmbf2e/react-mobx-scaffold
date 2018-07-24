import React from 'react'
import PropTypes from 'prop-types'
import { Menu, Layout, Icon } from 'antd'
import { observer, inject } from 'mobx-react'
import { toJS } from 'mobx'
import MenuLink from 'component/Menu/Link'

@inject('store')
@observer
export default class Sider extends React.Component {
  static propTypes = {
    store: PropTypes.shape({
      menu: PropTypes.object,
      sider: PropTypes.object,
      router: PropTypes.object,
    }).isRequired,
  }

  render() {
    const { sider, menu } = this.props.store
    const menus = toJS(sider.menus)
    const selectedKeys = toJS(menu.selectedKeys)
    return (
      <Layout.Sider
        onCollapse={sider.toggle}
        collapsible
        collapsed={sider.collapsed}
      >
        <Menu
          onSelect={menu.setCurrent}
          selectedKeys={selectedKeys}
          mode="inline"
        >
          {menus.map(m => (
            <Menu.Item key={m.to}>
              <MenuLink onClick={this.checkSamePathname} to={m.to}>
                <Icon type={m.icon} />
                <span>{m.name}</span>
              </MenuLink>
            </Menu.Item>
          ))}
        </Menu>
      </Layout.Sider>
    )
  }
}
