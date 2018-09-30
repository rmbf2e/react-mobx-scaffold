import URL from 'url'
import createBrowserHistory from 'history/createBrowserHistory'
import { RouterStore, syncHistoryWithStore } from 'mobx-react-router'
import { computed } from 'mobx'

// 单例模式，全局只需要一个router即可
let instance = null

class Router extends RouterStore {
  constructor() {
    super()
    if (instance) {
      return instance
    }
    const appHistory = createBrowserHistory()
    syncHistoryWithStore(appHistory, this)
    instance = this
  }

  // 扩展query属性方便获取url上的querystring
  @computed
  get query() {
    const { search } = this.location
    return search ? URL.parse(search, true).query : {}
  }
}

export default new Router()
