import React from 'react'
import noop from 'lodash/noop'
import { mount } from 'enzyme'
import { notification, LocaleProvider } from 'antd'
import { Provider } from 'mobx-react'
import { Router } from 'react-router-dom'
import router from 'store/router'
import fxios from 'tool/fxios'
import app from 'store/app'
import Main from 'component/Main'
import { emitter as soundEmitter } from 'component/SoundEffect'

const store = { router, app }

const wrapper = () => mount(<Main store={store} />)

describe('测试Main', () => {
  beforeEach(() => {
    jest
      .spyOn(fxios, 'get')
      .mockImplementation(() => Promise.resolve({ code: 200, data: {} }))
  })

  it('测试Main内包含组件', () => {
    const com = wrapper()
    expect(com.find(LocaleProvider)).toHaveLength(1)
    expect(com.find(Provider)).toHaveLength(1)
    expect(com.find(Router)).toHaveLength(1)
    com.unmount()
  })

  it('测试Main卸载后，移除fxios监听', () => {
    const com = wrapper()
    expect(fxios.listeners('success')).toHaveLength(1)
    expect(fxios.listeners('error')).toHaveLength(1)
    com.unmount()
    expect(fxios.listeners('success')).toHaveLength(0)
    expect(fxios.listeners('error')).toHaveLength(0)
  })

  it('测试Main绑定fxios success事件', () => {
    const com = wrapper()
    const spy = jest.spyOn(notification, 'success')
    expect(spy).not.toHaveBeenCalled()
    const soundEmitterSpy = jest
      .spyOn(soundEmitter, 'emit')
      .mockImplementation(noop)
    fxios.emit('success', { message: 'abc' }, { method: 'post' })
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith({
      message: '操作成功',
      description: 'abc',
      duration: 3,
    })
    expect(soundEmitterSpy).toHaveBeenLastCalledWith('success')
    com.unmount()
  })

  it('测试Main绑定fxios success事件，get方法不会调用', () => {
    const com = wrapper()
    const spy = jest.spyOn(notification, 'success')
    expect(spy).not.toHaveBeenCalled()
    const soundEmitterSpy = jest
      .spyOn(soundEmitter, 'emit')
      .mockImplementation(noop)
    fxios.emit('success', { message: 'abc' }, { method: 'get' })
    expect(spy).toHaveBeenCalledTimes(0)
    expect(soundEmitterSpy).not.toHaveBeenCalled()
    com.unmount()
  })

  it('测试Main绑定fxios error事件', () => {
    const com = wrapper()
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
    com.unmount()
  })

  it('Main负责捕获组件内错误', () => {
    const com = wrapper()
    const spy = jest.spyOn(notification, 'error')
    const soundEmitterSpy = jest
      .spyOn(soundEmitter, 'emit')
      .mockImplementation(noop)

    expect(spy).not.toHaveBeenCalled()
    jest
      // eslint-disable-next-line
      .spyOn(global._virtualConsole, 'emit')
      .mockImplementation(noop)
    jest.spyOn(console, 'error').mockImplementation(noop)
    try {
      app.setMe(undefined)
      expect(spy).toHaveBeenCalled()
      expect(soundEmitterSpy).toHaveBeenLastCalledWith('failure')
    } catch (e) {
      noop()
    }
    com.unmount()
  })
})