
import { basicConstant } from '@/smartview/VBasicConstant.js'

export default class VDataView {

  // 窗体
  forms = [];

  findDetailForm(formName) {
    var form = this.findForm(formName)
    if (form == null || form === undefined) return null
    if (form.ctype === basicConstant.FORMTYPE_DETAIL) {
      return form
    } else {
      return null
    }
  }

  findForm(formName) {
    for (var form of this.forms) {
      if (form.componentName === formName) {
        return form
      }
    }
  }
}

