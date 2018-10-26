import React from 'react'
import PropTypes from 'prop-types'
import { toJS } from 'mobx'
import { Modal, Form, Input, Radio } from 'antd'
import { inject, observer } from 'mobx-react'
import { GENDER } from 'src/constant'

const FormItem = Form.Item

const layout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 18 },
}

@Form.create()
@inject('store')
@observer
class FormModal extends React.Component {
  static propTypes = {
    store: PropTypes.shape({
      user: PropTypes.shape({
        formModal: PropTypes.bool,
      }),
    }).isRequired,
    form: PropTypes.shape({
      getFieldDecorator: PropTypes.func,
      validateFieldsAndScroll: PropTypes.func,
    }).isRequired,
  }

  submit = e => {
    if (e) {
      e.preventDefault()
    }
    const { form } = this.props
    form.validateFields((err, values) => {
      const body = { ...values }
      if (!err) {
        const {
          store: { user },
        } = this.props
        const isUpdate = !!user.record.id
        if (isUpdate) {
          body.id = user.record.id
        }
        user[`${isUpdate ? 'update' : 'create'}Record`](
          body,
          {},
          {
            id: values.id,
          },
        ).finally(user.hideFormModal)
      }
    })
  }

  render() {
    const {
      store: { user },
      form,
    } = this.props
    const record = toJS(user.record)
    const isUpdate = !!record.id
    return (
      <Modal
        onCancel={user.hideFormModal}
        destroyOnClose
        visible={user.formModal}
        width={600}
        title={`${isUpdate ? '编辑' : '创建'}用户`}
        onOk={this.submit}
      >
        <Form onSubmit={this.submit} layout="horizontal">
          <FormItem label="帐号" {...layout}>
            {form.getFieldDecorator('account', {
              initialValue: record.account,
              rules: [{ required: true, message: '请填写帐号' }],
            })(<Input />)}
          </FormItem>
          <FormItem label="姓名" {...layout}>
            {form.getFieldDecorator('name', {
              initialValue: record.name,
              rules: [{ required: true, message: '请填写姓名' }],
            })(<Input />)}
          </FormItem>
          <FormItem label="邮箱" {...layout}>
            {form.getFieldDecorator('mail', {
              initialValue: record.mail,
              rules: [{ required: true, message: '请填写邮箱' }],
            })(<Input />)}
          </FormItem>
          <FormItem label="手机" {...layout}>
            {form.getFieldDecorator('mobile', {
              initialValue: record.mobile,
              rules: [{ required: true, message: '请填写手机' }],
            })(<Input />)}
          </FormItem>
          <FormItem label="性别" {...layout}>
            {form.getFieldDecorator('gender', {
              initialValue: record.gender,
              rules: [{ required: true }],
            })(<Radio.Group options={GENDER} />)}
          </FormItem>
        </Form>
      </Modal>
    )
  }
}
export default FormModal
