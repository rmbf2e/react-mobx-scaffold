import React from 'react'
import { Card } from 'antd'
import Exception from 'ant-design-pro/lib/Exception'
import { Link } from 'react-router-dom'
import 'ant-design-pro/lib/Exception/style/index.less'

const actions = (
  <Link className="ant-btn ant-btn-primary" to="/">
    返回首页
  </Link>
)

export default () => (
  <Card bordered={false}>
    <Exception type="404" actions={actions} />
  </Card>
)
