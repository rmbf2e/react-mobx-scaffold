import React from 'react'
import { Table } from 'antd'
import { mount } from 'enzyme'
import AnimateTable from 'component/AnimateTable'

describe('component/AnimateTable', () => {
  it('使用antd的Table', () => {
    const app = mount(<AnimateTable columns={[{ key: 'a', title: 'a' }]} />)
    expect(app.find(Table)).toHaveLength(1)
    const table = app.find(Table).at(0)
    expect(typeof table.prop('components').body.wrapper).toBe('function')
  })
})
