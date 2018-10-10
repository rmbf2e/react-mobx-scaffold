/**
 * 获取所有上级节点的key
 * @param {Object} node 当前节点
 * @param {String} keyName 获取节点的键名，默认为key
 * @return {Array} 所有上级节点的集合
 * */
export default function getParentKeys(node, keyName = 'key') {
  const keys = []
  if (node) {
    let p = node.parent
    while (p) {
      const v = p[keyName]
      if (!v) {
        break
      }
      keys.push(p[keyName])
      p = p.parent
    }
  }
  return keys
}
