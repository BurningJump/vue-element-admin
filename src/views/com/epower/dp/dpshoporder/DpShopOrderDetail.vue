<script>
import BaseBillDetail from "@/views/com/epower/fw/smartview/detail/BaseBillDetail";
export default {
  name: "com.epower.dp.dpshoporder.DpShopOrderDetail",
  extends: BaseBillDetail,
  data() {
    return {};
  },
  methods: {
    // setFormEnableDependence() {
    //   var canGenStockBillFun = function(e) {
    //     var ds = this.getDataset("dpShopOrder");
    //     if (ds == null) return false;
    //     if (ds != null) {
    //       var rs = ds.currentTable[0].rstatus;
    //       var bs = ds.currentTable[0].bstatus;
    //     }

    //     if (
    //       this.state == basicConstant.VIEWSTATE_VIEW &&
    //       rs == 1 &&
    //       (bs == 1 || bs == 2)
    //     ) {
    //       return true;
    //     } else {
    //       return false;
    //     }
    //   };
    //   this.setEnableDependence("newStockOrder", canGenStockBillFun);
    // }
  }
};
</script>

