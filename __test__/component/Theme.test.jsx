import React from 'react'
import Theme from 'component/Theme'
import { Switch } from 'antd'
import { mount } from 'enzyme'
import { Provider } from 'mobx-react'
import locale from 'store/locale'
import defaultTheme from 'style/default.theme.less'
import darkTheme from 'style/dark.theme.less'

describe('component/Theme', () => {
  const store = {
    locale,
  }

  const wrapper = () =>
    mount(
      <Provider store={store}>
        <Theme />
      </Provider>,
    )

  it('toggle', () => {
    const app = wrapper()
    const sw = app.find(Switch).first()

    const toggle = sw.prop('onChange')
    expect(defaultTheme.use).not.toHaveBeenCalled()
    expect(darkTheme.use).not.toHaveBeenCalled()
    toggle(true)
    expect(defaultTheme.use).toHaveBeenCalledTimes(1)
    expect(darkTheme.unuse).toHaveBeenCalledTimes(1)
    toggle(false)
    expect(defaultTheme.unuse).toHaveBeenCalledTimes(1)
    expect(darkTheme.use).toHaveBeenCalledTimes(1)
  })
})
