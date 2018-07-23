import fetchMock from 'fetch-mock'
import list from 'storeProp/list'
import url from 'url'
import config from 'app/config'
import router from 'store/router'

const defaultResponse = {
  code: 200,
}

// jest.mock('app/storeProp')
describe('storeProp/list', () => {
  const option = {
    name: 'promotions',
    rowKey: 'id',
    url: 'promotions',
  }
  // const fn = jest.fn()
  class A {
    constructor() {
      list.call(this, [option])
    }
  }
  // with rowSelectionKey
  class B {
    constructor() {
      list.call(this, [
        {
          ...option,
          rowSelectionKey: 'id',
        },
      ])
    }
  }
  const a = new A()
  const b = new B()

  it('list shape without rowSelection', () => {
    expect('search' in a.promotions).toBeTruthy()
    const { tableProps } = a.promotions
    expect(tableProps.rowKey).toBe(option.rowKey)
    expect(tableProps.dataSource).toEqual([])
    expect(tableProps.loading).toBe(true)
    expect(tableProps.bordered).toBe(true)
    const { pagination } = tableProps
    expect(pagination.showSizeChanger).toBe(true)
    expect(pagination.defaultPageSize).toBe(config.pageSize)
    expect(pagination.pageSizeOptions).toEqual(config.pageSizeOptions)
    expect(pagination.current).toBe(1)
    expect(typeof pagination.onShowSizeChange).toBe('function')
    expect(pagination.pageSize).toBe(config.pageSize)
    expect(pagination.total).toBe(0)
    expect(typeof pagination.showTotal).toBe('function')
    expect(typeof pagination.onChange).toBe('function')

    expect('rowSelection' in tableProps).not.toBe(true)
    expect('checkedKeys' in a.promotions).not.toBe(true)
    expect('checkedRecords' in a.promotions).not.toBe(true)
    expect('hasCheckedKeys' in a.promotions).not.toBe(true)
  })

  it('list shape with rowSelection', () => {
    const { promotions } = b
    const { tableProps } = promotions
    expect(promotions.checkedKeys).toEqual([])
    expect(promotions.checkedRecords).toEqual([])
    expect(promotions.hasCheckedKeys).toBe(false)
    const { rowSelection } = tableProps
    expect(typeof rowSelection.getCheckboxProps).toBe('function')
    expect(rowSelection.selectedRowKeys).toEqual([])
    expect(typeof rowSelection.onChange).toBe('function')
  })

  it('测试 setSearch的方法', () => {
    expect(a.promotions.search).toEqual({})
    const search = { pid: 112 }
    a.setPromotionsSearch(search)
    expect(a.promotions.search).toEqual(search)
    // 回复原搜索条件
    a.setPromotionsSearch({})
  })

  describe('模拟获取接口数据', () => {
    // beforeEach(() => {
    //   moxios.install(ajax)
    // })

    afterEach(() => {
      fetchMock.restore()
    })

    const data = {
      entities: [
        {
          id: 1,
          name: 'a',
        },
        {
          id: 2,
          name: 'b',
        },
      ],
      pageNo: 30,
      entityCount: 22,
    }
    it('test fetch list without rowSelectionKey', () => {
      const u = url.format({
        pathname: config.baseURL + option.url,
        query: { pageNo: 1, pageSize: config.pageSize },
      })
      fetchMock.get(u, {
        ...defaultResponse,
        data,
      })
      return a.fetchPromotions().then(() => {
        const { tableProps } = a.promotions
        expect(tableProps.dataSource).toEqual(data.entities)
        const { pagination } = tableProps
        expect(pagination.current).toBe(data.pageNo)
        expect(pagination.total).toBe(data.entityCount)

        const search = { name: 'abc' }
        a.promotions.search = search
        expect(a.promotions.search).toEqual(search)
        a.restorePromotions()
        expect(a.promotions.search).toEqual({})
        expect(tableProps.dataSource).toEqual([])
        expect(pagination.current).toBe(1)
        expect(pagination.total).toBe(0)
      })
    })

    it('test fetch list with rowSelectionKey', () => {
      const u = url.format({
        pathname: config.baseURL + option.url,
        query: { pageNo: 1, pageSize: config.pageSize },
      })
      fetchMock.get(u, {
        ...defaultResponse,
        data,
      })
      expect(b.promotions.tableProps.rowSelection.getCheckboxProps({
          id: 2222,
        })).toBe(2222)
      return b.fetchPromotions().then(() => {
        const { tableProps } = b.promotions
        expect(tableProps.dataSource).toEqual(data.entities)
        const { pagination } = tableProps
        expect(pagination.current).toBe(data.pageNo)
        expect(pagination.total).toBe(data.entityCount)

        // 模拟选择数据
        const { onChange } = b.promotions.tableProps.rowSelection
        const ids = data.entities.map(d => d.id)
        onChange(ids, data.entities)
        const { promotions } = b
        expect(promotions.checkedKeys).toEqual(ids)
        expect(promotions.tableProps.rowSelection.selectedRowKeys).toEqual(ids)
        expect(promotions.checkedRecords).toEqual(data.entities)
        expect(promotions.hasCheckedKeys).toBe(true)

        // restore后选择的数据应为空
        const search = { name: 'abc' }
        b.promotions.search = search
        expect(b.promotions.search).toEqual(search)
        b.restorePromotions()
        expect(b.promotions.search).toEqual({})
        expect(tableProps.dataSource).toEqual([])
        expect(pagination.current).toBe(1)
        expect(pagination.total).toBe(0)

        expect(promotions.checkedKeys).toEqual([])
        expect(promotions.tableProps.rowSelection.selectedRowKeys).toEqual([])
        expect(promotions.checkedRecords).toEqual([])
        expect(promotions.hasCheckedKeys).toBe(false)
      })
    })

    it('测试搜索对象中有数组的情况，数组的条件也必须导入到url中', () => {
      const search = { name: ['a', 'b'] }
      const u = url.format({
        pathname: config.baseURL + option.url,
        query: { pageNo: 1, pageSize: config.pageSize, ...search },
      })
      fetchMock.get(u, {
        ...defaultResponse,
        data,
      })
      b.promotions.search = search
      return b.fetchPromotions().then(() => {
        expect(fetchMock.lastCall()[0].url).toEqual(u)
      })
    })

    it('测试分页', () => {
      expect(router.query.pageNo).toBe(undefined)
      expect(router.query.pageSize).toBe(undefined)
      a.promotions.tableProps.pagination.onChange(2)
      expect(router.query.pageNo).toBe('2')
      a.promotions.tableProps.pagination.onShowSizeChange(null, 29)
      expect(router.query.pageSize).toBe('29')
      expect(a.promotions.tableProps.pagination.showTotal(123)).toBe('共123条记录')
      router.push('/')
    })

    it('测试接口数据处理函数', () => {
      const fn = jest.fn(res => {
        res.dataSource = res.dataSource.map(d => ({
          ...d,
          age: 3,
        }))
        return res
      })

      class C {
        constructor() {
          list.call(this, [
            {
              ...option,
              rowSelectionKey: 'id',
              processResponse: fn,
            },
          ])
        }
      }
      const c = new C()
      const u = url.format({
        pathname: config.baseURL + option.url,
        query: { pageNo: 1, pageSize: config.pageSize },
      })
      fetchMock.get(u, {
        ...defaultResponse,
        data,
      })
      return c.fetchPromotions().then(res => {
        expect(fn.mock.calls).toHaveLength(1)
        // console.log(res)
        expect(res.dataSource).toHaveLength(2)
        expect(res.dataSource[0].age).toBe(3)
        expect(res.dataSource[1].age).toBe(3)
      })
    })
  })
})
