import { TableProps } from 'antd/lib/table'
import { isObject } from 'lodash'
import { IApiData, IList } from './interface'

interface ITableProps<T> extends TableProps<T> {
  originalData: any
}

/**
 * 检测接口数据若符合分页列表格式，
 * 则将数据格式化为antd Table适用的格式后返回
 * @param {object} data 接口数据
 * @return {object} 原数据，或格式化后适合Table组件的数据结构
 * */
export const processList = (data: IApiData): ITableProps<object> | IApiData => {
  if (isObject(data) && 'list' in data) {
    const d = data as IList
    return {
      dataSource: d.list,
      pagination: {
        current: Number(d.page) || 1,
        total: Number(d.total) || 0,
      },
    }
  }
  return data
}
