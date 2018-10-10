import forEach from 'lodash/forEach'
import modal from './modal'
import list from './list'
import rest from './rest'
import setter from './setter'
import lazy from './lazy'

// 自动将storeProp文件夹里的所有文件加载为生成器
// 例如modal.js文件将被加载到generators.modal属性
// const generators = {}
// const generatorsRequire = require.context('src/storeProp', false, /\.js$/)
// generatorsRequire.keys().forEach(key => {
//   if (key !== './index.js') {
//     const name = key.replace(/(\.\/|\.js$)/g, '')
//     generators[name] = generatorsRequire(key).default
//   }
// })

const generators = {
  modal,
  list,
  rest,
  setter,
  lazy,
}

/*
 * 通过传入一系列option，批量生成被定义Class的属性和方法
 * option的每个键与storeProp里的某个文件名对应
 *
 * @param {Object} option
 * @return {Class} 继承后的新class
 * */
const storeProp = option => Class =>
  class ExtendedClass extends Class {
    constructor(...args) {
      super(...args)
      forEach(option, (v, k) => {
        generators[k].call(this, v)
      })
    }
  }

export default storeProp
