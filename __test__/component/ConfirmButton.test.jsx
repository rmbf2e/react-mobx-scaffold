import React from 'react'
import { mount } from 'enzyme'
import { Button, Popover } from 'antd'
import { ConfirmButton } from 'component/ConfirmButton'

describe('component/ConfirmButton', () => {
  it('按钮的popover内的按钮执行onConfirm', () => {
    const spy = jest.fn()
    const app = mount(
      <div>
        <ConfirmButton onConfirm={spy}>ABC</ConfirmButton>
      </div>,
    )
    const button = app.find('button').first()
    expect(button.html()).toContain('ABC')
    expect(spy).not.toHaveBeenCalled()
    const popover = app.find(Popover).first()
    const confirmButton = popover.prop('content')
    expect(confirmButton.props.children).toContain(
      ConfirmButton.defaultProps.onConfirmText,
    )
    confirmButton.props.onClick()
    expect(spy).toHaveBeenCalled()
  })

  it('ConfirmButton的data-*属性可以传入到Popover内的Button', () => {
    const spy = jest.fn()
    const app = mount(
      <div>
        <ConfirmButton data-id={3} data-name="def" onConfirm={spy}>
          ABC
        </ConfirmButton>
      </div>,
    )
    const button = app.find('button').first()
    expect(button.html()).toContain('ABC')
    const popover = app.find(Popover).first()
    const confirmButton = popover.prop('content')
    expect(confirmButton.props['data-id']).toBe(3)
    expect(confirmButton.props['data-name']).toBe('def')
  })

  it('测试disabled', () => {
    const spy = jest.fn()
    const app = mount(
      <div>
        <ConfirmButton disabled data-id={3} data-name="def" onConfirm={spy}>
          ABC
        </ConfirmButton>
      </div>,
    )
    const button = app.find(Button).first()
    expect(button.props().disabled).toBe(true)
  })
})
