import 'jest-enzyme'
import noop from 'lodash/noop'
import fetchMock from 'fetch-mock'
import router from '../app/store/router'

afterEach(() => {
  fetchMock.restore()
  router.push('/')
})

// 抑制validator报错
beforeEach(() => {
  jest.spyOn(console, 'warn').mockImplementation(noop)
})
