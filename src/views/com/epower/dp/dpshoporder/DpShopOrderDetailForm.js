import VBaseDetailForm from '@/smartview/bizform/VBaseDetailForm.js'
import { basicConstant } from '@/smartview/VBasicConstant.js'

export default class DpShopOrderDetailForm extends VBaseDetailForm {
  // 获取Vue视图路径
  getVueComponentPath() {
    return '/com/epower/dp/dpshoporder/DpShopOrderDetail'
  }

  setFormEnableDependence(form) {
    var canGenStockBillFun = function(e) {
      var ds = form.getDataset('dpShopOrder')
      if (ds == null) return false
      if (ds != null) {
        var rs = ds.currentTable[0].rstatus
        var bs = ds.currentTable[0].bstatus
      }

      if (
        form.state == basicConstant.VIEWSTATE_VIEW &&
        rs == 1 &&
        (bs == 1 || bs == 2)
      ) {
        return true
      } else {
        return false
      }
    }
    form.setEnableDependence('newStockOrder', canGenStockBillFun)

    var isNeedFun = function(e) {
      return true
    }

    form.setRequiredDependence('SellerNick', isNeedFun)
  }
}

