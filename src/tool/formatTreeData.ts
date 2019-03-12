import { INode, TKey } from 'tool/getDescendantKeys'

/*
 * 格式化将树状结构对象
 * @param {Array} tree
 * @param {String} keyName
 * @param {String} titleName
 * @param {Object} parent
 * */
export default function formatTreeData(
  tree: INode[],
  keyName: TKey,
  titleName: string,
  parent: INode | null = null,
) {
  return tree.map(node => {
    const result: INode = {
      checked: node.checked,
      key: String(node[keyName]),
      title: node[titleName],
    }
    if (node.children) {
      result.children = formatTreeData(
        node.children,
        keyName,
        titleName,
        result,
      )
    }
    if (parent) {
      result.parent = parent
    }
    return result
  })
}
