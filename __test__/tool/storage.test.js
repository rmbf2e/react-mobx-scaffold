import { storage } from 'tool/storage'

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

  it('没有当前key时，直接返回false', () => {
    expect(storage.get('test1024')).toBeFalsy()
  })

  it('处理非法json时，会直接将原值返回', () => {
    global.localStorage.setItem('b', 'test1024')
    expect(storage.get('b')).toEqual('test1024')
  })
})
