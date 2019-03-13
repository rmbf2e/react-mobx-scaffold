import { formatTreeData } from 'tool/formatTreeData'
import data from '../fixture/tree.json'

describe('tool/formatTreeData', () => {
  it('格式化Tree数据', () => {
    const d = formatTreeData(data, 'resId', 'fullName')
    // 随便测试了几个数据，有问题再添加测试
    expect(d[0].key).toBe(String(data[0].resId))
    expect(d[0].title).toBe(data[0].fullName)
    expect(d[0].children[0].parent).toBe(d[0])
  })
})
