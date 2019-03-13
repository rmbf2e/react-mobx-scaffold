import React from 'react'
import { mount } from 'enzyme'
import { Tabs as AntTabs } from 'antd'
import { Tabs } from 'component/Tabs'
import { router } from 'store/router'

const store = { router }

const { TabPane } = Tabs

const onChange = jest.fn()
const App = (
  <Tabs onChange={onChange} store={store}>
    <TabPane tab="One" key="one">
      One
    </TabPane>
    <TabPane tab="Two" key="two">
      Two
    </TabPane>
  </Tabs>
)

describe('components/Tabs', () => {
  it('default tab memory by hash', () => {
    router.push({
      hash: 'one',
    })
    let app = mount(App)
    // const appRender = app.render()
    expect(app.find('.ant-tabs-tab')).toHaveLength(2)
    expect(app.find('.ant-tabs-tab-active')).toHaveLength(1)
    expect(app.find('.ant-tabs-tab-active').text()).toBe('One')
    app.instance().wrappedInstance.onChangeTab('two')
    app.unmount()

    router.push({
      hash: 'two',
    })
    app = mount(App)
    expect(app.find('.ant-tabs-tab-active').text()).toBe('Two')
    app.unmount()
  })

  it('测试onChange prop', () => {
    onChange.mockClear()
    router.push({
      hash: 'two',
    })
    const app = mount(App)
    expect(onChange).not.toHaveBeenCalled()
    const tabTitle = app.find('.ant-tabs-tab').at(0)
    tabTitle.simulate('click')
    expect(onChange).toHaveBeenCalledWith('one')
    const tabs = app.find(AntTabs).at(0)
    expect(tabs.prop('defaultActiveKey')).toBe('two')
    app.unmount()
  })

  it('没有hash时，默认第一个tab为active tab，并且没有onChange也能用', () => {
    const TabWrapper = (
      <Tabs store={store}>
        <TabPane tab="One" key="one">
          One
        </TabPane>
        <TabPane tab="Two" key="two">
          Two
        </TabPane>
      </Tabs>
    )
    router.push('/')
    const app = mount(TabWrapper)
    const tabs = app.find(AntTabs).at(0)
    expect(tabs.prop('defaultActiveKey')).toBe('')
    tabs.prop('onChange')('one')
    expect(router.location.hash).toBe('#one')
  })
})
