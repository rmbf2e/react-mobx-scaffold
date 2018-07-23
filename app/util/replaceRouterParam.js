/* 将url中的路由参数替换成query中对应的数据
 * */
export default function replaceRouterParam(url, query, deleteWhenMatch = true) {
  if (!query) {
    return url
  }
  return url.replace(/(:[^/]+)/g, match => {
    const target = query[match.slice(1)]
    if (target) {
      if (deleteWhenMatch) {
        delete query[match.slice(1)]
      }
      return target
    }
    return match
  })
}
