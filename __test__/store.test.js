import * as store from 'src/store'
import { app } from 'store/app'
import { router } from 'store/router'
import { queryForm } from 'store/queryForm'
import { menu } from 'store/menu'
import { user } from 'store/user'

describe('store', () => {
  it('test store children', () => {
    expect(store.app).toBe(app)
    expect(store.router).toBe(router)
    expect(store.queryForm).toBe(queryForm)
    expect(store.menu).toBe(menu)
    expect(store.user).toBe(user)
  })
})
