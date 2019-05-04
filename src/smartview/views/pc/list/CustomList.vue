<template>
    <BaseList :form = "form"  >
    </BaseList>
</template>

<script>
import BaseList from "./BaseList";
import VBaseListForm from "../../../bizform/VBaseListForm.js";
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
    var contentKey = this.$route.query.contentKey
     var callContent =vsmartview.callContents[contentKey]
     var aform =this.NewInstant(callContent.formMeta)
     aform.show()
       //必须先搞一个变量，页面永远不会渲染，想什么时候渲染就什么时候赋值
     this.form = aform
     vsmartview.callContents[contentKey] = null
  },

  methods: {
    NewInstant: (meta)=> {
              return new VBaseListForm(this, formMeta)
    }
  }
};
</script>
