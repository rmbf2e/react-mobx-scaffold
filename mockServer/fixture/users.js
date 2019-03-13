const lodash = require('lodash')

const { times } = lodash

module.exports = function users(req, res) {
  if (req.method === 'GET') {
    const page = req.query.page || 1
    const list = times(20, i => ({
      account: `user${i + page * 10}`,
      mail: 'aaa@test.com',
      mobile: 15888888888,
      name: 'AAA',
      gender: '1',
      id: Number(i),
    }))
    res.json({
      list,
      page,
      total: 1000,
      pageSize: 10,
    })
  } else {
    res.json(req.body)
  }
}
