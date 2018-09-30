const debounce = require('lodash/debounce')
// const fs = require('fs')

/**
 * 以文件修改时间为判断是否运行测试的条件，避免文件没有实际变化时多次运行
 * */
class MyWatchPlugin {
  constructor() {
    this.passed = false
    this.setPassed = debounce(() => {
      this.passed = true
    }, 2000)
  }

  apply(jestHooks) {
    jestHooks.shouldRunTestSuite(() => {
      this.setPassed()
      if (this.passed) {
        this.passed = false
        return true
      }
      return false
    })
    // jestHooks.shouldRunTestSuite(testPath => {
    //   const f = fs.statSync(testPath.testPath)
    //   if (this.lastUpdated[testPath.testPath] !== f.mtimeMs) {
    //     this.lastUpdated[testPath.testPath] = f.mtimeMs
    //     return true
    //   }
    //   return false
    // })
  }
}

module.exports = MyWatchPlugin
