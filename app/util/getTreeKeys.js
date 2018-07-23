/*
 * 根据键名称，获取树状对象中checked的值
 * @param {Array} value
 * @param {String} keyName
 * @param {Boolean} checked 默认false获取所有key，true时只返回checked的key
 * */
export default function getTreeKeys(value, keyName = 'key', checked = false) {
  let keys = []
  value.forEach(item => {
    if (!checked || item.checked) {
      keys.push(item[keyName])
    }
    if (item.children) {
      keys = keys.concat(getTreeKeys(item.children, keyName, checked))
    }
  })
  return keys
}
