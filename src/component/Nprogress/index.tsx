import nprogress from 'nprogress'
import 'nprogress/nprogress.css'
import React from 'react'
import { router } from 'store/router'

export class Nprogress extends React.Component {
  public unlisten: () => void

  public timer: number

  public componentDidMount() {
    // 添加页面切换特效
    this.unlisten = router.history.listen(() => {
      nprogress.start()
      this.timer = window.setTimeout(() => nprogress.done(), 1000)
    })
  }

  public componentWillUnmount() {
    this.unlisten()
    clearTimeout(this.timer)
  }

  public render() {
    return null
  }
}
