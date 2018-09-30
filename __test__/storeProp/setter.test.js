import { reaction, toJS } from 'mobx'
import setter from 'app/storeProp/setter'

describe('storeProp/setter', () => {
  class A {
    constructor() {
      setter.call(this, [
        {
          name: 'user',
          default: {},
        },
      ])
    }
  }
  let a
  beforeEach(() => {
    a = new A()
  })

  it('定义了一个user属性', () => {
    expect(a.user).toEqual({})
  })

  it('测试setter方法', () => {
    const u = { name: 'abc' }
    a.setUser(u)
    expect(a.user).toEqual(u)
  })

  it('被定义的属性应是mobx的observable属性', () => {
    const fn = jest.fn()
    reaction(
      () => a.user,
      (_, r) => {
        fn()
        r.dispose()
      },
    )
    const u = { name: 'abc' }
    expect(fn).not.toHaveBeenCalled()
    a.setUser(u)
    expect(a.user).toEqual(u)
    expect(fn).toHaveBeenCalled()
  })

  it('测试restore方法', () => {
    expect(toJS(a.user)).toEqual({})
    const u = { name: 'abc' }
    a.setUser(u)
    expect(a.user).toEqual(u)
    a.restoreUser()
    expect(a.user).toEqual({})
  })
})
