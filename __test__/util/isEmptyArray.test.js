import isEmptyArray from 'util/isEmptyArray'

describe('util/isEmptyArray', () => {
  it('只测试带空值的数组', () => {
    expect(isEmptyArray([])).toBe(true)
    expect(isEmptyArray([''])).toBe(true)
    // expect(isEmptyArray(['1'])).toBe(false)
  })
})
