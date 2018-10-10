import pullAll from 'lodash/pullAll'

const emptyValues = ['', null, undefined]

/**
 * 判定url中query中的项目是否是空值
 * @param {any} v the query value
 * @return {boolean} test result
 * */
const isEmptyQuery = v => {
  if (Array.isArray(v)) {
    v = [...v]
    pullAll(v, emptyValues)
    return v.length === 0
  }
  return emptyValues.includes(v)
}

export default isEmptyQuery
