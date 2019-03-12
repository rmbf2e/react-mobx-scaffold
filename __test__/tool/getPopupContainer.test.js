import { getPopupContainer } from 'tool/getPopupContainer'

describe('tool/getPopupContainer', () => {
  it('返回参数的parentNode属性', () => {
    const trigger = { parentNode: 'sdfsdaf' }
    expect(getPopupContainer(trigger)).toBe(trigger.parentNode)
  })
})
