import { Modal } from 'antd'

/**
 * 使用antd的Modal生成确认提示弹出ui
 * 参数与Modal的confirm相同
 * @param {object} option 与Modal.confirm参数相同
 * @return {object} 由Modal.confirm创建的实例
 * */
export default option => {
  const { onOk, ...modalOption } = option
  const modal = Modal.confirm({
    onOk: () => {
      const promise = onOk()
      if (promise.then) {
        promise.then(() => modal.destroy())
      } else {
        modal.destroy()
      }
    },
    onCancel: () => modal.destroy(),
    ...modalOption,
  })
}
