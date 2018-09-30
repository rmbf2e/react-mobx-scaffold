module.exports = function(req, res) {
  if (req.method === 'GET') {
    res.json({
      code: 200,
      data: {
        entities: [
          {
            erp: 'erp_bbb',
            jdAccount: null,
            mail: 'bbb@test.com',
            mobile: '15888888888',
            name: 'bbb',
            orgId: 0,
            roles: [
              {
                fullName: '自营超级管理员',
                name: 'xx',
                roleId: 29,
                roleType: 'C002',
                siteId: 5,
                status: 1,
              },
            ],
            sex: 1,
            siteId: 5,
            status: 1,
            userId: 873,
          },
          {
            erp: 'erp_aaa',
            jdAccount: null,
            mail: 'aaa@jd.com',
            mobile: '1111',
            name: 'erp_aaa',
            orgId: 0,
            roles: [
              {
                fullName: '自营采销',
                name: 'aaa',
                roleId: 47,
                roleType: '1',
                siteId: 5,
                status: 1,
              },
            ],
            sex: 1,
            siteId: 5,
            status: 1,
            userId: 874,
          },
        ],
        pageNo: 1,
        pageSize: 20,
      },
    })
  } else {
    res.json({
      code: 200,
    })
  }
}