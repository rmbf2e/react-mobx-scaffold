import { action, extendObservable } from 'mobx'
import upperFirst from 'lodash/upperFirst'
import castArray from 'lodash/castArray'

/*
 * 生成被修饰Class实例的 `${name}Modal`属性
 * 与`show{upperFirst(name)}Modal`方法，显示modal
 * 与`hide{upperFirst(name)}Modal`方法，隐藏modal
 *
 * 例如options为 [{name: 'blacklistForm'}]
 * 则生成属性 blacklistFormModal
 * 生成方法 showBlacklistFormModal
 * 生成方法 hideBlacklistFormModal
 *
 * @param {Array} options
 * @return void
 * */
function generateModal(options) {
  castArray(options).forEach(option => {
    const name = typeof option === 'string' ? option : option.name
    const modalName = `${name}Modal`
    const upperFirstName = upperFirst(name)
    const showMethodName = `show${upperFirstName}Modal`
    const hideMethodName = `hide${upperFirstName}Modal`
    extendObservable(
      this,
      {
        [modalName]: false,
        [showMethodName]: () => {
          this[modalName] = true
        },
        [hideMethodName]: () => {
          this[modalName] = false
        },
      },
      {
        [showMethodName]: action,
        [hideMethodName]: action,
      },
    )
  })
}

export default generateModal
