/* check the selector value is equal your input value
 * each 1000 milisecond
 * in your input timeout
 * */
exports.command = function waitForValueEqual(selector, value, timeout) {
  let valueOk = false
  let timeUsed = 0
  const performCb = done => {
    this.getValue(selector, result => {
      if (result.value === value) {
        valueOk = true
      }
    })
    if (valueOk) {
      valueOk = false
      done()
    } else if (timeUsed < timeout) {
      setTimeout(() => {
        performCb(done)
      }, 1000)
      timeUsed += 1000
    } else {
      done()
    }
  }
  this.perform(performCb)
}
