import { Layout } from 'antd'
import React from 'react'
import { Provider } from 'mobx-react'
import { mount } from 'enzyme'
import AppHeader from 'component/Header'
import router from 'store/router'
import locale from 'store/locale'
import menu from 'store/menu'

const { Header } = Layout

const logout = jest.fn()
const store = {
  router,
  menu,
  locale,
  app: {
    me: {
      name: 'ddd',
    },
    logout,
  },
}

describe('component/Header', () => {
  const wrapper = () =>
    mount(
      <Provider store={store}>
        <AppHeader />
      </Provider>,
    )
  it('测试包含antd Header', () => {
    const app = wrapper()
    expect(app.find(Header)).toHaveLength(1)
  })

  it('测试logout', () => {
    const com = wrapper()
    expect(logout).not.toHaveBeenCalled()
    const a = com.find('a')
    a.simulate('click')
    expect(logout).toHaveBeenCalled()
    logout.mockRestore()
  })
})
