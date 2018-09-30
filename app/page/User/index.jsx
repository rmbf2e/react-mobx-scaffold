import React from 'react'
import { inject, observer } from 'mobx-react'
import { toJS } from 'mobx'
import { Card, Table, Button } from 'antd'
import PropTypes from 'prop-types'
import ConfirmButton from 'component/ConfirmButton'
import Form from './Form'
import Search from './Search'
import column from './column'

@inject('store')
@observer
class User extends React.Component {
  static propTypes = {
    store: PropTypes.shape({
      user: PropTypes.shape({
        fetchList: PropTypes.func,
        list: PropTypes.shape({
          dataSource: PropTypes.array,
          pagination: PropTypes.object,
        }),
        showFormModal: PropTypes.func,
        restoreList: PropTypes.func,
      }),
    }).isRequired,
  }

  constructor(props) {
    super(props)
    const {
      store: { user },
    } = this.props
    this.store = user
  }

  componentWillUnmount() {
    this.store.restoreList()
  }

  onEdit = e => {
    this.setUserByDataset(e)
    this.store.showFormModal()
  }

  setUserByDataset = e => {
    const { index } = e.target.dataset
    const user = this.store
    const data = user.list.tableProps.dataSource[index]
    user.setUser({ data })
  }

  destroy = () => {
    const user = this.store
    user.destroyUser(toJS(user.list.checkedKeys))
  }

  render() {
    const user = this.store
    const { list } = user
    const tableProps = toJS(list.tableProps)
    return (
      <Card
        title={(
          <Search>
            <Button.Group>
              <Button type="primary" onClick={user.showFormModal}>
                新增
              </Button>
              <ConfirmButton
                type="danger"
                disabled={!list.hasCheckedKeys}
                onConfirm={this.destroy}
              >
                删除
              </ConfirmButton>
            </Button.Group>
          </Search>
)}
      >
        <Table columns={column(this)} {...tableProps} />
        <Form />
      </Card>
    )
  }
}
export default User
