import React from 'react'
import { notification } from 'antd'
import { onError } from 'mobx-react'
import fxios from 'tool/fxios'
import { emitter as soundEmitter } from 'component/SoundEffect'

// 监听后端接口错误函数
export const onApiError = error => {
  notification.error({
    message: '接口错误',
    description: error.message || error.toString(),
    duration: 3,
  })
  soundEmitter.emit('failure')
}

// 监听后端接口成功提示
export const onApiSuccess = (res, req) => {
  if (req.method !== 'get') {
    notification.success({
      message: '操作成功',
      description: res.message,
      duration: 3,
    })
    soundEmitter.emit('success')
  }
}

// 监听React组件错误
export const onPageError = (error, info) => {
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

export const onMobxError = error => {
  notification.error({
    message: 'mobx错误',
    description: error.toString(),
    placement: 'topLeft',
  })
  soundEmitter.emit('failure')
}

const listen = () => {
  fxios.on('error', onApiError)
  fxios.on('success', onApiSuccess)
  const dispose = onError(onMobxError)
  return () => {
    dispose()
    fxios.removeListener('success', onApiSuccess)
    fxios.removeListener('error', onApiError)
  }
}

export default listen
