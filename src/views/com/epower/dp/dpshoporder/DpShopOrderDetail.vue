<template>
   <BaseBillDetail :form = "form"  >
      <div slot="header">
        <span>slot header </span>
      </div>
    </BaseBillDetail>
</template>

<script>
import CustomBillDetail from '@/views/com/epower/fw/smartview/detail/CustomBillDetail';
import BaseBillDetail from "@/views/com/epower/fw/smartview/detail/BaseBillDetail";

export default {
  name: "com.epower.dp.dpshoporder.DpShopOrderDetail",
  extends:CustomBillDetail,
  components:{BaseBillDetail},
};
</script>
