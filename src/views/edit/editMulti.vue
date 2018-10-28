<template>
  <div class="app-container">
    <el-container>
      <el-header height="auto">
        <div class="toolbar">
          <el-button v-for="btn in buttons" :key="btn.label" size="small">{{ btn.label }}</el-button>
        </div>
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
          <el-header v-for="btn in tab.toolbarModel.buttons" v-if="tab.toolbarModel.buttons.length > 0" :key="btn.label" height="auto">
            <el-button size="small">{{ btn.label }}</el-button>
          </el-header>
          <el-main>
            <el-table v-if="tab.componentSetModel.style === 'grid'" ref="multipleTable" :data="firstTabData" element-loading-text="拼命加载中" border fit highlight-current-row>
              <el-table-column type="selection" align="center"/>
              <el-table-column v-for="header in tab.componentSetModel.components" :key="header.label" :prop="header.field" :label="header.label" align="center">
                <template slot-scope="scope">
                  <img v-if="header.ctype === 'image'" :src="scope.row[header.field]" :width="header.width">
                  <span v-else-if="header.ctype === 'valuelistField'">{{ scope.row[header.field][header.valueListModel.displayField] }}</span>
                  <span v-else>{{ scope.row[header.field] }}</span>
                </template>
              </el-table-column>
            </el-table>
            <el-table v-else-if="tab.componentSetModel.style === 'aGrid'" ref="multipleTable" element-loading-text="拼命加载中" border fit highlight-current-row>
              <el-table-column type="selection" align="center"/>
              <el-table-column v-for="header in tab.componentSetModel.components" :key="header.label" :prop="header.prop" :label="header.label" align="center"/>>
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
      editMultiUI: require('./edit-ui-多表.json'),
      buttons: [],
      masterPageInputs: [],
      detailPagesTabs: [],
      editMultiData: require('./edit-data-多表-主从表.json'),
      masterPageData: [],
      firstTabData: [],
      activeTab: ''
    }
  },
  mounted() {
    this.getUIdata()
    this.getMultiData()
    this.activeTab = this.detailPagesTabs[0].name
  },
  methods: {
    getUIdata() {
      this.buttons = [...this.editMultiUI.detailViewModel.masterPage.toolbarModel.buttons]
      this.masterPageInputs = [...this.editMultiUI.detailViewModel.masterPage.componentSetModel.components]
      this.detailPagesTabs = [...this.editMultiUI.detailViewModel.detailPages]
    },
    getMultiData() {
      this.masterPageData = this.editMultiData.dataPackage.dataSets[0].currentTable[0]
      this.firstTabData = this.editMultiData.dataPackage.dataSets[1].currentTable
    },
    remoteMethod() {},
    handleClick() {}
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

