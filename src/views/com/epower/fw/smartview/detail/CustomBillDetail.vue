<template>
    <BaseBillDetail :form = "form"  >
    </BaseBillDetail>
</template>

<script>
import BaseBillDetail from "@/views/com/epower/fw/smartview/detail/BaseBillDetail";
import VBaseDetailForm from "@/smartview/bizform/VBaseDetailForm.js";

export default {
  name: 'com-epower-fw-smartview-detail-CustomBillDetail',
  components:{BaseBillDetail},
  data() {
    return {
      form: null //add by max
    };
  },
  created(){
    this.form =  this.$route.query.form

  },
};
</script>
