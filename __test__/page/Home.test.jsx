import { Card } from 'antd'
import { mount } from 'enzyme'
import React from 'react'
import Home from 'page/Home'

describe('page/Home', () => {
  const wrapper = () => mount(<Home />)

  it('home content', () => {
    const app = wrapper()
    const card = app.find(Card).first()
    expect(card.prop('bordered')).toBe(false)
    expect(card.prop('title')).toBe('欢迎使用本scaffold')
    expect(card.find('h2').text()).toBe('Welcome Home')
  })
})
