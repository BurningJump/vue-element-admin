<template>
<div class="base-bill-detail-container">
    <!-- <el-container v-if="UiLoaded&&dataLoaded">
      <el-header height="auto" id="qconHeader">
        <el-button-group>
          <el-button v-for="btn in UIMeta.detailViewModel.masterPage.toolbarModel.buttons" v-if="!btn.isMore" :key="btn.label" size="mini">
            <svg-icon :icon-class="`${btn.iconcls}`"/>
            {{ btn.label }}
          </el-button>
          <el-dropdown v-if="UIMeta.detailViewModel.masterPage.toolbarModel.showMoreButton" trigger="click" placement="bottom" szie="mini">
            <el-button size="mini">
              更多<i class="el-icon-arrow-down el-icon--right" style="margin-left:0;"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-for="btn in UIMeta.detailViewModel.masterPage.toolbarModel.buttons" v-if="btn.isMore">
                <svg-icon :icon-class="`${btn.iconcls}`"/>
                {{btn.label}}
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-button-group>
      </el-header>
      <el-main>
        <el-form v-for="input in UIMeta.detailViewModel.masterPage.componentSetModel.components" :key="input.label" :style="{width: input.width*100 + '%'}" class="demo-ruleForm" label-width="100px" size="mini">
          <el-form-item :label="input.label" :required="!Boolean(input.allowBlank)">
            <el-input v-if="input.ctype === 'textfield'" v-model="masterPageData[input.field]"/>
            <el-date-picker v-else-if="input.ctype === 'dateField'" v-model="masterPageData[input.field]" type="date"/>
            <el-date-picker v-else-if="input.ctype === 'dateTimeField'" v-model="masterPageData[input.field]" type="datetime"/>
            <el-select v-else-if="input.ctype === 'comboBox'" v-model="masterPageData[input.field]" filterable>
              <el-option v-for="item in input.enumModel.items" :key="item.value" :label="item.label" :value="item.value"/>
            </el-select>
            <el-input v-else-if="input.ctype === 'numberfield'" v-model="masterPageData[input.field]" type="number"/>
            <el-select v-else-if="input.ctype === 'remoteComboBox'" v-model="masterPageData[input.field]" :remote-method="remoteMethod" multiple filterable remote reserve-keyword>
              <el-option v-for="item in options4" :key="item.value" :label="item.label" :value="item.value"/>
            </el-select>
          </el-form-item>
        </el-form>
      </el-main>
    </el-container> -->
    <base-detail-column v-if="UiLoaded&&dataLoaded" :tab="UIMeta.detailViewModel.masterPage"/>
    <el-tabs v-if="UiLoaded&&dataLoaded" v-model="activeTab" type="card" @tab-click="handleClick">
      <el-tab-pane v-for="(tab,tabIndex) in UIMeta.detailViewModel.detailPages" :key="tab.name" :name="tab.name">
        <span slot="label">
          <svg-icon :icon-class="`${tab.iconcls}`"/>
          {{tab.label}}
        </span>
        <div class="base-detail-container">
          <base-detail-grid v-if="tab.componentSetModel.style === 'grid'&&settings[tab.componentSetModel.dataset]" :tab="tab" :activeTab="activeTab" :settings="settings[tab.componentSetModel.dataset]" :height="height"/>
          <base-detail-a-grid v-else-if="tab.componentSetModel.style === 'aGrid'" :url="UIMeta.detailViewModel.datasetInfo.datasets[tabIndex].actionMethod" :tab="tab" :activeTab="activeTab" :listLoading="listLoading" :agridData="DetailDataStore.DataLists[tab.componentSetModel.dataset]" :height="height"/>
          <base-detail-column v-else-if="tab.componentSetModel.style === 'column'" :tab="tab" :activeTab="activeTab"/>
        </div>
        <!-- <base-detail :url="UIMeta.detailViewModel.datasetInfo.datasets[tabIndex].actionMethod" :tab="tab" :activeTab="activeTab" :type="tab.componentSetModel.style" :settings="detailpageSettings" :height="height" :agridData="DetailDataStore.DataLists[tabIndex]"/> -->
      </el-tab-pane>
    </el-tabs>
  </div>
  
</template>

