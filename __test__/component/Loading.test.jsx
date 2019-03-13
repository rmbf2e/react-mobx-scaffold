import React from 'react'
import { mount } from 'enzyme'
import { locale } from 'store/locale'
import { Loading } from 'component/Loading'

describe('component/Loading', () => {
  const { loading } = locale.lang.Loading

  it('测试error prop', () => {
    const com = mount(<Loading error={new Error('abc')} />)
    expect(com.text()).toContain('abc')
  })

  it('传text', () => {
    const com = mount(<Loading text="test text" />)
    expect(com.text()).not.toContain(loading)
    expect(com.text()).toContain('test text')
  })

  it('不传text', () => {
    const com = mount(<Loading />)
    expect(com.text()).not.toContain('test text')
    expect(com.text()).toContain(loading)
  })
})
