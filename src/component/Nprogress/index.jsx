import React from 'react'
import nprogress from 'nprogress'
import router from 'store/router'
import 'nprogress/nprogress.css'

class Nprogress extends React.Component {
  unlisten = null

  timer = null

  componentDidMount() {
    // 添加页面切换特效
    this.unlisten = router.history.listen(() => {
      nprogress.start()
      this.timer = setTimeout(() => nprogress.done(), 1000)
    })
  }

  componentWillUnmount() {
    this.unlisten()
    clearTimeout(this.timer)
  }

  render() {
    return null
  }
}

export default Nprogress
