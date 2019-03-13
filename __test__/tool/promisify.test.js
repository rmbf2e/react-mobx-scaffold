import { promisify } from 'tool/promisify'

describe('util/promisify', () => {
  it('convert cb function to return promise', async () => {
    const cbFn = (value, cb) => {
      if (value) {
        cb(null, true)
      } else {
        cb(new Error('bomb'))
      }
    }

    const result = await promisify(cbFn)(true)
    expect(result).toBe(true)

    try {
      await promisify(cbFn)(false)
    } catch (e) {
      expect(e.toString()).toContain('bomb')
    }
  })
})
