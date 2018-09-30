import storage from 'tool/storage'

describe('tool/storage', () => {
  it('可以存储对象', async () => {
    const a = { name: 'a' }
    await storage.setItem('a', a)
    expect(await storage.getItem('a')).toEqual(a)
  })

  it('可以存储字符串', async () => {
    const a = 'sdfafsdf'
    await storage.setItem('a', a)
    expect(await storage.getItem('a')).toEqual(a)
  })
})
