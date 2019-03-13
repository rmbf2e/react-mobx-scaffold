const lodash = require('lodash')

const { times } = lodash

module.exports = function users(req, res) {
  if (req.method === 'GET') {
    const page = req.query.page || 1
    const pageSize = Number(req.query.pageSize || 10)
    const list = times(pageSize, i => ({
      id: `${i + page * pageSize}`,
      account: `user${i + page * pageSize}`,
      mail: 'aaa@test.com',
      mobile: 15888888888,
      name: 'AAA',
      gender: '1',
    }))
    res.json({
      list,
      page,
      total: 1000,
      pageSize,
    })
  } else {
    res.json(req.body)
  }
}
