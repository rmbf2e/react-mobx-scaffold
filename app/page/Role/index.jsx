import React from 'react'
import { inject, observer } from 'mobx-react'
import { toJS } from 'mobx'
import { Card, Button, Modal, Table } from 'antd'
import PropTypes from 'prop-types'
import UserForm from 'page/User/Form'
import Form from './Form'
import Search from './Search'
import column from './column'

@inject('store')
@observer
export default class Role extends React.Component {
  static propTypes = {
    store: PropTypes.shape({
      role: PropTypes.shape({
        fetchRoles: PropTypes.func,
        roles: PropTypes.shape({
          dataSource: PropTypes.array,
          pagination: PropTypes.object,
        }),
        restoreRoles: PropTypes.func,
        showFormModal: PropTypes.func,
      }),
      user: PropTypes.shape({
        fetchAllRoles: PropTypes.func,
      }),
    }).isRequired,
  }

  componentWillUnmount() {
    this.props.store.role.restoreRoles()
  }

  onEdit = e => {
    this.setRoleByDataset(e)
    this.props.store.role.showFormModal()
  }

  setRoleByDataset = e => {
    const { index } = e.target.dataset
    const {
      store: { role },
    } = this.props
    const data = role.roles.tableProps.dataSource[index]
    role.setRole({ data })
  }

  destroy = () => {
    const {
      store: { role },
    } = this.props
    const modal = Modal.confirm({
      title: '确认删除选中的角色？',
      onOk: () => {
        role
          .destroyRole(toJS(role.roles.checkedKeys))
          .then(() => {
            role.fetchRoles()
          })
          .finally(() => {
            modal.destroy()
          })
      },
      onCancel: () => modal.destroy(),
      confirmLoading: role.destroyingRole,
    })
  }

  render() {
    const { role } = this.props.store
    const { roles } = role
    const tableProps = toJS(roles.tableProps)
    return (
      <Card
        title={
          <Search>
            <Button.Group>
              <Button type="primary" onClick={role.showFormModal}>
                新增
              </Button>
              <Button
                type="danger"
                disabled={!roles.hasCheckedKeys}
                onClick={this.destroy}
              >
                删除
              </Button>
            </Button.Group>
          </Search>
        }
      >
        <Table columns={column(this)} {...tableProps} />
        <Form />
        <UserForm />
      </Card>
    )
  }
}
