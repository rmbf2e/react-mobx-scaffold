import store from 'src/store'
import app from 'store/app'
import router from 'store/router'
import searchForm from 'store/searchForm'
import menu from 'store/menu'
import user from 'store/user'

describe('store', () => {
  it('test store children', () => {
    expect(store.app).toBe(app)
    expect(store.router).toBe(router)
    expect(store.searchForm).toBe(searchForm)
    expect(store.menu).toBe(menu)
    expect(store.user).toBe(user)
  })
})
