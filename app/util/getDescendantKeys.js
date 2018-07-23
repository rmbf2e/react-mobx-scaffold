/*
 * 获取所有子孙节点的key值
 * @param {Object} node
 * @param {String} keyName
 * */
export default function getDescendantKeys(node, keyName = 'key') {
  let keys = []
  if (node && node.children) {
    node.children.forEach(n => {
      keys.push(n[keyName])
      if (n.children) {
        keys = keys.concat(getDescendantKeys(n, keyName))
      }
    })
  }
  return keys
}
