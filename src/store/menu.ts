import find from 'lodash/find'
import reduce from 'lodash/reduce'
import { action, computed, observable, toJS } from 'mobx'
import { matchPath } from 'react-router'
import { extendStore } from 'src/extendStore'
import { Imenu, TNoop } from 'store/interface'
import { getFirstPathname } from 'tool/getFirstPathname'

interface ITopMenuMapValue {
  menu: Imenu
  top: Imenu
}

interface ITopMenuMap {
  [key: string]: ITopMenuMapValue
}

abstract class AMenu {
  public menus: any[]
  public setMenus: TNoop
  public restoreMenus: TNoop

  public breadcrumbContent: any
  public setBreadcrumbContent: TNoop
  public restoreBreadcrumbContent: TNoop
  public topMenuMap: ITopMenuMap

  public setTopMenu: (m: ITopMenuMapValue) => void
  public selectedKeys: string[]
}

@extendStore({
  // 定义menus属性与setMenus方法
  setter: [
    {
      name: 'topMenu',
      default: {},
    },
    {
      name: 'menus',
      default: [],
    },
  ],
})
export class Menu extends AMenu {
  @observable
  public selectedKeys: string[] = []

  // 设置当前激活状态的菜单
  // 在监听路由切换时调用
  @action
  public setActiveMenu = (pathname: string) => {
    // 通过路由匹配来找到当前pathname对应的一级目录
    let currentMenu = find<ITopMenuMap>(this.topMenuMap, (v, k) => {
      if (k !== '/') {
        const match = matchPath(pathname, {
          path: k,
          // exact: !!v.menu.exact,
          // strict: !!v.menu.strict,
        })
        return !!match
      }
      return false
    })

    // 如果按路由匹配找不到，就用url中的第一级路径匹配来找是否有对应的菜单
    if (!currentMenu) {
      const firstPathname: string = getFirstPathname(pathname)
      currentMenu = this.topMenuMap[firstPathname]
      // 最后如果没有对应项目则使用根路径
      if (!currentMenu) {
        const path = '/'
        currentMenu = this.topMenuMap[path]
      }
    }

    if (currentMenu.menu) {
      this.selectedKeys[0] = currentMenu.menu.to
    }

    // console.log(currentMenu?.top?.children)

    if (currentMenu.top.children && currentMenu.top.children) {
      this.setTopMenu(currentMenu)
    }
  }

  // 每一级的目录对应的顶级目录
  // 返回对象key为二级目录对应的路径
  // 返回对象value为对象
  //     键menu对应值当前的二级菜单对象
  //     键top对应值当前的一级菜单对象
  // 如果有三级菜单
  // 返回对象key为三级目录对应的路径
  // 返回对象value为对象
  //     键menu对应值当前的三级菜单对象
  //     键top对应当前的一级菜单对象
  @computed
  get topMenuMap() {
    return reduce<Imenu, ITopMenuMap>(
      toJS(this.menus),
      (result, topMenu) => {
        const resultMenu: ITopMenuMap = {}
        if (topMenu.children) {
          topMenu.children.forEach((secondLevelMenu: Imenu) => {
            if (secondLevelMenu.to) {
              resultMenu[secondLevelMenu.to] = {
                menu: secondLevelMenu,
                top: topMenu,
              }
            }
            if (secondLevelMenu.children) {
              secondLevelMenu.children.forEach((thirdLevelMenu: Imenu) => {
                if (thirdLevelMenu.to) {
                  resultMenu[thirdLevelMenu.to] = {
                    menu: thirdLevelMenu,
                    top: topMenu,
                  }
                }
              })
            }
          })
        }
        return {
          ...resultMenu,
          ...result,
        }
      },
      {},
    )
  }
}

export const menu = new Menu()
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
