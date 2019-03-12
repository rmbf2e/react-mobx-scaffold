import { castArray, upperFirst } from 'lodash'
import { action, extendObservable } from 'mobx'
import { IExtendableObject, ISetterOption } from './interface'

/*
 * 生成被修饰Class实例的 `${name}`属性
 * 与`set{upperFirst(name)}`方法
 * 与`restore{upperFirst(name)}`方法，恢复初始值
 *
 * 例如options为 [{name: 'user', default: 'abc'}]
 * 则生成属性 user，初始值'abc'
 * 生成方法 setUser
 * 生成方法 restoreUser
 *
 * @param {Array} options
 * @return void
 * */
export function setter(this: IExtendableObject, options: ISetterOption[]) {
  castArray(options).forEach(option => {
    const { name, shallow } = option
    const upperFirstName = upperFirst(name)
    const setMethod = `set${upperFirstName}`
    const restoreMethod = `restore${upperFirstName}`
    const extendOption = shallow ? { deep: false } : undefined
    delete this[name]
    delete this[setMethod]
    delete this[restoreMethod]
    extendObservable(
      this,
      {
        [name]: option.default,
        [setMethod]: (v: any) => {
          this[name] = v
        },
        [restoreMethod]: () => {
          this[name] = option.default
        },
      },
      {
        [setMethod]: action,
        [restoreMethod]: action,
      },
      extendOption,
    )
  })
}
