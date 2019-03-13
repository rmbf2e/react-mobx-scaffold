import React from 'react'
import s from './style.m.less'

interface IProp {
  children?: React.ReactNode
}

// 模拟Card Title样式的组件
export const CardTitle = ({ children }: IProp) => (
  <div className="ant-card-head-wrapper">
    <div className={`ant-card-head-title ${s.title}`}>{children}</div>
  </div>
)
