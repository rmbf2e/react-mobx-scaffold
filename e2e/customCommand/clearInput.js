exports.command = function clearInput(selector) {
  this.getValue(selector, function getValue(result) {
    let i = result.value.length
    this.click(selector)
    while (i > 0) {
      this.keys(this.Keys.BACK_SPACE)
      i -= 1
    }
  })
  this.click(selector)

  return this
}
