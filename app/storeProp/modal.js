import { action, extendObservable } from 'mobx'
import upperFirst from 'lodash/upperFirst'
import castArray from 'lodash/castArray'

/**
 * 生成被修饰Class实例的 `${name}Modal`属性
 * 与`show{upperFirst(name)}Modal`方法，显示modal
 * 与`hide{upperFirst(name)}Modal`方法，隐藏modal
 *
 * 例如options为 [{name: 'blacklistForm'}]
 * 则生成属性 blacklistFormModal
 * 生成方法 showBlacklistFormModal
 * 生成方法 hideBlacklistFormModal
 *
 * @param {array} options 生成modal的参数
 * @return {void}
 * */
function generateModal(options) {
  castArray(options).forEach(option => {
    const name = typeof option === 'string' ? option : option.name
    const modalName = `${name}Modal`
    const upperFirstName = upperFirst(name)
    const showMethod = `show${upperFirstName}Modal`
    const hideMethod = `hide${upperFirstName}Modal`
    extendObservable(
      this,
      {
        [modalName]: false,
        [showMethod]: () => {
          this[modalName] = true
        },
        [hideMethod]: () => {
          this[modalName] = false
        },
      },
      {
        [showMethod]: action,
        [hideMethod]: action,
      },
    )
  })
}

export default generateModal
