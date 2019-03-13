import { removeEmptyParentKey } from 'tool/removeEmptyParentKey'

describe('tool/removeEmptyParentKey', () => {
  it('从keys集合上，删除node空上级keys, 默认用key作为keyName', () => {
    const parent = { key: '1' }
    const child1 = { key: '2', parent }
    parent.children = [child1]
    const child2 = { key: '3', parent: child1 }
    child1.children = [child2]
    const child3 = { key: '4', parent: child2 }
    child2.children = [child3]
    let keys = ['10', '11', '12', '1', '2', '3']

    keys = removeEmptyParentKey(child3, keys)
    expect(keys).toEqual(['10', '11', '12'])
  })

  it('使用自定义key名称', () => {
    const parent = { id: '1' }
    const child1 = { id: '2', parent }
    parent.children = [child1]
    const child2 = { id: '3', parent: child1 }
    child1.children = [child2]
    const child3 = { id: '4', parent: child2 }
    child2.children = [child3]
    let keys = ['10', '11', '12', '1', '2', '3']

    keys = removeEmptyParentKey(child3, keys, 'id')
    expect(keys).toEqual(['10', '11', '12'])
  })
})
