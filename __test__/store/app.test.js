import { toJS } from 'mobx'
import noop from 'lodash/noop'
import fxios from 'tool/fxios'
import { app } from 'store/app'
import { base as api } from 'src/api'

describe('测试appStore', () => {
  it('测试me的setter方法', async () => {
    const me = { name: 'adadfa' }
    jest.spyOn(fxios, 'get').mockImplementation(() => Promise.resolve(me))
    expect(app.me).toEqual({})
    await app.fetchMe()
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
    const spy = jest.spyOn(fxios, 'get').mockImplementation(noop)
    app.logout()
    expect(spy).toHaveBeenLastCalledWith(api.logout)
  })
})
