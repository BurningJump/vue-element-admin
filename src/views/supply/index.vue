<template>
  <div class="app-container">
    <el-container>
      <el-header height="auto" id="qconHeader">
        <el-button-group>
          <el-button v-for="btn in supplyUI.detailViewModel.masterPage.toolbarModel.buttons" v-if="!btn.isMore" :key="btn.label" size="mini">
            <i v-if="btn.iconcls === 'table_add'" class="el-icon-plus"/>
            <i v-else-if="btn.iconcls === 'table_view'" class="el-icon-view"/>
            <i v-else-if="btn.iconcls === 'table_edit'" class="el-icon-edit"/>
            <i v-else-if="btn.iconcls === 'table_delete'" class="el-icon-delete"/>
            <i v-else-if="btn.iconcls === 'table_close'" class="el-icon-close"/>
            <i v-else-if="btn.iconcls === 'table_save'" class="el-icon-document"/>
            <i v-else-if="btn.iconcls === 'refresh'" class="el-icon-refresh"/>
            {{ btn.label }}
          </el-button>
          <el-dropdown v-if="supplyUI.detailViewModel.masterPage.toolbarModel.showMoreButton" trigger="click" placement="bottom" szie="mini">
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
        <el-form v-for="input in supplyUI.detailViewModel.masterPage.componentSetModel.components" :key="input.label" :style="{width: input.width*100 + '%'}" class="demo-ruleForm" label-width="100px" size="mini">
          <el-form-item :label="input.label" :required="!Boolean(input.allowBlank)">
            <el-input v-if="input.ctype === 'textfield'" v-model="supplyData.dataPackage.dataSets[0].currentTable[0][input.field]"/>
            <el-date-picker v-else-if="input.ctype === 'dateTimeField'" v-model="supplyData.dataPackage.dataSets[0].currentTable[0][input.field]" type="datetime"/>
            <el-select v-else-if="input.ctype === 'comboBox'" v-model="supplyData.dataPackage.dataSets[0].currentTable[0][input.field].toString()" filterable>
              <el-option v-for="item in input.enumModel.items" :key="item.value" :label="item.label" :value="item.value"/>
            </el-select>
            <el-input v-else-if="input.ctype === 'numberfield'" v-model="supplyData.dataPackage.dataSets[0].currentTable[0][input.field]" type="number"/>
            <el-select v-else-if="input.ctype === 'remoteComboBox'" v-model="supplyData.dataPackage.dataSets[0].currentTable[0][input.field]" :remote-method="remoteMethod" multiple filterable remote reserve-keyword>
              <el-option v-for="item in options4" :key="item.value" :label="item.label" :value="item.value"/>
            </el-select>
          </el-form-item>
        </el-form>
      </el-main>
      <el-tabs v-model="activeTab" type="card" @tab-click="handleClick">
        <!-- <el-tab-pane v-for="tab in detailPagesTabs" :key="tab.name" :label="tab.label" :name="tab.name"> -->
        <el-tab-pane v-for="(tab,tabIndex) in supplyUI.detailViewModel.detailPages" :key="tab.name" :name="tab.name">
          <span slot="label">
            <i v-if="tab.iconcls === 'table_add'" class="el-icon-plus"/>
            <i v-else-if="tab.iconcls === 'table_view'" class="el-icon-view"/>
            <i v-else-if="tab.iconcls === 'table_edit'" class="el-icon-edit"/>
            <i v-else-if="tab.iconcls === 'table_delete'" class="el-icon-delete"/>
            <i v-else-if="tab.iconcls === 'table_close'" class="el-icon-close"/>
            <i v-else-if="tab.iconcls === 'table_save'" class="el-icon-document"/>
            <i v-else-if="tab.iconcls === 'refresh'" class="el-icon-refresh"/>
            {{tab.label}}
          </span>
          <el-container>
            <el-aside v-if="tab.treeModel" width="200px" :style="{'height': treeHeight, 'padding': '0 5px'}">
              <!-- <div class="tree-toolbar">
                <el-button-group>
                  <el-tooltip class="item" effect="dark" v-for="btn in tab.tree.toolbar.components" :content="btn.label" placement="top">
                    <el-button v-if="btn.fun === 'new'" size="mini" icon="el-icon-document"></el-button>
                    <el-button v-else-if="btn.fun === 'view'" size="mini" icon="el-icon-view"></el-button>
                  </el-tooltip>
                  <el-tooltip class="item" effect="dark" content="更多" placement="top">
                    <el-dropdown v-if="supplyUI.listViewModel.tree.toolbar.showMoreButton" trigger="click" placement="bottom" szie="mini">
                      <el-button size="mini">
                        <i class="el-icon-arrow-down el-icon--right" style="margin-left:0;"></i>
                      </el-button>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item v-for="btn in treeToolbar" v-if="btn.isMore">
                          <i v-if="btn.iconcls === 'table_add'" class="el-icon-plus"/>
                          <i v-else-if="btn.iconcls === 'table'" class="el-icon-view"/>
                          <i v-else-if="btn.iconcls === 'table_edit'" class="el-icon-edit"/>
                          <i v-else-if="btn.iconcls === 'table_delete'" class="el-icon-delete"/>
                          {{btn.label}}
                        </el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </el-tooltip>
                </el-button-group>
              </div> -->
              <div class="tree-container">
                <el-tree :data="tab.treeModel" :props="defaultProps" highlight-current @node-expand="handleNodeExpand" @node-click="handleNodeClick">
                  <!-- <span class="custom-tree-node" slot-scope="{ node, data }">
                    <span v-if="node.isLeaf">
                      <i v-if="data.iconcls === 'table_add'" class="el-icon-plus"/>
                      <i v-else-if="data.iconcls === 'table_delete'" class="el-icon-delete"/>
                      <i v-else-if="data.iconcls === 'table_edit'" class="el-icon-edit"/>
                      {{ node.label }}
                    </span>
                    <span v-if="!node.isLeaf">
                      {{ node.label }}
                    </span>
                  </span> -->
                </el-tree>
              </div>
            </el-aside>
            <el-container>
              <el-header v-if="tab.toolbarModel.buttons.length > 0 || tab.componentSetModel.style === 'aGrid'" height="35px">
                <el-button-group v-if="tab.toolbarModel.buttons.length > 0">
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
                <base-bill-detail v-if="tab.componentSetModel.style === 'grid' && tab.name==='detailpage'" :settings="detailpageSettings" :height="tableHeight"/>
                <base-bill-detail v-else-if="tab.componentSetModel.style === 'grid' && tab.name==='detailPage3'" :settings="detailpageSettings" :height="tableHeight"/>
              </el-main>
            </el-container>
          </el-container>
        </el-tab-pane>
      </el-tabs>
    </el-container>
  </div>
