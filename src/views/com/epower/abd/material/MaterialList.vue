<script>
import CustomSelect from '@/smartview/views/pc/select/CustomSelect'
import MaterialListForm from './MaterialListForm'
export default{
  name: 'com.epower.abd.material.MaterialList',
  extends: CustomSelect,
  components: {},
  mounted() {},
  methods: {
        NewInstant: (formMeta)=> {
         return new MaterialListForm(this, formMeta)
        }
  }
}
</script>
