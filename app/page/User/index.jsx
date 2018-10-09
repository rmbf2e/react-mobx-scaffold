import { Card } from 'antd'
import React from 'react'
import Form from './Form'
import Search from './Search'
import Operation from './Operation'
import List from './List'

const User = () => (
  <Card title={<Search />}>
    <Operation />
    <List />
    <Form />
  </Card>
)
export default User
