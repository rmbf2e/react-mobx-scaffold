/* 获取所有上级节点的key
 * @param {Object} node
 * @param {String} keyName
 * */
export default function getParentKeys(node, keyName = 'key') {
  const keys = []
  if (node) {
    let p = node.parent
    while (p) {
      keys.push(p[keyName])
      p = p.parent
    }
  }
  return keys
}
