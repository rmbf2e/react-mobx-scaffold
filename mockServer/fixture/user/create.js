module.exports = function(req, res) {
  const newUser = {
    account: 'new account',
    mail: 'bbb@test.com',
    mobile: '15888888888',
    name: 'bbb',
    sex: 1,
    id: Math.random()
      .toString()
      .slice(2),
  }
  res.json(newUser)
}
