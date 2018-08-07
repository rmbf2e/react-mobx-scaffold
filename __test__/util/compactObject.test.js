import compactObject from 'util/compactObject'

describe('util/compactObject', () => {
  it('过滤掉空值', () => {
    expect(compactObject()).toEqual({})
    expect(compactObject(null)).toEqual({})
    expect(compactObject('')).toEqual({})
    expect(compactObject({})).toEqual({})
    expect(compactObject({ a: '1', b: '' })).toEqual({ a: '1' })
    expect(compactObject({ a: '1', b: '', c: [] })).toEqual({ a: '1' })
    expect(compactObject({ a: '1', b: '', c: [''] })).toEqual({ a: '1' })
    expect(compactObject({ a: 1, b: '', c: [''] })).toEqual({ a: 1 })
  })
})
