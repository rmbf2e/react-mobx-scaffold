require('babel-register')
const config = require('../config')

module.exports = {
  'user page': function home(browser) {
    const userMenuLink = '.ant-layout-sider .ant-menu-item:nth-of-type(2)'
    browser
      .login()
      .waitForElementVisible(userMenuLink, 5000)
      .click(userMenuLink)
      .assert.urlEquals(`${config.host}user`)

    const contentSelector = '.ant-layout-content .ant-card-body'
    const thead = `${contentSelector} .ant-table-thead`
    browser
      .pause(3000) // 路由切换耗时
      .waitForElementVisible(thead, 5000)
      .assert.containsText(thead, '来源')
      .assert.containsText(thead, '帐号')
      .assert.containsText(thead, '姓名')
      .assert.containsText(thead, '性别')
      .assert.containsText(thead, '邮箱')
      .assert.containsText(thead, '手机')
      .assert.containsText(thead, '角色')
      .assert.containsText(thead, '类型')
      .assert.containsText(thead, '修改时间')
      .assert.containsText(thead, '操作')

    // 点击批量导入按钮
    browser
      .click('.ant-card-body .ant-btn-group .ant-btn:nth-of-type(2)')
      .pause(2000)
      .assert.containsText('.ant-modal-title', '批量导入用户')
      .assert.containsText(
        '.ant-modal-body .ant-col-12:nth-of-type(1)',
        '未下载过模板',
      )
      .assert.containsText(
        '.ant-modal-body .ant-col-12:nth-of-type(2)',
        '已有模板，直接上传',
      )
    // .elements('css selector', '.ant-modal-body .ant-card', result => {
    //   result.value.forEach(element => {
    //     browser.elementIdText(element.ELEMENT, text => {
    //       console.log(text)
    //     })
    //   })
    // })
    // .assert.containsText(
    //   '.ant-modal-body .ant-card:nth-of-type(1)',
    //   '点击下载模板',
    // )
    // .assert.containsText(
    //   '.ant-modal-body .ant-card:nth-of-type(2)',
    //   '上传文件',
    // )

    browser.end()
  },
}
