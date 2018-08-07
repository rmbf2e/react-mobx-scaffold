import React from 'react'
import { Button } from 'antd'
import { GENDER_MAP } from 'app/constant'

const column = self => [
  {
    title: '帐号',
    dataIndex: 'erp',
    key: 'erp',
    render: (_, record) => {
      if (record.erp.includes('_')) {
        return record.erp.split('_')[1]
      }
      return record.erp
    },
  },
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '性别',
    dataIndex: 'sex',
    key: 'sex',
    render: sex => GENDER_MAP[sex],
  },
  {
    title: '邮箱',
    dataIndex: 'mail',
    key: 'mail',
  },
  {
    title: '手机',
    dataIndex: 'mobile',
    key: 'mobile',
  },
  {
    title: '角色',
    dataIndex: 'roles',
    key: 'roles',
    render: roles => (
      <React.Fragment>
        {roles.map(r => (
          <div key={r.roleId}>
            {r.fullName}
          </div>
))}
      </React.Fragment>
    ),
  },
  {
    title: '修改时间',
    dataIndex: 'operateDate',
    key: 'operateDate',
  },
  {
    title: '操作',
    dataIndex: 'operation',
    key: 'operation',
    render: (text, record, index) => (
      <Button.Group>
        <Button type="primary" data-index={index} onClick={self.onEdit}>
          编辑
        </Button>
      </Button.Group>
    ),
  },
]
export default column
