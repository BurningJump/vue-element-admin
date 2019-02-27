<script>
import CustomBillDetail from '@/views/com/epower/fw/smartview/detail/CustomBillDetail'
export default {
  name: 'com.epower.inv.invrequest.InvRequestDetail',
  extends: CustomBillDetail
}
</script>

<style lang="scss">
.app-container {
  .el-header {
    padding: 0;
    border-bottom: 1px solid #e4e7ed;
    .el-button-group {
      margin-bottom: 2px;
    }
  }
  .el-main {
    display: flex;
    flex-wrap: wrap;
    padding: 5px;
  }
  .el-tabs {
    width: 100%;
  }
  .el-tabs__item {
    height: 32px;
    line-height: 32px;
  }
  .el-tabs__header {
    margin: 0 0 3px;
  }
}
</style>

