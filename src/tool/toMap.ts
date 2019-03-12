// 将数组转换成value为key，label为值的对象
interface IItem {
  value: string
  label: string
}
export const toMap = (array: IItem[]) =>
  array.reduce(
    (r, { value, label }) => ({
      ...r,
      [value]: label,
    }),
    {},
  )
