import { Layout, Select } from 'antd'
import { noop } from 'lodash'
import React from 'react'
import { Provider } from 'mobx-react'
import { mount } from 'enzyme'
import { Header } from 'component/Header'
import { router } from 'store/router'
import { locale } from 'store/locale'
import { menu } from 'store/menu'

const { Header: AntHeader } = Layout

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
        <Header />
      </Provider>,
    )
  it('test include antd Header', () => {
    const app = wrapper()
    expect(app.find(AntHeader)).toHaveLength(1)
  })

  it('test logout', () => {
    const com = wrapper()
    expect(logout).not.toHaveBeenCalled()
    const button = com.find('button').last()
    button.simulate('click')
    expect(logout).toHaveBeenCalled()
    logout.mockRestore()
  })

  it('test onLangSwitch', () => {
    const langCodes = Object.keys(locale.langs)
    const spy = jest.spyOn(locale, 'setLang').mockImplementation(noop)
    const com = wrapper()
    const select = com.find(Select).first()
    const onLangSwitch = select.prop('onChange')
    onLangSwitch(langCodes[0])
    expect(spy).toHaveBeenLastCalledWith(locale.langs[langCodes[0]])
    onLangSwitch(langCodes[1])
    expect(spy).toHaveBeenLastCalledWith(locale.langs[langCodes[1]])
  })
})
