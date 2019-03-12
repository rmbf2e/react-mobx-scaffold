import { intersection, pull } from 'lodash'
import getDescendantKeys, { INode, TKey } from 'tool/getDescendantKeys'

/* 从checkedKeys中删除node的所有空的上级节点的key */
export default function removeEmptyParentKey(
  node: INode,
  checkedKeys: TKey[],
  keyName = 'key',
): TKey[] {
  const clonedKeys = [...checkedKeys]
  if (
    node.parent &&
    intersection(getDescendantKeys(node.parent), clonedKeys).length === 0
  ) {
    pull(clonedKeys, node.parent[keyName])
    return removeEmptyParentKey(node.parent, clonedKeys, keyName)
  }
  return clonedKeys
}
