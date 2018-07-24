import isEmptyArray from 'util/isEmptyArray'
import reduce from 'lodash/reduce'

const isEmpty = v => v === undefined || v === null || v === ''

// 过滤掉表单中的空值
const compactObject = obj => {
  const result = {}
  if (!obj) {
    return result
  }
  return reduce(
    obj,
    (r, v, k) => {
      if (!isEmpty(v) && !isEmptyArray(v)) {
        r[k] = v
      }
      return r
    },
    result,
  )
}

export default compactObject
