import { pullAll } from 'lodash'

const emptyValues = ['', null, undefined]

/**
 * 判定url中query中的项目是否是空值
 * @param {any} v the query value
 * @return {boolean} test result
 * */
const isEmptyQuery = (value: any): boolean => {
  let v = value
  if (Array.isArray(v)) {
    v = [...v]
    pullAll(v, emptyValues)
    return v.length === 0
  }
  return emptyValues.includes(v)
}

export default isEmptyQuery
