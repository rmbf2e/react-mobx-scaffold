import { Form, Input } from 'antd'
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'
import QueryForm from 'component/QueryForm'
import React from 'react'

const FormItem = Form.Item

@Form.create()
@inject('store')
@observer
class Search extends React.Component {
  static propTypes = {
    form: PropTypes.shape({
      getFieldDecorator: PropTypes.func,
    }).isRequired,
    store: PropTypes.shape({
      user: PropTypes.shape({
        fetchList: PropTypes.func,
      }),
      queryForm: PropTypes.shape({
        query: PropTypes.object,
      }),
    }).isRequired,
  }

  onSubmit = () => {
    const {
      store: { user, queryForm },
    } = this.props
    user.setListSearch(queryForm.query)
    user.fetchList()
  }

  beforeSubmit = () =>
    new Promise((resolve, reject) => {
      const { form } = this.props
      form.validateFields(err => {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
    })

  render() {
    const { form } = this.props
    const { getFieldDecorator } = form
    return (
      <QueryForm
        form={form}
        onSubmit={this.onSubmit}
        layout="inline"
        beforeSubmit={this.beforeSubmit}
      >
        <FormItem label="帐号">
          {getFieldDecorator('account')(<Input />)}
        </FormItem>
        <FormItem label="姓名">{getFieldDecorator('name')(<Input />)}</FormItem>
        <FormItem label="邮箱">{getFieldDecorator('mail')(<Input />)}</FormItem>
        <FormItem label="手机">
          {getFieldDecorator('mobile', {
            rules: [
              {
                pattern: /^\d+$/,
                message: '请输入数字格式手机号',
              },
            ],
          })(<Input />)}
        </FormItem>
      </QueryForm>
    )
  }
}
export default Search
