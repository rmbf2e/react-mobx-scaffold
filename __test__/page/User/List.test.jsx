import { runInAction, toJS } from 'mobx'
import { Button } from 'antd'
import { mount } from 'enzyme'
import React from 'react'
import { Provider } from 'mobx-react'
import listFixture from 'fixture/users.json'
import user from 'store/user'
import List from 'page/User/List'
import { GENDER_MAP } from 'src/constant'

describe('page/User/List', () => {
  const store = {
    user,
  }
  const wrapper = () =>
    mount(
      <Provider store={store}>
        <List />
      </Provider>,
    )

  beforeEach(() => {
    runInAction(() => {
      user.list.tableProps.dataSource = listFixture.data.entities
    })
  })

  it('测试组件卸载，清空store的list数据', () => {
    const spy = jest.spyOn(user, 'restoreList')
    const app = wrapper()
    expect(spy).not.toHaveBeenCalled()
    app.unmount()
    expect(spy).toHaveBeenCalled()
  })

  it('测试table列', () => {
    const app = wrapper()
    const th = app.find('th')
    expect(th.at(0).text()).toBe('')
    expect(th.at(1).text()).toBe('帐号')
    expect(th.at(2).text()).toBe('姓名')
    expect(th.at(3).text()).toBe('性别')
    expect(th.at(4).text()).toBe('邮箱')
    expect(th.at(5).text()).toBe('手机')
    expect(th.at(6).text()).toBe('操作')
  })

  it('测试数据', () => {
    const app = wrapper()
    const td = app.find('td')
    const row = listFixture.data.entities[0]
    expect(td.at(1).text()).toBe(row.account)
    expect(td.at(2).text()).toBe(row.name)
    expect(td.at(3).text()).toBe(GENDER_MAP[row.gender])
    expect(td.at(4).text()).toBe(row.mail)
    expect(td.at(5).text()).toBe(row.mobile)
    expect(td.at(6).text()).toBe('编 辑')
  })

  it('测试onEdit', () => {
    const app = wrapper()
    const button = app.find(Button).first()
    expect(user.formModal).toBe(false)
    const record = listFixture.data.entities[0]
    expect(toJS(user.record)).not.toEqual(record)

    const onClick = button.prop('onClick')
    onClick({ target: { dataset: { index: 0 } } })
    expect(user.formModal).toBe(true)
    expect(toJS(user.record)).toEqual(record)

    // 恢复数据
    user.hideFormModal()
    user.restoreRecord()
  })
})
