module.exports = function users(req, res) {
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
            sex: 1,
            siteId: 5,
            status: 1,
            id: 1,
          },
          {
            erp: 'erp_aaa',
            jdAccount: null,
            mail: 'aaa@jd.com',
            mobile: '1111',
            name: 'erp_aaa',
            orgId: 0,
            sex: 1,
            siteId: 5,
            status: 1,
            id: 2,
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
