const config = require('../config')

module.exports = {
  site: function site(browser) {
    const siteMenu = '.ant-layout-header .ant-menu-submenu:nth-of-type(2)'

    const testSite = {
      name: 'abcdef',
      fullName: '测试网站',
    }

    browser
      .url(config.host)
      .waitForElementVisible(siteMenu, 8000)
      .click(siteMenu)
      .pause(2000)
      .waitForElementVisible('.ant-layout-content .ant-card-body', 8000)
      .waitForElementVisible(
        '.ant-layout-content .ant-card-head button:nth-of-type(1)',
        4000,
      )
      .click('.ant-layout-content .ant-card-head button:nth-of-type(1)')
      .waitForElementVisible('.ant-modal-body', 7000)

    const nameErrorText = '请填写站点英文名'
    const fullNameErrorText = '请填写站点全称'
    browser.expect.element('.ant-modal-body').text.to.not.contain(nameErrorText)
    browser.expect
      .element('.ant-modal-body')
      .text.to.not.contain(fullNameErrorText)
    browser.click('.ant-modal-footer button.ant-btn-primary').pause(1000)
    browser.expect.element('.ant-modal-body').text.to.contain(nameErrorText)
    browser.expect.element('.ant-modal-body').text.to.contain(fullNameErrorText)
    browser
      .setValue('input#name', '$$$')
      .setValue('input#fullName', testSite.fullName)
    browser.click('.ant-modal-footer button.ant-btn-primary')
    browser.expect
      .element('.ant-modal-body')
      .text.to.contain('请填写网站英文名称，必须为小写字母与_')

    browser.end()
  },
}
