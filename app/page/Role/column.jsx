import React from 'react'
import { Button } from 'antd'
import propertyOf from 'lodash/propertyOf'
import { ROLE_STATUS_MAP } from 'app/constant'

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
  },
  {
    title: '角色状态',
    dataIndex: 'status',
    render: propertyOf(ROLE_STATUS_MAP),
  },
  {
    title: '操作',
    dataIndex: 'handler',
    render: (text, record, index) => (
      <Button size="small" key="edit" data-index={index} onClick={self.onEdit}>
        编辑
      </Button>
    ),
  },
]
