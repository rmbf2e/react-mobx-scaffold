import url from 'url'
import React from 'react'
import { Button, Row, Col } from 'antd'
import { Link } from 'react-router-dom'
import { ROLE_STATUS_MAP } from 'app/constant'

const showUserForm = (self, role) => {
  const { user } = self.props.store
  user.hideForm() // 恢复默认用户数据
  user.setRoleAndShowFormModal(role)
}

export default self => [
  {
    title: '角色ID',
    dataIndex: 'roleId',
  },
  {
    title: '角色简称',
    dataIndex: 'name',
  },
  {
    title: '角色名称',
    dataIndex: 'fullName',
    render: (fullName, role) => (
      <Row>
        <Col span={12}>
          <Link
            to={url.format({ pathname: '/user', query: { role: role.roleId } })}
          >
            {fullName}
          </Link>
        </Col>
        <Col span={12}>
          <Button type="primary" onClick={() => showUserForm(self, role)}>
            添加用户
          </Button>
        </Col>
      </Row>
    ),
  },
  {
    title: '角色状态',
    dataIndex: 'status',
    render: text => ROLE_STATUS_MAP[text],
  },
  {
    title: '修改时间',
    dataIndex: 'operateDate',
  },
  {
    title: '操作',
    dataIndex: 'handler',
    render: (text, record, index) => (
      <Button.Group>
        <Button
          type="primary"
          key="edit"
          data-index={index}
          onClick={self.onEdit}
        >
          编辑
        </Button>
      </Button.Group>
    ),
  },
]
