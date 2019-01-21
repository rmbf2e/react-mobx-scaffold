import URL from 'url'
import { Button, Form } from 'antd'
import React from 'react'
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'
import forEach from 'lodash/forEach'
import reduce from 'lodash/reduce'
// import LocaleReceiver from 'antd/lib/locale-provider/LocaleReceiver'
import isEmptyQuery from 'tool/isEmptyQuery'
import config from 'src/config'
import { parseMoment, formatMoment } from 'tool/moment'
import promisify from 'tool/promisify'

/*
 * 该组件解决的几个问题
 * 1、搜索表单onSubmit时自动获取里面所有选项的值对象
 * 2、通过添加<input type="submit" />隐藏项目，自动添加表单内键盘回车提交功能
 * 3、在搜索时自动添加表单级别遮照层，并在搜索完成后自动解除
 * 4、在提交时自动过滤掉空值
 *
 * 使用方法：
 * 在组件中使用QueryForm代替antd的Form
 * 将应用组件使用antd的Form.create()修饰，然后将props.form传递给QueryForm的prop
 * 默认提交时会带page参数为1，可通过prop withPagination={false}取消该行为
 * 提交表单时，表单项name以Time结尾的被格式化为时间格式字符串
 *
 * beforeSubmit属性：应返回promise的函数，当promise reject时则阻止本次提交
 * 🈲 该组件会接管url上的query管理，因此一个页面上同时只能存在一个实例，如果一个页面上有多个搜索表单，其他表单请用普通的antd Form。
 */
@inject('store')
@observer
class QueryForm extends React.Component {
  // 当路由切换时，pathname变化，当前组件会被卸载，比较pathname来决定是否执行props.onSubmit
  pathname = ''

  static propTypes = {
    form: PropTypes.shape({
      getFieldsValue: PropTypes.func,
      setFieldsValue: PropTypes.func,
    }).isRequired,
    store: PropTypes.shape({
      router: PropTypes.object,
      queryForm: PropTypes.object,
    }).isRequired,
    children: PropTypes.node.isRequired,
    onSubmit: PropTypes.func.isRequired,
    beforeSubmit: PropTypes.func,
    withPagination: PropTypes.bool,
  }

  // 默认提交时带分页参数
  static defaultProps = {
    withPagination: true,
    beforeSubmit: null,
  }

  // 从querystring上取值并回填回表单
  componentDidMount() {
    // history.listen 在页面载入时不会执行，在之后的history变化才会
    // history.subscribe 在页面载入时就会执行一次
    const {
      store: { router },
    } = this.props
    this.pathname = router.location.pathname
    this.backfillFromQuery()
    this.stopListenHistory = router.history.listen(() => {
      const {
        form,
        store: {
          router: {
            query,
            location: { pathname },
          },
          queryForm,
        },
        onSubmit,
      } = this.props
      const formValues = reduce(
        form.getFieldsValue(),
        (r, v, k) =>
          // 当query中没有表单对应的项时
          // 设置为undefined才能将表单中的值清空
          ({
            ...r,
            [k]: Object.prototype.hasOwnProperty.call(query, k)
              ? parseMoment(query[k])
              : undefined,
          }),
        {},
      )
      // 将表单value与store中的query同步
      queryForm.query = this.compactFormValues(formValues)
      form.setFieldsValue(formValues)
      if (pathname === this.pathname) {
        onSubmit()
      }
    })
  }

  componentWillUnmount() {
    this.stopListenHistory()
  }

  // 组件第一次加载时从query回填表单
  // 如果表单有默认值则不被query覆盖
  backfillFromQuery = () => {
    const {
      store: { router, queryForm },
      form,
      onSubmit,
    } = this.props
    const { query } = router
    const formValues = reduce(
      form.getFieldsValue(),
      (r, v, k) => {
        // 第一次页面载入，有默认值则按表单默认值算
        const isInQuery = Object.prototype.hasOwnProperty.call(query, k)
        if (v !== undefined && !isInQuery) {
          return {
            ...r,
            [k]: v,
          }
        }
        return {
          ...r,
          [k]: isInQuery ? parseMoment(query[k]) : v,
        }
      },
      {},
    )
    // 将表单value与store中的query同步
    queryForm.query = this.compactFormValues(formValues)
    // queryForm.setQuery(this.compactFormValues(formValues))
    form.setFieldsValue(formValues)
    onSubmit()
  }

  beforeSubmit = () => {
    const { form } = this.props
    return promisify(form.validateFields)()
  }

  onSubmit = async e => {
    e.preventDefault()
    const {
      form,
      beforeSubmit,
      store: {
        router: { push, location, query },
      },
      withPagination,
    } = this.props
    let isFormValid = true
    try {
      if (beforeSubmit) {
        await beforeSubmit()
      } else {
        await this.beforeSubmit()
      }
    } catch {
      isFormValid = false
    }
    if (!isFormValid) {
      return
    }
    const formValues = form.getFieldsValue()
    // 若当前页面取消了某项搜索条件，则删除在query中对应的键
    forEach(
      query,
      (v, k) => {
        if (
          Object.prototype.hasOwnProperty.call(formValues, k) &&
          (!formValues[k] || isEmptyQuery(formValues[k])) &&
          k in query
        ) {
          delete query[k]
        }
      },
      {},
    )
    const values = this.compactFormValues(formValues)
    if (withPagination) {
      values.page = 1
      values.pageSize = query.pageSize || config.pageSize
    }
    push({
      search: URL.format({ query: { ...query, ...values } }),
      hash: location.hash,
    })
  }

  // 过滤掉空值
  compactFormValues = formValues => {
    const values = reduce(
      formValues,
      (r, v, k) => {
        if (!isEmptyQuery(v)) {
          // 根据搜索条件是否以Time结尾判断是否应该格式化成时间
          // 默认格式化为日期
          return {
            ...r,
            [k]: formatMoment(v, k.endsWith('Time')),
          }
        }
        return r
      },
      {},
    )
    return values
  }

  render() {
    const {
      store: { locale },
    } = this.props
    const {
      store,
      form,
      onSubmit,
      beforeSubmit,
      children,
      withPagination,
      ...props
    } = this.props
    return (
      <Form onSubmit={this.onSubmit} {...props}>
        {children}
        <input type="submit" className="hidden" />
        <Form.Item>
          <Button type="primary" htmlType="submit">
            {locale.lang.QueryForm.search}
          </Button>
        </Form.Item>
      </Form>
    )
  }
}
export default QueryForm
