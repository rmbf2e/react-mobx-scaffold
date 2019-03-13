import React from 'react'
import { mount } from 'enzyme'
import { noop } from 'lodash'
import { SoundEffect, emitter } from 'component/SoundEffect'

const wrapper = () => mount(<SoundEffect />)

describe('component/SoundEffect', () => {
  it('测试error prop', () => {
    const app = wrapper()
    const instance = app.instance()
    const successAudio = instance.successAudio.current
    const failureAudio = instance.failureAudio.current
    const successPlaySpy = jest
      .spyOn(successAudio, 'play')
      .mockImplementation(noop)
    const successPauseSpy = jest
      .spyOn(successAudio, 'pause')
      .mockImplementation(noop)
    const failurePlaySpy = jest
      .spyOn(failureAudio, 'play')
      .mockImplementation(noop)
    const failurePauseSpy = jest
      .spyOn(failureAudio, 'pause')
      .mockImplementation(noop)

    instance.play('success')()
    expect(successPlaySpy).toHaveBeenCalledTimes(1)
    expect(successPauseSpy).toHaveBeenCalledTimes(1)

    instance.play('failure')()
    expect(failurePlaySpy).toHaveBeenCalledTimes(1)
    expect(failurePauseSpy).toHaveBeenCalledTimes(1)
    app.unmount()
  })

  it('test unmount unlisten events', () => {
    expect(emitter.listeners('success')).toHaveLength(0)
    expect(emitter.listeners('failure')).toHaveLength(0)
    const app = wrapper()
    expect(emitter.listeners('success')).toHaveLength(1)
    expect(emitter.listeners('failure')).toHaveLength(1)
    app.unmount()
  })
})
