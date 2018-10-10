import URL from 'url'
import React from 'react'
import PropTypes from 'prop-types'
import { Form, Button } from 'antd'
import { inject, observer } from 'mobx-react'
import forEach from 'lodash/forEach'
import reduce from 'lodash/reduce'
import isEmptyQuery from 'tool/isEmptyQuery'
import config from 'src/config'
import { parseMoment, formatMoment } from 'tool/moment'

/*
 * 该组件解决的几个问题
 * 1、搜索表单onSubmit时自动获取里面所有选项的值对象
 * 2、通过添加<input type="submit" />隐藏项目，自动添加表单内键盘回车提交功能
 * 3、在搜索时自动添加表单级别遮照层，并在搜索完成后自动解除
 * 4、在提交时自动过滤掉空值
 *
 * 使用方法：
 * 在组件中使用SearchForm代替antd的Form
 * 将应用组件使用antd的Form.create()修饰，然后将props.form传递给SearchForm的prop
 * 默认提交时会带page参数为1，可通过prop withPagination={false}取消该行为
 * 提交表单时，表单项name以Time结尾的被格式化为时间格式
 */
@inject('store')
@observer
class SearchForm extends React.Component {
  // 标记此次history push是否由submit引起，避免submit引起的history变更调用两次props.onSubmit
  pushedBySubmit = false

  // 当路由切换时，pathname变化，当前组件会被卸载，比较pathname来决定是否执行props.onSubmit
  pathname = ''

  static propTypes = {
    form: PropTypes.shape({
      getFieldsValue: PropTypes.func,
      setFieldsValue: PropTypes.func,
    }).isRequired,
    store: PropTypes.shape({
      router: PropTypes.object,
      searchForm: PropTypes.object,
    }).isRequired,
    children: PropTypes.node.isRequired,
    onSubmit: PropTypes.func.isRequired,
    withPagination: PropTypes.bool,
  }

  // 默认提交时带分页参数
  static defaultProps = {
    withPagination: true,
  }

  // 从querystring上取值并回填回表单
  componentDidMount() {
    // history.listen 在页面载入时不会执行，在之后的history变化才会
    // history.subscribe 在页面载入时就会执行一次
    const {
      store: { router },
    } = this.props
    this.pathname = router.location.pathname
    this.stopSubscribeHistory = router.history.subscribe(() => {
      const {
        form,
        store: {
          router: {
            query,
            location: { pathname },
          },
          searchForm,
        },
        onSubmit,
      } = this.props
      const formValues = reduce(
        form.getFieldsValue(),
        (r, v, k) => {
          if (k in query) {
            r[k] = parseMoment(query[k])
          } else {
            // 当query中没有表单对应的项时
            // 设置为undefined才能将表单中的值清空
            r[k] = undefined
          }
          return r
        },
        {},
      )
      // 将表单value与store中的query同步
      searchForm.query = this.compactFormValues(formValues)
      // searchForm.setQuery(this.compactFormValues(formValues))
      if (!this.pushedBySubmit) {
        form.setFieldsValue(formValues)
      }
      this.pushedBySubmit = false
      if (pathname === this.pathname) {
        onSubmit()
      }
    })
  }

  componentWillUnmount() {
    this.stopSubscribeHistory()
  }

  onSubmit = e => {
    e.preventDefault()
    this.pushedBySubmit = true
    const {
      form,
      // onSubmit,
      store: {
        router: { push, location, query },
      },
      withPagination,
    } = this.props
    const formValues = form.getFieldsValue()
    // 若当前页面取消了某项搜索条件，则删除在query中对应的键
    forEach(
      query,
      (v, k) => {
        if (
          k in formValues &&
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
          r[k] = formatMoment(v, k.endsWith('Time'))
        }
        return r
      },
      {},
    )
    return values
  }

  render() {
    const {
      store,
      form,
      onSubmit,
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
            搜索
          </Button>
        </Form.Item>
      </Form>
    )
  }
}
export default SearchForm
