import VBaseDetailForm from '@/smartview/bizform/VBaseDetailForm.js'
import { basicConstant } from '@/smartview/VBasicConstant.js'

export default class InvRequestDetailForm extends VBaseDetailForm {
  operationCode = 'DP02' ;

  static NewInstant(parent, formMeta) {
    return new InvRequestDetailForm(parent, formMeta)
  }

}

