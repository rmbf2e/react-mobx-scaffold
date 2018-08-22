import isObject from 'lodash/isObject'
import fxios from 'share/util/fxios'
import appConfig from 'app/config'

// 处理列表与分页
// 处理后的数据可直接用于antd的Table
const processList = data => {
  if (data && data.data && isObject(data.data) && 'entities' in data.data) {
    const d = data.data
    return {
      originalData: d,
      dataSource: d.entities,
      pagination: {
        // current: Number(d.pageNo) || 1,
        total: Number(d.entityCount) || 0,
      },
    }
  }
  return data
}

fxios.interceptor.response.push((res, req) => {
  // 未登录跳转
  if (res.type === 'opaqueredirect') {
    const { location } = global
    location.href = appConfig.loginHost
    return null
  }
  if (!res.ok) {
    const error = new Error(res.statusText)
    error.response = res
    throw error
  }
  return res.json().then(data => {
    // 成功判断
    if (data.code === 200) {
      res.message = data.message
      if (req.method !== 'GET') {
        fxios.emit('success', res, req)
      }
      data = processList(data)
      return data
    }
    // 未登录跳转
    const error = new Error(data.message)
    error.code = data.code
    error.response = res
    throw error
  })
})

const fxiosCatch = error => {
  // 若emitter没有监听函数直接emit一个error，会抛出错误不执行下面的throw error
  if (fxios.listeners('error').length > 0) {
    fxios.emit('error', error)
  }
  throw error
}
fxios.interceptor.catch.push(fxiosCatch)

export default fxios
