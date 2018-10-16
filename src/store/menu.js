import { observable, action } from 'mobx'
import storeProp from 'src/storeProp'

@storeProp({
  // 定义menus属性与setMenus方法
  setter: [
    {
      name: 'menus',
      default: [],
    },
  ],
})
class Menu {
  @observable
  selectedKeys = []

  // 设置当前激活状态的菜单
  // 在监听路由切换时调用
  @action
  setCurrent = ({ key }) => {
    this.selectedKeys[0] = key
  }
}
const menu = new Menu()
menu.setMenus([
  {
    name: '系统管理',
    children: [
      {
        name: '首页',
        to: '/',
        icon: 'home',
      },
      {
        name: '用户管理',
        to: '/user',
        icon: 'user',
      },
      {
        name: '不存在的路径',
        icon: 'close',
        children: [
          {
            name: '不存在的路径',
            icon: 'close',
            to: '/noMatch',
          },
        ],
      },
    ],
  },
])

export default menu
