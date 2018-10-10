import intersection from 'lodash/intersection'
import pull from 'lodash/pull'
import getDescendantKeys from 'tool/getDescendantKeys'

/* 从checkedKeys中删除node的所有空的上级节点的key */
export default function removeEmptyParentKey(
  node,
  checkedKeys,
  keyName = 'key',
) {
  checkedKeys = [...checkedKeys]
  if (
    node.parent &&
    intersection(getDescendantKeys(node.parent), checkedKeys).length === 0
  ) {
    pull(checkedKeys, node.parent[keyName])
    return removeEmptyParentKey(node.parent, checkedKeys, keyName)
  }
  return checkedKeys
}
