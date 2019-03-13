import { menu } from 'store/menu'

describe('store/menu', () => {
  it('测试基本属性', () => {
    expect('topMenu' in menu).toBe(true)
  })
})
