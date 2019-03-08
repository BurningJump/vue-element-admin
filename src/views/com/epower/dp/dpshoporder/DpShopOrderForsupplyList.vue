<script>
import BaseList from '@/views/com/epower/fw/smartview/list/BaseList'
import VSmartView from '@/smartview/VSmartView.js'

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
      const v = new VSmartView()
      v.callForm('com.epower.dp.dpshoporder.DpShopOrderDetail', 1, 'VIEW')
    }
  }
}
</script>
