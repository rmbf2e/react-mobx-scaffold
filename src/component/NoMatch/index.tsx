import Exception from 'ant-design-pro/lib/Exception'
import { Card } from 'antd'
import React from 'react'
import { Link } from 'react-router-dom'
// import 'ant-design-pro/lib/Exception/style/index.less'

const actions = (
  <Link className="ant-btn ant-btn-primary" to="/">
    返回首页
  </Link>
)

export const NoMatch = () => (
  <Card bordered={false}>
    <Exception type="404" actions={actions} />
  </Card>
)
