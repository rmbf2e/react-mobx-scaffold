import getDescendantKeys from 'util/getDescendantKeys'
import intersection from 'lodash/intersection'
import pull from 'lodash/pull'

/* 从checkedKeys中删除node的所有空的上级节点的key */
export default function pullParentKey(node, checkedKeys, keyName = 'key') {
  if (
    node.parent &&
    intersection(getDescendantKeys(node.parent), checkedKeys).length === 0
  ) {
    pull(checkedKeys, node.parent[keyName])
    pullParentKey(node.parent, checkedKeys, keyName)
  }
}
