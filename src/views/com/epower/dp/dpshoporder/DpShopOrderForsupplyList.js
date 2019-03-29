import VBaseListForm from '@/smartview/bizform/VBaseListForm.js'

export default class DpShopOrderForsupplyListForm extends VBaseListForm {
  operationCode = 'DP02' ;

  static NewInstant(parent, formMeta) {
    return new DpShopOrderForsupplyListForm(parent, formMeta)
  }

}

