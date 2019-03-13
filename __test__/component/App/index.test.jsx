import React from 'react'
import { noop } from 'lodash'
import { mount } from 'enzyme'
import { notification } from 'antd'
import { Loading } from 'component/Loading'
import { Layout } from 'component/Layout'
import { router } from 'store/router'
import { fxios } from 'tool/fxios'
import { app } from 'store/app'
import { menu } from 'store/menu'
import { locale, zhCN } from 'store/locale'
import { App } from 'component/App'
import { emitter as soundEmitter } from 'component/SoundEffect'

const Home = () => <div />

const routes = [
  { key: 'home', path: '/', exact: true, component: Home },
  /* template-placeholder */
]

const store = { router, menu, app, locale }

const wrapper = route => {
  let appRoutes = routes
  if (route) {
    appRoutes = appRoutes.concat(route)
  }
  return mount(
    <App
      store={store}
      locale={zhCN}
      history={router.history}
      routes={appRoutes}
    />,
  )
}

describe('测试App', () => {
  beforeEach(() => {
    jest
      .spyOn(fxios, 'get')
      .mockImplementation(() => Promise.resolve({ code: 200, data: {} }))
  })

  it('测试App内包含组件', () => {
    let com = wrapper()
    expect(com.find(Loading)).toHaveLength(1)
    expect(com.find(Layout)).toHaveLength(0)
    com.unmount()
    app.setLoading(false)
    com = wrapper()
    expect(com.find(Layout)).toHaveLength(1)
    expect(router.routes).toEqual(routes)
  })

  it('测试App卸载后，移除fxios监听', () => {
    const com = wrapper()
    const instance = com.instance()
    expect(typeof instance.dispose).toBe('function')
    const spy = jest.spyOn(instance, 'dispose')
    com.unmount()
    expect(spy).toHaveBeenCalledTimes(1)
  })

  it('App负责捕获组件内错误', () => {
    class ErrorPage extends React.Component {
      state = {
        error: false,
      }

      render() {
        const { error } = this.state
        if (error) {
          throw new Error('error page')
        }
        return (
          <button
            className="errorButton"
            type="button"
            onClick={() => this.setState({ error: true })}
          >
            generate error
          </button>
        )
      }
    }
    const errorRoute = {
      key: 'error',
      path: '/error',
      exact: true,
      component: ErrorPage,
    }
    // ready to render ErrorPage
    app.setLoading(false)
    router.push('/error')

    const com = wrapper(errorRoute)
    const spy = jest.spyOn(notification, 'error')
    const soundEmitterSpy = jest
      .spyOn(soundEmitter, 'emit')
      .mockImplementation(noop)

    expect(spy).not.toHaveBeenCalled()
    jest
      // eslint-disable-next-line
      .spyOn(global._virtualConsole, 'emit')
      .mockImplementation(noop)
    jest.spyOn(console, 'error').mockImplementation(noop)
    const button = com.find('.errorButton').first()
    expect(button.text()).toBe('generate error')
    button.simulate('click')
    expect(spy).toHaveBeenCalled()
    expect(soundEmitterSpy).toHaveBeenLastCalledWith('failure')
    com.unmount()

    app.restoreLoading()
  })
})
