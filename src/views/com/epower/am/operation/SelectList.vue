<script>
import CustomSelect from '@/smartview/views/pc/select/CustomSelect'
import SelectListForm from './SelectListForm'
export default{
  name: 'com.epower.am.operation.SelectList',
  extends: CustomSelect,
  components: {},
  mounted() {},
  methods: {
        NewInstant: (formMeta)=> {
         return new SelectListForm(this, formMeta)
        }
  }
}
</script>
