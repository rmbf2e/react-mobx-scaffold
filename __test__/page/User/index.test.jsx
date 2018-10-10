import { shallow } from 'enzyme'
import React from 'react'
import { Card } from 'antd'
import Operation from 'page/User/Operation'
import List from 'page/User/List'
import Form from 'page/User/Form'
import User from 'page/User'
import Search from 'page/User/Search'

describe('page/User/index', () => {
  const wrapper = () => shallow(<User />)

  it('挂载子组件', () => {
    const app = wrapper()
    const card = app.find(Card).first()
    expect(card.prop('bordered')).toBe(false)
    expect(card.prop('title').type).toBe(Search)
    const children = card.children()
    expect(children).toHaveLength(3)
    expect(children.get(0).type).toBe(Operation)
    expect(children.get(1).type).toBe(List)
    expect(children.get(2).type).toBe(Form)
  })
})
