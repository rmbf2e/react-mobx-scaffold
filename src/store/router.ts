import { createBrowserHistory } from 'history'
import { computed } from 'mobx'
import {
  RouterStore,
  syncHistoryWithStore,
  SynchronizedHistory,
} from 'mobx-react-router'
import { matchPath, RouteProps } from 'react-router'
import URL from 'url'

// 单例模式，全局只需要一个router即可
let instance: Router | null = null

export class Router extends RouterStore {
  public routes: RouteProps[] = []
  public history!: SynchronizedHistory

  constructor() {
    super()
    if (instance) {
      return instance
    }
    const appHistory = createBrowserHistory()
    this.history = syncHistoryWithStore(appHistory, this)
    instance = this
  }

  // 扩展query属性方便获取url上的querystring
  @computed
  get query() {
    const { search } = this.location
    return search ? URL.parse(search, true).query : {}
  }

  // 扩展获取路由参数param
  @computed
  get param() {
    const { pathname } = this.location
    let param = {}
    this.routes.find(route => {
      const match = matchPath(pathname, route)
      if (match && match.params) {
        param = match.params
      }
      return !!match
    })
    return param
  }
}

export const router = new Router()
