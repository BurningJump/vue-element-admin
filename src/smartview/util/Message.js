import { MessageBox } from 'element-ui'

export function showSucMesg(config) {
  MessageBox.prompt(config.msg, '提示',
    {
      confirmButtonText: '确定',
      type: 'success',
      callback: config.fn
    })
}

export function showFailMesg(config) {
  MessageBox.prompt(config.msg, '提示',
    {
      confirmButtonText: '确定',
      type: 'error',
      callback: config.fn
    })
}
