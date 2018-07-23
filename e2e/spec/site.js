module.exports = {
  site: function home(browser) {
    const siteMenu = '.ant-layout-header .ant-menu-submenu:nth-of-type(2)'

    const testSite = {
      name: 'abcdef',
      fullName: '测试网站',
    }

    browser
      .login()
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

    browser
      .clearInput('input#name')
      .clearInput('input#fullName')
      .setValue('input#name', testSite.name)
      .setValue('input#fullName', testSite.fullName)
      .click('.ant-modal-footer button.ant-btn-primary')
      .pause(2000)
    browser.expect
      .element('tbody.ant-table-body tr:last-of-type')
      .text.to.contain(testSite.name)
      .text.to.contain(testSite.fullName)

    browser
      .click('tbody.ant-table-body tr:last-of-type td:last-of-type button')
      .pause(1000)
      .getValue('.ant-modal-body input#name', result => {
        browser.assert.equal(result.value, testSite.name)
      })
      .getValue('.ant-modal-body input#fullName', result => {
        browser.assert.equal(result.value, testSite.fullName)
      })

    // 更新站点
    browser
      .clearInput('.ant-modal-body input#name')
      .setValue('input#name', 'newsite')
      .click('.ant-modal-footer button.ant-btn-primary')
      .pause(2000)
    browser.expect
      .element('tbody.ant-table-body tr:last-of-type')
      .text.to.contain('newsite')

    // 删除测试站点
    browser
      .click('.ant-table-body tr:last-of-type checkbox')
      .pause(1000)
      .click('.ant-layout-content .ant-card-head button:nth-of-type(2)')
      .pause(1000)
    browser.expect
      .element('.ant-modal-body')
      .text.to.contain('确认删除选中的站点？')
    browser.click('.ant-confirm-btns button.ant-btn-primary').pause(1000)
    browser.expect
      .element('tbody.ant-table-body tr:last-of-type')
      .text.to.not.contain(testSite.name)
      .text.to.not.contain(testSite.fullName)
    browser.end()
  },
}
