import React from 'react'
import PropTypes from 'prop-types'
import { toJS } from 'mobx'
import { inject, observer } from 'mobx-react'
import {
 Form, Input, Select, Spin,
} from 'antd'
import SearchForm from 'share/component/SearchForm'
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
    children: PropTypes.node.isRequired,
  }

  onSubmit = () => {
    const {
      store: { user, searchForm },
    } = this.props
    user.users.search = searchForm.query
    user.fetchUsers()
  }

  render() {
    const {
      form,
      store: { user },
      children,
    } = this.props
    return (
      <SearchForm form={form} onSubmit={this.onSubmit} layout="inline">
        <Item>{children}</Item>
        <Item label="帐号">{form.getFieldDecorator('erp')(<Input />)}</Item>
        <Item label="姓名">{form.getFieldDecorator('name')(<Input />)}</Item>
        <Item label="邮箱">{form.getFieldDecorator('email')(<Input />)}</Item>
        <Item label="手机">{form.getFieldDecorator('mobile')(<Input />)}</Item>
        <Item label="角色">
          <Spin spinning={user.fetchingRoles}>
            {form.getFieldDecorator('role')(
              <Select allowClear>
                {toJS(user.ALL_ROLES).map(r => (
                  <Option key={r.value} value={r.value}>
                    {r.label}
                  </Option>
                ))}
              </Select>,
            )}
          </Spin>
        </Item>
        <Item label="状态">
          {form.getFieldDecorator('status')(
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
