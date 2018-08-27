import React from 'react'
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'
import { Form, Input, Select } from 'antd'
import SearchForm from 'share/component/SearchForm'
import { ROLE_STATUS } from 'app/constant'
import s from './search.m.less'

const { Option } = Select
const { Item } = Form

@Form.create()
@inject('store')
@observer
export default class Search extends React.Component {
  static propTypes = {
    form: PropTypes.shape({
      getFieldDecorator: PropTypes.func,
    }).isRequired,
    store: PropTypes.shape({
      role: PropTypes.shape({
        fetchRoles: PropTypes.func,
      }),
      searchForm: PropTypes.shape({
        query: PropTypes.object,
      }),
    }).isRequired,
    children: PropTypes.node.isRequired,
  }

  onSubmit = () => {
    const {
      store: { role, searchForm },
    } = this.props
    role.roles.search = searchForm.query
    role.fetchRoles()
  }

  render() {
    const { form, children } = this.props
    return (
      <SearchForm
        className={s.form}
        form={form}
        onSubmit={this.onSubmit}
        layout="inline"
      >
        <Item className={s.left}>{children}</Item>
        <Item label="简称">{form.getFieldDecorator('name')(<Input />)}</Item>
        <Item label="全称">
          {form.getFieldDecorator('fullName')(<Input />)}
        </Item>
        <Item label="状态">
          {form.getFieldDecorator('status')(
            <Select allowClear>
              {ROLE_STATUS.map(status => (
                <Option key={status.value} value={status.value}>
                  {status.label}
                </Option>
              ))}
            </Select>,
          )}
        </Item>
      </SearchForm>
    )
  }
}
