import intersection from 'lodash/intersection'
import pull from 'lodash/pull'
import getDescendantKeys from 'tool/getDescendantKeys'

/* 从checkedKeys中删除node的所有空的上级节点的key */
export default function removeEmptyParentKey(
  node,
  checkedKeys,
  keyName = 'key',
) {
  const resultKeys = [...checkedKeys]
  if (
    node.parent &&
    intersection(getDescendantKeys(node.parent), resultKeys).length === 0
  ) {
    pull(resultKeys, node.parent[keyName])
    return removeEmptyParentKey(node.parent, resultKeys, keyName)
  }
  return resultKeys
}
