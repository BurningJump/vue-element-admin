<template>
    <BaseBillDetail :form = "form"  >
    </BaseBillDetail>
</template>

<script>
import BaseBillDetail from "@/views/com/epower/fw/smartview/detail/BaseBillDetail";
import VBaseDetailForm from "@/smartview/bizform/VBaseDetailForm.js";
import {vsmartview} from '@/smartview/VSmartView.js'

export default {
  name: 'com-epower-fw-smartview-detail-CustomBillDetail',
  components:{BaseBillDetail},
  data() {
    return {
      form: null //add by max
    };
  },
  created(){
   // this.form =vsmartview.findFormById(this.$route.query.formId)

     var   callContent =vsmartview.callContents[this.$route.query.formKey+this.$route.query.dataId]
     var aform =this.NewInstant(callContent['formMeta'])
     aform.dataId = callContent['formDataId']
     aform.requestDetailData(aform.dataId).then(dataPackage => {
              aform.loadDataByPackage(dataPackage) // add by max
            aform.show(callContent['formStates'] )
            //页面永远不会渲染，想什么时候渲染就什么时候赋值
            this.form = aform
            }).catch(err => {
              console.log(err.stack)
            })
    vsmartview.callContents[this.$route.query.formKey+this.$route.query.dataId] =  null
  },

  methods: {
    NewInstant: (meta)=> {
       return null
    }
  }
};
</script>
