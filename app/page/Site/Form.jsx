import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Form, Input } from 'antd'
import { inject, observer } from 'mobx-react'

const { Item } = Form

@Form.create()
@inject('store')
@observer
export default class FormModal extends React.Component {
  static propTypes = {
    store: PropTypes.shape({
      site: PropTypes.shape({
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
          store: { site },
        } = this.props
        const isUpdate = !!site.site.siteId
        if (isUpdate) {
          values.siteId = site.site.siteId
        }
        site[`${isUpdate ? 'update' : 'create'}Site`](
          values,
          {},
          {
            id: values.siteId,
          },
        ).finally(site.hideForm)
      }
    })
  }

  render() {
    const {
      store: { site },
      form,
    } = this.props
    const isUpdate = 'siteId' in site.site
    const confirmLoading = isUpdate ? site.updatingSite : site.creatingSite
    return (
      <Modal
        onCancel={site.hideForm}
        destroyOnClose
        confirmLoading={confirmLoading}
        visible={site.formModal}
        width={600}
        title={`${isUpdate ? '编辑' : '创建'}站点`}
        onOk={this.submit}
      >
        <Form onSubmit={this.submit}>
          <Item label="英文名(小写字母与下划线)">
            {form.getFieldDecorator('name', {
              initialValue: site.site.name,
              rules: [
                { required: true, message: '请填写站点英文名' },
                {
                  validator: (rule, value, cb) => {
                    if (/[^a-z_]/.test(value)) {
                      return cb('请填写网站英文名称，必须为小写字母与_')
                    }
                    return cb()
                  },
                },
              ],
            })(<Input />)}
          </Item>
          <Item label="全称">
            {form.getFieldDecorator('fullName', {
              initialValue: site.site.fullName,
              rules: [{ required: true, message: '请填写站点全称' }],
            })(<Input />)}
          </Item>
        </Form>
      </Modal>
    )
  }
}
