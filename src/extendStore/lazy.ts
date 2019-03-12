import { castArray, upperFirst } from 'lodash'
import { action, extendObservable } from 'mobx'
import { lazyObservable } from 'mobx-utils'
import { IExtendableObject, ILazyOption } from './interface'

/**
 * 使用name属性生成惰性加载的属性
 * 例如options为 [{
 *   name: 'category',
 *   default: [],
 *   lazy(cb) {
 *     return fxios.get(api.options).then(res => cb(res.data))
 *   }
 * }]
 * 生成 category 属性，默认值为default属性中的[]，该属性为computed
 * 生成 loadingCategory 响应式属性
 * 生成 setLoadingCategory 方法，参数为true/false，用来设置loadingCategory
 * 生成 lazyCategory lazy属性，有current方法，基本不使用
 *
 * 总结：主要使用category获取数据；loadingCategory展示加载状态，
 * 其他属性属于该功能内部使用。
 *
 * 注意：lazy必须返回一个promise
 *
 * @param {array} options 定义参数
 * @return {void}
 * */
export function lazy(this: IExtendableObject, options: ILazyOption[]) {
  castArray(options).forEach(option => {
    const { name } = option
    const upperName = upperFirst(name)
    const lazyName = `lazy${upperName}`
    const loadingName = `loading${upperName}`
    const setLoading = `setLoading${upperName}`
    const extendObj = {
      [loadingName]: false,
      [setLoading]: (loading: boolean) => {
        this[loadingName] = loading
      },
      [lazyName]: lazyObservable(cb => {
        this[setLoading](true)
        option.lazy(cb).finally(() => {
          this[setLoading](false)
        })
      }, option.default),
      get [name](): any {
        return this[lazyName].current()
      },
    }
    extendObservable(this, extendObj, {
      [setLoading]: action,
    })
  })
}
