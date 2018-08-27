import React from 'react'
import PropTypes from 'prop-types'
import {
 Modal, Form, Input, Radio,
} from 'antd'
import { inject, observer } from 'mobx-react'
import { ROLE_STATUS } from 'app/constant'

const { Item } = Form

@Form.create()
@inject('store')
@observer
export default class FormModal extends React.Component {
  static propTypes = {
    store: PropTypes.shape({
      role: PropTypes.shape({
        formModal: PropTypes.bool,
      }),
      user: PropTypes.shape({
        fetchAllRoles: PropTypes.func,
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
          store: { role, user },
        } = this.props
        const isUpdate = role.role.name !== ''
        if (isUpdate) {
          values.roleId = role.role.roleId
        }
        role[`${isUpdate ? 'update' : 'create'}Role`](
          values,
          {},
          {
            id: values.roleId,
          },
        )
          .then(() => {
            // role.fetchRoles()
            // role更新后，更新ALL_ROLES的下拉列表
            user.fetchAllRoles()
          })
          .finally(role.hideForm)
      }
    })
  }

  render() {
    const {
      store: { role },
      form,
    } = this.props
    const isCreate = role.role.name === ''
    return (
      <Modal
        onCancel={role.hideForm}
        destroyOnClose
        visible={role.formModal}
        width={600}
        title={`${isCreate ? '创建' : '编辑'}角色`}
        onOk={this.submit}
      >
        <Form onSubmit={this.submit}>
          <Item label="简称">
            {form.getFieldDecorator('name', {
              initialValue: role.role.name,
              rules: [{ required: true, message: '请填写角色简称' }],
            })(<Input />)}
          </Item>
          <Item label="名称">
            {form.getFieldDecorator('fullName', {
              initialValue: role.role.fullName,
              rules: [{ required: true, message: '请填写角色名称' }],
            })(<Input />)}
          </Item>
          <Item label="状态">
            {form.getFieldDecorator('status', {
              initialValue: String(role.role.status),
              rules: [{ required: true }],
            })(<Radio.Group options={ROLE_STATUS} />)}
          </Item>
        </Form>
      </Modal>
    )
  }
}
