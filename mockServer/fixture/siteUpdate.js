module.exports = function(req, res) {
  res.json({
    code: 200,
    data: req.body,
  })
}
