import { notification } from 'antd'
import { onError } from 'mobx-react'
import fxios from 'tool/fxios'
import { emitter as soundEmitter } from 'component/SoundEffect'

// 监听后端接口错误函数
const onApiError = error => {
  notification.error({
    message: '接口错误',
    description: error.message || error.toString(),
    duration: 3,
  })
  soundEmitter.emit('failure')
}

// 监听后端接口成功提示
const onApiSuccess = (res, req) => {
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
export const onPageError = error => {
  notification.error({
    message: '页面错误',
    description: error.toString(),
    placement: 'topLeft',
  })
}

const listen = () => {
  fxios.on('error', onApiError)
  fxios.on('success', onApiSuccess)
  const dispose = onError(error => {
    notification.error({
      message: 'mobx错误',
      description: error.toString(),
      placement: 'topLeft',
    })
    soundEmitter.emit('failure')
  })
  return () => {
    dispose()
    fxios.off('success', onApiSuccess)
    fxios.off('error', onApiSuccess)
  }
}

export default listen
