import React from 'react'
import PropTypes from 'prop-types'
// import style from './style.m.less'

class Operation extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
  }

  constructor(props) {
    super(props)
    this.dom = React.createRef()
  }

  // componentDidMount() {
  //   const dom = this.dom.current
  //   console.log(dom.offsetTop)
  //   console.log(dom.offsetLeft)
  //   console.log(dom.clientWidth)
  //   console.log(dom.offsetWidth)
  // }
  // <Affix
  //   offsetTop={20}
  //   className={style.operation}
  //   ref={this.dom}
  //   target={() => global.document.getElementById('appContent')}
  // >
  //   {children}
  // </Affix>

  render() {
    const { children } = this.props
    return (
      <div className="ant-card-head-title" ref={this.dom}>
        {children}
      </div>
    )
  }
}

export default Operation
