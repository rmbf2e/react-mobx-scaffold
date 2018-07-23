import pluralize from 'pluralize'
import upperFirst from 'lodash/upperFirst'

/*
 * 通过dom的dataset中的index获取当前页面中store的列表数据
 * */
export default (store, name, e) => {
  const { index } = e.target.dataset
  const data = store[pluralize(name)].tableProps.dataSource[index]
  store[`set${upperFirst(name)}`]({ data })
}
