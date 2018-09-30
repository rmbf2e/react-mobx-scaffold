import React from 'react'
import PropTypes from 'prop-types'
import { toJS } from 'mobx'
import Tree from 'antd/lib/tree'
import uniq from 'lodash/uniq'
import pull from 'lodash/pull'
import getDescendantKeys from 'tool/getDescendantKeys'
import getParentKeys from 'tool/getParentKeys'

const { TreeNode } = Tree

export default class CheckedTree extends React.Component {
  static TreeNode = TreeNode

  static propTypes = {
    data: PropTypes.arrayOf(
      PropTypes.shape({
        key: PropTypes.string,
        title: PropTypes.string,
        checked: PropTypes.bool,
      }),
    ).isRequired,
    onCheck: PropTypes.func.isRequired,
    checkedKeys: PropTypes.arrayOf(PropTypes.string),
    disabledKeys: PropTypes.arrayOf(PropTypes.string),
  }

  static defaultProps = {
    checkedKeys: [],
    disabledKeys: [],
  }

  onCheck = (...args) => {
    let checkedKeys = args[0].checked
    const { checked } = args[1]
    const data = toJS(args[1].node.props.data)
    const parentKeys = getParentKeys(data)
    const descendentKeys = getDescendantKeys(data)
    if (checked) {
      checkedKeys = checkedKeys.concat(parentKeys, descendentKeys)
    } else {
      pull(checkedKeys, ...descendentKeys)
      // 通过取交集查看上级key是否在选中之内，没有则删除
      // 后来由于有需求，去掉该功能
      // 使父节点允许为空
      // checkedKeys = removeEmptyParentKey(data, checkedKeys)
    }
    const { onCheck } = this.props
    onCheck(uniq(checkedKeys))
  }

  renderTreeNodes = data => {
    if (!data) {
      return null
    }
    const { disabledKeys } = this.props
    return data.map(item => {
      const disabled = disabledKeys.includes(item.key)
      return (
        <TreeNode
          disabled={disabled}
          title={item.title}
          key={item.key}
          data={item}
          className={item.className}
        >
          {this.renderTreeNodes(item.children)}
        </TreeNode>
      )
    })
  }

  render() {
    const { checkedKeys, data } = this.props
    return (
      <Tree
        onCheck={this.onCheck}
        checkedKeys={checkedKeys}
        selectable={false}
        checkable
        checkStrictly
      >
        {this.renderTreeNodes(data)}
      </Tree>
    )
  }
}
