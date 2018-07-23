import sites from './_sites.json'

export default req => {
  if (req.method === 'GET') {
    return sites
  }
  return {
    message: '操作成功',
  }
}
