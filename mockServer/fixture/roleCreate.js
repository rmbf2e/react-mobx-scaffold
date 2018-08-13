module.exports = function(req, res) {
  const roleId = Math.random()
    .toString(16)
    .slice(2)
  const data = {
    ...req.body,
    roleId,
  }
  res.json({
    code: 200,
    data,
  })
}
