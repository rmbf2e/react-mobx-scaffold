import { Alert } from 'antd'
import classnames from 'classnames'
import React from 'react'
import { locale } from 'store/locale'
import style from './style.m.less'

export const Loading = ({ text, error }: { text: string; error: Error }) => {
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

Loading.defaultProps = {
  error: null,
  text: locale.lang.Loading.loading,
}
