import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Form, Input, Radio, Select } from 'antd'
import { inject, observer } from 'mobx-react'
import { GENDER, USER_STATUS } from 'app/constant'
import debounce from 'lodash/debounce'

const { Item } = Form
const { Option } = Select

const layout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 18 },
}

@Form.create()
@inject('store')
@observer
export default class FormModal extends React.Component {
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
    e.preventDefault()
    const { form } = this.props
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const {
          store: { user },
        } = this.props
        const isUpdate = !!user.user.userId
        if (isUpdate) {
          values.userId = user.user.userId
        }
        values.erp = `${values.source}_${values.account}`
        delete values.source
        delete values.account
        user[`${isUpdate ? 'update' : 'create'}User`](
          values,
          {},
          {
            id: values.userId,
          },
        )
          .then(() => {
            user.fetchUsers()
          })
          .finally(user.hideForm)
      }
    })
  }

  // 根据account查询对应信息自动填充表单
  searchByAccount = debounce(() => {
    const {
      form,
      store: { user },
    } = this.props
    const account = form.getFieldValue('account')
    const source = form.getFieldValue('source')
    if (source) {
      user.searchByAccount(account, source).then(res => {
        const { data } = res
        if (data && (data.mail || data.mobile || data.name)) {
          form.setFieldsValue(data)
        }
      })
    }
  }, 800)

  render() {
    const {
      store: { user },
      form,
    } = this.props
    const u = user.user
    const isUpdate = !!u.userId
    return (
      <Modal
        onCancel={user.hideForm}
        destroyOnClose
        visible={user.formModal}
        width={600}
        title={`${isUpdate ? '编辑' : '创建'}用户`}
        onOk={this.submit}
      >
        <Form onSubmit={this.submit} layout="horizontal">
          <Item label="帐号" {...layout}>
            {form.getFieldDecorator('erp', {
              initialValue: u.erp,
              rules: [{ required: true, message: '请填写帐号' }],
            })(<Input />)}
          </Item>
          <Item label="姓名" {...layout}>
            {form.getFieldDecorator('name', {
              initialValue: u.name,
              rules: [{ required: true, message: '请填写姓名' }],
            })(<Input />)}
          </Item>
          <Item label="邮箱" {...layout}>
            {form.getFieldDecorator('mail', {
              initialValue: u.mail,
              rules: [{ required: true, message: '请填写邮箱' }],
            })(<Input />)}
          </Item>
          <Item label="手机" {...layout}>
            {form.getFieldDecorator('mobile', {
              initialValue: u.mobile,
              rules: [{ required: true, message: '请填写手机' }],
            })(<Input />)}
          </Item>
          <Item label="性别" {...layout}>
            {form.getFieldDecorator('sex', {
              initialValue: u.sex,
              rules: [{ required: true }],
            })(<Radio.Group options={GENDER} />)}
          </Item>
          <Item label="角色" {...layout}>
            {form.getFieldDecorator('roleId', {
              initialValue: u.roles.map(r => String(r.roleId)),
              rules: [{ required: true, message: '请选择角色' }],
            })(<Select mode="multiple">
              {user.ALL_ROLES.map(type => (
                <Option key={type.value} value={type.value}>
                  {type.label}
                </Option>
                ))}
            </Select>)}
          </Item>
          <Item label="状态" {...layout}>
            {form.getFieldDecorator('status', {
              initialValue: u.status,
              rules: [{ required: true }],
            })(<Radio.Group options={USER_STATUS} />)}
          </Item>
        </Form>
      </Modal>
    )
  }
}
