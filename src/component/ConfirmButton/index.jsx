import React from 'react'
import PropTypes from 'prop-types'
import reduce from 'lodash/reduce'
import { Button, Popover } from 'antd'
import locale from 'store/locale'
import s from './style.m.less'

/**
 * 自带确认过程的按钮
 * 使用popover内的按钮执行实际操作
 * */
class ConfirmButton extends React.PureComponent {
  static propTypes = {
    children: PropTypes.node.isRequired,
    onConfirm: PropTypes.func.isRequired,
    onConfirmText: PropTypes.node,
  }

  static defaultProps = {
    onConfirmText: locale.lang.ConfirmButton.confirm,
  }

  render() {
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

export default ConfirmButton
