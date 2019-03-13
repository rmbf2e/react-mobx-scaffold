import { filterOption } from 'tool/filterOption'
import categoryL2Fixture from 'fixture/categoryL2.json'

describe('tool/filterOption', () => {
  it('测试filterOption方法', () => {
    const result = filterOption('小说', {
      props: {
        children: categoryL2Fixture.data,
      },
    })

    expect(typeof result).toBe('boolean')
  })
})
