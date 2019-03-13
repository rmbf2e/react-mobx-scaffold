import { FxiosRequestOption } from 'fxios/typings/index'
import { castArray, upperFirst } from 'lodash'
import { action, extendObservable, toJS } from 'mobx'
import config from 'src/config'
import { router } from 'store/router'
import { fxios } from 'tool/fxios'
import URL from 'url'
import {
  IExtendableObject,
  IList,
  IListOption,
  IRecord,
  TableProps,
} from './interface'

// 动态获取分页值
const getPage = (isDrivenByQuery?: boolean) => {
  if (isDrivenByQuery) {
    const { query } = router
    return {
      current: Number(query.page || 1),
      pageSize: Number(query.pageSize || config.pageSize),
    }
  }
  return {
    current: 1,
    pageSize: config.pageSize,
  }
}

/*
 * 生成被修饰Class的[name]属性
 * 与`fetch${upperFirst(name)}`方法
 * 与`restore${upperFirst(name)}`方法
 * 针对列表与分页处理使用
 * 使用page字段作为query中的分页数
 * 使用pageSize字段作为query中的每页显示数
 * 该组件与component/QueryForm,store/router耦合
 *
 * 例如options为
    [{
      name: 'list', // 必须，生成属性与方法的名称
      rowKey: 'id', // 必须，传给Table组件的rowKey
      url: '/autoPricingPool/list', // 必须，获取数据的url，使用GET方法获取数据
      rowSelectionKey: 'id', // 可选，若需要选择table中的行数据，则指定，指定后可在生成的list属性中的checkedKeys数组中获取选中的key数组
      ，可从通过生成的list属性checkedRecords获取选中的对象
      processResponse: func // 可选，在列表数组不符合要求时，可对其进行预处理
      request: (url, query) => Promise // func, 通常使用fxios.get
      isDrivenByQuery?: boolean，// 默认为true，当作为modal层内列表使用时，置为false取消与query的关联
    }]
 * 则生成属性 list，具体数据结构参考下面的list局部变量
 * 生成方法 fetchList，调用request属性函数并返回
 * 生成方法 setList方法，设置store.list.dataSource与pagination属性
 * 生成方法 setListLoading方法，设置store.list.tableProps.loading属性
 * 生成方法 restoreList，将列表数据恢复为初始状态
 *
 * @param {Array} options
 * @return void
 * */
function generateList(this: IExtendableObject, options: IListOption[]) {
  castArray(options).forEach(option => {
    const { name } = option
    const isDrivenByQuery: boolean =
      option.isDrivenByQuery === undefined ? true : option.isDrivenByQuery
    const upperName = upperFirst(name)
    const fetchMethod = `fetch${upperName}`
    const restoreMethod = `restore${upperName}`
    const setMethod = `set${upperName}`
    const setLoading = `set${upperName}Loading`
    const list: IList = {
      isDrivenByQuery,
      tableProps: {
        bordered: true,
        dataSource: [],
        loading: true,
        onRow: (record: { className?: string; [key: string]: any }) => ({
          className: record.className,
        }),
        pagination: {
          defaultPageSize: config.pageSize,
          showSizeChanger: true,
          ...getPage(isDrivenByQuery),
          onChange: action('pagination', page => {
            this[name].tableProps.pagination.current = page
            if (isDrivenByQuery) {
              router.push({
                hash: router.location.hash,
                search: URL.format({
                  query: { ...toJS(router.query), page },
                }),
              })
            } else {
              this[fetchMethod]()
            }
          }),
          onShowSizeChange: action(
            'onShowSizeChange',
            (currentSize: number, size: number) => {
              // config.pageSize = size
              const { pagination } = this[name].tableProps
              pagination.pageSize = size
              pagination.page = 1
              config.pageSize = size
              if (isDrivenByQuery) {
                router.push({
                  hash: router.location.hash,
                  search: URL.format({
                    query: { ...toJS(router.query), page: 1, pageSize: size },
                  }),
                })
              } else {
                this[fetchMethod]()
              }
            },
          ),
          pageSizeOptions: config.pageSizeOptions,
          showTotal: (total: number) => `共${total}条记录`,
          total: 0,
        },
        rowKey: option.rowKey,
      },
    }
    if (option.rowSelectionKey !== undefined) {
      const rowSelectionKey = option.rowSelectionKey
      list.tableProps.rowSelection = {
        getCheckboxProps: (record: IRecord): any => {
          return { [rowSelectionKey]: record[rowSelectionKey] }
        },
        onChange: action(
          'changeSelectKeys',
          (keys: Array<keyof IRecord>, records: IRecord[]) => {
            this[name].tableProps.rowSelection.selectedRowKeys = keys
            this[name].checkedKeys = keys
            this[name].checkedRecords = records
          },
        ),
        selectedRowKeys: [],
      }
      list.checkedKeys = []
      list.checkedRecords = []
      Object.defineProperty(list, 'hasCheckedKeys', {
        enumerable: true,
        get(): boolean {
          return this.checkedKeys.length > 0
        },
      })
    }
    extendObservable(
      this,
      {
        [name]: list,
        [fetchMethod]: (query?: object) => {
          this[setLoading](true)
          /* 将antd Table的pagination属性映射为后端需要的分页属性
           * current => page
           * pageSize => pageSize
           * 并附加搜索参数
           * */
          // this[name].tableProps.dataSource = []
          const request = option.request || fxios.get
          const pagination = getPage(isDrivenByQuery)
          let fxiosOption: FxiosRequestOption = {
            query: {
              page: String(pagination.current),
              pageSize: String(pagination.pageSize),
              ...router.query,
              ...query,
            },
          }
          if (option.interceptor && option.interceptor.request) {
            ;[option.url, fxiosOption] = option.interceptor.request.call(
              this,
              option.url,
              fxiosOption,
            )
          }
          return request(option.url, fxiosOption)
            .then(this[setMethod])
            .finally(() => {
              this[setLoading](false)
            })
        },
        [restoreMethod]: () => {
          const observedList = this[name]
          observedList.tableProps.dataSource = []
          observedList.tableProps.pagination.current = 1
          observedList.tableProps.pagination.total = 0
          if (option.rowSelectionKey) {
            observedList.tableProps.rowSelection.selectedRowKeys = []
            observedList.checkedKeys = []
            observedList.checkedRecords = []
          }
        },
        [setMethod]: (data: TableProps<object>) => {
          let newData = data
          if (option.interceptor && option.interceptor.response) {
            newData = option.interceptor.response.call(this, data)
          }
          const observedList = this[name]
          Object.assign(observedList.tableProps, {
            dataSource: newData.dataSource,
            pagination: {
              ...observedList.tableProps.pagination,
              ...newData.pagination,
              pageSize: config.pageSize,
            },
          })
          if (option.rowSelectionKey) {
            observedList.tableProps.rowSelection.selectedRowKeys = []
            observedList.checkedKeys = []
            observedList.checkedRecords = []
          }
          return newData
        },
        [setLoading]: (loading: boolean) => {
          this[name].tableProps.loading = loading
        },
      },
      {
        [fetchMethod]: action,
        [restoreMethod]: action,
        [setMethod]: action,
        [setLoading]: action,
      },
    )
  })
}

export { generateList as list }