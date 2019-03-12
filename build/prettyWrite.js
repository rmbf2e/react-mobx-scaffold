const fs = require('fs')
const eol = require('eol')
const path = require('path')
const prettier = require('prettier')
const resolveRoot = require('./resolveRoot')
const prettierConfig = require('../prettier.config.js')

/**
 * 用prettier格式化写入文件，替换对应操作系统的换行符
 * @param {string} content 文件内容
 * @param {string} filePath 以项目根路径为基础的相对路径
 * @return {void}
 * */
const writeJs = (content, filePath) => {
  const { ext } = path.parse(filePath)
  prettierConfig.parser = 'babel'
  if (ext === '.json') {
    prettierConfig.parser = 'json'
  }
  if (ext === '.ts') {
    prettierConfig.parser = 'typescript'
  }
  // console.log(ext, parser)
  fs.writeFileSync(
    resolveRoot(filePath),
    eol.lf(prettier.format(content, prettierConfig)),
  )
}

module.exports = writeJs
