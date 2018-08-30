import React from 'react'
import { inject, observer } from 'mobx-react'
import { toJS } from 'mobx'
import { Card, Button, Modal } from 'antd'
import PropTypes from 'prop-types'
import AnimateTable from 'share/component/AnimateTable'
import Form from './Form'
import Search from './Search'
import column from './column'

@inject('store')
@observer
class User extends React.Component {
  static propTypes = {
    store: PropTypes.shape({
      user: PropTypes.shape({
        fetchUsers: PropTypes.func,
        users: PropTypes.shape({
          dataSource: PropTypes.array,
          pagination: PropTypes.object,
        }),
        showFormModal: PropTypes.func,
        restoreUsers: PropTypes.func,
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
    this.store.restoreUsers()
  }

  onEdit = e => {
    this.setUserByDataset(e)
    this.store.showFormModal()
  }

  setUserByDataset = e => {
    const { index } = e.target.dataset
    const user = this.store
    const data = user.users.tableProps.dataSource[index]
    user.setUser({ data })
  }

  destroy = () => {
    const user = this.store
    const modal = Modal.confirm({
      title: '确认删除选中的用户？',
      onOk: () => {
        user
          .destroyUser(toJS(user.users.checkedKeys))
          .then(() => {
            user.fetchUsers()
          })
          .finally(() => {
            modal.destroy()
          })
      },
      onCancel: () => modal.destroy(),
      confirmLoading: user.destroyingRole,
    })
  }

  render() {
    const user = this.store
    const { users } = user
    const tableProps = toJS(users.tableProps)
    return (
      <Card
        title={(
          <Search>
            <Button.Group>
              <Button type="primary" onClick={user.showFormModal}>
                新增
              </Button>
              <Button
                type="danger"
                disabled={!users.hasCheckedKeys}
                onClick={this.destroy}
              >
                删除
              </Button>
            </Button.Group>
          </Search>
)}
      >
        <AnimateTable columns={column(this)} {...tableProps} />
        <Form />
      </Card>
    )
  }
}
export default User
