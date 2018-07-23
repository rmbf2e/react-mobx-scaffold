import { observable, action, toJS } from 'mobx'
import sider from 'store/sider'
import find from 'lodash/find'

class Menu {
  menus = [
    {
      name: '权限管理',
      children: [
        {
          name: '角色管理',
          to: '/role',
          icon: 'usergroup-add',
        },
        {
          name: '用户管理',
          to: '/user',
          icon: 'user',
        },
        {
          name: '不存在的路径',
          to: '/noMatch',
        },
      ],
    },
    {
      name: '站点管理',
      children: [
        {
          name: '站点管理',
          to: '/site',
          icon: 'html5',
        },
      ],
    },
  ]
  @observable selectedKeys = []
  @observable openKeys = []

  // 设置当前激活状态的菜单
  // 在监听路由切换时调用
  @action
  setCurrent = ({ key }) => {
    this.selectedKeys[0] = key
    const menus = toJS(this.menus)
    const currentSubMenus =
      find(menus, m => find(m.children, c => c.to === key)) || menus[0]

    this.openKeys[0] = currentSubMenus.name
    sider.setMenus(currentSubMenus.children)
  }

  @action
  onOpenChange = keys => {
    this.openKeys = keys
  }
}

export default new Menu()
