/* eslint-disable jsx-a11y/anchor-is-valid */
import { Button, Col, Form, Row } from 'antd'
import { WrappedFormUtils } from 'antd/lib/form/Form'
import { forEach, reduce } from 'lodash'
import { inject, observer } from 'mobx-react'
import Moment from 'moment'
import React from 'react'
import config from 'src/config'
import { QueryFormStore } from 'store/interface'
import { Router as IRouterStore } from 'store/router'
import { isEmptyQuery } from 'tool/isEmptyQuery'
import { formatMoment, parseMoment } from 'tool/moment'
import { promisify } from 'tool/promisify'
import URL from 'url'
import s from './style.m.less'

interface IProp {
  store?: {
    router: IRouterStore
    queryForm: QueryFormStore
  }
  onSubmit: (e?: FocusEvent) => void
  withPagination?: boolean
  form: WrappedFormUtils
  children: React.ReactNode
  beforeSubmit?: () => Promise<any>
  [key: string]: any
}

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
 * 提交表单时，表单项name以Time结尾的被格式化为时间格式
 */
@inject('store')
@observer
export class QueryForm extends React.Component<IProp> {
  // 默认提交时带分页参数
  public static defaultProps = {
    withPagination: true,
    beforeSubmit: null,
  }
  // 标记此次history push是否由submit引起，避免submit引起的history变更调用两次props.onSubmit
  public pushedBySubmit = false

  // 当路由切换时，pathname变化，当前组件会被卸载，比较pathname来决定是否执行props.onSubmit
  public pathname = ''

  private stopSubscribeHistory!: () => void

  // 从querystring上取值并回填回表单
  public componentDidMount() {
    // history.listen 在页面载入时不会执行，在之后的history变化才会
    // history.subscribe 在页面载入时就会执行一次
    const { router, queryForm } = this.props.store!
    this.pathname = router.location.pathname
    this.backfillFromQuery()
    this.stopSubscribeHistory = router.history.listen(() => {
      const { form, onSubmit } = this.props
      const {
        query,
        location: { pathname },
      } = router
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

  public componentWillUnmount() {
    this.stopSubscribeHistory()
  }

  // 组件第一次加载时从query回填表单
  // 如果表单有默认值则不被query覆盖
  public backfillFromQuery = () => {
    const { router, queryForm } = this.props.store!
    const { form, onSubmit } = this.props
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

  public beforeSubmit = () => {
    const { form } = this.props
    return promisify<any>(form.validateFields)()
  }

  public onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    this.pushedBySubmit = true
    const { form, beforeSubmit, withPagination, store } = this.props
    const {
      router: { push, location, query },
    } = store!
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
      return false
    }
    const formValues = form.getFieldsValue()
    // 若当前页面取消了某项搜索条件，则删除在query中对应的键
    forEach(query, (v, k) => {
      if (
        Object.prototype.hasOwnProperty.call(formValues, k) &&
        (!formValues[k] || isEmptyQuery(formValues[k])) &&
        Object.prototype.hasOwnProperty.call(query, k)
      ) {
        delete query[k]
      }
    })
    const values: {
      [key: string]: any
    } = this.compactFormValues(formValues)
    if (withPagination) {
      values.page = 1
      values.pageSize = query.pageSize || config.pageSize
    }
    push({
      search: URL.format({ query: { ...query, ...values } }),
      hash: location.hash,
    })
    return isFormValid
  }

  // 过滤掉空值
  public compactFormValues = (formValues: {
    [key: string]: string | Moment.Moment
  }) => {
    const values = reduce(
      formValues,
      (r, v: any, k) => {
        const p: {
          [key: string]: string | Moment.Moment
        } = r
        if (!isEmptyQuery(v)) {
          // 根据搜索条件是否以Time结尾判断是否应该格式化成时间
          // 默认格式化为日期
          p[k] = formatMoment(v, k.endsWith('Time'))
        }
        return p
      },
      {},
    )
    return values
  }

  public render() {
    const {
      store,
      form,
      onSubmit,
      beforeSubmit,
      children,
      withPagination,
      ...props
    } = this.props

    const searchButton = (
      <Button type="primary" htmlType="submit">
        搜索
      </Button>
    )
    return (
      <Form onSubmit={this.onSubmit} {...props} className={s.form}>
        <Row type="flex">
          <Col span={22}>
            {children}
            <input type="submit" className="hidden" />
          </Col>
          <Col span={2} className={s.buttonWrapper}>
            {children ? <Form.Item>{searchButton}</Form.Item> : null}
          </Col>
        </Row>
      </Form>
    )
  }
}
