import getParentKeys from 'util/getParentKeys'
import formatTreeData from 'util/formatTreeData'

describe('util/getParentKeys', () => {
  it('parent keys', () => {
    const data = formatTreeData(
      [
        {
          k: 1,
          title: 'a',
          children: [
            {
              k: 2,
              title: 'a',
              children: [
                {
                  k: 3,
                  title: 'a',
                },
              ],
            },
          ],
        },
      ],
      'k',
      'title',
    )
    expect(getParentKeys(data[0].children[0].children[0])).toEqual(['2', '1'])
  })
})
