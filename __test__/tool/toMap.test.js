import toMap from 'tool/toMap'

describe('测试toMap', () => {
  test('将数组转换成value为key，label为值的对象', () => {
    const ROLE_TYPE = [
      {
        label: '自营超管',
        value: 'C001',
      },
      {
        label: '自营采销',
        value: 'C002',
      },
    ]
    expect(toMap(ROLE_TYPE)).toEqual({
      C001: '自营超管',
      C002: '自营采销',
    })
  })
})
