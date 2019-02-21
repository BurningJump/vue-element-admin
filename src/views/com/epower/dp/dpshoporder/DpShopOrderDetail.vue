<script>
import BaseBillDetail from "@/views/com/epower/fw/smartview/detail/BaseBillDetail";
import BaseDetail from "@/views/com/epower/fw/smartview/detail/BaseDetail";
import { basicConstant } from '@/smartview/VBasicConstant.js';
import { longStackSupport } from 'q';
export default {
  name: "com.epower.dp.dpshoporder.DpShopOrderDetail",
  extends: BaseBillDetail,
  data() {
    return {};
  },

  methods: {
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

      var isNeedFun = function(e){
         return true
      }

      form.setRequiredDependence("SellerNick",isNeedFun);
    },
  delete(){
    //  var masterToolbar = this.dataView.getCmpByName("toolbar");
    //  var dToolbar = this.dataView.getCmpByName("spmi_toolbar");
     // super.delete();
      console.log('ShopOrderDelete');
  }
  }
};
</script>

