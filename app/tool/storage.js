// 存储并仅能存对象到sessionStorage
const { localStorage } = global

const storage = localStorage

/*
 * 用localStorage记录需要长期存储的前端数据
 * */

class Storage {
  // 用该对象记录存储的值是string还是复杂对象。
  keyValueCache = {}

  get(key) {
    const item = storage.getItem(key)
    if (!item) {
      return false
    }
    if (key in this.keyValueCache) {
      return item
    }
    try {
      return JSON.parse(item)
    } catch (e) {
      return item
    }
  }

  set(key, value) {
    if (typeof value === 'string') {
      this.keyValueCache[key] = true
      return storage.setItem(key, value)
    }
    return storage.setItem(key, JSON.stringify(value))
  }
}

export default new Storage()
