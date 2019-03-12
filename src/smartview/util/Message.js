import { MessageBox } from 'element-ui'

export function showSucMesg(config) {
  MessageBox.prompt(config.msg, '成功',
    {
      confirmButtonText: '确定',
      type: 'success',
      showInput: false,
      showCancelButton: false,
      callback: config.fn
    })
}

export function showFailMesg(config) {
  MessageBox.prompt(config.msg, '错误',
    {
      confirmButtonText: '确定',
      type: 'error',
      showInput: false,
      showCancelButton: false,
      callback: config.fn
    })
}
