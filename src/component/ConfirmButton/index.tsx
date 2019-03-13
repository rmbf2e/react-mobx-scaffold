import { Button, Popover } from 'antd'
import { BaseButtonProps } from 'antd/lib/button/button'
import { reduce } from 'lodash'
import React from 'react'
import { locale } from 'store/locale'
import s from './style.m.less'

export interface IConfirmButtonProps extends BaseButtonProps {
  children: React.ReactNode
  onConfirmText: string
  onConfirm: React.MouseEventHandler
  disabled?: boolean
}

/**
 * 自带确认过程的按钮
 * 使用popover内的按钮执行实际操作
 * */
export class ConfirmButton extends React.PureComponent<IConfirmButtonProps> {
  public static defaultProps = {
    onConfirmText: locale.lang.ConfirmButton.confirm,
  }

  public render() {
    const { children, onConfirmText, onConfirm, ...props } = this.props
    const datasetProps = reduce(
      props,
      (r, v, k) => {
        if (k.startsWith('data-')) {
          return {
            ...r,
            [k]: v,
          }
        }
        return r
      },
      {},
    )
    if (props.disabled) {
      return (
        <Button disabled {...props}>
          {children}
        </Button>
      )
    }
    return (
      <Popover
        overlayClassName={s.wrapper}
        mouseLeaveDelay={0.3}
        content={
          <Button icon="warning" {...datasetProps} onClick={onConfirm}>
            {onConfirmText}
          </Button>
        }
      >
        <Button {...props}>{children}</Button>
      </Popover>
    )
  }
}
