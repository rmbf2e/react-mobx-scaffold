import { runInAction } from 'mobx'
import { mount } from 'enzyme'
import noop from 'lodash/noop'
import React from 'react'
import { Provider } from 'mobx-react'
import { Form } from 'antd'
import queryForm from 'store/queryForm'
import QueryForm from 'component/QueryForm'
import Search from 'page/User/Search'
import user from 'store/user'
import router from 'store/router'
import locale from 'store/locale'

describe('page/User/Search', () => {
  const store = {
    user,
    queryForm,
    router,
    locale,
  }

  let formRef
  const wrapper = () =>
    mount(
      <Provider store={store}>
        <Search
          wrappedComponentRef={form => {
            formRef = form
          }}
        />
      </Provider>,
    )

  let fetchListSpy
  beforeEach(() => {
    fetchListSpy = jest.spyOn(user, 'fetchList').mockImplementation(noop)
  })

  it('页面载入时自动请求列表', () => {
    expect(fetchListSpy).not.toHaveBeenCalled()
    wrapper()
    expect(fetchListSpy).toHaveBeenCalled()
  })

  it('测试表单项目', () => {
    const app = wrapper()
    const label = app.find('label')
    expect(label.at(0).text()).toBe('帐号')
    expect(label.at(1).text()).toBe('姓名')
    expect(label.at(2).text()).toBe('邮箱')
    expect(label.at(3).text()).toBe('手机')
  })

  it('测试提交搜索', () => {
    const app = wrapper()
    const { form } = formRef.props
    const queryFormInstance = app.find(QueryForm).first()
    fetchListSpy.mockReset()
    expect(fetchListSpy).not.toHaveBeenCalled()
    expect(user.list.search).toEqual({})

    const query = {
      account: 'abc',
      name: 'def',
      mail: 'hge',
      mobile: '123',
    }
    form.setFieldsValue(query)
    queryForm.query = query
    queryFormInstance.prop('onSubmit')()
    expect(user.list.search).toEqual(query)
    expect(fetchListSpy).toHaveBeenCalled()

    // 恢复数据
    runInAction(() => {
      user.list.search = {}
    })
  })

  it('手机号格式验证不通过则不提交搜索', async () => {
    const app = wrapper()
    const { form } = formRef.props
    form.setFieldsValue({ mobile: 'abc' })
    const formInstance = app.find(Form).first()
    try {
      await formInstance.prop('onSubmit')({ preventDefault: noop })
    } catch (e) {}
    expect(router.query.mobile).toBeFalsy()
    form.setFieldsValue({ mobile: '123' })
    try {
      await formInstance.prop('onSubmit')({ preventDefault: noop })
    } catch (e) {}
    expect(router.query.mobile).toBe('123')
  })
})
