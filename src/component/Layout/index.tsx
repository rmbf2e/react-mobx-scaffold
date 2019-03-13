import { ConfigProvider, Layout as AntLayout } from 'antd'
import { Footer } from 'component/Footer'
import { Header } from 'component/Header'
import { TransitionRoute } from 'component/TransitionRoute'
import React from 'react'
import { IRouteProps } from 'store/interface'
import { getPopupContainer } from 'tool/getPopupContainer'
import s from './style.m.less'

interface IProps {
  routes: IRouteProps[]
}

/*
 * 项目最外层组件，负责监听事件
 * */
export const Layout = ({ routes }: IProps) => (
  <ConfigProvider getPopupContainer={getPopupContainer}>
    <AntLayout>
      <Header />
      <AntLayout.Content className={s.content}>
        <TransitionRoute routes={routes} />
      </AntLayout.Content>
      <Footer />
    </AntLayout>
  </ConfigProvider>
)
