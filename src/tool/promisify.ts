type NodeCallback = (err: Error | null, value: any) => any | void

// type NodeFunction = (values: any[], cb: NodeCallback) => any | void

/**
 * @param {function} nodejs风格，以一个回调函数为最后一个参数
 * @return {function} 返回一个接收除最后一个回调函数外，其他参数与参数fn一样的函数，该函数运行则返回promise
 * */
function promisify<T>(fn: any) {
  return (...args: any[]) =>
    new Promise((resolve, reject) => {
      const cb: NodeCallback = (err, value: T) => {
        if (err) {
          reject(err)
        } else {
          resolve(value)
        }
      }
      fn(...args, cb)
    })
}

export default promisify
