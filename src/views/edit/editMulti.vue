<template>
  <div class="app-container">
    <el-container>
      <el-header height="auto">
        <el-button-group>
          <el-button v-for="btn in buttons" v-if="!btn.isMore" :key="btn.label" size="mini">
            <i v-if="btn.iconcls === 'table_add'" class="el-icon-plus"/>
            <i v-else-if="btn.iconcls === 'table_view'" class="el-icon-view"/>
            <i v-else-if="btn.iconcls === 'table_edit'" class="el-icon-edit"/>
            <i v-else-if="btn.iconcls === 'table_delete'" class="el-icon-delete"/>
            <i v-else-if="btn.iconcls === 'table_close'" class="el-icon-close"/>
            <i v-else-if="btn.iconcls === 'table_save'" class="el-icon-document"/>
            <i v-else-if="btn.iconcls === 'refresh'" class="el-icon-refresh"/>
            {{ btn.label }}
          </el-button>
          <el-dropdown v-if="editMultiUI.detailViewModel.masterPage.toolbarModel.showMoreButton" trigger="click" placement="bottom" szie="mini">
            <el-button size="mini">
              更多<i class="el-icon-arrow-down el-icon--right" style="margin-left:0;"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-for="btn in buttons" v-if="btn.isMore">
                <!-- <el-tooltip class="item" effect="dark" :content="btn.label" placement="top"> -->
                  <i v-if="btn.iconcls === 'table_add'" class="el-icon-plus"/>
                  <i v-else-if="btn.iconcls === 'table'" class="el-icon-view"/>
                  <i v-else-if="btn.iconcls === 'table_edit'" class="el-icon-edit"/>
                  <i v-else-if="btn.iconcls === 'table_delete'" class="el-icon-delete"/>
                  <i v-else-if="btn.iconcls === 'table_close'" class="el-icon-close"/>
                  {{btn.label}}
                <!-- </el-tooltip> -->
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-button-group>
      </el-header>
      <el-main>
        <el-form v-for="input in masterPageInputs" :key="input.label" :style="{width: input.width*100 + '%'}" class="demo-ruleForm" label-width="100px" size="mini">
          <el-form-item :label="input.label">
            <el-input v-if="input.ctype === 'textfield'" v-model="masterPageData[input.field]"/>
            <el-date-picker v-else-if="input.ctype === 'dateTimeField'" v-model="masterPageData[input.field]" type="datetime"/>
            <el-select v-else-if="input.ctype === 'comboBox'" v-model="masterPageData[input.field].toString()" filterable>
              <el-option v-for="item in input.enumModel.items" :key="item.value" :label="item.label" :value="item.value"/>
            </el-select>
            <el-input v-else-if="input.ctype === 'numberfield'" v-model="masterPageData[input.field]" type="number"/>
            <el-select v-else-if="input.ctype === 'remoteComboBox'" v-model="masterPageData[input.field]" :remote-method="remoteMethod" multiple filterable remote reserve-keyword>
              <el-option v-for="item in options4" :key="item.value" :label="item.label" :value="item.value"/>
            </el-select>
          </el-form-item>
        </el-form>
      </el-main>
    </el-container>
    <el-tabs v-model="activeTab" type="card" @tab-click="handleClick">
      <el-tab-pane v-for="tab in detailPagesTabs" :key="tab.name" :label="tab.label" :name="tab.name">
        <el-container>
          <el-header height="auto">
            <el-button-group>
              <el-button v-for="btn in tab.toolbarModel.buttons" v-if="tab.toolbarModel.buttons.length > 0 && !btn.isMore" :key="btn.label" size="mini">
                <i v-if="btn.iconcls === 'table_add'" class="el-icon-plus"/>
                <i v-else-if="btn.iconcls === 'table_delete'" class="el-icon-delete"/>
                {{ btn.label }}
              </el-button>
              <el-dropdown v-if="tab.toolbarModel.showMoreButton" trigger="click" placement="bottom" szie="mini">
                <el-button size="mini">
                  更多<i class="el-icon-arrow-down el-icon--right" style="margin-left:0;"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item v-for="btn in tab.toolbarModel.buttons" v-if="btn.isMore">
                    <!-- <el-tooltip class="item" effect="dark" :content="btn.label" placement="top"> -->
                      <i v-if="btn.iconcls === 'table_add'" class="el-icon-plus"/>
                      <i v-else-if="btn.iconcls === 'table'" class="el-icon-view"/>
                      <i v-else-if="btn.iconcls === 'table_edit'" class="el-icon-edit"/>
                      <i v-else-if="btn.iconcls === 'table_delete'" class="el-icon-delete"/>
                      <i v-else-if="btn.iconcls === 'table_close'" class="el-icon-close"/>
                      {{btn.label}}
                    <!-- </el-tooltip> -->
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-button-group>
          </el-header>
          <el-main>
            <el-table v-if="tab.componentSetModel.style === 'grid'" ref="multipleTable" :data="firstTabData" element-loading-text="拼命加载中" border fit highlight-current-row>
              <el-table-column type="selection" align="center"/>
              <el-table-column v-for="header in tab.componentSetModel.components" :key="header.label" :prop="header.field" :label="header.label" align="center">
                <template slot-scope="scope">
                  <img v-if="header.ctype === 'image'" :src="scope.row[header.field]" :width="header.width">
                  <div v-else-if="header.ctype === 'valuelistField'" v-html="scope.row[header.field][header.valueListModel.displayField]"></div>
                  <div v-else v-html="scope.row[header.field]"></div>
                </template>
              </el-table-column>
            </el-table>
            <el-table v-else-if="tab.componentSetModel.style === 'aGrid'" ref="multipleTable" element-loading-text="拼命加载中" border fit highlight-current-row>
              <el-table-column type="selection" align="center"/>
              <el-table-column v-for="header in tab.componentSetModel.components" :key="header.label" :prop="header.prop" :label="header.label" align="center"/>
            </el-table>
            <div v-else-if="tab.componentSetModel.style === 'column'" class="column">
              <el-main>
                <el-form v-for="input in tab.componentSetModel.components" :key="input.label" :style="{width: input.width*100 + '%'}" class="demo-ruleForm" label-width="100px" size="mini">
                  <el-form-item :label="input.label">
                    <el-input v-if="input.ctype === 'textfield'"/>
                    <el-checkbox v-else-if="input.ctype === 'checkboxField'"/>
                    <el-date-picker v-else-if="input.ctype === 'dateTimeField'"/>
                    <el-select v-else-if="input.ctype === 'valuelistField'" filterable>
                      <el-option v-for="item in input.valueList" :key="item.value" :label="item.label" :value="item.value"/>
                    </el-select>
                    <el-select v-else-if="input.ctype === 'comboBox'" filterable>
                      <el-option v-for="item in input.enumModel.items" :key="item.value" :label="item.label" :value="item.value"/>
                    </el-select>
                    <el-input v-else-if="input.ctype === 'numberfield'" type="number"/>
                    <el-select v-else-if="input.ctype === 'remoteComboBox'" v-model="value9" :remote-method="remoteMethod" multiple filterable remote reserve-keyword>
                      <el-option v-for="item in options4" :key="item.value" :label="item.label" :value="item.value"/>
                    </el-select>
                  </el-form-item>
                </el-form>
              </el-main>
            </div>
          </el-main>
        </el-container>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
