import { mount } from 'enzyme'
import React from 'react'
import { CardTitle } from 'component/CardTitle'

describe('component/CardTitle', () => {
  const wrapper = () => mount(<CardTitle>xxxxxx</CardTitle>)

  it('测试className', () => {
    const app = wrapper()
    const outside = app.find('.ant-card-head-wrapper').first()
    expect(outside.prop('className')).toBe('ant-card-head-wrapper')
    const inside = outside.find('.ant-card-head-title')
    expect(inside.prop('className')).toContain('ant-card-head-title')
    expect(inside.text()).toBe('xxxxxx')
  })
})
