import URL from 'url'
import { action, extendObservable, toJS } from 'mobx'
import upperFirst from 'lodash/upperFirst'
import castArray from 'lodash/castArray'
import config from 'src/config'
import fxios from 'tool/fxios'
import router from 'store/router'

// 动态获取分页值
const getPage = () => {
  const { query } = router
  return {
    current: Number(query.page || 1),
    pageSize: Number(query.pageSize || config.pageSize),
  }
}

/*
 * 生成被修饰Class的 name的名词复数化属性
 * 与`fetch${upperFirst(name的名词复数化)}`方法
 * 与`restore${upperFirst(name的名词复数化)}`方法
 * 针对列表与分页处理使用
 *
 * 例如options为
    [{
      name: 'groups', // 必须，生成属性与方法的名称
      rowKey: 'id', // 必须，传给Table组件的rowKey
      url: '/autoPricingPool/list', // 必须，获取数据的url，使用GET方法获取数据
      rowSelectionKey: 'id', // 可选，若需要选择table中的行数据，则指定，指定后可在生成的list属性中的checkedKeys数组中获取选中的key数组
      ，可从通过生成的list属性checkedRecords获取选中的对象
      processResponse: func // 可选，在列表数组不符合要求时，可对其进行预处理
      request: (url, query) => Promise // func, 通常使用fxios.get
    }]
 * 则生成属性 groups，具体数据结构参考下面的list局部变量
 * 生成方法 fetchGroups，调用request属性函数并返回
 * 生成方法 setGroupsSearch方法，设置store.groups.search属性
 * 生成方法 restoreGroups，将列表数据恢复为初始状态
 *
 * @param {Array} options
 * @return void
 * */
function generateList(options) {
  castArray(options).forEach(option => {
    const { name } = option
    const upperName = upperFirst(name)
    const fetchMethod = `fetch${upperName}`
    const restoreMethod = `restore${upperName}`
    const setSearchMethod = `set${upperName}Search`
    const setMethod = `set${upperName}`
    const setLoading = `set${upperName}Loading`
    const list = {
      search: {},
      tableProps: {
        rowKey: option.rowKey,
        onRow: record => ({ className: record.className }),
        dataSource: [],
        loading: true,
        bordered: true,
        pagination: {
          showSizeChanger: true,
          defaultPageSize: config.pageSize,
          pageSizeOptions: config.pageSizeOptions,
          ...getPage(),
          // current: router.query.page || 1,
          // pageSize: router.query.pageSize || config.pageSize,
          onShowSizeChange: action('onShowSizeChange', (currentSize, size) => {
            // config.pageSize = size
            const { pagination } = this[name].tableProps
            pagination.pageSize = size
            pagination.page = 1
            router.push({
              search: URL.format({
                query: { ...toJS(router.query), page: 1, pageSize: size },
              }),
              hash: router.location.hash,
            })
          }),
          total: 0,
          showTotal: total => `共${total}条记录`,
          onChange: action('pagination', page => {
            this[name].tableProps.pagination.current = page
            router.push({
              search: URL.format({
                query: { ...toJS(router.query), page },
              }),
              hash: router.location.hash,
            })
          }),
        },
      },
    }
    if (option.rowSelectionKey) {
      list.tableProps.rowSelection = {
        getCheckboxProps: record => record[option.rowSelectionKey],
        selectedRowKeys: [],
        onChange: action('changeSelectKeys', (keys, records) => {
          this[name].tableProps.rowSelection.selectedRowKeys = keys
          this[name].checkedKeys = keys
          this[name].checkedRecords = records
        }),
      }
      list.checkedKeys = []
      list.checkedRecords = []
    }
    extendObservable(
      this,
      {
        [name]: list,
        [setSearchMethod]: search => {
          this[name].search = search
        },
        [fetchMethod]: () => {
          const page = getPage()
          this[setLoading](true)
          const search = toJS(this[name].search)
          /* 将antd Table的pagination属性映射为后端需要的分页属性
          * current => page
          * pageSize => pageSize
          * 并附加搜索参数
          * */
          this[name].tableProps.dataSource = []
          const request = option.request || fxios.get
          return request(option.url, {
            page: page.current,
            pageSize: page.pageSize,
            // page and pageSize in search can overwrite the values above
            ...search,
          })
            .then(this[setMethod])
            .finally(
              action('stopFetchListLoading', () => {
                this[setLoading](false)
              }),
            )
        },
        [restoreMethod]: () => {
          const observedList = this[name]
          observedList.tableProps.dataSource = []
          observedList.tableProps.pagination.current = 1
          observedList.tableProps.pagination.total = 0
          observedList.search = {}
          if (option.rowSelectionKey) {
            observedList.tableProps.rowSelection.selectedRowKeys = []
            observedList.checkedKeys = []
            observedList.checkedRecords = []
          }
        },
        [setMethod]: data => {
          if (option.processResponse) {
            data = option.processResponse(data)
          }
          const observedList = this[name]
          Object.assign(observedList.tableProps, {
            dataSource: data.dataSource,
            pagination: {
              ...observedList.tableProps.pagination,
              ...data.pagination,
            },
          })
          if (option.rowSelectionKey) {
            observedList.tableProps.rowSelection.selectedRowKeys = []
            observedList.checkedKeys = []
            observedList.checkedRecords = []
          }
          return data
        },
        [setLoading]: loading => {
          this[name].tableProps.loading = loading
        },
      },
      {
        [setSearchMethod]: action,
        [fetchMethod]: action,
        [restoreMethod]: action,
        [setMethod]: action,
        [setLoading]: action,
      },
    )
    if (option.rowSelectionKey) {
      extendObservable(this[name], {
        get hasCheckedKeys() {
          return this.checkedKeys.length > 0
        },
      })
    }
  })
}

export default generateList
