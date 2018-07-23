import replaceRouterParam from 'util/replaceRouterParam'

describe('util/replaceRouterParam', () => {
  it('replace router params', () => {
    expect(replaceRouterParam('/abc/:id', { id: 33 })).toEqual('/abc/33')
    expect(replaceRouterParam('/abc/:id/def/:name', { id: 33, name: 'xxx' })).toEqual('/abc/33/def/xxx')
  })

  it('如果没有匹配则不替换', () => {
    const query = { id: 33 }
    expect(replaceRouterParam('/abc/:id/edit/:name', query)).toEqual('/abc/33/edit/:name')
    expect(query).toEqual({})
  })

  it('如果第三个参数deleteWhenMatch为true则不删除query对应的属性', () => {
    const query = { id: 33 }
    expect(replaceRouterParam('/abc/:id/edit/:name', { id: 33 }, true)).toEqual('/abc/33/edit/:name')
    expect(query).toEqual({ id: 33 })
  })
})
