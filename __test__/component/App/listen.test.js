import noop from 'lodash/noop'
import { notification } from 'antd'
import listen, {
  onPageError,
  onApiError,
  onApiSuccess,
  onMobxError,
} from 'component/App/listen'
import { emitter as soundEmitter } from 'component/SoundEffect'
import { emitter as fxiosEmitter } from 'tool/fxios'

describe('component/App/listen', () => {
  it('fxiosEmitter on event', () => {
    const soundEmitterSpy = jest
      .spyOn(soundEmitter, 'emit')
      .mockImplementation(noop)

    expect(soundEmitterSpy).not.toHaveBeenCalled()
    expect(fxiosEmitter.listeners('success')).toHaveLength(0)
    expect(fxiosEmitter.listeners('error')).toHaveLength(0)

    const dispose = listen()
    expect(fxiosEmitter.listeners('success')).toHaveLength(1)
    expect(fxiosEmitter.listeners('error')).toHaveLength(1)
    expect(fxiosEmitter.listeners('success')[0]).toBe(onApiSuccess)
    expect(fxiosEmitter.listeners('error')[0]).toBe(onApiError)

    dispose()
    expect(fxiosEmitter.listeners('success')).toHaveLength(0)
    expect(fxiosEmitter.listeners('error')).toHaveLength(0)
  })

  it('fxiosEmitter success事件，get方法不会调用，其他http方法会调用', () => {
    const spy = jest.spyOn(notification, 'success')
    const dispose = listen()
    expect(spy).not.toHaveBeenCalled()
    const soundEmitterSpy = jest
      .spyOn(soundEmitter, 'emit')
      .mockImplementation(noop)
    fxiosEmitter.emit('success', { message: 'abc' }, { method: 'get' })
    expect(spy).toHaveBeenCalledTimes(0)
    expect(soundEmitterSpy).not.toHaveBeenCalled()
    fxiosEmitter.emit('success', { message: 'abc' }, { method: 'post' })
    expect(soundEmitterSpy).toHaveBeenCalledTimes(1)
    dispose()
  })

  it('fxiosEmitter error事件', () => {
    const dispose = listen()
    const spy = jest.spyOn(notification, 'error')
    const soundEmitterSpy = jest
      .spyOn(soundEmitter, 'emit')
      .mockImplementation(noop)
    expect(spy).not.toHaveBeenCalled()
    fxiosEmitter.emit('error', { message: 'error' })
    expect(spy).toHaveBeenCalledWith({
      message: '接口错误',
      description: 'error',
      duration: 3,
    })
    expect(soundEmitterSpy).toHaveBeenLastCalledWith('failure')
    fxiosEmitter.emit('error', new Error('error message'))
    expect(spy).toHaveBeenCalledWith({
      message: '接口错误',
      description: 'error message',
      duration: 3,
    })
    expect(soundEmitterSpy).toHaveBeenLastCalledWith('failure')
    fxiosEmitter.emit('error', 'string message')
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
    onPageError(error, { componentStack: 'xxxx' })
    expect(spy).toHaveBeenCalledTimes(1)
  })

  it('onMobxError', () => {
    const spy = jest.spyOn(notification, 'error').mockImplementation(noop)
    expect(spy).not.toHaveBeenCalled()
    const error = new Error('abc')
    onMobxError(error)
    expect(spy).toHaveBeenLastCalledWith({
      message: 'mobx错误',
      description: error.toString(),
      placement: 'topLeft',
    })
  })
})
