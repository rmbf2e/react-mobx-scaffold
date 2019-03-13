import { router } from 'store/router'
import { list } from 'extendStore/list'
import config from 'src/config'
import { fxios } from 'tool/fxios'

const resolve = (v: any) => () => Promise.resolve(v)

// jest.mock('app/extendStore')
describe('extendStore/list', () => {
  const option = {
    name: 'promotions',
    rowKey: 'id',
    url: 'promotions',
  }

  // 抽象接口，定义extendStore的扩展接口
  abstract class AA {
    promotions: any
    fetchPromotions: (v?: any) => Promise<any>
    setPromotions: (v: any) => void
    setPromotionsLoading: (v: boolean) => void
    restorePromotions: () => void
  }

  class A extends AA {
    constructor() {
      super()
      list.call(this, [option])
    }
  }
  // with rowSelectionKey
  class B extends AA {
    constructor() {
      super()
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

  beforeEach(() => {
    config.pageSize = 10
  })

  it('没有rowSelection时的生成的属性与方法', () => {
    const { tableProps } = a.promotions
    expect(tableProps.rowKey).toBe(option.rowKey)
    expect(tableProps.dataSource).toEqual([])
    expect(tableProps.loading).toBe(true)
    expect(tableProps.bordered).toBe(true)
    expect(tableProps.onRow({ className: 'abc', xxx: 111 })).toEqual({
      className: 'abc',
    })
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
    expect(typeof a.setPromotions).toBe('function')
    expect(typeof a.setPromotionsLoading).toBe('function')

    expect('rowSelection' in tableProps).not.toBe(true)
    expect('checkedKeys' in a.promotions).not.toBe(true)
    expect('checkedRecords' in a.promotions).not.toBe(true)
    expect('hasCheckedKeys' in a.promotions).not.toBe(true)
  })

  it('测试setLoading', done => {
    expect(a.promotions.tableProps.loading).toBe(true)
    a.setPromotionsLoading(false)
    expect(a.promotions.tableProps.loading).toBe(false)

    jest.spyOn(fxios, 'get').mockImplementation(() =>
      Promise.resolve({
        list: [],
        page: 3,
        total: 1000,
        pageSize: 23,
      }),
    )
    expect(a.promotions.tableProps.loading).toBe(false)
    a.fetchPromotions().then(() => {
      expect(a.promotions.tableProps.loading).toBe(false)
      done()
    })
    expect(a.promotions.tableProps.loading).toBe(true)
  })

  it('有rowSelection时的一些方法', () => {
    const { promotions } = b
    const { tableProps } = promotions
    expect(promotions.checkedKeys).toEqual([])
    expect(promotions.checkedRecords).toEqual([])
    expect(promotions.hasCheckedKeys).toBe(false)
    const { rowSelection } = tableProps
    // expect(typeof rowSelection.getCheckboxProps).toBe('function')
    expect(rowSelection.selectedRowKeys).toEqual([])
    expect(typeof rowSelection.onChange).toBe('function')
  })

  describe('模拟获取接口数据', () => {
    const data = {
      dataSource: [
        {
          id: 1,
          name: 'a',
        },
        {
          id: 2,
          name: 'b',
        },
      ],
      pagination: {
        current: 1,
        pageSize: 10,
        total: 22,
      },
    }
    it('test fetch list without rowSelectionKey', () => {
      jest.spyOn(fxios, 'get').mockImplementation(resolve(data))
      return a.fetchPromotions().then(() => {
        const { tableProps } = a.promotions
        expect(tableProps.dataSource).toEqual(data.dataSource)
        const { pagination } = tableProps
        expect(pagination.current).toBe(data.pagination.current)
        expect(pagination.total).toBe(data.pagination.total)

        a.restorePromotions()
        expect(tableProps.dataSource).toEqual([])
        expect(pagination.current).toBe(1)
        expect(pagination.total).toBe(0)
      })
    })

    it('test fetch list with rowSelectionKey', () => {
      jest.spyOn(fxios, 'get').mockImplementation(resolve(data))
      // expect(
      //   b.promotions.tableProps.rowSelection.getCheckboxProps({
      //     id: 2222,
      //   }),
      // ).toEqual({ id: 2222 })
      return b.fetchPromotions().then(() => {
        const { tableProps } = b.promotions
        expect(tableProps.dataSource).toEqual(data.dataSource)
        const { pagination } = tableProps
        expect(pagination.current).toBe(data.pagination.current)
        expect(pagination.total).toBe(data.pagination.total)

        // 模拟选择数据
        const { onChange } = b.promotions.tableProps.rowSelection
        const ids = data.dataSource.map(d => d.id)
        onChange(ids, data.dataSource)
        const { promotions } = b
        expect(promotions.checkedKeys).toEqual(ids)
        expect(promotions.tableProps.rowSelection.selectedRowKeys).toEqual(ids)
        expect(promotions.checkedRecords).toEqual(data.dataSource)
        expect(promotions.hasCheckedKeys).toBe(true)

        // restore后选择的数据应为空
        b.restorePromotions()
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
      const query = { name: ['a', 'b'] }
      const spy = jest.spyOn(fxios, 'get').mockImplementation(resolve(data))
      return b.fetchPromotions(query).then(() => {
        expect(spy).toHaveBeenLastCalledWith(option.url, {
          query: {
            name: ['a', 'b'],
            page: '1',
            pageSize: String(config.pageSize),
          },
        })
      })
    })

    it('测试分页，当变换分页条数之后自动跳转回第一页，且config.pageSize不应变化', () => {
      expect(router.query.page).toBe(undefined)
      expect(router.query.pageSize).toBe(undefined)
      a.promotions.tableProps.pagination.onChange(2)
      expect(router.query.page).toBe('2')
      a.promotions.tableProps.pagination.onShowSizeChange(null, 29)
      expect(router.query.pageSize).toBe('29')
      expect(config.pageSize).toBe(config.pageSize)
      expect(router.query.page).toBe('1')
      expect(a.promotions.tableProps.pagination.showTotal(123)).toBe(
        '共123条记录',
      )
      expect(a.promotions.tableProps.pagination.current).toBe(1)
      router.push('/')
    })

    it('测试接口数据处理函数', () => {
      const fn = jest.fn(res => {
        res.dataSource = res.dataSource.map((d: any) => ({
          ...d,
          age: 3,
        }))
        return res
      })

      class C extends AA {
        constructor() {
          super()
          list.call(this, [
            {
              ...option,
              rowSelectionKey: 'id',
              interceptor: {
                response: fn,
              },
            },
          ])
        }
      }
      const c = new C()
      const spy = jest.spyOn(fxios, 'get').mockImplementation(resolve(data))
      return c.fetchPromotions().then(res => {
        expect(spy).toHaveBeenCalledTimes(1)
        expect(res.dataSource).toHaveLength(2)
        expect(res.dataSource[0].age).toBe(3)
        expect(res.dataSource[1].age).toBe(3)
      })
    })

    it('fetch参数，没有request则默认使用fxios.get', () => {
      jest.spyOn(fxios, 'get').mockImplementation(resolve(data))
      class C extends AA {
        constructor() {
          super()
          list.call(this, [
            {
              name: 'promotions',
              rowKey: 'id',
              url: 'promotions',
            },
          ])
        }
      }
      const c = new C()
      return c.fetchPromotions().then(res => {
        expect(res.dataSource).toHaveLength(2)
      })
    })
  })

  it('不与query关联时，isDrivenByQuery = false', () => {
    class C extends AA {
      constructor() {
        super()
        list.call(this, [
          {
            ...option,
            independent: true,
          },
        ])
      }
    }
    router.push('?page=3')

    const a1 = new A()
    const c = new C()
    expect(a1.promotions.tableProps.pagination.current).toBe(3)
    expect(c.promotions.tableProps.pagination.current).toBe(1)

    const routerSpy = jest.spyOn(router, 'push')
    const fetchSpy = jest.spyOn(fxios, 'get').mockImplementation(() =>
      Promise.resolve({
        list: [],
        page: 3,
        total: 1000,
        pageSize: 23,
      }),
    )
    c.promotions.tableProps.pagination.onChange(3)
    expect(c.promotions.tableProps.pagination.current).toBe(3)
    expect(c.promotions.tableProps.pagination.pageSize).toBe(config.pageSize)
    expect(fetchSpy).toHaveBeenCalledTimes(1)
    expect(fetchSpy).toHaveBeenLastCalledWith('promotions', {
      query: {
        page: '3',
        pageSize: String(config.pageSize),
      },
    })
    expect(routerSpy).not.toHaveBeenCalled()

    c.promotions.tableProps.pagination.onShowSizeChange(null, 73)
    expect(c.promotions.tableProps.pagination.current).toBe(1)
    expect(c.promotions.tableProps.pagination.pageSize).toBe(73)
    expect(fetchSpy).toHaveBeenCalledTimes(2)
    expect(fetchSpy).toHaveBeenLastCalledWith('promotions', {
      query: {
        page: '1',
        pageSize: '73',
      },
    })
  })
})
