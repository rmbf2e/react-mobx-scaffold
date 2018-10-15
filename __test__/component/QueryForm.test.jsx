import url from 'url'
import React from 'react'
// import { toJS } from 'mobx'
import { mount } from 'enzyme'
import Moment from 'moment'
import { Input, Form, DatePicker, TimePicker } from 'antd'
import { Provider } from 'mobx-react'
import queryForm from 'store/queryForm'
import QueryForm from 'component/QueryForm'
import router from 'store/router'
import locale from 'store/locale'
import config from 'src/config'

const { RangePicker } = DatePicker
const store = {
  router,
  queryForm,
  locale,
}

const Comp = props => {
  const { form } = props
  return (
    <Provider store={store}>
      <QueryForm {...props}>
        {form.getFieldDecorator('firstName')(<Input />)}
        {form.getFieldDecorator('secondName')(<Input />)}
        {form.getFieldDecorator('firstDate')(<DatePicker />)}
        {form.getFieldDecorator('secondDate')(<DatePicker />)}
        {form.getFieldDecorator('rangeDate')(<RangePicker />)}
        {form.getFieldDecorator('firstTime')(<TimePicker />)}
        {form.getFieldDecorator('secondTime')(<TimePicker />)}
      </QueryForm>
    </Provider>
  )
}
const WrappedForm = Form.create()(Comp)

