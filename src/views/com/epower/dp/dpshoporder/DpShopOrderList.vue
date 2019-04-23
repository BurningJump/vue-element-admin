<script>
import CustomList from '@/views/com/epower/fw/smartview/list/CustomList';
import DpShopOrderListForm from './DpShopOrderListForm'

export default {
  name: "com.epower.dp.dpshoporder.shopOrderList",
  extends:CustomList,
  components:{},
  methods: {
    NewInstant: (formMeta)=> {
         return new DpShopOrderListForm(this, formMeta)
    }
  }
};
</script>
