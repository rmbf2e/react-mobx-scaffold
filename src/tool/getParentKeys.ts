interface INode {
  parent: INode
  [key: string]: any
}

/**
 * 获取所有上级节点的key
 * @param {Object} node 当前节点
 * @param {String} keyName 获取节点的键名，默认为key
 * @return {Array} 所有上级节点的集合
 * */
export function getParentKeys(node: INode, keyName: string = 'key'): string[] {
  const keys: string[] = []
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
