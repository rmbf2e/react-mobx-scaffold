import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Tabs } from 'antd'
import { inject } from 'mobx-react'

/*
 * 在tab切换过程中将每个TabPane的key作为hash push到history
 * 达到通过hash记录当前被选中tab的功能
 * */

@inject('store')
export default class TabsMemoryByHash extends Component {
  static TabPane = Tabs.TabPane

  static propTypes = {
    store: PropTypes.shape({
      router: PropTypes.shape({
        location: PropTypes.object,
        push: PropTypes.func,
      }),
    }).isRequired,
    onChange: PropTypes.func,
  }

  static defaultProps = {
    onChange: null,
  }

  onChangeTab = key => {
    const {
      router: { location, push },
    } = this.props.store
    push({
      search: location.search,
      hash: key,
    })
    const { onChange } = this.props
    if (onChange) {
      onChange(key)
    }
  }

  render() {
    const props = { ...this.props }
    props.onChange = this.onChangeTab
    const {
      router: { location },
    } = this.props.store
    if (location.hash) {
      props.defaultActiveKey = location.hash.slice(1)
    }
    return <Tabs {...props} />
  }
}
