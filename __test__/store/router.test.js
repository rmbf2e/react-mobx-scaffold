import router, { Router } from 'store/router'

describe('store/router', () => {
  it('测试全局单例', () => {
    const newRouter = new Router()
    expect(newRouter).toBe(router)
  })
})
