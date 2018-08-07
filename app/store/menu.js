import Menu from 'share/store/menu'

const menu = new Menu()
menu.setMenus([
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
])

export default menu
