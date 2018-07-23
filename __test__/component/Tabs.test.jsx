import React from 'react'
// import { Provider } from 'mobx-react'
// import { Router } from 'react-router-dom'
import { RouterStore, syncHistoryWithStore } from 'mobx-react-router'
import createMemoryHistory from 'history/createMemoryHistory'
import { mount } from 'enzyme'
import Tabs from 'component/Tabs'

const routerStore = new RouterStore()

const appHistory = createMemoryHistory()
syncHistoryWithStore(appHistory, routerStore)

const { TabPane } = Tabs

const App = (
  <Tabs store={{ router: routerStore }}>
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
    appHistory.push({
      hash: 'one',
    })
    let app = mount(App)
    // const appRender = app.render()
    expect(app.find('.ant-tabs-tab')).toHaveLength(2)
    expect(app.find('.ant-tabs-tab-active')).toHaveLength(1)
    expect(app.find('.ant-tabs-tab-active').text()).toBe('One')
    app.instance().wrappedInstance.onChangeTab('two')
    app.unmount()

    appHistory.push({
      hash: 'two',
    })
    app = mount(App)
    expect(app.find('.ant-tabs-tab-active').text()).toBe('Two')
  })
})
