import { action, extendObservable, observable } from 'mobx'
import upperFirst from 'lodash/upperFirst'
import castArray from 'lodash/castArray'
import fxios from 'tool/fxios'

/**
 * 生成以命名为核心的添删改方法与相关的请求状态属性
 * 例如options为 [{
 *   name: 'group',
 *   default: {},
 *   create: {
 *     url: '/groups/create', // required
 *     request: fxios.post, // 可以不指定，默认按restfull接口规则
 *     interceptor: {
 *       request: (...args) => {
 *         ...
 *         return args
 *       }, // 预处理发送data
 *       response: (data) => {..}, // 处理接口返回data
 *     },
 *   },
 * }]
 * 会生成 group 属性，默认值为default属性中的{}
 * 会生成 creatingGroup 属性
 * 会生成 createGroup 方法
 * 如果没有create，则不会生成上面这两项
 * 会生成 restoreGroup 方法，将group恢复成option中制定的default值
 *
 * update, fetch, destroy方法与create相同
 *
 * create, update, destroy方法成功后，如果该class继承自events，有emit方法，则会emit `${name}:changed`事件，无emit参数
 * 同时emit `${name}:${created|updated|destroyed}`事件，emit参数为请求的response，与请求的数据对象{ body, query, param }，body为请求体，query为url query，param为url参数
 *
 * @param {Array} options 配置rest参数
 * @returns {void} return undefined
 * */
function rest(options) {
  castArray(options).forEach(option => {
    const { name } = option
    const upperName = upperFirst(name)
    const extendObject = {}
    const decoratorObject = {}
    const setMethod = `set${upperName}`
    extendObject[setMethod] = res => {
      this[option.name] = res
    }
    const restoreMethod = `restore${upperName}`
    extendObject[restoreMethod] = () => {
      if (option.default) {
        this[option.name] = option.default
      }
    }
    extendObject[option.name] = option.default
    const methods = ['create', 'update', 'destroy']
    const httpMethods = ['post', 'put', 'delete']
    const pastWords = ['created', 'updated', 'destroyed']
    const ingWords = ['creating', 'updating', 'destroying']
    methods.forEach((method, index) => {
      if (option[method]) {
        const ing = `${ingWords[index]}${upperName}`
        const requestMethod = `${method}${upperName}`
        extendObject[ing] = false
        extendObject[requestMethod] = fxiosOption => {
          const { [method]: methodOption } = option
          let requestOption = fxiosOption
          if (methodOption.interceptor && methodOption.interceptor.request) {
            requestOption = methodOption.interceptor.request(fxiosOption)
          }
          this[ing] = true
          const request = option[method].request || fxios[httpMethods[index]]
          const promise = request(methodOption.url, requestOption).then(res => {
            if (this.emit) {
              this.emit(`${name}:changed`)
              this.emit(`${name}:${pastWords[index]}`, res, requestOption)
            }
            this[restoreMethod]()
            if (methodOption.interceptor?.response) {
              return methodOption.interceptor.response(res)
            }
            return res
          })
          promise.finally(
            action(`stop ${ing}`, () => {
              this[ing] = false
            }),
          )
          return promise
        }
        decoratorObject[requestMethod] = action
      }
    })
    if (option.fetch) {
      const fetching = `fetching${upperName}`
      const fetchMethod = `fetch${upperName}`
      extendObject[fetching] = false
      extendObject[fetchMethod] = fxiosOption => {
        this[fetching] = true
        const fetchObj = option.fetch
        const setResponseAction = action(setMethod, res => {
          let response = { ...res }
          if (fetchObj.interceptor?.response) {
            response = fetchObj.interceptor.response(res)
          }
          extendObject[setMethod](response)
          return response
        })
        let requestOption = fxiosOption
        if (fetchObj.interceptor?.request) {
          requestOption = fetchObj.interceptor.request(fxiosOption)
        }
        const request = option.fetch.request || fxios.get
        const promise = request(fetchObj.url, requestOption).then(
          setResponseAction,
        )
        promise.finally(
          action(fetchMethod, () => {
            this[fetching] = false
          }),
        )
        return promise
      }
      decoratorObject[fetchMethod] = action
      decoratorObject[option.name] = observable
    }
    decoratorObject[setMethod] = action
    decoratorObject[restoreMethod] = action
    extendObservable(this, extendObject, decoratorObject)
  })
}

export default rest