describe('components/QueryForm', () => {
  it('test onSubmit', () => {
    const hash = '#abc'
    router.push(hash)
    expect(router.location.hash).toBe(hash)
    const submit = jest.fn(() => Promise.resolve())
    const form = mount(<WrappedForm onSubmit={submit} />)
    const f = form.find('form')
    form
      .instance()
      .getForm()
      .setFieldsValue({
        firstName: 'first',
      })
    f.simulate('submit')
    expect(submit.mock.calls).toHaveLength(2)
    expect(router.query).toEqual({
      firstName: 'first',
      page: '1',
      pageSize: String(config.pageSize),
    })
    expect(router.location.hash).toBe(hash)
    // expect(form).toHaveText('搜索')
    expect(form.find('input.hidden[type="submit"]')).toExist()
    expect(form.find('button[type="submit"]')).toExist()
    // 将url状态复位
    router.push('/')
  })

  it('withPagination is false', () => {
    const hash = '#def'
    router.push(hash)
    expect(router.location.hash).toBe(hash)
    const submit = jest.fn(() => Promise.resolve())
    const form = mount(<WrappedForm onSubmit={submit} withPagination={false} />)
    const f = form.find('form')
    form
      .instance()
      .getForm()
      .setFieldsValue({
        firstName: 'last',
      })
    f.simulate('submit')
    expect(submit.mock.calls).toHaveLength(2)
    expect(router.query).toEqual({ firstName: 'last' })
    expect(router.location.hash).toBe(hash)
    router.push('/')
  })

  it('测试url中已有的，且与表单中内容不相关的query，不能在提交时不能被删除', () => {
    const originQuery = { nnn: 'ccc' }
    router.push({
      search: url.format({ query: originQuery }),
    })
    expect(router.query).toEqual(originQuery)
    const submit = jest.fn(() => Promise.resolve())
    const form = mount(<WrappedForm onSubmit={submit} withPagination={false} />)
    const f = form.find('form')
    const values = {
      firstName: 'last',
    }
    form
      .instance()
      .getForm()
      .setFieldsValue(values)
    f.simulate('submit')
    expect(submit.mock.calls).toHaveLength(2)
    expect(router.query).toEqual({ ...values, ...originQuery })
  })

  it('当删除表单中的搜索条件后提交，url query中对应的项也会被删除', () => {
    const values = {
      firstName: 'last',
      secondName: 'bbbb',
    }
    router.push({
      search: url.format({ query: values }),
    })
    expect(router.query).toEqual(values)
    const submit = jest.fn(() => Promise.resolve())
    const form = mount(<WrappedForm onSubmit={submit} withPagination={false} />)
    const f = form.find('form')
    form
      .instance()
      .getForm()
      .setFieldsValue({
        firstName: undefined,
        secondName: values.secondName,
      })
    f.simulate('submit')
    expect(submit.mock.calls).toHaveLength(2)
    expect(router.query).toEqual({
      secondName: values.secondName,
    })
  })

  it('当url变化时，表单中的对应项目也一同变化', () => {
    const originValues = {
      firstName: 'last',
      secondName: 'bbbb',
    }
    router.push({
      search: url.format({ query: originValues }),
    })
    expect(router.query).toEqual(originValues)
    const submit = jest.fn(() => Promise.resolve())
    const form = mount(<WrappedForm onSubmit={submit} withPagination={false} />)
    expect(
      form
        .instance()
        .getForm()
        .getFieldsValue(),
    ).toEqual(originValues)
    originValues.firstName = 'xxxxxxxx'
    originValues.secondName = 'yyyyyyyyyy'
    router.push({
      search: url.format({ query: originValues }),
    })
    expect(
      form
        .instance()
        .getForm()
        .getFieldsValue(),
    ).toEqual(originValues)
  })

  it('测试日期类型的表单参数', () => {
    router.push({
      search: '',
    })
    const submit = jest.fn(() => Promise.resolve())
    const form = mount(<WrappedForm onSubmit={submit} withPagination={false} />)
    const firstDate = '2018-03-03'
    const antFormInstance = form.instance().getForm()
    antFormInstance.setFieldsValue({
      firstDate: Moment(firstDate),
    })
    const f = form.find('form')
    f.simulate('submit')
    expect(queryForm.query).toEqual({ firstDate })
    const secondDate = '2016-12-09'
    router.push({
      search: url.format({ query: { secondDate } }),
    })
    expect(queryForm.query).toEqual({ secondDate })
  })

  it('测试时间类型的表单参数', () => {
    router.push({
      search: '',
    })
    const submit = jest.fn(() => Promise.resolve())
    const form = mount(<WrappedForm onSubmit={submit} withPagination={false} />)
    const firstTime = '2018-03-03 05:03:02'
    const antFormInstance = form.instance().getForm()
    antFormInstance.setFieldsValue({
      firstTime: Moment(firstTime),
    })
    const f = form.find('form')
    f.simulate('submit')
    expect(queryForm.query).toEqual({ firstTime })
    const secondTime = '2016-12-09 12:32:43'
    router.push({
      search: url.format({ query: { secondTime } }),
    })
    expect(queryForm.query).toEqual({ secondTime })
  })

  it('测试区间日期类型的表单参数', () => {
    router.push({
      search: '',
    })
    const submit = jest.fn(() => Promise.resolve())
    const form = mount(<WrappedForm onSubmit={submit} withPagination={false} />)
    const rangeDate = '2018-03-03'
    const antFormInstance = form.instance().getForm()
    antFormInstance.setFieldsValue({
      rangeDate: [Moment(rangeDate), undefined],
    })
    const f = form.find('form')
    f.simulate('submit')
    const otherDate = '2017-02-20'
    expect(queryForm.query).toEqual({ rangeDate: [rangeDate, ''] })
    router.push({
      search: url.format({ query: { rangeDate: [otherDate, ''] } }),
    })
    expect(queryForm.query).toEqual({ rangeDate: [otherDate, ''] })
    router.push({
      search: url.format({ query: { rangeDate: [otherDate, otherDate] } }),
    })
    expect(queryForm.query).toEqual({ rangeDate: [otherDate, otherDate] })
    router.push('/')
  })

  it('当路由切换时引起的history变化，不应再执行props.onSubmit', () => {
    router.push('/path1')
    const submit1 = jest.fn(() => Promise.resolve())
    const submit2 = jest.fn(() => Promise.resolve())
    const form1 = mount(<WrappedForm onSubmit={submit1} />)
    expect(submit1.mock.calls).toHaveLength(1)
    expect(submit2.mock.calls).toHaveLength(0)
    // 模拟切换路由，第一个表单卸载
    router.push('/path2')
    form1.unmount()
    const form2 = mount(<WrappedForm onSubmit={submit2} />)
    expect(submit1.mock.calls).toHaveLength(1)
    expect(submit2.mock.calls).toHaveLength(1)
    form2.unmount()
    router.push('/')
  })
})
