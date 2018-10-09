import React from 'react'
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'
import { Form, Input, Select } from 'antd'
import SearchForm from 'component/SearchForm'
import { USER_STATUS } from 'app/constant'

const { Item } = Form
const { Option } = Select

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
        fetchAllRoles: PropTypes.func,
        ALL_ROLES: PropTypes.array,
      }),
      searchForm: PropTypes.shape({
        query: PropTypes.object,
      }),
    }).isRequired,
  }

  onSubmit = () => {
    const {
      store: { user, searchForm },
    } = this.props
    user.list.search = searchForm.query
    user.fetchList()
  }

  render() {
    const { form } = this.props
    const { getFieldDecorator } = form
    return (
      <SearchForm form={form} onSubmit={this.onSubmit} layout="inline">
        <Item label="帐号">{getFieldDecorator('erp')(<Input />)}</Item>
        <Item label="姓名">{getFieldDecorator('name')(<Input />)}</Item>
        <Item label="邮箱">{getFieldDecorator('email')(<Input />)}</Item>
        <Item label="手机">{getFieldDecorator('mobile')(<Input />)}</Item>
        <Item label="状态">
          {getFieldDecorator('status')(
            <Select allowClear>
              {USER_STATUS.map(status => (
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
export default Search
