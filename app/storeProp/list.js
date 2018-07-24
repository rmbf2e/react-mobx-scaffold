import url from 'url'
import fxios from 'util/fxios'
import { action, extendObservable, toJS } from 'mobx'
import upperFirst from 'lodash/upperFirst'
import castArray from 'lodash/castArray'
import pluralize from 'pluralize'
import router from 'store/router'
import config from 'app/config'

// 动态获取分页值
const getPage = () => {
  const { query } = router
  return {
    current: Number(query.pageNo || 1),
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
      name: 'group', // 必须，生成属性与方法的名称
      rowKey: 'id', // 必须，传给Table组件的rowKey
      url: '/autoPricingPool/list', // 必须，获取数据的url，使用GET方法获取数据
      rowSelectionKey: 'id', // 可选，若需要选择table中的行数据，则指定，指定后可在生成的list属性中的checkedKeys数组中获取选中的key数组
      ，可从通过生成的list属性checkedRecords获取选中的对象
      processResponse: func // 可选，在列表数组不符合要求时，可对其进行预处理
    }]
 * 则生成属性 groups(group的名词复数形式)，具体数据结构参考下面的list局部变量
 * 生成方法 fetchGroups，通过fxios从url获取数据
 * 生成方法 setGroupsSearch方法，设置store.groups.search属性
 * 生成方法 restoreGroups，将列表数据恢复为初始状态
 *
 * @param {Array} options
 * @return void
 * */
function generateList(options) {
  castArray(options).forEach(option => {
    const { name } = option
    const pluralName = pluralize(name)
    const upperName = upperFirst(pluralName)
    const fetchMethodName = `fetch${upperName}`
    const restoreMethodName = `restore${upperName}`
    const setSearchMethodName = `set${upperName}Search`
    const list = {
      search: {},
      tableProps: {
        rowKey: option.rowKey,
        dataSource: [],
        loading: true,
        bordered: true,
        pagination: {
          showSizeChanger: true,
          defaultPageSize: config.pageSize,
          pageSizeOptions: config.pageSizeOptions,
          ...getPage(),
          // current: router.query.pageNo || 1,
          // pageSize: router.query.pageSize || config.pageSize,
          onShowSizeChange: action('onShowSizeChange', (currentSize, size) => {
            config.pageSize = size
            this[pluralName].tableProps.pagination.pageSize = size
            router.push({
              search: url.format({
                query: { ...toJS(router.query), pageSize: size },
              }),
              hash: router.location.hash,
            })
            // this[fetchMethodName]()
          }),
          total: 0,
          showTotal: total => `共${total}条记录`,
          onChange: action('pagination', page => {
            this[pluralName].tableProps.pagination.current = page
            router.push({
              search: url.format({
                query: { ...toJS(router.query), pageNo: page },
              }),
              hash: router.location.hash,
            })
            // this[fetchMethodName](page)
          }),
        },
      },
    }
    if (option.rowSelectionKey) {
      list.tableProps.rowSelection = {
        getCheckboxProps: record => record[option.rowSelectionKey],
        selectedRowKeys: [],
        onChange: action('changeSelectKeys', (keys, records) => {
          this[pluralName].tableProps.rowSelection.selectedRowKeys = keys
          this[pluralName].checkedKeys = keys
          this[pluralName].checkedRecords = records
        }),
      }
      list.checkedKeys = []
      list.checkedRecords = []
    }
    extendObservable(
      this,
      {
        [pluralName]: list,
        [setSearchMethodName]: search => {
          this[pluralName].search = search
        },
        [fetchMethodName]: () => {
          const page = getPage()
          this[pluralName].tableProps.loading = true
          const search = toJS(this[pluralName].search)
          /* 将antd Table的pagination属性映射为后端需要的分页属性
          * current => pageNo
          * pageSize => pageSize
          * 并附加搜索参数
          * */
          this[pluralName].tableProps.dataSource = []
          return fxios
            .get(option.url, {
              pageNo: page.current,
              pageSize: page.pageSize,
              // pageNo and pageSize in search can overwrite the values above
              ...search,
            })
            .then(action(`set${pluralName}`, data => {
                if (option.processResponse) {
                  data = option.processResponse(data)
                }
                Object.assign(this[pluralName].tableProps, {
                  dataSource: data.dataSource,
                  pagination: {
                    ...this[pluralName].tableProps.pagination,
                    ...data.pagination,
                  },
                })
                if (option.rowSelectionKey) {
                  this[pluralName].tableProps.rowSelection.selectedRowKeys = []
                  this[pluralName].checkedKeys = []
                  this[pluralName].checkedRecords = []
                }
                return data
              }))
            .finally(action('stopFetchListLoading', () => {
                this[pluralName].tableProps.loading = false
              }))
        },
        [restoreMethodName]: () => {
          const observedList = this[pluralName]
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
      },
      {
        [setSearchMethodName]: action,
        [fetchMethodName]: action,
        [restoreMethodName]: action,
      },
    )
    if (option.rowSelectionKey) {
      extendObservable(this[pluralName], {
        get hasCheckedKeys() {
          return this.checkedKeys.length > 0
        },
      })
    }
  })
}

export default generateList
