import React from 'react'
import PropTypes from 'prop-types'
import s from './style.m.less'

// 模拟Card Title样式的组件
const CardTitle = ({ children }) => (
  <div className="ant-card-head-wrapper">
    <div className={`ant-card-head-title ${s.title}`}>{children}</div>
  </div>
)

CardTitle.propTypes = {
  children: PropTypes.node.isRequired,
}

export default CardTitle
