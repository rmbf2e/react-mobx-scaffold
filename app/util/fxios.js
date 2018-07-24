import { Fxios } from 'fxios'
import isObject from 'lodash/isObject'
import appConfig from 'app/config'
// import app from 'store/app'

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
  if (data && data.data && isObject(data.data) && 'entities' in data.data) {
    const d = data.data
    return {
      data: d,
      dataSource: d.entities,
      // loading: false,
      pagination: {
        current: Number(d.pageNo) || 1,
        // pageSize: Number(d.pageSize),
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
    const href = `${location.protocol}//${
      process.env.LOGIN_HOST === 'test' ? 'test.' : ''
    }ssa.jd.com/sso/login?ReturnUrl=${encodeURIComponent(location.href)}`
    location.href = href
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

// 自动注入site参数
const methods = ['get', 'post', 'delete', 'put']
methods.forEach(method => {
  const originMethod = fxios[method].bind(fxios)

  fxios[method] = (...args) => {
    const url = args[0]
    if (typeof url === 'string' && url.includes(':site')) {
      args[0] = { url, param: { site: fxios.site } }
    }
    if (typeof url === 'object' && url.url && url.url.includes(':site')) {
      url.param = url.param || {}
      url.param.site = fxios.site
    }
    return originMethod(...args)
  }
})

fxios.site = ''

export default fxios
