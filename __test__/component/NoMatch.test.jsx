import React from 'react'
import { mount } from 'enzyme'
import { Router } from 'react-router-dom'
import Exception from 'ant-design-pro/lib/Exception'
import { NoMatch } from 'component/NoMatch'
import { router } from 'store/router'

describe('component/NoMatch', () => {
  it('使用ant-pro的Exception', () => {
    const com = mount(
      <Router history={router.history}>
        <NoMatch />
      </Router>,
    )
    expect(com.find(Exception)).toHaveLength(1)
  })
})
