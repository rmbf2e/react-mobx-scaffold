import React from 'react'
import noop from 'lodash/noop'
import { mount } from 'enzyme'
import nprogress from 'nprogress'
import Nprogress from 'component/Nprogress'
import router from 'store/router'

const wrapper = () => mount(<Nprogress />)

describe('测试App', () => {
  it('测试nprogress', () => {
    jest.useFakeTimers()
    const startSpy = jest.spyOn(nprogress, 'start').mockImplementation(noop)
    const doneSpy = jest.spyOn(nprogress, 'done').mockImplementation(noop)
    expect(startSpy).not.toHaveBeenCalled()
    const app = wrapper()
    const instance = app
      .find(Nprogress)
      .first()
      .instance()
    expect(typeof instance.unlisten).toBe('function')
    const unlistenSpy = jest.spyOn(instance, 'unlisten')
    expect(instance.timer).toBe(null)
    router.history.push('/noMatch')
    expect(instance.timer).not.toBe(null)
    expect(startSpy).toHaveBeenCalled()
    expect(doneSpy).not.toHaveBeenCalled()
    jest.advanceTimersByTime(1000)
    expect(doneSpy).toHaveBeenCalled()
    expect(clearTimeout).not.toHaveBeenCalled()
    app.unmount()
    expect(clearTimeout).toHaveBeenLastCalledWith(instance.timer)
    expect(unlistenSpy).toHaveBeenCalledTimes(1)
  })
})
