import { toJS } from 'mobx'
import router, { Router } from 'store/router'

describe('store/router', () => {
  it('测试全局单例', () => {
    const newRouter = new Router()
    expect(newRouter).toBe(router)
  })

  it('测试param', () => {
    router.routes = [
      {
        path: '/cde',
      },
      {
        path: '/abc/:id/edit',
      },
    ]
    router.push('/abc/123/edit')
    expect(toJS(router.param)).toEqual({ id: '123' })
  })
})
