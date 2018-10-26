import isObject from 'lodash/isObject'
import { Fxios } from 'fxios'
import appConfig from 'src/config'

export const config = {
  credentials: 'include',
  redirect: 'manual',
  mode: 'cors',
  cache: 'reload',
  base: appConfig.baseURL,
}

const fxios = new Fxios(config)

// 处理列表与分页
// 处理后的数据可直接用于antd的Table
const processList = data => {
  if (isObject(data) && 'list' in data) {
    const d = data
    return {
      originalData: d,
      dataSource: d.list,
      pagination: {
        total: Number(d.count) || 0,
      },
    }
  }
  return data
}

fxios.interceptor.response.push((res, req) => {
  if (!res.ok) {
    const error = new Error(res.statusText)
    error.response = res
    throw error
  }
  return res.json().then(data => {
    res.message = data.message
    if (req.method.toUpperCase() !== 'GET') {
      fxios.emit('success', res, req)
    }
    return processList(data)
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
