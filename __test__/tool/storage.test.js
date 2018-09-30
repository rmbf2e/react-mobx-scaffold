import storage from 'tool/storage'

describe('tool/storage', () => {
  it('可以存储对象', () => {
    const a = { name: 'a' }
    storage.set('a', a)
    expect(storage.get('a')).toEqual(a)
  })

  it('可以存储字符串', () => {
    const a = 'sdfafsdf'
    storage.set('a', a)
    expect(storage.get('a')).toEqual(a)
  })
})
