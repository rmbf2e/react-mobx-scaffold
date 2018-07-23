import compact from 'lodash/compact'
/* 将字符串按中英文逗号，空格分割为数组
 * 在提交skuIds等页面使用
 * */
export default str => {
  if (!str) {
    return []
  }
  return compact(str.split(/,|，|\s/))
}
