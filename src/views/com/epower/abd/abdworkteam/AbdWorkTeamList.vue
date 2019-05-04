<script>
import CustomSelect from '@/smartview/views/pc/select/CustomSelect'
import AbdWorkTeamListForm from './AbdWorkTeamListForm'
export default{
  name: 'com.epower.am.operation.AbdWorkTeamList',
  extends: CustomSelect,
  components: {},
  mounted() {},
  methods: {
        NewInstant: (formMeta)=> {
         return new AbdWorkTeamListForm(this, formMeta)
        }
  }
}
</script>
