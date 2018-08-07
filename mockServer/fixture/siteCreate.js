module.exports = function(req, res) {
  const siteId = Math.random()
    .toString()
    .slice(2)
  const data = {
    ...req.body,
    siteId,
  }
  res.json({
    code: 200,
    data,
  })
}
