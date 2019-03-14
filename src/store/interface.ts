import { RouteProps } from 'react-router'

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

export { Menu as MenuStore, IMenuToTopMenu } from 'store/menu'

/* define menu end */

export { Locale as LocaleStore, ILangs } from 'store/locale'

export { Router as RouterStore } from 'store/router'

export interface IRouteProps extends RouteProps {
  key: string
}

export { App as AppStore } from 'store/app'

export { User as UserStore } from 'store/user'
