import Moment from 'moment'

export const timeFormat = 'YYYY-MM-DD HH:mm:ss'
export const dateFormat = 'YYYY-MM-DD'

/**
 * 解析字符串为Moment实例
 * @param {any} value 需要被格式化为时间的string
 * @return {any} 格式化的moment格式
 * */
function parseMoment(
  value: string | string[],
): string | Moment.Moment | Array<string | Moment.Moment>
function parseMoment(value: any): any {
  if (
    typeof value === 'string' &&
    // 解析日期，或时间的格式
    /^\d{4}-\d{2}-\d{2}( \d{2}:\d{2}(\d{2})?)?/.test(value)
  ) {
    return Moment(value)
  }
  if (Array.isArray(value) && value.length > 0) {
    return value.map(v => parseMoment(v))
  }
  return value
}

export { parseMoment }

/**
 * 解析Moment实例到字符串
 * 如果value有display属性则直接返回该属性，否则使用dateFormat格式化为日期格式
 * @param {any} value moment
 * @param {boolean} isTime should be time format?
 * @return {any} 日期或时间格式的string
 * */
function formatMoment(value: Moment.Moment, isTime: boolean): string
function formatMoment(value: Moment.Moment[], isTime: boolean): string[]
function formatMoment(value: any, isTime: boolean = false): any {
  if (value instanceof Moment) {
    const format = isTime ? timeFormat : dateFormat
    return (value as Moment.Moment).format(format)
  }
  if (Array.isArray(value) && value.length > 0) {
    return value.map(v => formatMoment(v, isTime))
  }
  return value
}
export { formatMoment }
