import React from 'react'
import { Button } from 'antd'
import propertyOf from 'lodash/propertyOf'
import { GENDER_MAP } from 'app/constant'

const column = self => [
  {
    title: '帐号',
    dataIndex: 'erp',
    key: 'erp',
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
    render: propertyOf(GENDER_MAP),
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
    title: '操作',
    dataIndex: 'operation',
    key: 'operation',
    render: (text, record, index) => (
      <Button size="small" data-index={index} onClick={self.onEdit}>
        编辑
      </Button>
    ),
  },
]
export default column
