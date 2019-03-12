import { Layout } from 'antd'
import React from 'react'
import s from './style.m.less'

export const Footer = () => (
  <Layout.Footer className={`${s.footer} footer`}>
    <nav className={s.nav}>
      <a>nav 1</a> | <a> nav 2</a> | <a> nav 3</a> | <a> nav 4</a>
    </nav>
    other footer here
  </Layout.Footer>
)
