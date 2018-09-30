/**
 * 获取所有子孙节点的key值
 * @param {Object} node 当前节点
 * @param {String} keyName 获取节点的键名称，默认为key
 * @return {Array} 后代节点键集合
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
