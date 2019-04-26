<template>
   <BaseBillDetail :form = "form"  >
    </BaseBillDetail>
</template>

<script>
import CustomBillDetail from '@/smartview/views/pc/detail/CustomBillDetail';
import BaseBillDetail from "@/smartview/views/pc/detail/BaseBillDetail";
import DpShopOrderDetailForm from './DpShopOrderDetailForm'
export default {
  name: "com.epower.dp.dpshoporder.DpShopOrderDetail",
  extends:CustomBillDetail,
  components:{BaseBillDetail},
  methods: {
    NewInstant: (formMeta)=> {
        return new DpShopOrderDetailForm(this, formMeta)
    }
  }
};
</script>
