import { getFirstPathname } from 'tool/getFirstPathname'

describe('tool/getFirstPathname', () => {
  it('从/或空路径获取', () => {
    expect(getFirstPathname('')).toBe('/')
    expect(getFirstPathname('/')).toBe('/')
  })

  it('从单层路径获取', () => {
    expect(getFirstPathname('/abc')).toBe('/abc')
    expect(getFirstPathname('/def')).toBe('/def')
  })

  it('从多层路径获取', () => {
    expect(getFirstPathname('/abc/def')).toBe('/abc')
    expect(getFirstPathname('/def/fgg/333')).toBe('/def')
  })

  it('pathname没有以/开头的情况', () => {
    expect(getFirstPathname('abc/def')).toBe('/abc')
    expect(getFirstPathname('def/fgg/333')).toBe('/def')
  })
})
