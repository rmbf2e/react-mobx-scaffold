const fs = require('fs')

/**
 * 以文件修改时间为判断是否运行测试的条件，避免文件没有实际变化时多次运行
 * */
class MyWatchPlugin {
  constructor() {
    this.lastUpdated = {}
  }

  apply(jestHooks) {
    jestHooks.shouldRunTestSuite(testPath => {
      const f = fs.statSync(testPath.testPath)
      if (this.lastUpdated[testPath.testPath] !== f.mtimeMs) {
        this.lastUpdated[testPath.testPath] = f.mtimeMs
        return true
      }
      return false
    })
  }
}

module.exports = MyWatchPlugin
