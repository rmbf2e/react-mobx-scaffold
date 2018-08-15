import React from 'react'
import ShareHeader from 'share/component/Header'
import Menu from 'share/component/Menu'
import s from './style.m.less'

const AppHeader = () => (
  <ShareHeader>
    <figure className={s.logo}>
      <img alt="logo" src="/asset/image/logo.png" />
      站点标题
    </figure>
    <Menu />
  </ShareHeader>
)
export default AppHeader
