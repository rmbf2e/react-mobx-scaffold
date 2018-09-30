import React from 'react'
import { mount } from 'enzyme'
import TransitionRoute from 'component/TransitionRoute'
import Content from 'component/Content'
import Loading from 'component/Loading'

const wrapper = () => mount(<Content />)

describe('component/Content', () => {
  it('测试包含Loading', () => {
    const com = wrapper()
    expect(com.find(Loading)).toHaveLength(1)
    expect(com.find(TransitionRoute)).toHaveLength(0)
  })
})