</template>

<script>
import BaseBillDetail from '@/views/com/epower/fw/smartview/detail/BaseBillDetail'
import Handsontable from 'handsontable';
export default {
  data() {
    return {
      supplyUI: '',
      supplyData: '',
      activeTab: '',
      detailpageSettings: {
        data: [],
        dataSchema: {},
        colHeaders: [],
        rowHeaders: false,
        columns: [],
        colWidths: [],
        rowHeights: 55,
        className: 'htCenter htMiddle',
        contextMenu: true,
        manualColumnFreeze: true,
        fixedColumnsLeft: 0,    // 冻结前n列
        fixedRowsTop: 0,     // 冻结前n行
      },
      detailPage3Settings: {
        data: [],
        dataSchema: {},
        colHeaders: [],
        rowHeaders: false,
        columns: [],
        colWidths: [],
        rowHeights: 55,
        className: 'htCenter htMiddle',
        contextMenu: true,
        manualColumnFreeze: true,
        fixedColumnsLeft: 0,    // 冻结前n列
        fixedRowsTop: 0,     // 冻结前n行
      },
    }
  },
  components: {
    BaseBillDetail
  },
  mounted() {
    Promise.all([this.getUIdata(), this.getSupplyData()]).then(() => {
      this.getSettings(this.detailpageSettings,this.supplyData.dataPackage.dataSets[1].currentTable,0)
      this.getSettings(this.detailpage3Settings,this.supplyData.dataPackage.dataSets[2].currentTable,1)
    })
  },
  methods: {
    getSettings(settings,sourceData,index) {
      settings.data = [].concat(sourceData)
      this.supplyUI.detailViewModel.detailPages[index].componentSetModel.components.forEach(theader => {
        settings.colHeaders.push(theader.label)
        settings.dataSchema[theader.field] = null
        settings.colWidths.push(theader.width > 1 ? theader.width : theader.width > 0 && theader.width <= 1 ? theader.width*100 + '%' : '')
        settings.columns.push({
          type: 'autocomplete',
          allowHtml: true,
          renderer: this.coverRenderer,
          data: theader.field,
        })
      });
    },
    coverRenderer (instance, td, row, col, prop, value, cellProperties) {
      const escaped = Handsontable.helper.stringify(value);
      let img = null;

      if (escaped.indexOf('http') === 0) {
        img = document.createElement('IMG');
        img.src = value;
        img.width = instance.getColWidth()

        Handsontable.dom.addEvent(img, 'mousedown', function(event) {
          event.preventDefault();
        });

        Handsontable.dom.empty(td);
        td.className = 'htCenter htMiddle'
        td.appendChild(img);
      } else {
        Handsontable.renderers.TextRenderer.apply(this, arguments);
      }

      return td;
    },
    getUIdata() {
      return new Promise((resolve, reject) => {
        this.$http.get('http://root.yiuser.com:3001/openapi/invRequestDetailUI').then((res) => {
          this.supplyUI = res.data
          this.activeTab = this.supplyUI.detailViewModel.detailPages[0].name
          resolve('ok')
        })
      })
    },
    getSupplyData() {
      return new Promise((resolve, reject) => {
        this.$http.get('http://root.yiuser.com:3001/openapi/invRequestDetailData').then((res) => {
          this.supplyData = res.data
          resolve('ok')
        })
      })
    }
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
    margin-bottom: 3px;
  }
  .el-form-item, .el-select, .el-input {
    width: 100%;
  }
  .el-input__inner {
    height: 22px;
    line-height: 22px;
  }
  .el-form-item__label {
    font-size: 12px;
    font-weight: normal;
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

