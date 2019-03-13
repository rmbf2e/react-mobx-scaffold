import { Tabs } from 'antd'
import { inject, observer } from 'mobx-react'
import React, { Component } from 'react'
import { RouterStore } from 'store/interface'

/*
 * 在tab切换过程中将每个TabPane的key作为hash push到history
 * 达到通过hash记录当前被选中tab的功能
 * */

interface IProp {
  store?: {
    router: RouterStore
  }
  onChange?: (v: string) => void
}

@inject('store')
@observer
class TabsMemoryByHash extends Component<IProp> {
  public static TabPane = Tabs.TabPane

  public static defaultProps = {
    onChange: null,
  }

  public defaultActiveKey = ''

  public componentWillMount() {
    const {
      router: { location },
    } = this.props.store!
    if (location.hash) {
      this.defaultActiveKey = location.hash.slice(1)
    }
  }

  public onChangeTab = (key: string) => {
    const {
      router: { location, push },
    } = this.props.store!
    push({
      search: location.search,
      hash: key,
    })
    const { onChange } = this.props
    if (onChange) {
      onChange(key)
    }
  }

  public render() {
    const props = { ...this.props }
    return (
      <Tabs
        {...props}
        onChange={this.onChangeTab}
        defaultActiveKey={this.defaultActiveKey}
      />
    )
  }
}

export { TabsMemoryByHash as Tabs }
