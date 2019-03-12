const path = require('path')

const resolveRoot = relativePath => path.resolve(__dirname, '..', relativePath)

module.exports = resolveRoot
