import { DatePicker, Form, Input } from 'antd'
import { WrappedFormUtils } from 'antd/lib/form/Form'
import { inject, observer } from 'mobx-react'
import { QueryForm } from 'component/QueryForm'
import { UserStore } from 'store/interface'
import React from 'react'

const FormItem = Form.Item
interface IProp {
  store?: {
    user: UserStore
  }
  form: WrappedFormUtils
}

@inject('store')
@observer
class Search extends React.Component<IProp> {
  onSubmit = () => {
    const { user } = this.props.store!
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
        <FormItem label="出生日期">
          {getFieldDecorator('birthday')(<DatePicker />)}
        </FormItem>
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

export default Form.create()(Search)
