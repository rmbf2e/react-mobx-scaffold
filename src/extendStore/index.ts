import { IOption } from './interface'
import { lazy } from './lazy'
import { list } from './list'
import { modal } from './modal'
import { rest } from './rest'
import { setter } from './setter'

interface IGenerators {
  modal: typeof modal
  list: typeof list
  rest: typeof rest
  setter: typeof setter
  lazy: typeof lazy
  [k: string]: any
}

const generators: IGenerators = {
  modal,
  list,
  rest,
  setter,
  lazy,
}

export interface IAnyClass {
  new (...args: any[]): any
  [key: string]: any
}
// export type AnyClass = new (...args: any[]) => IExtendableObject

/**
 * 通过传入一系列option，批量生成被定义Class的属性和方法
 * option的每个键与extendStore里的某个文件名对应
 *
 * @param {Object} option 各种配置选项
 * @return {Class} 继承后的新class
 * */
export const extendStore = <T>(option: IOption) => (Class: IAnyClass): any => {
  class Store extends Class {
    constructor(...args: any[]) {
      super(...args)
      Object.keys(option).forEach(k => {
        const v = option[k]
        generators[k].call(this, v)
      })
      return (this as unknown) as Store | T
    }

    [key: string]: any
  }
  return Store
}
