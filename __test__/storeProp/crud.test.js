// import fetch from 'util/fetch'
import { toJS } from 'mobx'
import fetchMock from 'fetch-mock'
import crud from 'storeProp/crud'
import config from 'app/config'

const defaultResponse = {
  code: 200,
}

describe('storeProp/crud', () => {
  // const host = 'http://localhost'
  const option = {
    name: 'user',
    default: {},
    create: { url: 'user/create' },
    update: { url: 'user/update' },
    destroy: { url: 'user/destroy' },
    fetch: { url: 'user/fetch' },
  }
  class A {
    constructor() {
      crud.call(this, [option])
    }
  }
  const a = new A()

  // beforeEach(() => {})

  afterEach(() => {
    fetchMock.restore()
  })

  it('test create.url与createingUser', () => {
    fetchMock.post(`${config.baseURL}${option.create.url}`, defaultResponse)
    expect(a.creatingUser).toBe(false)
    const p = a.createUser({})
    expect(a.creatingUser).toBe(true)
    return p.then(() => {
      expect(a.creatingUser).toBe(false)
    })
  })

  it('测试create的数据与返回数据', () => {
    const mockRes = {
      ...defaultResponse,
      data: { name: 'abc' },
    }
    fetchMock.post(`${config.baseURL}${option.create.url}`, mockRes)
    const createData = { name: 'newUser' }
    const p = a.createUser(createData)
    expect(a.creatingUser).toBe(true)
    return p.then(res => {
      expect(a.creatingUser).toBe(false)
      // eslint-disable-next-line
      expect(JSON.parse(fetchMock.lastCall()[0].body)).toEqual(createData)
      expect(res).toEqual(mockRes)
    })
  })

  const methods = ['create', 'update', 'destroy']
  methods.forEach(method => {
    it(`测试${method}的添加interceptor处理request数据与response数据`, () => {
      const mockRes = {
        ...defaultResponse,
        data: { name: 'abc' },
      }
      const Boption = {
        name: 'user',
        [method]: {
          url: 'user/create',
          interceptor: {
            request: d => ({
              ...d,
              name: `pre_${d.name}`,
            }),
            response: res => ({
              ...res,
              data: {
                ...res.data,
                name: `${res.data.name}_post`,
              },
            }),
          },
        },
      }
      fetchMock.post(`${config.baseURL}${Boption[method].url}`, mockRes)
      fetchMock.put(`${config.baseURL}${Boption[method].url}`, mockRes)
      fetchMock.delete(`${config.baseURL}${Boption[method].url}`, mockRes)
      class B {
        constructor() {
          crud.call(this, [Boption])
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
        expect(JSON.parse(fetchMock.lastCall()[0].body)).toEqual(
          Boption[method].interceptor.request(data))
        expect(res).toEqual(Boption[method].interceptor.response(mockRes))
      })
    })
  })

  it('测试fetch的interceptor处理request数据与response数据', () => {
    const mockRes = {
      ...defaultResponse,
      data: { name: 'abc' },
    }
    const Boption = {
      name: 'user',
      fetch: {
        url: 'user',
        interceptor: {
          request: d => ({
            ...d,
            name: `pre${d.name}`,
          }),
          response: res => ({
            ...res,
            data: {
              ...res.data,
              name: `${res.data.name}_post`,
            },
          }),
        },
      },
    }
    fetchMock.get(
      `${config.baseURL}${Boption.fetch.url}?name=prenewUser`,
      mockRes,
    )
    class B {
      constructor() {
        crud.call(this, [Boption])
      }
    }
    const b = new B()
    const query = { name: 'newUser' }
    const p = b.fetchUser(query)
    expect(b.fetchingUser).toBe(true)
    return p.then(res => {
      expect(a.fetchingUser).toBe(false)
      // eslint-disable-next-line
      expect(fetchMock.lastCall()[0].url).toEqual(
        `${config.baseURL}${Boption.fetch.url}?name=prenewUser`)
      expect(res).toEqual(Boption.fetch.interceptor.response(mockRes))
    })
  })

  it('test update.url', () => {
    expect(a.updatingUser).toBe(false)
    fetchMock.put(`${config.baseURL}${option.update.url}`, defaultResponse)
    const p = a.updateUser({})
    expect(a.updatingUser).toBe(true)
    return p.then(() => {
      expect(a.updatingUser).toBe(false)
    })
  })

  it('test destroy.url', () => {
    expect(a.destroyingUser).toBe(false)
    fetchMock.delete(`${config.baseURL}${option.destroy.url}`, defaultResponse)
    const p = a.destroyUser({})
    expect(a.destroyingUser).toBe(true)
    return p.then(() => {
      expect(a.destroyingUser).toBe(false)
    })
  })

  it('test fetch.url', () => {
    expect(a.fetchingUser).toBe(false)
    const data = { name: 'abc' }
    fetchMock.get(`${config.baseURL}${option.fetch.url}`, {
      ...defaultResponse,
      data,
    })
    const p = a.fetchUser({})
    expect(a.fetchingUser).toBe(true)
    return p.then(() => {
      expect(a.fetchingUser).toBe(false)
      expect(a.user).toEqual(data)

      const otherData = { xxx: '111' }
      a.setUser({ data: otherData })
      expect(toJS(a.user)).toEqual(otherData)
    })
  })

  it('测试fetch返回数据中没有data的情况，则使用res赋值', () => {
    expect(a.fetchingUser).toBe(false)
    const res = defaultResponse
    fetchMock.get(`${config.baseURL}${option.fetch.url}`, res)
    const p = a.fetchUser({})
    expect(a.fetchingUser).toBe(true)
    return p.then(() => {
      expect(a.fetchingUser).toBe(false)
      expect(a.user).toEqual(res)
    })
  })

  it('fetch 指定其他method', () => {
    const mockRes = {
      ...defaultResponse,
      data: { name: 'abc' },
    }
    const Boption = {
      name: 'user',
      fetch: {
        url: 'user',
        method: 'post',
      },
    }
    class B {
      constructor() {
        crud.call(this, [Boption])
      }
    }
    const b = new B()
    fetchMock.post(`${config.baseURL}${Boption.fetch.url}`, mockRes)
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
    const mockRes = {
      ...defaultResponse,
      data: { name: 'abc' },
    }
    fetchMock.post(`${config.baseURL}${Boption.create.url}`, mockRes)
    fetchMock.put(`${config.baseURL}${Boption.update.url}`, mockRes)
    fetchMock.delete(`${config.baseURL}${Boption.destroy.url}`, mockRes)
    class B {
      constructor() {
        crud.call(this, [Boption])
      }

      emit = fn
    }
    const b = new B()

    expect(fn.mock.calls).toHaveLength(0)
    await b.createUser({})
    expect(fn.mock.calls).toHaveLength(1)
    await b.updateUser({})
    expect(fn.mock.calls).toHaveLength(2)
    await b.destroyUser({})
    expect(fn.mock.calls).toHaveLength(3)
  })

  it('测试default属性', () => {
    const b = new A()
    expect(b.user).toEqual({})
  })

  it('测试create之后会恢复default', async () => {
    const b = new A()
    expect(b.user).toEqual({})
    fetchMock.post(`${config.baseURL}${option.create.url}`, defaultResponse)
    const bUser = { name: 'b' }
    b.setUser(bUser)
    expect(b.user).toEqual(bUser)
    await b.createUser({})
    expect(b.user).toEqual({})
  })

  it('测试update之后会恢复default', async () => {
    const b = new A()
    expect(b.user).toEqual({})
    fetchMock.put(`${config.baseURL}${option.update.url}`, defaultResponse)
    const bUser = { name: 'b' }
    b.setUser(bUser)
    expect(b.user).toEqual(bUser)
    await b.updateUser({})
    expect(b.user).toEqual({})
  })
})
