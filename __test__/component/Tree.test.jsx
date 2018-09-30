import React from 'react'
import { mount } from 'enzyme'
import formatTreeData from 'tool/formatTreeData'
import Tree from 'component/Tree'
import treeData from '../fixture/tree.json'

describe('component/Tree', () => {
  class TestTree extends React.Component {
    data = formatTreeData(treeData, 'resId', 'fullName')

    state = {
      checkedKeys: [],
    }

    onCheck = checkedKeys => {
      this.setState({
        checkedKeys,
      })
    }

    render() {
      const { checkedKeys } = this.state
      return (
        <Tree
          data={this.data}
          checkedKeys={checkedKeys}
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

  it('点击子组件，若该树内为空，则上级组件不会自动uncheck', () => {
    const tree = mount(<TestTree />)
    expect(tree.state('checkedKeys')).toHaveLength(0)
    // 修改默认不展开后，必须手动展开第一个节点
    tree
      .find('.ant-tree-switcher.ant-tree-switcher_close')
      .at(0)
      .simulate('click')
    const checkbox = tree.find('.ant-tree-node-content-wrapper')
    checkbox.at(0).simulate('click')
    expect(tree.state('checkedKeys').length).toBeGreaterThan(1)
    checkbox.at(1).simulate('click')
    expect(tree.state('checkedKeys')).toHaveLength(1)
  })
})
