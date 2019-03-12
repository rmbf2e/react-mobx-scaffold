export type TNoop = (v?: any) => void

export { QueryForm as QueryFormStore } from 'store/queryForm'

/* define menu start */

// m小写表示是数据
export interface Imenu {
  name: string
  to: string
  icon: string
  children?: Imenu[]
}

export interface IMenuToTopMenu {
  menu: Imenu
  top: Imenu
}

export { Menu as MenuStore } from 'store/menu'

/* define menu end */

export { Locale as LocaleStore } from 'store/locale'

export { Router as RouterStore } from 'store/router'

export { App as AppStore } from 'store/app'
