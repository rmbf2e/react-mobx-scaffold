import { toJS } from 'mobx'
import lazy from 'src/storeProp/lazy'

describe('storeProp/lazy', () => {
  class A {
    constructor() {
      lazy.call(this, [
        {
          name: 'category',
          default: [],
          lazy: cb =>
            new Promise(resolve => {
              setTimeout(() => {
                const data = [{ name: 'a' }]
                resolve(data)
                cb(data)
              }, 10)
            }),
        },
      ])
    }
  }

  it('生成loading方法', done => {
    const a = new A()
    expect(toJS(a.loadingCategory)).toBe(false)
    // 生成惰性加载属性, 初始值为default
    expect(toJS(a.category)).toEqual([])
    expect(toJS(a.loadingCategory)).toBe(true)
    setTimeout(() => {
      expect(toJS(a.category)).toEqual([{ name: 'a' }])
      expect(toJS(a.loadingCategory)).toBe(false)
      done()
    }, 20)
  })
})
