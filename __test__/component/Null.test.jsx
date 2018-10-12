import React from 'react'
import { mount } from 'enzyme'
import Null from 'component/Null'

describe('component/Null', () => {
  const wrapper = () => mount(<Null />)

  it('should render empty node', () => {
    const app = wrapper()
    expect(app.html()).toBe(null)
  })
})
