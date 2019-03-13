import { notification } from 'antd'
import { emitter as soundEmitter } from 'component/SoundEffect'
import { onError } from 'mobx-react'
import React from 'react'
import { emitter as fxiosEmitter, IResponse } from 'tool/fxios'

// 监听后端接口错误函数
export const onApiError = (error: Error) => {
  notification.error({
    message: '接口错误',
    description: error.message || error.toString(),
    duration: 3,
  })
  soundEmitter.emit('failure')
}

// 监听后端接口成功提示
export const onApiSuccess = (res: IResponse, req: Request) => {
  if (req.method.toUpperCase() !== 'GET') {
    notification.success({
      message: '操作成功',
      description: res.message,
      duration: 3,
    })
    soundEmitter.emit('success')
  }
}

// 监听React组件错误
export const onPageError = (error: Error, info: React.ErrorInfo) => {
  notification.error({
    message: '页面错误',
    description: (
      <div>
        <h2>{error.toString()}</h2>
        <div>{info.componentStack}</div>
      </div>
    ),
    placement: 'topLeft',
  })
  soundEmitter.emit('failure')
}

export const onMobxError = (error: Error) => {
  notification.error({
    message: 'mobx错误',
    description: error.toString(),
    placement: 'topLeft',
  })
  soundEmitter.emit('failure')
}

export const listen = () => {
  fxiosEmitter.on('error', onApiError)
  fxiosEmitter.on('success', onApiSuccess)
  const dispose = onError(onMobxError)
  return () => {
    dispose()
    fxiosEmitter.removeListener('success', onApiSuccess)
    fxiosEmitter.removeListener('error', onApiError)
  }
}
