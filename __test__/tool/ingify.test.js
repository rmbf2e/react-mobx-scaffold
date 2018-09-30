import ingify from 'tool/ingify'

describe('tool/ingify', () => {
  it('结尾有e或没有e的单词', () => {
    expect(ingify('make')).toBe('making')
    expect(ingify('destroy')).toBe('destroying')
  })

  it('去ie变y的', () => {
    expect(ingify('die')).toBe('dying')
    expect(ingify('tie')).toBe('tying')
  })

  it('c结尾的变ck', () => {
    expect(ingify('picnic')).toBe('picnicking')
    expect(ingify('traffic')).toBe('trafficking')
  })

  it('测试需要双写最后一个字母的', () => {
    expect(ingify('put')).toBe('putting')
    expect(ingify('run')).toBe('running')
    expect(ingify('swim')).toBe('swimming')
  })
})
