import { ConfigProvider, Layout } from 'antd'
import { Footer } from 'component/Footer'
import { Header } from 'component/Header'
import { TransitionRoute } from 'component/TransitionRoute'
import React from 'react'
import { IRouteProps } from 'src/route'
import { getPopupContainer } from 'tool/getPopupContainer'
import s from './style.m.less'

interface IProps {
  routes: IRouteProps[]
}

/*
 * 项目最外层组件，负责监听事件
 * */
const AppLayout = ({ routes }: IProps) => (
  <ConfigProvider getPopupContainer={getPopupContainer}>
    <Layout>
      <Header />
      <Layout.Content className={s.content}>
        <TransitionRoute routes={routes} />
      </Layout.Content>
      <Footer />
    </Layout>
  </ConfigProvider>
)

export default AppLayout
