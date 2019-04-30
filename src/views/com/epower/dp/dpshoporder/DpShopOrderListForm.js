import VBaseListForm from '@/smartview/bizform/VBaseListForm.js'
import { vsmartview } from '@/smartview/VSmartView.js'

export default class DpShopOrderListForm extends VBaseListForm {

  operationCode = 'DP02' ;

  handleGridRowDBClick(params) {
    vsmartview.callDetailForm('com.epower.dp.dpshoporder.DpShopOrderDetail', 1, 'VIEW')
  }

}

