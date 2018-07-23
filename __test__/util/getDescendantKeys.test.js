import getDescendantKeys from 'util/getDescendantKeys'

describe('util/getDescendantKeys', () => {
  it('get keys with keyName "k"', () => {
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
            children: [
              {
                k: 7,
              },
              {
                k: 8,
              },
            ],
          },
        ],
      },
      { k: 3 },
    ]
    expect(getDescendantKeys(data[1], 'k')).toEqual([4, 5, 7, 8])
  })

  it('get keys without keyName', () => {
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
            children: [
              {
                key: 7,
              },
              {
                key: 8,
              },
            ],
          },
        ],
      },
      { key: 3 },
    ]
    expect(getDescendantKeys(data[1])).toEqual([4, 5, 7, 8])
  })
})
