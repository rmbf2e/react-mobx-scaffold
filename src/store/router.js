import { matchPath } from 'react-router'
import URL from 'url'
import createBrowserHistory from 'history/createBrowserHistory'
import { RouterStore, syncHistoryWithStore } from 'mobx-react-router'
import { computed } from 'mobx'

// 单例模式，全局只需要一个router即可
let instance = null

export class Router extends RouterStore {
  constructor() {
    super()
    if (instance) {
      return instance
    }
    const appHistory = createBrowserHistory()
    syncHistoryWithStore(appHistory, this)
    instance = this
  }

  // 全局的routes数组
  routes = []

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
    // routes 在component/App中赋值
    this.routes.find(route => {
      const match = matchPath(pathname, route)
      if (match?.params) {
        param = match.params
      }
      return !!match
    })
    return param
  }
}

export default new Router()
