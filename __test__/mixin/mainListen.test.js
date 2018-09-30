import noop from 'lodash/noop'
import { notification } from 'antd'
import mainListen, {
  onPageError,
  onApiError,
  onApiSuccess,
} from 'mixin/mainListen'
import { emitter as soundEmitter } from 'component/SoundEffect'
import fxios from 'tool/fxios'

describe('minx/mainListen', () => {
  it('fxios on event', () => {
    const soundEmitterSpy = jest
      .spyOn(soundEmitter, 'emit')
      .mockImplementation(noop)

    expect(soundEmitterSpy).not.toHaveBeenCalled()
    expect(fxios.listeners('success')).toHaveLength(0)
    expect(fxios.listeners('error')).toHaveLength(0)

    const dispose = mainListen()
    expect(fxios.listeners('success')).toHaveLength(1)
    expect(fxios.listeners('error')).toHaveLength(1)
    expect(fxios.listeners('success')[0]).toBe(onApiSuccess)
    expect(fxios.listeners('error')[0]).toBe(onApiError)

    dispose()
    expect(fxios.listeners('success')).toHaveLength(0)
    expect(fxios.listeners('error')).toHaveLength(0)
  })

  it('fxios success事件，get方法不会调用，其他http方法会调用', () => {
    const spy = jest.spyOn(notification, 'success')
    const dispose = mainListen()
    expect(spy).not.toHaveBeenCalled()
    const soundEmitterSpy = jest
      .spyOn(soundEmitter, 'emit')
      .mockImplementation(noop)
    fxios.emit('success', { message: 'abc' }, { method: 'get' })
    expect(spy).toHaveBeenCalledTimes(0)
    expect(soundEmitterSpy).not.toHaveBeenCalled()
    fxios.emit('success', { message: 'abc' }, { method: 'post' })
    expect(soundEmitterSpy).toHaveBeenCalledTimes(1)
    dispose()
  })

  it('fxios error事件', () => {
    const dispose = mainListen()
    const spy = jest.spyOn(notification, 'error')
    const soundEmitterSpy = jest
      .spyOn(soundEmitter, 'emit')
      .mockImplementation(noop)
    expect(spy).not.toHaveBeenCalled()
    fxios.emit('error', { message: 'error' })
    expect(spy).toHaveBeenCalledWith({
      message: '接口错误',
      description: 'error',
      duration: 3,
    })
    expect(soundEmitterSpy).toHaveBeenLastCalledWith('failure')
    fxios.emit('error', new Error('error message'))
    expect(spy).toHaveBeenCalledWith({
      message: '接口错误',
      description: 'error message',
      duration: 3,
    })
    expect(soundEmitterSpy).toHaveBeenLastCalledWith('failure')
    fxios.emit('error', 'string message')
    expect(spy).toHaveBeenCalledWith({
      message: '接口错误',
      description: 'string message',
      duration: 3,
    })
    expect(soundEmitterSpy).toHaveBeenLastCalledWith('failure')
    dispose()
  })

  it('onPageError', () => {
    const spy = jest.spyOn(notification, 'error').mockImplementation(noop)
    expect(spy).not.toHaveBeenCalled()
    const error = new Error('abc')
    onPageError(error)
    expect(spy).toHaveBeenLastCalledWith({
      message: '页面错误',
      description: error.toString(),
      placement: 'topLeft',
    })
  })
})
