import { MessageBox, Message } from 'element-ui'

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

export function askMesg(config) {
  MessageBox.prompt(config.msg, '提问',
    {
      confirmButtonText: '确定',
      type: 'warning',
      showCancelButton: false,
      callback: config.fn
    })
}

export function alert(message) {
  Message.warning(
    {
      message: message,
      type: 'warning',
      center: true,
      duration: 5 * 1000,
      showClose: true
    })
}

export function success(message) {
  Message.Message(
    {
      message: message,
      type: 'success',
      duration: 5 * 1000,
      showClose: true
    })
}

export function info(message) {
  Message.Message(
    {
      message: message,
      type: 'info',
      duration: 5 * 1000,
      showClose: true
    })
}

export function error(message) {
  Message.Message(
    {
      message: message,
      type: 'error',
      duration: 5 * 1000,
      showClose: true
    })
}
