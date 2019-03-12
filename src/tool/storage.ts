// 存储并仅能存对象到sessionStorage
const engine = localStorage

/*
 * 用localStorage记录需要长期存储的前端数据
 * */

class Storage {
  // 用该对象记录存储的值是string还是复杂对象。
  public keyValueCache: {
    [key: string]: any
  } = {}

  public get(key: string) {
    const item = engine.getItem(key)
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

  public set(key: string, value: any) {
    if (typeof value === 'string') {
      this.keyValueCache[key] = true
      return engine.setItem(key, value)
    }
    return engine.setItem(key, JSON.stringify(value))
  }
}

export const storage = new Storage()
