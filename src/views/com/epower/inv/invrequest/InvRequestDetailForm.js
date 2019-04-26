import VBaseDetailForm from '@/smartview/bizform/VBaseDetailForm.js'

export default class InvRequestDetailForm extends VBaseDetailForm {
  operationCode = 'DP02' ;

  static NewInstant(parent, formMeta) {
    return new InvRequestDetailForm(parent, formMeta)
  }

}

