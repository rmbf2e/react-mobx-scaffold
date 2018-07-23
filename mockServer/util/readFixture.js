import path from 'path'
// import fs from 'fs'

/*
 * 从server/fixtures文件夹中读取json文件
 * @param {String} filename
 * @return {Object} json/js文件的内容读取为对象
 * */
const readFixtures = filename => {
  const filepath = path.resolve(process.cwd(), `mockServer/fixture/${filename}`)
  const result = require(filepath)
  return result.default ? result.default : result
}

export default readFixtures
