import React from 'react'
import { Table } from 'antd'
import Animate from 'rc-animate'
import 'rc-table/assets/index.css'
import 'rc-table/assets/animation.css'

const AnimateBody = props => (
  <Animate transitionName="move" component="tbody" {...props} />
)

const components = { body: { wrapper: AnimateBody } }

const AnimateTable = props => <Table {...props} components={components} />

export default AnimateTable
