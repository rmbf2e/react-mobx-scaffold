module.exports = {
  logout: function home(browser) {
    const logoutLink = '.ant-layout-header figure:last-of-type a'
    browser
      .login()
      .waitForElementVisible(logoutLink, 3000)
      .click(logoutLink)
      .waitForElementVisible('.login_pop_inner.login_withpc', 5000)
      .assert.urlEquals('http://test.ssa.jd.com/sso/login?ReturnUrl=http%3A%2F%2Flocal-rmbrbac.jd.com%2F')
    browser.end()
  },
}
