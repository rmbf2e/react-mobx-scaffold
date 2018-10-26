// 将数组转换成value为key，label为值的对象
const toMap = array =>
  array.reduce(
    (r, { value, label }) => ({
      ...r,
      [value]: label,
    }),
    {},
  )

export default toMap
