/**
 * 返回参数的parentNode属性
 * 给Select，Popover等组件在Modal中的情况使用
 *
 * @param {object} trigger
 * @return {any} 返回的parentNode
 */
export const getPopupContainer = (trigger?: Element) =>
  (trigger ? trigger.parentNode : document.body) as HTMLElement
