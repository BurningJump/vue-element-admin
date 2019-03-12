import VBaseDetailForm from '@/smartview/bizform/VBaseDetailForm.js'
import { basicConstant } from '@/smartview/VBasicConstant.js'

export default class DpShopOrderDetailForm extends VBaseDetailForm {
  operationCode = 'DP02' ;

  static NewInstant(parent, formMeta) {
    return new DpShopOrderDetailForm(parent, formMeta)
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

  setFormButton(form) {
    var newStockOrder = form.getCmpByName('newStockOrder')
    newStockOrder.on('click',
      function(params = null) {
        // form.showFailMesg({ msg: '生成要货单失败!' })
        form.setCmpValue('ShopOrderNo', 12121)
      }
    )
  }

  setFormDefaultValue(form) {
    form.setDefaultValue('dpShopOrder', 'rstatus', 2)
    form.setDefaultValue('dpShopOrder', 'bstatus', 1)
    form.setDefaultValue('dpShopOrder', 'totalExpressAmt', 1)
    form.setDefaultValue('dpShopOrder', 'exchangeRate', 0)
    form.setDefaultValue('dpShopOrder', 'totalAmount', 0)
    form.setDefaultValue('dpShopOrder', 'totalQty', 0)
    form.setDefaultValue('dpShopOrder', 'orderDate', new Date())
    form.setDefaultValue('dpShopOrder', 'payDate', new Date())

    form.setDefaultValue('dpShopOrderDetail', 'rstatus', 2)
    form.setDefaultValue('dpShopOrderDetail', 'qty', 0)
    form.setDefaultValue('dpShopOrderDetail', 'unitPrice', 0)
    form.setDefaultValue('dpShopOrderDetail', 'discount', 0)
    form.setDefaultValue('dpShopOrderDetail', 'taxRate', 0)
    form.setDefaultValue('dpShopOrderDetail', 'adjustAmount', 0)
  }
}

