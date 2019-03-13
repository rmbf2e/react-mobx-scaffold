import EventEmitter from 'events'
import { toJS } from 'mobx'
import { rest } from 'extendStore/rest'
import { fxios } from 'tool/fxios'

describe('extendStore/rest', () => {
  const option = {
    name: 'user',
    default: {},
    create: {
      url: 'user/create',
    },
    update: {
      url: 'user/update',
    },
    destroy: {
      url: 'user/destroy',
    },
    fetch: {
      url: 'user/fetch',
    },
  }
  class A {
    constructor() {
      rest.call(this, [option])
    }
  }
  const a = new A()

  const resolve = any => () => Promise.resolve(any)

  it('test create.url与createingUser', () => {
    jest.spyOn(fxios, 'post').mockImplementation(resolve())
    expect(a.creatingUser).toBe(false)
    const p = a.createUser({})
    expect(a.creatingUser).toBe(true)
    return p.then(() => {
      expect(a.creatingUser).toBe(false)
    })
  })

  it('测试create的数据与返回数据', () => {
    const mockRes = { name: 'abc' }
    const spy = jest.spyOn(fxios, 'post').mockImplementation(resolve(mockRes))
    const createData = { name: 'newUser' }
    const p = a.createUser({ body: createData })
    expect(a.creatingUser).toBe(true)
    return p.then(res => {
      expect(a.creatingUser).toBe(false)
      expect(spy).toHaveBeenLastCalledWith(option.create.url, {
        body: createData,
      })
      expect(res).toEqual(mockRes)
    })
  })

  const methods = ['create', 'update', 'destroy']
  methods.forEach(method => {
    it(`测试${method}的添加interceptor处理request数据与response数据`, () => {
      const mockRes = { name: 'abc' }
      const Boption = {
        name: 'user',
        [method]: {
          url: 'user/create',
          interceptor: {
            request: (...args) => {
              const d = args[0]
              return [
                {
                  ...d,
                  name: `pre_${d.name}`,
                },
                ...args.slice(1),
              ]
            },
            response: res => ({
              ...res,
              name: `${res.name}_post`,
            }),
          },
        },
      }
      jest.spyOn(fxios, 'post').mockImplementation(resolve(mockRes))
      jest.spyOn(fxios, 'put').mockImplementation(resolve(mockRes))
      jest.spyOn(fxios, 'delete').mockImplementation(resolve(mockRes))
      // fetchMock.post(`${config.baseURL}${Boption[method].url}`, mockRes)
      // fetchMock.put(`${config.baseURL}${Boption[method].url}`, mockRes)
      // fetchMock.delete(`${config.baseURL}${Boption[method].url}`, mockRes)
      class B {
        constructor() {
          rest.call(this, [Boption])
        }
      }
      const b = new B()
      const data = { name: 'newUser' }
      const p = b[`${method}User`](data)
      let doing
      if (method === 'create') {
        doing = 'creatingUser'
      } else if (method === 'update') {
        doing = 'updatingUser'
      } else {
        doing = 'destroyingUser'
      }
      expect(b[doing]).toBe(true)
      return p.then(res => {
        expect(a[doing]).toBe(false)
        // eslint-disable-next-line
        // expect(JSON.parse(fetchMock.lastCall()[0].body)).toEqual(
        //   Boption[method].interceptor.request(data),
        // )
        expect(res).toEqual(Boption[method].interceptor.response(mockRes))
      })
    })
  })

  it('测试fetch的interceptor处理request数据与response数据', () => {
    const mockRes = {
      name: 'abc',
    }
    const Boption = {
      name: 'user',
      fetch: {
        url: 'user',
        interceptor: {
          request: ({ query }) => ({
            query: {
              ...query,
              name: `pre${query.name}`,
            },
          }),
          response: res => ({
            ...res,
            name: `${res.name}_post`,
          }),
        },
      },
    }
    const spy = jest.spyOn(fxios, 'get').mockImplementation(resolve(mockRes))
    class B {
      constructor() {
        rest.call(this, [Boption])
      }
    }
    const b = new B()
    const query = { name: 'newUser' }
    const p = b.fetchUser({ query })
    expect(b.fetchingUser).toBe(true)
    return p.then(res => {
      expect(b.fetchingUser).toBe(false)
      expect(spy).toHaveBeenLastCalledWith(Boption.fetch.url, {
        query: { name: 'prenewUser' },
      })
      expect(res).toEqual(Boption.fetch.interceptor.response(mockRes))
    })
  })

  it('test update.url', () => {
    expect(a.updatingUser).toBe(false)
    jest.spyOn(fxios, 'put').mockImplementation(resolve())
    // fetchMock.put(`${config.baseURL}${option.update.url}`, {})
    const p = a.updateUser({})
    expect(a.updatingUser).toBe(true)
    return p.then(() => {
      expect(a.updatingUser).toBe(false)
    })
  })

  it('test destroy.url', () => {
    expect(a.destroyingUser).toBe(false)
    jest.spyOn(fxios, 'delete').mockImplementation(resolve())
    // fetchMock.delete(`${config.baseURL}${option.destroy.url}`, {})
    const p = a.destroyUser({})
    expect(a.destroyingUser).toBe(true)
    return p.then(() => {
      expect(a.destroyingUser).toBe(false)
    })
  })

  it('test fetch.url', () => {
    expect(a.fetchingUser).toBe(false)
    const data = { name: 'abc' }
    jest.spyOn(fxios, 'get').mockImplementation(resolve(data))
    const p = a.fetchUser({})
    expect(a.fetchingUser).toBe(true)
    return p.then(() => {
      expect(a.fetchingUser).toBe(false)
      expect(a.user).toEqual(data)

      const otherData = { xxx: '111' }
      a.setUser(otherData)
      expect(toJS(a.user)).toEqual(otherData)
    })
  })

  it('fetch 指定其他method', () => {
    const mockRes = {
      name: 'abc',
    }
    jest.spyOn(fxios, 'post').mockImplementation(resolve(mockRes))
    const Boption = {
      name: 'user',
      fetch: {
        url: 'user',
        request: fxios.post,
      },
    }
    class B {
      constructor() {
        rest.call(this, [Boption])
      }
    }
    const b = new B()
    const p = b.fetchUser()
    expect(b.fetchingUser).toBe(true)
    return p.then(() => {
      expect(a.fetchingUser).toBe(false)
    })
  })

  it('当store继承eventEmitter的情况，create, update, destroy都会触发changed事件', async () => {
    const fn = jest.fn()
    const Boption = {
      name: 'user',
      create: {
        url: 'user',
      },
      update: {
        url: 'user',
      },
      destroy: {
        url: 'user',
      },
    }
    const mockRes = { name: 'abc' }
    // const url = `${config.baseURL}${Boption.create.url}`
    jest.spyOn(fxios, 'post').mockImplementation(resolve(mockRes))
    jest.spyOn(fxios, 'put').mockImplementation(resolve(mockRes))
    jest.spyOn(fxios, 'delete').mockImplementation(resolve(mockRes))
    class B {
      constructor() {
        rest.call(this, [Boption])
      }

      emit = fn
    }
    const b = new B()

    expect(fn.mock.calls).toHaveLength(0)
    await b.createUser({ body: {} })
    expect(fn.mock.calls).toHaveLength(2)
    await b.updateUser({ body: {} })
    expect(fn.mock.calls).toHaveLength(4)
    await b.destroyUser({})
    expect(fn.mock.calls).toHaveLength(6)
  })

  it('测试default属性', () => {
    const b = new A()
    expect(b.user).toEqual({})
  })

  it('测试create之后会恢复default', async () => {
    const b = new A()
    expect(b.user).toEqual({})
    jest.spyOn(fxios, 'post').mockImplementation(resolve({}))
    const bUser = { name: 'b' }
    b.setUser(bUser)
    expect(b.user).toEqual(bUser)
    await b.createUser({})
    expect(b.user).toEqual({})
  })

  it('测试update之后会恢复default', async () => {
    const b = new A()
    expect(b.user).toEqual({})
    jest.spyOn(fxios, 'put').mockImplementation(resolve({}))
    const bUser = { name: 'b' }
    b.setUser(bUser)
    expect(b.user).toEqual(bUser)
    await b.updateUser({ body: {} })
    expect(b.user).toEqual({})
  })

  it('测试restoreMethod', () => {
    const b = new A()
    expect(b.user).toEqual({})
    const u = { name: 'sdfsdf' }
    b.setUser(u)
    expect(b.user).toEqual(u)
    b.restoreUser()
    expect(b.user).toEqual({})
  })

  it('测试create时，使用对象格式参数', () => {
    const b = new A()
    const createdUser = { name: 'adf' }
    const originCreateUrl = option.create.url
    option.create.url = `${originCreateUrl}/:id`
    // fetchMock.post(
    //   `${config.baseURL}${option.create.url.replace(':id', 3)}?b=2`,
    //   createdUser,)
    const spy = jest
      .spyOn(fxios, 'post')
      .mockImplementation(resolve(createdUser))
    return b
      .createUser({
        body: { a: 1 },
        query: { b: 2 },
        param: { id: 3 },
      })
      .then(() => {
        expect(spy).toHaveBeenLastCalledWith('user/create/:id', {
          param: { id: 3 },
          body: { a: 1 },
          query: { b: 2 },
        })
        // 恢复create的url
        option.create.url = originCreateUrl
      })
  })

  it('测试fetch时，使用对象格式参数', () => {
    const b = new A()
    const user = { name: 'adf' }
    const originFetchUrl = option.fetch.url
    option.fetch.url = `${originFetchUrl}/:id`
    const spy = jest.spyOn(fxios, 'get').mockImplementation(resolve(user))
    return b
      .fetchUser({
        query: { b: 2 },
        param: { id: 3 },
      })
      .then(() => {
        expect(spy).toHaveBeenLastCalledWith(option.fetch.url, {
          param: { id: 3 },
          query: { b: 2 },
        })
        // 恢复url
        option.fetch.url = originFetchUrl
      })
  })

  describe('测试emit的参数', () => {
    class E extends EventEmitter {
      constructor() {
        super()
        rest.call(this, [option])
      }
    }
    it('测试create的emit事件', () => {
      const e = new E()
      const createdUser = { name: 'adf' }
      // fetchMock.post(`${config.baseURL}${option.create.url}?a=1`, createdUser)
      jest.spyOn(fxios, 'post').mockImplementation(resolve(createdUser))
      const fn = jest.fn()
      e.on('user:changed', fn)
      e.on('user:created', fn)
      return e.createUser({ body: { a: 2 }, query: { a: 1 } }).then(() => {
        expect(fn.mock.calls).toHaveLength(2)
        expect(fn).toHaveBeenLastCalledWith(createdUser, {
          body: { a: 2 },
          query: { a: 1 },
        })
      })
    })

    it('测试update的emit事件', () => {
      const e = new E()
      const updatedUser = { name: 'adf' }
      jest.spyOn(fxios, 'put').mockImplementation(resolve(updatedUser))
      const fn = jest.fn()
      e.on('user:changed', fn)
      e.on('user:updated', fn)
      return e.updateUser({ body: 123 }).then(() => {
        expect(fn.mock.calls).toHaveLength(2)
        expect(fn).toHaveBeenCalledWith(updatedUser, { body: 123 })
      })
    })

    it('测试destroy的emit事件', () => {
      const e = new E()
      jest.spyOn(fxios, 'delete').mockImplementation(resolve({}))
      // fetchMock.delete(`${config.baseURL}${option.destroy.url}`, {})
      const fn = jest.fn()
      e.on('user:changed', fn)
      e.on('user:destroyed', fn)
      return e.destroyUser({}).then(() => {
        expect(fn.mock.calls).toHaveLength(2)
      })
    })
  })
})
