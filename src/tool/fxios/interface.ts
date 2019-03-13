// 接口返回通用数据结构
export interface IApiData {
  list?: any[]
  page?: number
  pageSize?: number
  message?: string
  code?: string
  [key: string]: any
}

// 接口返回列表结构
export interface IList {
  list: any[]
  page: number
  total: number
  pageSize: number
}
