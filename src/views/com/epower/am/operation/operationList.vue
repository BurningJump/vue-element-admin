<script>
import BaseList from '@/views/com/epower/fw/smartview/list/BaseList'
export default{
  name: 'com.epower.am.operation.OperationList',
  extends: BaseList,
  components: {},
  data() {
    return {
      UIapi: `http://root.yiuser.com:3001/getListUIMeta/${this.$options.name}`
    }
  },
  mounted() {},
  methods: {}
}
</script>

<style lang="scss">
.el-form {
  display: flex;
  width: 100%;
}
</style>

