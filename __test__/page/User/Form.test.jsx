import { Modal } from 'antd'
import { mount } from 'enzyme'
import React from 'react'
import { Provider } from 'mobx-react'
import user from 'store/user'
import Form from 'page/User/Form'
import listFixture from 'fixture/users.json'

describe('page/User/Form', () => {
  const store = {
    user,
  }

  let formRef
  const wrapper = () =>
    mount(
      <Provider store={store}>
        <Form
          wrappedComponentRef={form => {
            formRef = form
          }}
        />
      </Provider>,
    )

  it('测试Modal属性', () => {
    const app = wrapper()
    const modal = app.find(Modal).first()
    const props = modal.props()
    expect(props.destroyOnClose).toBe(true)
    expect(props.width).toBe(600)
    expect(props.visible).toBe(false)
    expect(props.title).toBe('创建用户')
    expect(props.onCancel).toBe(user.hideFormModal)
  })

  describe('显示modal并测试modal内部内容', () => {
    beforeEach(() => {
      user.showFormModal()
    })

    afterEach(() => {
      user.hideFormModal()
    })

    it('测试表单项', () => {
      const app = wrapper()
      const label = app.find('label')
      expect(label.at(0).text()).toBe('帐号')
      expect(label.at(1).text()).toBe('姓名')
      expect(label.at(2).text()).toBe('邮箱')
      expect(label.at(3).text()).toBe('手机')
      expect(label.at(4).text()).toBe('性别')
    })

    it('测试表单提交验证', () => {
      const app = wrapper()
      const modal = app.find(Modal).first()
      const spy = jest
        .spyOn(user, 'createRecord')
        .mockImplementation(() => Promise.resolve())
      const submit = modal.prop('onOk')
      submit()
      expect(spy).not.toHaveBeenCalled()

      const { form } = formRef.props
      form.setFieldsValue({
        account: 'abc',
        name: 'abc',
        mail: 'abc',
        mobile: '123',
        gender: '1',
      })
      submit()
      expect(spy).toHaveBeenCalled()
    })

    it('当user有id时，表单提交更新数据', () => {
      const record = listFixture.list[0]
      user.setRecord(record)
      const app = wrapper()
      const modal = app.find(Modal).first()
      const spy = jest
        .spyOn(user, 'updateRecord')
        .mockImplementation(() => Promise.resolve())
      const submit = modal.prop('onOk')
      submit()
      expect(spy).toHaveBeenCalled()
    })

    it('测试表单调教阻止默认事件', () => {
      const app = wrapper()
      const modal = app.find(Modal).first()
      const submit = modal.prop('onOk')
      const spy = jest.fn()
      submit({ preventDefault: spy })
      expect(spy).toHaveBeenCalledTimes(1)
    })
  })
})
