import React from 'react'
import { inject, observer } from 'mobx-react'
import { toJS } from 'mobx'
import { Card, Button, Modal } from 'antd'
import PropTypes from 'prop-types'
import AnimateTable from 'share/component/AnimateTable'
import UserForm from 'page/User/Form'
import ConfirmButton from 'component/ConfirmButton'
import Form from './Form'
import Search from './Search'
import column from './column'

@inject('store')
@observer
class Role extends React.Component {
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

  constructor(props) {
    super(props)
    const {
      store: { role },
    } = this.props
    this.store = role
  }

  componentWillUnmount() {
    this.store.restoreRoles()
  }

  onEdit = e => {
    this.setRoleByDataset(e)
    this.store.showFormModal()
  }

  setRoleByDataset = e => {
    const { index } = e.target.dataset
    const role = this.store
    const data = role.roles.tableProps.dataSource[index]
    role.setRole({ data })
  }

  destroy = () => {
    const role = this.store
    role.destroyRole(toJS(role.roles.checkedKeys))
  }

  renderTitle() {
    const role = this.store
    const { roles } = role
    return (
      <Search>
        <Button.Group>
          <Button type="primary" onClick={role.showFormModal}>
            新增
          </Button>
          <ConfirmButton
            type="danger"
            disabled={!roles.hasCheckedKeys}
            onConfirm={this.destroy}
          >
            删除
          </ConfirmButton>
        </Button.Group>
      </Search>
    )
  }

  render() {
    const role = this.store
    const { roles } = role
    const tableProps = toJS(roles.tableProps)
    return (
      <Card title={this.renderTitle()}>
        <AnimateTable columns={column(this)} {...tableProps} />
        <Form />
        <UserForm />
      </Card>
    )
  }
}
export default Role
