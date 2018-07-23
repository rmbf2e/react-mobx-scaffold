// import createHashHistory from 'history/createHashHistory'
import createBrowserHistory from 'history/createBrowserHistory'
import { RouterStore, syncHistoryWithStore } from 'mobx-react-router'
import { extendObservable } from 'mobx'
import url from 'url'

const routerStore = new RouterStore()
const appHistory = createBrowserHistory()
export const history = syncHistoryWithStore(appHistory, routerStore)

// 扩展query属性方便获取url上的querystring
extendObservable(routerStore, {
  get query() {
    const { search } = this.location
    return search ? url.parse(search, true).query : {}
  },
})

export default routerStore
