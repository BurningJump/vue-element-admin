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
          <el-form-item :label="input.label" :required="!Boolean(input.allowBlank)">
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
      <!-- <el-tab-pane v-for="tab in detailPagesTabs" :key="tab.name" :label="tab.label" :name="tab.name"> -->
      <el-tab-pane v-for="(tab,tabIndex) in detailPagesTabs" :key="tab.name" :name="tab.name">
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
            <pagination v-show="tab.componentSetModel.style === 'aGrid'" :total="list.length" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" style="position: absolute; right: 50px; top: 0; margin-top: 0;"/>
          </el-header>
          <el-main>
            <!-- <el-table v-if="tab.componentSetModel.style === 'grid'" ref="multipleTable" :data="firstTabData" element-loading-text="拼命加载中" border fit stripe highlight-current-row :header-cell-style="{background:'#f6f6f6'}" :height="tableHeight" :cell-style="cellStyle" :row-style="rowStyle">
              <el-table-column type="selection" align="center"/>
              <el-table-column v-for="header in tab.componentSetModel.components" :key="header.label" :prop="header.field" :label="header.label" align="center" :width="header.width > 1 ? header.width + 'px' : header.width > 0 && header.width <= 1 ? header.width*100 + '%' : ''">
                <template slot-scope="scope">
                  <img v-if="header.ctype === 'image'" :src="scope.row[header.field]" :width="header.width">
                  <div v-else-if="header.ctype === 'valuelistField'" v-html="scope.row[header.field][header.valueListModel.displayField]"></div>
                  <div v-else v-html="scope.row[header.field]"></div>
                </template>
              </el-table-column>
            </el-table> -->
            <base-bill-detail v-if="tab.componentSetModel.style === 'grid'" :settings="settings" :height="tableHeight"/>
            <el-table v-else-if="tab.componentSetModel.style === 'aGrid'" ref="multipleTable" element-loading-text="拼命加载中" border fit stripe highlight-current-row :header-cell-style="{background:'#f6f6f6'}" :height="tableHeight" :cell-style="cellStyle" :row-style="rowStyle">
              <el-table-column type="selection" align="center"/>
              <el-table-column v-for="header in tab.componentSetModel.components" :key="header.label" :prop="header.prop" :label="header.label" align="center" :width="header.width > 1 ? header.width + 'px' : header.width > 0 && header.width <= 1 ? header.width*100 + '%' : ''"/>
            </el-table>
            <div v-else-if="tab.componentSetModel.style === 'column'" class="column">
              <el-main>
                <el-form v-for="input in tab.componentSetModel.components" :key="input.label" :style="{width: input.width*100 + '%'}" class="demo-ruleForm" label-width="100px" size="mini">
                  <el-form-item :label="input.label" :required="!Boolean(input.allowBlank)">
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
import Pagination from '@/components/Pagination'
import { HotTable } from '@handsontable/vue'
import BaseBillDetail from '@/views/com/epower/fw/smartview/detail/BaseBillDetail'
import Handsontable from 'handsontable';
export default {
  name: 'EditMulti',
  data() {
    return {
      tableHeight: 600, // 表头高度
      list: [],
      listQuery: {
        page: 1,
        limit: 20
      },
      editMultiUI: '',
      buttons: [],
      masterPageInputs: [],
      detailPagesTabs: [],
      editMultiData: '',
      masterPageData: [],
      firstTabData: [],
      activeTab: '',
      gridObjectData: [],
      gridTableSettings: [],
      settings: {
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
        fixedRowsTop: 1,     // 冻结前n行
      },
    }
  },
  components: {
    Pagination,
    BaseBillDetail,
  },
  computed: {
    cellStyle() {
      return {
        'padding-left': '6px',
        'padding-right': '6px'
      }
    },
    rowStyle({ row, rowIndex}) {
      if (rowIndex%2 === 0) {
        return {
          'fontSize': '12px',
          'backgroundColor': '#fafafa'
        }
      } else {
        return {
          'fontSize': '12px',
          'backgroundColor': '#fff'
        }
      }
    }
  },
  mounted() {
    Promise.all([this.getUIdata(), this.getMultiData()]).then(() => {
      this.settings.data = [].concat(this.firstTabData)
      // this.settings.data = this.settings.data.concat(this.firstTabData)
      // this.settings.data = this.settings.data.concat(this.firstTabData)
      // this.settings.data = this.settings.data.concat(this.firstTabData)
      this.detailPagesTabs[0].componentSetModel.components.forEach(theader => {
        this.settings.colHeaders.push(theader.label)
        this.settings.dataSchema[theader.field] = null
        // this.settings.colWidths.push(theader.width)
        this.settings.colWidths.push(theader.width > 1 ? theader.width : theader.width > 0 && theader.width <= 1 ? theader.width*100 + '%' : '')
        this.settings.columns.push({
          type: 'autocomplete',
        //   // use HTML in the source list
          allowHtml: true,
          // renderer: 'html',
          data: theader.field,
          renderer: function(instance, td, row, col, prop, value, cellProperties) {
            const escaped = Handsontable.helper.stringify(value);
            let img = null;

            if (escaped.indexOf('http') === 0) {
              img = document.createElement('IMG');
              img.src = value;
              img.width = theader.width

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
          }
        })
        
      });
    })
    this.calcTableHeight()
  },
  // mounted() {
  // },
  methods: {
    coverRenderer (instance, td, row, col, prop, value, cellProperties) {
      var escaped = Handsontable.helper.stringify(value),
        img;

      if (escaped.indexOf('http') === 0) {
        img = document.createElement('IMG');
        img.src = value;

        Handsontable.dom.addEvent(img, 'mousedown', function (e){
          e.preventDefault(); // prevent selection quirk
        });

        Handsontable.dom.empty(td);
        td.appendChild(img);
      }
      else {
        // render as text
        Handsontable.renderers.TextRenderer.apply(this, arguments);
      }

      return td;
    },
    calcTableHeight() {
      setTimeout(() => {
        this.tableHeight = window.innerHeight - parseInt(window.getComputedStyle(document.getElementById('qconHeader'), null).height) - 190
        this.treeHeight = (window.innerHeight - parseInt(window.getComputedStyle(document.getElementById('qconHeader'), null).height) - 100) + 'px'
      })
    },
    getUIdata() {
      return new Promise((resolve, reject) => {
        this.$http.get('http://root.yiuser.com:3001/openapi/shopOrderDetailUI').then((res) => {
          this.editMultiUI = res.data
          this.buttons = [...this.editMultiUI.detailViewModel.masterPage.toolbarModel.buttons]
          this.masterPageInputs = [...this.editMultiUI.detailViewModel.masterPage.componentSetModel.components]
          this.detailPagesTabs = [...this.editMultiUI.detailViewModel.detailPages]
          this.activeTab = this.detailPagesTabs[0].name
          resolve('ok')
        })
      })
    },
    getMultiData() {
      return new Promise((resolve, reject) => {
        this.$http.get('http://root.yiuser.com:3001/openapi/shopOrderDetailData').then((res) => {
          this.editMultiData = res.data
          this.masterPageData = this.editMultiData.dataPackage.dataSets[0].currentTable[0]
          this.firstTabData = this.editMultiData.dataPackage.dataSets[1].currentTable
          resolve('ok')
        })
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

