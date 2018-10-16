import zhCN from 'locale/zh_CN'
import enUS from 'locale/en_US'

describe('test locale scructure', () => {
  it('zhCN should have same structure to enUS', () => {
    expect(zhCN).toStructureEqual(enUS)
  })
})
