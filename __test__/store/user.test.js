import noop from 'lodash'
import { user } from 'store/user'

describe('store/user', () => {
  it('record:changed event', () => {
    const spy = jest.spyOn(user, 'fetchList').mockImplementation(noop)
    user.emit('record:changed')
    expect(spy).toHaveBeenCalledTimes(1)
  })
})
