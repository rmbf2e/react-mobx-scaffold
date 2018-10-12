module.exports = function users(req, res) {
  if (req.method === 'GET') {
    res.json({
      code: 200,
      data: {
        entities: [
          {
            account: 'aaa',
            mail: 'aaa@test.com',
            mobile: 15888888888,
            name: 'AAA',
            sex: 1,
            id: 1,
          },
          {
            account: 'bbb',
            mail: 'bbb@test.com',
            mobile: 1111,
            name: 'BBB',
            sex: 0,
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
