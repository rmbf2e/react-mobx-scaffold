import { runInAction } from 'mobx'
import noop from 'lodash/noop'
import { Button } from 'antd'
import { mount } from 'enzyme'
import React from 'react'
import { Provider } from 'mobx-react'
import ConfirmButton from 'src/component/ConfirmButton'
import Operation from 'page/User/Operation'
import user from 'store/user'

describe('page/User/Operation', () => {
  const store = {
    user,
  }
  const wrapper = () =>
    mount(
      <Provider store={store}>
        <Operation />
      </Provider>,
    )

  it('"添加"按钮', () => {
    const app = wrapper()
    const button = app.find(Button).first()
    expect(button.prop('onClick')).toBe(user.showFormModal)
    expect(button.text()).toBe('添 加')
  })

  it('删除按钮disabled', () => {
    const app = wrapper()
    let button = app.find(ConfirmButton).first()
    expect(button.text()).toBe('删 除')
    expect(button.prop('disabled')).toBe(true)

    runInAction(() => {
      user.list.checkedKeys = [1, 2, 3]
    })
    app.update()
    button = app.find(ConfirmButton).first()
    expect(button.prop('disabled')).toBe(false)

    // 恢复数据
    runInAction(() => {
      user.list.checkedKeys = []
    })
  })

  it('删除按钮功能', () => {
    const app = wrapper()
    const button = app.find(ConfirmButton).first()
    const destroy = button.prop('onConfirm')
    const spy = jest.spyOn(user, 'destroyRecord').mockImplementation(noop)
    runInAction(() => {
      user.list.checkedKeys = [1, 2, 3]
    })
    destroy()
    expect(spy).toHaveBeenLastCalledWith([1, 2, 3])

    // 恢复数据
    runInAction(() => {
      user.list.checkedKeys = []
    })
  })
})
