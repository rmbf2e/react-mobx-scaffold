import { observable, action } from 'mobx'
import config from 'app/config'
import menu from 'store/menu'

class Sider {
  @observable menus = []

  @action
  setMenus = menus => {
    this.menus = menus
  }

  // sider折叠
  @observable collapsed = config.siderCollapsed
  @action
  toggle = () => {
    this.collapsed = !this.collapsed
    // 如果关闭sider，清空顶部菜单的openKeys
    if (this.collapsed) {
      menu.onOpenChange([])
    }
  }
}

export default new Sider()
