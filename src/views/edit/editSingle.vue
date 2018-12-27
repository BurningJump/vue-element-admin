<temp/* late>
  <div class="app-container">
    <el-container>
      <el-header height="auto">
        <div class="toolbar">
          <el-button v-for="btn in buttons" :key="btn.label">
            <i v-if="btn.iconcls === 'table_add'" class="el-icon-plus"/>
            <i v-else-if="btn.iconcls === 'table_delete'" class="el-icon-delete"/>
            <i v-else-if="btn.iconcls === 'table_save'" class="el-icon-document"/>
            <i v-else-if="btn.iconcls === 'table_edit'" class="el-icon-edit"/>
            <i v-else-if="btn.iconcls === 'refresh'" class="el-icon-refresh"/>
            {{ btn.label }}
          </el-button>
        </div>
      </el-header>
      <el-main>
        <el-form v-for="input in masterPageInputs" :key="input.label" :style="{width: input.width*100 + '%'}" label-width="150px" class="demo-ruleForm" size="mini">
          <el-form-item :label="input.label">
            <el-input v-if="input.ctype === 'textfield'" v-model="currentTable[input.field]"/>
            <el-checkbox v-else-if="input.ctype === 'checkboxfield'" v-model="currentTable[input.field]"/>
            <el-date-picker v-else-if="input.ctype === 'dateTimeField'" v-model="currentTable[input.field]" type="datetime"/>
            <el-select v-else-if="input.ctype === 'valuelistField'" v-model="currentTable[input.field][input.valueListModel.displayField]" filterable>
              <el-option v-for="item in valueList" :key="item.value" :label="item.label" :value="item.value"/>
            </el-select>
          </el-form-item>
        </el-form>
      </el-main>
    </el-container>
    <el-container>
      <el-header>{{ detailPagesLabel }}</el-header>
      <el-main>
        <el-form v-for="input in detailPagesInputs" :key="input.label" :style="{width: input.width*100 + '%'}" label-width="150px" class="demo-ruleForm" size="mini">
          <el-form-item :label="input.label">
            <el-input v-if="input.ctype === 'textfield'" v-model="currentTable[input.field]"/>
            <el-checkbox v-else-if="input.ctype === 'checkboxfield'" v-model="currentTable[input.field]"/>
            <el-date-picker v-else-if="input.ctype === 'dateTimeField'" v-model="currentTable[input.field]" type="datetime"/>
            <el-select v-else-if="input.ctype === 'valuelistField'" v-model="currentTable[input.field][input.valueListModel.displayField]" filterable>
              <el-option v-for="item in valueList" :key="item.value" :label="item.label" :value="item.value"/>
            </el-select>
            <el-select v-else-if="input.ctype === 'comboBox'" v-model="currentTable[input.field].toString()" filterable>
              <el-option v-for="item in input.enumModel.items" :key="item.value" :label="item.label" :value="item.value"/>
            </el-select>
          </el-form-item>
        </el-form>
      </el-main>
    </el-container>
  </div>
</template> */

<script>
import BaseDetailGrid from '@/views/com/epower/fw/smartview/detail/BaseDetailGrid'
export default {
  name: 'EditSingle',
  extends: BaseDetailGrid,
  data() {
    return {
      editSingleUI: require('./edit-ui-单表.json'),
      buttons: [],
      masterPageInputs: [],
      detailPagesInputs: [],
      valueList: [],
      detailPagesLabel: '',
      editSingleData: require('./edit-data-单表.json'),
      currentTable: []
    }
  },
  mounted() {
    this.getUIdata()
    this.getSingleData()
  },
  methods: {
    getUIdata() {
      this.buttons = [...this.editSingleUI.detailViewModel.masterPage.toolbarModel.buttons]
      this.masterPageInputs = [...this.editSingleUI.detailViewModel.masterPage.componentSetModel.components]
      this.detailPagesLabel = this.editSingleUI.detailViewModel.detailPages[0].label
      this.detailPagesInputs = [...this.editSingleUI.detailViewModel.detailPages[0].componentSetModel.components]
    },
    getSingleData() {
      this.currentTable = this.editSingleData.dataPackage.dataSets[0].currentTable[0]
    }
  }
}
</script>
<style lang="scss">
.app-container {
  .el-main {
    display: flex;
    flex-wrap: wrap;
    padding: 5px;
  }
  .el-form-item {
    margin-bottom: 5px;
  }
}
</style>

