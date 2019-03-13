import Tree from 'antd/lib/tree'
import { AntTreeNodeCheckedEvent } from 'antd/lib/tree/Tree'
import { pull, uniq } from 'lodash'
import { toJS } from 'mobx'
import React from 'react'
import { getDescendantKeys } from 'tool/getDescendantKeys'
import { getParentKeys } from 'tool/getParentKeys'

const { TreeNode } = Tree

interface IData {
  key: string
  title: string
  checked: boolean
  className?: string
  children: IData[]
}

interface IProp {
  data: IData[]
  onCheck: (
    checkedKeys:
      | string[]
      | {
          checked: string[]
          halfChecked: string[]
        },
    e: AntTreeNodeCheckedEvent,
  ) => void
  checkedKeys: string[]
  disabledKeys: string[]
}

class CheckedTree extends React.Component<IProp> {
  public static TreeNode = TreeNode

  public static defaultProps = {
    checkedKeys: [],
    disabledKeys: [],
  }

  public onCheck = (
    checkedKeys:
      | string[]
      | {
          checked: string[]
          halfChecked: string[]
        },
    e: AntTreeNodeCheckedEvent,
  ) => {
    if ('checked' in checkedKeys) {
      let cKeys = checkedKeys.checked
      const { checked } = e
      const data = toJS(e.node.props.data)
      const parentKeys = getParentKeys(data)
      const descendentKeys = getDescendantKeys(data)
      if (checked) {
        cKeys = cKeys.concat(parentKeys, descendentKeys)
      } else {
        pull(cKeys, ...descendentKeys)
        // 通过取交集查看上级key是否在选中之内，没有则删除
        // 后来由于有需求，去掉该功能
        // 使父节点允许为空
        // checkedKeys = removeEmptyParentKey(data, checkedKeys)
      }
      const { onCheck } = this.props
      onCheck(uniq<string>(cKeys), e)
    }
  }

  public renderTreeNodes = (data?: IData[]) => {
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

  public render() {
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

export { CheckedTree as Tree }