<script>
import { HotTable } from '@handsontable/vue'
import Handsontable from 'handsontable';
import BaseDetailAGrid from '@/views/com/epower/fw/smartview/detail/BaseDetailAGrid'
import BaseDetailColumn from '@/views/com/epower/fw/smartview/detail/BaseDetailColumn'
import BaseDetailGrid from '@/views/com/epower/fw/smartview/detail/BaseDetailGrid'
export default {
  data() {
    return {
      UIapi: '',
      options4: [],
      listLoading: false,
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      UiLoaded: false,  // UI获取完成
      dataLoaded: false,  // 数据获取完成
      height: 600, // 表头高度
      UIMeta: '',
      dataPackageResp: '',
      DetailDataStore: {  // DetailDataStore.Datapackage = dataPackageResp.datapackage, detailDataStore.DataLists = agrid的返回List, detailDataStore.DataSetMetas = detailViewModel.datasetInfo
        DataPackage: [],
        DataLists: [],
        DataSetMetas: []
      },
      masterPageData: [],
      firstTabData: [],
      activeTab: '',
      settings: [],
      // settings: {
      //   data: [],
      //   dataSchema: {},
      //   colHeaders: [],
      //   rowHeaders: false,
      //   columns: [],
      //   colWidths: [],
      //   rowHeights: 55,
      //   className: 'htCenter htMiddle',
      //   contextMenu: true,
      //   manualColumnFreeze: true,
      //   fixedColumnsLeft: 0,    // 冻结前n列
      //   fixedRowsTop: 0,     // 冻结前n行
      // },
      url: '',
      tab: Object,
      agridData: Array,
    }
  },
  components: {
    BaseDetailAGrid,
    BaseDetailColumn,
    BaseDetailGrid,
  },
  mounted() {
    // Promise.all([this.getUIMeta(), this.getMultiData()]).then(() => {
    //   this.UiLoaded = true
    //   this.dataLoaded = true
    //   this.DetailDataStore.DataPackage = this.dataPackageResp.dataPackage
    //   this.DetailDataStore.DataSetMetas = this.UIMeta.detailViewModel.datasetInfo
    //   this.getSettings(this.detailpageSettings, this.firstTabData, 0)
    // })
    // this.getUIapi().then(() => {
      this.getUIMeta().then(() => {
        this.UiLoaded = true
        this.DetailDataStore.DataSetMetas = this.UIMeta.detailViewModel.datasetInfo
        this.getMultiData().then(() => {
          this.dataLoaded = true
          // this.getSettings(this.detailpageSettings, this.firstTabData, 0)
        })
      })
    // })
    this.calcTableHeight()
  },
  methods: {
    getSettings(settings, sourceData, index) {
      settings.data = [].concat(sourceData)
      this.UIMeta.detailViewModel.detailPages[index].componentSetModel.components.forEach(theader => {
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
    calcTableHeight() {
      setTimeout(() => {
        this.height = window.innerHeight - parseInt(window.getComputedStyle(document.getElementById('qconHeader'), null).height) - 190
        // this.height = (window.innerHeight - parseInt(window.getComputedStyle(document.getElementById('qconHeader'), null).height) - 100) + 'px'
      })
    },
    // getUIapi() {
    //   return new Promise((resolve, reject) => {
    //     this.UIapi = 'openapi/shopOrderDetailUI'
    //     resolve('ok')
    //   })
    // },
    getUIMeta() {
      return new Promise((resolve, reject) => {
        this.$http.get(this.UIapi).then((res) => {
          this.UIMeta = res.data
          this.activeTab = this.UIMeta.detailViewModel.detailPages[0].name
          resolve('ok')
        })
      })
    },
    // UIMeta.detailViewModel.datasetInfo.datasets.name = UIMeta.detailViewModel.detailPages.componentSetModel.dataset = dataPackageResp.dataPackage.dataSets.name
    // UIMeta.detailViewModel.detasetInfo.datasets.Datasource
    getMultiData() {
      return new Promise((resolve, reject) => {
        if (this.UIMeta.detailViewModel.actionUrl) {
          this.$http.get(this.UIMeta.detailViewModel.actionUrl).then((res) => {
            this.dataPackageResp = res.data
            this.DetailDataStore.DataPackage = this.dataPackageResp.dataPackage

            this.DetailDataStore.DataPackage.dataSets.forEach((item, index) => {
              if (item.name === this.UIMeta.detailViewModel.masterPage.componentSetModel.dataset) {
                this.masterPageData = item.currentTable[0]
              }
            })

            this.UIMeta.detailViewModel.datasetInfo.datasets.forEach((item, index) => {
              if (item.datasource === 'ajaxRequest') {
                this.$http.get(item.actionMethod).then((res) => {
                  this.DetailDataStore.DataLists[item.name] = [].concat(res.data.resultList)
                })
              } else if (item.datasource === 'dataPackage') {
                this.DetailDataStore.DataPackage.dataSets.forEach((dpItem, dpIndex) => {
                  if (item.name === dpItem.name) {
                    this.settings[item.name] = {
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
                    }
                    this.firstTabData = dpItem.currentTable
                    this.getSettings(this.settings[item.name], dpItem.currentTable, 0)
                  }
                })
              }
              if (index === this.UIMeta.detailViewModel.datasetInfo.datasets.length - 1) {
                resolve('ok')
              }
            })

            // todo----------------------------------------------------------------------------------
            // this.firstTabData = this.dataPackageResp.dataPackage.dataSets[1].currentTable
            // todo----------------------------------------------------------------------------------

            // this.UIMeta.detailViewModel.detailPages.forEach((tab, index) => {
            //   if (tab.componentSetModel.style === 'grid') {
            //     this.settings[index] = {
            //       data: [],
            //       dataSchema: {},
            //       colHeaders: [],
            //       rowHeaders: false,
            //       columns: [],
            //       colWidths: [],
            //       rowHeights: 55,
            //       className: 'htCenter htMiddle',
            //       contextMenu: true,
            //       manualColumnFreeze: true,
            //       fixedColumnsLeft: 0,    // 冻结前n列
            //       fixedRowsTop: 0,     // 冻结前n行
            //     }
            //     this.getSettings(this.settings[index], this.firstTabData, 0)
            //   }
            // })
          })
        }
        
      })
    },
    remoteMethod() {},
    handleClick() {}
  }
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
.base-detail-container {
  width: 100%;
}
</style>

