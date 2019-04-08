<template>
    <BaseList :form = "form"  >
    </BaseList>
</template>

<script>
import BaseList from "./BaseList";
import VBaseListForm from "@/smartview/bizform/VBaseListForm.js";
import {vsmartview} from '@/smartview/VSmartView.js'

export default {
  name: 'com-epower-fw-smartview-list-CustomList',
  components:{BaseList},
  data() {
    return {
      form: null //add by max
    };
  },
  created(){
    this.form =vsmartview.findFormById(this.$route.query.formId)
  },
};
</script>
