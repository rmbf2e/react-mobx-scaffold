module.exports = function(req, res) {
  const newUser = {
    erp: 'erp_bbb',
    jdAccount: null,
    mail: 'bbb@test.com',
    mobile: '15888888888',
    name: 'bbb',
    operateDate: '2018-06-19 12:49:06',
    orgId: 0,
    roles: [
      {
        fullName: '自营超级管理员',
        name: 'xx',
        operateDate: '2018-07-20 14:24:05',
        roleId: 29,
        roleType: 'C002',
        siteId: 5,
        status: 1,
      },
    ],
    sex: 1,
    siteId: 5,
    status: 1,
    userId: Math.random()
      .toString()
      .slice(2),
  }
  res.json(newUser)
}
