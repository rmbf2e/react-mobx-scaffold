const lodash = require('lodash')

const { times } = lodash

module.exports = function users(req, res) {
  if (req.method === 'GET') {
    const entities = times(20, i => ({
      account: 'aaa',
      mail: 'aaa@test.com',
      mobile: 15888888888,
      name: 'AAA',
      gender: '1',
      id: Number(i),
    }))
    res.json({
      code: 200,
      data: {
        entities,
        pageNo: req.query.page || 1,
        pageSize: 20,
      },
    })
  } else {
    res.json({
      code: 200,
    })
  }
}
