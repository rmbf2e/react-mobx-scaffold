import enUS from 'antd/lib/locale-provider/en_US'
import zhCN from 'antd/lib/locale-provider/zh_CN'
import { Locale } from 'store/locale'

describe('store/locale', () => {
  let originalNavigator
  beforeEach(() => {
    originalNavigator = global.navigator
  })
  afterEach(() => {
    // restore
    Object.defineProperty(global, 'navigator', {
      get: () => originalNavigator,
    })
  })

  it('when browser lang is nether zhCN nor enUS default lang is enUS', done => {
    Object.defineProperty(global, 'navigator', {
      get: () => ({ language: 'en-GB' }),
    })
    const store = new Locale()
    setTimeout(() => {
      expect(store.lang).toBe(enUS)

      done()
    }, 5)
  })
  it('when browser lang is zhCN, lang is zhCN', done => {
    Object.defineProperty(global, 'navigator', {
      get: () => ({ language: 'zh-CN' }),
    })
    const store = new Locale()
    setTimeout(() => {
      expect(store.lang).toBe(zhCN)
      done()
    }, 5)
  })
})
