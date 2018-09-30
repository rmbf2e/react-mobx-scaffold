import { toJS } from 'mobx'
import app from 'store/app'

describe('测试appStore', () => {
  it('测试me的setter方法', () => {
    expect(app.me).toEqual({})
    const me = { name: 'adadfa' }
    app.setMe(me)
    expect(toJS(app.me)).toEqual(me)
    app.restoreMe()
    expect(app.me).toEqual({})
  })

  it('loading', () => {
    expect(app.loading).toBe(true)
    app.setLoading(false)
    expect(app.loading).toBe(false)
    app.restoreLoading()
    expect(app.loading).toBe(true)
  })

  it('测试继承必须实现的方法', () => {
    expect(() => app.logout()).toThrow()
  })
})
