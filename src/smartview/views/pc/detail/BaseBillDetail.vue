<script>
import { HotTable } from '@handsontable/vue'
import BaseDetail from './BaseDetail'
import Handsontable from 'handsontable';
export default {
  name: 'com-epower-fw-smartview-detail-BaseBillDetail',
  data() {
    return {}
  },
  extends: BaseDetail,
}
</script>
<style lang="scss">
.base-bill-detail-container {
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
