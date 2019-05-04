<script>
import CustomList from '@/smartview/views/pc/list/CustomList'
import operationListForm from './operationListForm'
export default{
  name: 'com.epower.am.operation.OperationList',
  extends: CustomList,
  components: {},
  mounted() {},
  methods: {
        NewInstant: (formMeta)=> {
         return new operationListForm(this, formMeta)
    }
  }
}
</script>
