/**
 * 提取url路径的第一部分
 * @param {string} pathname 需要解析的路径，location.pathname
 * @return {string} 解析结果
 * */
const getFirstPathname = pathname => {
  if (!pathname || pathname === '/') {
    return '/'
  }
  if (pathname.startsWith('/')) {
    return `/${pathname.split('/')[1]}`
  }
  return `/${pathname.split('/')[0]}`
}

export default getFirstPathname