export default {
  name: 'EditMulti',
  data() {
    return {
      editMultiUI: '',
      buttons: [],
      masterPageInputs: [],
      detailPagesTabs: [],
      editMultiData: '',
      masterPageData: [],
      firstTabData: [],
      activeTab: ''
    }
  },
  mounted() {
    this.getUIdata()
    this.getMultiData()
  },
  methods: {
    getUIdata() {
      this.$http.get('http://root.yiuser.com:3001/openapi/shopOrderDetailUI').then((res) => {
        this.editMultiUI = res.data
        this.buttons = [...this.editMultiUI.detailViewModel.masterPage.toolbarModel.buttons]
        this.masterPageInputs = [...this.editMultiUI.detailViewModel.masterPage.componentSetModel.components]
        this.detailPagesTabs = [...this.editMultiUI.detailViewModel.detailPages]
        this.activeTab = this.detailPagesTabs[0].name
      })
    },
    getMultiData() {
      this.$http.get('http://root.yiuser.com:3001/openapi/shopOrderDetailData').then((res) => {
        this.editMultiData = res.data
        this.masterPageData = this.editMultiData.dataPackage.dataSets[0].currentTable[0]
        this.firstTabData = this.editMultiData.dataPackage.dataSets[1].currentTable
      })
    },
    remoteMethod() {},
    handleClick() {}
  }
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
  .el-form-item {
    margin-bottom: 5px;
  }
  .el-form-item, .el-select, .el-input {
    width: 100%;
  }
  .el-tabs {
    width: 100%;
  }
}
</style>

