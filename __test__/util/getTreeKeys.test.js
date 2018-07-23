import getTreeKeys from 'util/getTreeKeys'

describe('util/getTreeKeys', () => {
  it('get keys with keyName', () => {
    const data = [
      { k: 1, checked: true },
      {
        k: 2,
        children: [
          {
            k: 4,
            checked: true,
          },
          {
            k: 5,
            checked: true,
          },
        ],
      },
      { k: 3 },
    ]
    expect(getTreeKeys(data, 'k', true)).toEqual([1, 4, 5])
  })

  it('get keys without default keyName, the default keyName is "key"', () => {
    const data = [
      { key: 1, checked: true },
      {
        key: 2,
        children: [
          {
            key: 4,
            checked: true,
          },
          {
            key: 5,
            checked: true,
          },
        ],
      },
      { key: 3 },
    ]
    expect(getTreeKeys(data, 'key', true)).toEqual([1, 4, 5])
  })

  it('获取所有key，无论是否选中的', () => {
    const data = [
      { k: 1, checked: true },
      {
        k: 2,
        children: [
          {
            k: 4,
            checked: true,
          },
          {
            k: 5,
            checked: true,
          },
        ],
      },
      { k: 3 },
    ]
    expect(getTreeKeys(data, 'k')).toEqual([1, 2, 4, 5, 3])
  })
})
