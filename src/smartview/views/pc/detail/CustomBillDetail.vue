<template>
    <BaseBillDetail :form = "form"  >
    </BaseBillDetail>
</template>

<script>
import BaseBillDetail from "./BaseBillDetail";
import VBaseDetailForm from "../../../bizform/VBaseDetailForm.js";
import {vsmartview} from '../../../VSmartView.js'

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
    var   contentKey = this.$route.query.contentKey
     var  callContent =vsmartview.callContents[contentKey]
     var  aform =this.NewInstant(callContent.formMeta)
     aform.dataId =callContent.formDataId
    if (callContent.formStates === 'VIEW'){
     aform.requestDetailData(aform.dataId).then(dataPackage => {
     aform.loadDataByPackage(dataPackage) // add by max
     aform.show(callContent.formStates)
            //页面永远不会渲染，想什么时候渲染就什么时候赋值
            this.form = aform
              vsmartview.callContents[contentKey] =  null
            }).catch(err => {
              console.log(err.stack)
            })
    } else if (callContent.formStates === 'NEW'){
        aform.show(callContent.formStates)
        this.form = aform
        vsmartview.callContents[contentKey] =  null
    }



  },

  methods: {
    NewInstant: (meta)=> {
       return new VBaseDetailForm(this, formMeta)
    }
  }
};
</script>
