import React from 'react'
import PropTypes from 'prop-types'
import { toJS } from 'mobx'
import { inject, observer } from 'mobx-react'
import { Modal, Spin } from 'antd'
import Tree from 'component/Tree'

// @Form.create()
@inject('store')
@observer
export default class System extends React.Component {
  static propTypes = {
    store: PropTypes.shape({
      role: PropTypes.shape({
        formModal: PropTypes.bool,
      }),
    }).isRequired,
  }

  submit = () => {
    const {
      store: { role },
    } = this.props
    const keys = toJS(role.checkedSystemKeys)
    return role
      .updateSystem(keys, {}, { roleId: role.role.roleId })
      .finally(() => {
        role.hideSystemModal()
      })
  }

  render() {
    const {
      store: { role },
    } = this.props
    if (role.fetchingSystem) {
      return <Spin spinning />
    }
    const checkedKeys = toJS(role.checkedSystemKeys)
    const data = toJS(role.system)
    // console.log(data)
    return (
      <Modal
        visible={role.systemModal}
        onCancel={role.hideSystemModal}
        destroyOnClose
        title={`配置系统资源 当前角色简称: ${role.role.name} / 全称: ${
          role.role.fullName
        }`}
        onOk={this.submit}
      >
        <Tree
          onCheck={role.setCheckedSystemKeys}
          checkedKeys={checkedKeys}
          data={data}
        />
      </Modal>
    )
  }
}
