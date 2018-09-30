import Moment from 'moment'
import { parseMoment, formatMoment } from 'tool/moment'

describe('tool/moment', () => {
  it('解析字符串到Moment对象', () => {
    expect(parseMoment('2018-05-03')).toBeInstanceOf(Moment)
    const moments = parseMoment(['2018-05-03', '2011-09-12'])
    expect(moments[0]).toBeInstanceOf(Moment)
    expect(moments[1]).toBeInstanceOf(Moment)
  })

  it('parseMoment parse time format', () => {
    expect(parseMoment('2018-05-03 01:01:01')).toBeInstanceOf(Moment)
    expect(parseMoment('2018-05-03 01:01')).toBeInstanceOf(Moment)
    const moments = parseMoment(['2018-05-03 02:02', '2011-09-12 02:03:03'])
    expect(moments[0]).toBeInstanceOf(Moment)
    expect(moments[1]).toBeInstanceOf(Moment)
  })

  it('parseMoment parse not date str', () => {
    expect(parseMoment(111)).toBe(111)
    expect(parseMoment('aaa')).toBe('aaa')
  })

  it('formatMoment', () => {
    const date = '2018-01-01'
    const m = Moment(date)
    expect(formatMoment(m)).toBe(date)
    expect(formatMoment([m, m])).toEqual([date, date])
    expect(formatMoment(111)).toBe(111)
  })

  it('formatMoment for time', () => {
    const time = '2018-01-01 01:01:01'
    const m = Moment(time)
    expect(formatMoment(m, true)).toBe(time)
    expect(formatMoment([m, m], true)).toEqual([time, time])
  })
})
