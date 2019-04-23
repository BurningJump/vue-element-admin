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
     var callContent =vsmartview.callContents[this.$route.query.formKey+this.$route.query.formId]
     var aform =this.NewInstant(callContent['formMeta'])
     aform.show()
     this.form = aform
     vsmartview.callContents[this.$route.query.formKey+this.$route.query.formId] = null
  },

  methods: {
    NewInstant: (meta)=> {
       return null
    }
  }
};
</script>
