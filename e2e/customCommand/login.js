const config = require('../config')

exports.command = function login() {
  const { user, host } = config
  this.url(host)
    // 未登录跳转
    .waitForElementVisible('.login_pop_inner.login_withpc', 5000)
    .assert.urlEquals('http://test.ssa.jd.com/sso/login?ReturnUrl=http%3A%2F%2Flocal-rmbrbac.jd.com%2F')
    .setValue('input#username', user.name)
    .setValue('input#password', user.password)
    .click('input.formsubmit_btn')
  // .pause(2000)
  return this
}
