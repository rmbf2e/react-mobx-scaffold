import fetchMock from 'fetch-mock'
import fxios from 'tool/fxios'
import config from 'app/config'

describe('tool/fxios', () => {
  afterEach(() => {
    fetchMock.restore()
  })
  describe('测试分页处理', () => {
    test('测试有分页值', () => {
      const url = '/users'
      const mockResponse = {
        code: 200,
        data: {
          entities: [
            { name: 'aaaa', id: 1 },
            {
              name: 'bbb',
              id: 2,
            },
          ],
          pageNo: 2,
          entityCount: 2,
        },
      }
      fetchMock.get(`${config.baseURL}${url}`, mockResponse)
      return fxios.get(url).then(res => {
        expect(res.originalData).toEqual(mockResponse.data)
        expect(res.dataSource).toEqual(mockResponse.data.entities)
        expect(res.pagination).toEqual({
          total: 2,
        })
      })
    })

    it('测试非分页数据', async () => {
      const url = '/users'
      let data = {
        code: 200,
        data: null,
      }
      fetchMock.get(`${config.baseURL}${url}`, data)
      let res = await fxios.get(url)
      expect(res).toEqual(data)
      fetchMock.restore()

      data = {
        code: 200,
        data: {
          name: 'abc',
        },
      }
      fetchMock.get(`${config.baseURL}${url}`, data)
      res = await fxios.get(url)
      expect(res).toEqual(data)
      fetchMock.restore()

      data = {
        code: 200,
      }
      fetchMock.get(`${config.baseURL}${url}`, data)
      res = await fxios.get(url)
      expect(res).toEqual(data)
    })

    test('测试没有分页值，返回默认分页值', () => {
      const url = '/users'
      const mockResponse = {
        code: 200,
        data: {
          entities: [
            { name: 'aaaa', id: 1 },
            {
              name: 'bbb',
              id: 2,
            },
          ],
        },
      }
      fetchMock.get(`${config.baseURL}${url}`, mockResponse)
      return fxios.get(url).then(res => {
        expect(res.originalData).toEqual(mockResponse.data)
        expect(res.dataSource).toEqual(mockResponse.data.entities)
        expect(res.pagination).toEqual({
          total: 0,
        })
      })
    })
  })

  // test('测试未登录跳转', () => {
  //   const url = 'user/me'
  //   global.location.href = '/'
  //   expect(global.location.href).not.toEqual(config.loginHost)
  //   const res = new global.Response(
  //     {},
  //     {
  //       url: config.loginHost,
  //       type: 'opaqueredirect',
  //       redirected: false,
  //       status: 0,
  //       ok: false,
  //     },
  //   )
  //   res.type = 'opaqueredirect'
  //   fetchMock.get(`${config.baseURL}${url}`, res)
  //   return fxios.get(url).then(result => {
  //     // expect(global.location.href).toEqual(config.loginHost)
  //     expect(result).toBe(null)
  //   })
  // })

  test('测试失败的请求', () => {
    const url = 'user/me'
    global.location.href = '/'
    expect(global.location.href).not.toEqual(config.loginHost)
    const res = new global.Response(
      {},
      {
        url: config.loginHost,
        type: 'opaqueredirect',
        redirected: false,
        status: 0,
        ok: false,
      },
    )
    res.ok = false
    fetchMock.get(`${config.baseURL}${url}`, res)
    // fxios.interceptor.catch.push()
    return fxios.get(url).catch(error => {
      // expect(global.location.href).toEqual(config.loginHost)
      expect(error).toBeInstanceOf(Error)
    })
  })

  test('测试请求成功，但返回失败状态码', () => {
    const url = 'user/me'
    fetchMock.get(`${config.baseURL}${url}`, {
      code: 400,
      message: 'error',
    })
    return fxios.get(url).catch(err => {
      expect(err).toBeInstanceOf(Error)
    })
  })

  it('非get请求会发送success事件', async () => {
    const url = 'user'
    fetchMock.post(`${config.baseURL}${url}`, {
      code: 200,
    })
    fetchMock.get(`${config.baseURL}${url}`, {
      code: 200,
    })
    const spy = jest.fn()
    fxios.once('success', spy)
    await fxios.post(url)
    expect(spy).toHaveBeenCalledTimes(1)
    await fxios.get(url)
    expect(spy).toHaveBeenCalledTimes(1)
  })

  test('测试fxios catch的emit功能', () => {
    const url = 'user/me'
    fetchMock.get(`${config.baseURL}${url}`, {
      code: 400,
      message: 'error',
    })
    const fn = jest.fn()
    // fxios.interceptor.catch.push(fn)
    expect(fn).not.toHaveBeenCalled()
    fxios.on('error', fn)
    return fxios.get(url).catch(() => {
      expect(fn).toHaveBeenCalled()
      fxios.removeListener('error', fn)
    })
  })
})
