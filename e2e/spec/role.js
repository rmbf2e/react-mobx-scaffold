// For authoring Nightwatch tests, see
// http://nightwatchjs.org/guide#usage
require('babel-register')

const { ROLE_TYPE, ROLE_STATUS } = require('../../app/constant')

module.exports = {
  'role page': function home(browser) {
    browser
      .login()

      // 确认项目title
      .assert.containsText('.ant-layout-header', '品策权限管理系统')

      // 确认左侧菜单
      .assert.containsText(
        '.ant-layout-sider .ant-menu-item:nth-of-type(1)',
        '角色管理',
      )
      .assert.containsText(
        '.ant-layout-sider .ant-menu-item:nth-of-type(2)',
        '用户管理',
      )

    const contentSelector = '.ant-layout-content .ant-card-body'
    const thead = `${contentSelector} .ant-table-thead`

    browser
      .waitForElementVisible(thead, 5000)
      .assert.containsText(thead, '角色ID')
      .assert.containsText(thead, '角色简称')
      .assert.containsText(thead, '角色名称')
      .assert.containsText(thead, '类型')
      .assert.containsText(thead, '角色状态')
      .assert.containsText(thead, '修改时间')
      .assert.containsText(thead, '操作')
    // 确认初始状态没有行被选中
    browser.assert
      .elementNotPresent('.ant-checkbox-checked')
      .click(`${thead} input[type="checkbox"]`)
    // 点击全选后所有行都选中
    // 至少需要有一行数据
    browser
      .waitForElementVisible('.ant-checkbox-checked', 2000)
      .pause(1000)
      .assert.elementPresent('.ant-checkbox-checked')
      // 再点击全选后取消所有行都选中
      .click(`${thead} input[type="checkbox"]`)
      .waitForElementNotPresent('.ant-checkbox-checked', 2000)

    const cardHeadSelector = '.ant-card-head-title'
    const newRole = {
      name: 'testName',
      fullName: 'testFullName',
    }
    // 点击新增
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

    // 搜索新增加的角色
    browser
      .setValue('.ant-card-head-title #name', newRole.name)
      .click('.ant-card-head-title button[type="submit"]')
      .pause(2000)

    // 增加新role后在第一行显示
    const newRowSelector = '.ant-table-row:first-of-type'
    browser.expect.element(newRowSelector).text.to.contain(newRole.name)
    browser.expect.element(newRowSelector).text.to.contain(newRole.fullName)
    browser.expect.element(newRowSelector).text.to.contain(ROLE_STATUS[0].label)
    browser.expect
      .element(`${newRowSelector} td:nth-of-type(5)`)
      .text.to.contain(ROLE_TYPE[0].label)

    // 更新该角色
    const editButtonSelector = `${newRowSelector} td:last-of-type button:nth-of-type(1)`
    browser.expect.element(editButtonSelector).text.to.equal('编 辑')
    browser
      .click(editButtonSelector)
      .pause(1000)
      .assert.containsText('.ant-modal-title', '编辑角色')
      .clearValue('.ant-modal-body input#name')
      .pause(1000)
      .setValue('.ant-modal-body input#name', '新简称')
      .click('.ant-modal-body input#fullName')
      .clearValue('.ant-modal-body input#fullName')
      .setValue('.ant-modal-body input#fullName', '新名字')
      // 选择角色类型
      .click('.ant-modal-body .ant-select-enabled')
      .click('.ant-select-dropdown-menu-item:nth-of-type(2)')
      // 变更据色状态
      .click('.ant-modal-body .ant-radio-wrapper:last-of-type')
      // 提交表单
      .click('.ant-modal-footer .ant-btn-primary')
      // 提交后modal关闭
      .waitForElementNotPresent('.ant-modal-body', 3000)
    // 更新后根据新角色名称重新搜索
    browser
      .clearValue('.ant-card-head-title #name')
      .setValue('.ant-card-head-title #name', '新简称')
      .click('.ant-card-head-title button[type="submit"]')
      .pause(2000)
    // 确认数据被更新
    browser.expect.element(newRowSelector).text.to.contain('新简称')
    browser.expect.element(newRowSelector).text.to.contain('新名字')
    browser.expect.element(newRowSelector).text.to.contain(ROLE_STATUS[1].label)
    browser.expect.element(newRowSelector).text.to.contain(ROLE_TYPE[1].label)

    // 删除刚增加的数据
    browser
      .click(`${newRowSelector} input[type="checkbox"]`)
      .pause(1000)
      .click('.ant-card-head-title .ant-btn-danger')
      .pause(1000)
      .assert.containsText('.ant-confirm-title', '确认删除选中的角色？')
      .click('.ant-confirm-btns button.ant-btn-primary')
      .waitForElementNotPresent('.ant-modal-body', 3000)

      .waitForElementNotPresent(newRowSelector, 3000)

      // 清除搜索条件
      .click('.ant-card-head-title #name')
      .keys(browser.Keys.BACK_SPACE)
      .keys(browser.Keys.BACK_SPACE)
      .keys(browser.Keys.BACK_SPACE)
      .keys(browser.Keys.ENTER)
      // .clearValue('.ant-card-head-title #name')
      // .setValue('.ant-card-head-title #name', '')
      .pause(2000)
      // .click('.ant-card-head-title button[type="submit"]')
      .waitForElementPresent(newRowSelector, 3000)
      .end()
  },
}
