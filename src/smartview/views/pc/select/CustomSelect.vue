<template>
    <BaseSelect :form = "form"
                :selectType = "selectType"
                :callback = "callback"  >
    </BaseSelect>
</template>

<script>
import BaseSelect from "./BaseSelect";
import VBaseSelectForm from "../../../bizform/VBaseSelectForm.js";
import {vsmartview} from '@/smartview/VSmartView.js'

export default {
  name: 'com-epower-fw-smartview-select-CustomSelect',
  components:{BaseSelect},

  data() {
    return {
      form: null, //add by max
      selectType:'single', //默认单选模式 multi(多选) / single(单选模式)
      callback:null
    };
  },

  props:['content'],

  created(){
     var aform =this.NewInstant(this.content.formMeta)
     aform.show()
       //必须先搞一个变量，页面永远不会渲染，想什么时候渲染就什么时候赋值
     this.form = aform
     this.selectType = this.content.selectType
     this.callback =this.content.callback
  },

  methods: {
    NewInstant: (meta)=> {
        return new VBaseSelectForm(this, formMeta)
    }
  }
};
</script>
