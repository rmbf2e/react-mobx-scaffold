import React from 'react'
import PropTypes from 'prop-types'
import { Alert } from 'antd'
import classnames from 'classnames'
import style from './style.m.less'

const Loading = ({ text, error }) => {
  const err = error ? <Alert type="error" message={error.toString()} /> : null
  return (
    <div className={style.loading}>
      {err}
      <div className={style.foldingCube}>
        <div className={classnames(style.cube, style.cube1)} />
        <div className={classnames(style.cube, style.cube2)} />
        <div className={classnames(style.cube, style.cube4)} />
        <div className={classnames(style.cube, style.cube3)} />
      </div>
      <div>{text}</div>
    </div>
  )
}

Loading.propTypes = {
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Error)]),
  text: PropTypes.string,
}
Loading.defaultProps = {
  error: null,
  text: '加载中 ...',
}

export default Loading
