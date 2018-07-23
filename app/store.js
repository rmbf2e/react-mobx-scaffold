const storeRequire = require.context('./store', true, /\.js$/)

const store = {}

// 将所有store文件夹内的文件按文件名都放到store对象中
storeRequire.keys().forEach(key => {
  const storeName = key.match(/\.\/(\w+)\.js$/)[1]
  store[storeName] = storeRequire(key).default
})

export default store
