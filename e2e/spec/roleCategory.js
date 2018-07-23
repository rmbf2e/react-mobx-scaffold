require('babel-register')
const { ROLE_TYPE } = require('../../app/constant')

module.exports = {
  'role page': function home(browser) {
    browser.login()

    const contentSelector = '.ant-layout-content .ant-card-body'
    const thead = `${contentSelector} .ant-table-thead`
    browser.waitForElementVisible(thead, 5000)

    const cardHeadSelector = '.ant-card-head-title'
    const newRole = {
      name: 'testName',
      fullName: 'testFullName',
    }
    browser.assert
      .elementNotPresent('.ant-modal-body form')
      .click(`${cardHeadSelector} .ant-btn:nth-of-type(1)`)
      .assert.elementPresent('.ant-modal-body form')
      .pause(1000)
      .assert.containsText('.ant-modal-title', '创建角色')
      .pause(1000)
      .setValue('.ant-modal-body input#name', newRole.name)
      .setValue('.ant-modal-body input#fullName', newRole.fullName)
      // 提交表单
      .click('.ant-modal-footer .ant-btn-primary')
      // 提交后modal关闭
      .waitForElementNotPresent('.ant-modal-body', 3000)

    // 搜索新角色
    const newRowSelector = '.ant-table-row:first-of-type'
    const lastTdSelector = `${newRowSelector} td:last-of-type`
    browser
      .setValue('.ant-card-head-title #name', newRole.name)
      .click('.ant-card-head-title button[type="submit"]')
      .pause(2000)
      .expect.element(newRowSelector)
      .text.to.contain(ROLE_TYPE[0].label) // 自营超管
    browser.assert.count(`${newRowSelector} td:last-of-type button`, 1)
    const editButtonSelector = `${newRowSelector} td:last-of-type button:nth-of-type(1)`
    /* 自营采销测试 start */
    browser
      .click(editButtonSelector)
      .waitForElementPresent('.ant-modal-body form', 3000)
      .pause(1000)
      .click('.ant-modal-body .ant-select')
      .pause(1000)
      .click('.ant-select-dropdown-menu-item:nth-of-type(2)')
      .pause(1000)
      // 提交表单
      .click('.ant-modal-footer .ant-btn-primary')
      // 提交后modal关闭
      .waitForElementNotPresent('.ant-modal-body', 3000)
    browser.expect.element(newRowSelector).text.to.contain(ROLE_TYPE[1].label)
    browser.assert.count(`${newRowSelector} td:last-of-type button`, 1)
    /* 自营采销测试 end */

    /* 自营商家 start */
    browser
      .click(editButtonSelector)
      .waitForElementPresent('.ant-modal-body form', 3000)
      .pause(1000)
      .click('.ant-modal-body .ant-select')
      .pause(1000)
      .click('.ant-select-dropdown-menu-item:nth-of-type(3)')
      .pause(1000)
      // 提交表单
      .click('.ant-modal-footer .ant-btn-primary')
      // 提交后modal关闭
      .waitForElementNotPresent('.ant-modal-body', 3000)
    browser.expect.element(newRowSelector).text.to.contain(ROLE_TYPE[2].label)
    browser.expect.element(lastTdSelector).text.to.contain('配置自营品类')
    browser.expect.element(lastTdSelector).text.to.contain('配置自营品牌')
    browser.assert.count(`${newRowSelector} td:last-of-type button`, 3)
    /* 自营商家测试 end */

    /* 7fresh超管 start */
    browser
      .click(editButtonSelector)
      .waitForElementPresent('.ant-modal-body form', 3000)
      .pause(1000)
      .click('.ant-modal-body .ant-select')
      .pause(1000)
      .click('.ant-select-dropdown-menu-item:nth-of-type(4)')
      .pause(1000)
      // 提交表单
      .click('.ant-modal-footer .ant-btn-primary')
      // 提交后modal关闭
      .waitForElementNotPresent('.ant-modal-body', 3000)
    browser.expect.element(newRowSelector).text.to.contain(ROLE_TYPE[3].label)
    browser.assert.count(`${newRowSelector} td:last-of-type button`, 1)
    /* 7fresh超管 end */

    /* 7fresh采销 start */
    browser
      .click(editButtonSelector)
      .waitForElementPresent('.ant-modal-body form', 3000)
      .pause(1000)
      .click('.ant-modal-body .ant-select')
      .pause(1000)
      .click('.ant-select-dropdown-menu-item:nth-of-type(5)')
      .pause(1000)
      // 提交表单
      .click('.ant-modal-footer .ant-btn-primary')
      // 提交后modal关闭
      .waitForElementNotPresent('.ant-modal-body', 3000)
    browser.expect.element(newRowSelector).text.to.contain(ROLE_TYPE[4].label)
    browser.assert.count(`${newRowSelector} td:last-of-type button`, 1)
    /* 7fresh采销 end */

    /* 自营品类管理员 start */
    browser
      .click(editButtonSelector)
      .waitForElementPresent('.ant-modal-body form', 3000)
      .pause(1000)
      .click('.ant-modal-body .ant-select')
      .pause(1000)
      .click('.ant-select-dropdown-menu-item:nth-of-type(6)')
      .pause(1000)
      // 提交表单
      .click('.ant-modal-footer .ant-btn-primary')
      // 提交后modal关闭
      .waitForElementNotPresent('.ant-modal-body', 3000)
    browser.expect.element(newRowSelector).text.to.contain(ROLE_TYPE[5].label)
    browser.expect.element(lastTdSelector).text.to.contain('配置自营品类')
    browser.assert.count(`${newRowSelector} td:last-of-type button`, 2)
    /* 自营品类管理员 end */

    /* 自营品牌管理员 start */
    browser
      .click(editButtonSelector)
      .waitForElementPresent('.ant-modal-body form', 3000)
      .pause(1000)
      .click('.ant-modal-body .ant-select')
      .pause(1000)
      .click('.ant-select-dropdown-menu-item:nth-of-type(7)')
      .pause(1000)
      // 提交表单
      .click('.ant-modal-footer .ant-btn-primary')
      // 提交后modal关闭
      .waitForElementNotPresent('.ant-modal-body', 3000)
    browser.expect.element(newRowSelector).text.to.contain(ROLE_TYPE[6].label)
    browser.expect.element(lastTdSelector).text.to.contain('配置自营品牌')
    browser.assert.count(`${newRowSelector} td:last-of-type button`, 2)
    /* 自营品牌管理员 end */

    /* 7fresh品类管理员 start */
    browser
      .click(editButtonSelector)
      .waitForElementPresent('.ant-modal-body form', 3000)
      .pause(1000)
      .click('.ant-modal-body .ant-select')
      .pause(1000)
      .click('.ant-select-dropdown-menu-item:nth-of-type(8)')
      .pause(1000)
      // 提交表单
      .click('.ant-modal-footer .ant-btn-primary')
      // 提交后modal关闭
      .waitForElementNotPresent('.ant-modal-body', 3000)
    browser.expect.element(newRowSelector).text.to.contain(ROLE_TYPE[7].label)
    browser.expect.element(lastTdSelector).text.to.contain('配置7fresh品类')
    browser.assert.count(`${newRowSelector} td:last-of-type button`, 2)
    /* 7fresh品类管理员 end */

    /* 7fresh品牌管理员 start */
    browser
      .click(editButtonSelector)
      .waitForElementPresent('.ant-modal-body form', 3000)
      .pause(1000)
      .click('.ant-modal-body .ant-select')
      .pause(1000)
      .click('.ant-select-dropdown-menu-item:nth-of-type(9)')
      .pause(1000)
      // 提交表单
      .click('.ant-modal-footer .ant-btn-primary')
      // 提交后modal关闭
      .waitForElementNotPresent('.ant-modal-body', 3000)
    browser.expect.element(newRowSelector).text.to.contain(ROLE_TYPE[8].label)
    browser.expect.element(lastTdSelector).text.to.contain('配置7fresh品牌')
    browser.assert.count(`${newRowSelector} td:last-of-type button`, 2)
    /* 7fresh品牌管理员 end */

    // 最后清除角色
    browser
      .click(`${newRowSelector} input[type="checkbox"]`)
      .pause(1000)
      .click('.ant-card-head-title .ant-btn-danger')
      .pause(1000)
      .assert.containsText('.ant-confirm-title', '确认删除选中的角色？')
      .click('.ant-confirm-btns button.ant-btn-primary')
      .waitForElementNotPresent('.ant-modal-body', 3000)
      .waitForElementNotPresent(newRowSelector, 3000)
      .end()
  },
}
