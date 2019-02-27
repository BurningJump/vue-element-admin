<template>
    <BaseBillDetail :form = "form"  >
    </BaseBillDetail>
</template>

<script>
import CustomBillDetail from '@/views/com/epower/fw/smartview/detail/CustomBillDetail';
import BaseBillDetail from "@/views/com/epower/fw/smartview/detail/BaseBillDetail";
import VBaseDetailForm from "@/smartview/bizform/VBaseDetailForm.js";
import { basicConstant } from "@/smartview/VBasicConstant.js";


class DpShopOrderDetailForm extends VBaseDetailForm {
  setFormEnableDependence(form) {
    var canGenStockBillFun = function(e) {
      var ds = form.getDataset("dpShopOrder");
      if (ds == null) return false;
      if (ds != null) {
        var rs = ds.currentTable[0].rstatus;
        var bs = ds.currentTable[0].bstatus;
      }

      if (
        form.state == basicConstant.VIEWSTATE_VIEW &&
        rs == 1 &&
        (bs == 1 || bs == 2)
      ) {
        return true;
      } else {
        return false;
      }
    };
    form.setEnableDependence("newStockOrder", canGenStockBillFun);

    var isNeedFun = function(e) {
      return true;
    };

    form.setRequiredDependence("SellerNick", isNeedFun);
  }
}

export default {
  name: "com.epower.dp.dpshoporder.DpShopOrderDetail",
  extends:CustomBillDetail,
  components:{BaseBillDetail},
  methods: {
    getBizForm(formMeta) {
      return new DpShopOrderDetailForm(this, formMeta);
    },
  }
};
</script>
