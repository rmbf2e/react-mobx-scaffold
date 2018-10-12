import { Form, Input } from 'antd'
import React from 'react'
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'
import SearchForm from 'component/SearchForm'

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
      searchForm: PropTypes.shape({
        query: PropTypes.object,
      }),
    }).isRequired,
  }

  onSubmit = () => {
    const {
      store: { user, searchForm },
    } = this.props
    user.setListSearch(searchForm.query)
    user.fetchList()
  }

  render() {
    const { form } = this.props
    const { getFieldDecorator } = form
    return (
      <SearchForm form={form} onSubmit={this.onSubmit} layout="inline">
        <FormItem label="帐号">
          {getFieldDecorator('account')(<Input />)}
        </FormItem>
        <FormItem label="姓名">{getFieldDecorator('name')(<Input />)}</FormItem>
        <FormItem label="邮箱">{getFieldDecorator('mail')(<Input />)}</FormItem>
        ,
        <FormItem label="手机">
          {getFieldDecorator('mobile')(<Input />)}
        </FormItem>
      </SearchForm>
    )
  }
}
export default Search
