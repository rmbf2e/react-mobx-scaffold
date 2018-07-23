import isArray from 'lodash/isArray'

const isEmptyArray = v => {
  if (isArray(v)) {
    if (v.length === 0) {
      return true
    }
    if (v.length === 1 && v[0] === '') {
      return true
    }
  }
  return false
}

export default isEmptyArray
