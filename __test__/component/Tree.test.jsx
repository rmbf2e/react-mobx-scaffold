import React from 'react'
import Tree from 'component/Tree'
import { mount } from 'enzyme'
import formatTreeData from 'util/formatTreeData'
import treeData from '../fixture/tree.json'

describe('component/Tree', () => {
  class TestTree extends React.Component {
    state = {
      checkedKeys: [],
    }

    onCheck = checkedKeys => {
      this.setState({
        checkedKeys,
      })
    }
    data = formatTreeData(treeData, 'resId', 'fullName')

    render() {
      return (
        <Tree
          data={this.data}
          checkedKeys={this.state.checkedKeys}
          onCheck={this.onCheck}
        />
      )
    }
  }
  it('测试点击父组件，子组件全选或全不选', () => {
    const tree = mount(<TestTree />)
    const checkbox = tree.find('.ant-tree-node-content-wrapper')
    expect(tree.state('checkedKeys')).toHaveLength(0)
    checkbox.at(0).simulate('click')
    expect(tree.state('checkedKeys').length).toBeGreaterThan(1)
    checkbox.at(0).simulate('click')
    expect(tree.state('checkedKeys')).toHaveLength(0)
  })

  it('点击子组件，若该树内为空，则上级组件也自动uncheck', () => {
    const tree = mount(<TestTree />)
    const checkbox = tree.find('.ant-tree-node-content-wrapper')
    expect(tree.state('checkedKeys')).toHaveLength(0)
    checkbox.at(0).simulate('click')
    expect(tree.state('checkedKeys').length).toBeGreaterThan(1)
    checkbox.at(1).simulate('click')
    expect(tree.state('checkedKeys')).toHaveLength(0)
  })
})
