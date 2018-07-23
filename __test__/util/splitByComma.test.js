import splitByComma from 'util/splitByComma'

describe('util/splitByComma', () => {
  it('split by comma', () => {
    expect(splitByComma('a,b')).toEqual(['a', 'b'])
    expect(splitByComma('a，b')).toEqual(['a', 'b'])
  })

  it('split by whitespace', () => {
    expect(splitByComma('a b')).toEqual(['a', 'b'])
    expect(splitByComma('a  b')).toEqual(['a', 'b'])
  })

  it('split by comma with whitespace', () => {
    expect(splitByComma('a, b')).toEqual(['a', 'b'])
  })
})
