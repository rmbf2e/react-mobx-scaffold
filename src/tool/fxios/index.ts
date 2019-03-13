import Events from 'events'
import { Fxios } from 'fxios'
import { FxiosConfig } from 'fxios/typings'
import appConfig from 'src/config'
import { IApiData } from './interface'
import { loginRedirect } from './loginRedirect'
import { processList } from './processList'

export const emitter = new Events()

export const config: FxiosConfig = {
  credentials: 'include',
  redirect: 'manual',
  mode: 'cors',
  cache: 'reload',
  baseURL: appConfig.baseURL,
}

class FxiosError extends Error {
  public response: Response | null = null
  public code: string = ''
}

export interface IResponse extends Response {
  message: string
  data: any
}

export const fxios = new Fxios(config)

fxios.interceptor.response = (res: IResponse, req) => {
  if (res.status === 302) {
    return loginRedirect()
  }
  if (!res.ok) {
    const error = new FxiosError(res.statusText)
    error.response = res
    throw error
  }
  return res.json().then((data: IApiData) => {
    if (req.method.toUpperCase() !== 'GET') {
      emitter.emit('success', res, req)
    }
    return processList(data)

    // 其他code出错的情况
    const error = new FxiosError(data.message)
    error.code = data.code
    error.response = res
    throw error
  })
}

const fxiosCatch = (error: Error) => {
  // 若emitter没有监听函数直接emit一个error，会抛出错误不执行下面的throw error
  if (emitter.listeners('error').length > 0) {
    emitter.emit('error', error)
  }
  throw error
}

fxios.interceptor.catch = fxiosCatch
