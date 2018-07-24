import fxios from 'util/fxios'
import { action, extendObservable, observable } from 'mobx'
import upperFirst from 'lodash/upperFirst'
import castArray from 'lodash/castArray'

/*
 * 生成以命名为核心的添删改方法与相关的请求状态属性
 * 例如options为 [{
 *   name: 'group',
 *   default: {},
 *   create: {
 *     url: '/groups/create', // required
 *     method: 'post', // optional 默认post
 *     interceptor: {
 *       request: (data) => {..}, // 预处理发送data
 *       response: (data) => {..}, // 处理接口返回data
 *     },
 *   },
 * }]
 * 会生成 group 属性，默认值为default
 * 会生成 creatingGroup 属性
 * 会生成 createGroup 方法
 * createGroup方法参数 data 提交的数据 必须
 *                     query url上带的queryA 可选
 *                     param url路由需要的参数，如果url为'/group/:id', 则param需要为{ id: '123' } 可选
 * 如果没有create，则不会生成这两项
 *
 * update, fetch, destroy方法与create相同
 *
 * @param {Array} options
 * @return void
 * */
function crud(options) {
  castArray(options).forEach(option => {
    const { name } = option
    const upperName = upperFirst(name)
    const extendObject = {}
    const decoratorObject = {}
    const setMethod = `set${upperName}`
    extendObject[setMethod] = res => {
      this[option.name] = res.data ? res.data : res
    }
    extendObject[option.name] = option.default
    if (option.create) {
      const creating = `creating${upperName}`
      const createMethod = `create${upperName}`
      extendObject[creating] = false
      extendObject[createMethod] = (data, query, param) => {
        this[creating] = true
        const { create } = option
        const method = create.method || 'post'
        if (create.interceptor && create.interceptor.request) {
          data = create.interceptor.request(data)
        }
        const promise = fxios[method]({ url: create.url, param }, data).then(res => {
            if (this.emit) {
              this.emit(`${name}:changed`)
            }
            if (option.default) {
              this[setMethod](option.default)
            }
            if (create.interceptor && create.interceptor.response) {
              return create.interceptor.response(res)
            }
            return res
          })
        promise.finally(action(createMethod, () => {
            this[creating] = false
          }))
        return promise
      }
      decoratorObject[createMethod] = action
    }
    if (option.update) {
      const updating = `updating${upperName}`
      const updateMethod = `update${upperName}`
      extendObject[updating] = false
      extendObject[updateMethod] = (data, query, param) => {
        this[updating] = true
        const { update } = option
        const method = update.method || 'put'
        if (update.interceptor && update.interceptor.request) {
          data = update.interceptor.request(data)
        }
        const promise = fxios[method]({ url: update.url, param }, data).then(res => {
            if (this.emit) {
              this.emit(`${name}:changed`)
            }
            if (option.default) {
              this[setMethod](option.default)
            }
            if (update.interceptor && update.interceptor.response) {
              return update.interceptor.response(res)
            }
            return res
          })
        promise.finally(action(updateMethod, () => {
            this[updating] = false
          }))
        return promise
      }
      decoratorObject[updateMethod] = action
    }
    if (option.destroy) {
      const destroying = `destroying${upperName}`
      const destroyMethod = `destroy${upperName}`
      extendObject[destroying] = false
      extendObject[destroyMethod] = (data, param) => {
        this[destroying] = true
        const { destroy } = option
        const method = destroy.method || 'delete'
        if (destroy.interceptor && destroy.interceptor.request) {
          data = destroy.interceptor.request(data)
        }
        const promise = fxios[method]({ url: destroy.url, param }, data).then(res => {
            if (this.emit) {
              this.emit(`${name}:changed`)
            }
            if (destroy.interceptor && destroy.interceptor.response) {
              return destroy.interceptor.response(res)
            }
            return res
          })
        promise.finally(action(destroyMethod, () => {
            this[destroying] = false
          }))
        return promise
      }
      decoratorObject[destroyMethod] = action
    }
    if (option.fetch) {
      const fetching = `fetching${upperName}`
      const fetchMethod = `fetch${upperName}`
      extendObject[fetching] = false
      extendObject[fetchMethod] = (query, param) => {
        this[fetching] = true
        const fetchObj = option.fetch
        const method = fetchObj.method || 'get'
        const setAction = action(setMethod, res => {
          if (fetchObj.interceptor && fetchObj.interceptor.response) {
            res = fetchObj.interceptor.response(res)
          }
          extendObject[setMethod](res)
          return res
        })
        if (fetchObj.interceptor && fetchObj.interceptor.request) {
          query = fetchObj.interceptor.request(query)
        }
        const promise = fxios[method]({ url: fetchObj.url, param }, query).then(setAction)
        promise.finally(action(fetchMethod, () => {
            this[fetching] = false
          }))
        return promise
      }
      decoratorObject[fetchMethod] = action
      decoratorObject[option.name] = observable.shallow
    }
    decoratorObject[setMethod] = action
    extendObservable(this, extendObject, decoratorObject)
  })
}

export default crud
