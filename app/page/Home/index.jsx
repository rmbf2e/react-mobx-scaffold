import React from 'react'
import { Card } from 'antd'

export default () => {
  const text = '请根据业务需求，修改主页内容'
  return (
    <Card title="欢迎使用本scaffold">
      <h2>
        {text}
      </h2>
    </Card>
  )
}
