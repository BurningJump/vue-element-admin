<script>
import CustomList from '@/smartview/views/pc/list/CustomList';
import DpShopOrderListForm from './DpShopOrderListForm'

export default {
  name: "com.epower.dp.dpshoporder.DpShopOrderList",
  extends:CustomList,
  components:{},
  methods: {
    NewInstant: (formMeta)=> {
         return new DpShopOrderListForm(this, formMeta)
    }
  }
};
</script>
