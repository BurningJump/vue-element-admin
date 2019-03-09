<script>
import BaseList from '@/views/com/epower/fw/smartview/list/BaseList'
import {vsmartview} from '@/smartview/VSmartView.js'

export default{
  name: 'com.epower.dp.dpshoporder.DpShopOrderForsupplyList',
  extends: BaseList,
  components: {},
  data() {
    return {
    }
  },
  mounted() {},
  methods: {
    resetForm(){
      vsmartview.callForm('com.epower.dp.dpshoporder.DpShopOrderDetail', 1, 'VIEW')
    }
  }
}
</script>
