/**
 * @param {function} fn nodejs风格，以一个回调函数为最后一个参数
 * @return {function} 返回一个接收除最后一个回调函数外，其他参数与参数fn一样的函数，该函数运行则返回promise
 * */
const promisify = fn => (...args) =>
  new Promise((resolve, reject) => {
    fn(...args, (err, value) => {
      if (err) {
        reject(err)
      } else {
        resolve(value)
      }
    })
  })

export default promisify
