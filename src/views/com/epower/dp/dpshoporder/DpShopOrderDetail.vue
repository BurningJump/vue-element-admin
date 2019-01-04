<template>
  <div class="app-container">
    <el-container v-if="UiLoaded&&dataLoaded">
      <el-header height="auto">
        <el-button-group>
          <el-button v-for="btn in buttons" v-if="!btn.isMore" :key="btn.label" size="mini">
            <svg-icon :icon-class="`${btn.iconcls}`"/>
            {{ btn.label }}
          </el-button>
          <el-dropdown v-if="editMultiUI.detailViewModel.masterPage.toolbarModel.showMoreButton" trigger="click" placement="bottom" szie="mini">
            <el-button size="mini">
              更多<i class="el-icon-arrow-down el-icon--right" style="margin-left:0;"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-for="btn in buttons" v-if="btn.isMore">
                <!-- <el-tooltip class="item" effect="dark" :content="btn.label" placement="top"> -->
                  <svg-icon :icon-class="`${btn.iconcls}`"/>
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
            <el-date-picker v-else-if="input.ctype === 'dateField'" v-model="masterPageData[input.field]" type="date"/>
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
    <el-tabs v-if="UiLoaded&&dataLoaded" v-model="activeTab" type="card" @tab-click="handleClick">
      <!-- <el-tab-pane v-for="tab in detailPagesTabs" :key="tab.name" :label="tab.label" :name="tab.name"> -->
      <el-tab-pane v-for="(tab,tabIndex) in detailPagesTabs" :key="tab.name" :name="tab.name">
        <span slot="label">
          <svg-icon :icon-class="`${tab.iconcls}`"/>
          {{tab.label}}
        </span>
        <base-detail :url="editMultiUI.detailViewModel.datasetInfo.datasets[tabIndex].actionMethod" :tab="tab" :activeTab="activeTab" :type="tab.componentSetModel.style" :settings="detailpageSettings" :tableHeight="tableHeight" :agridData="aGridList[tabIndex]"/>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import { HotTable } from '@handsontable/vue'
import BaseDetail from '@/views/com/epower/fw/smartview/detail/BaseDetail'
import Handsontable from 'handsontable';
export default {
  name: 'com.epower.dp.dpshoporder.DpShopOrderDetail',
  data() {
    return {
      UiLoaded: false,  // UI获取完成
      dataLoaded: false,  // 数据获取完成
      tableHeight: 600, // 表头高度
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
        fixedRowsTop: 0,     // 冻结前n行
      },
      aGridList: [],
    }
  },
  components: {
    BaseDetail,
  },
  mounted() {
    Promise.all([this.getUIdata(), this.getMultiData()]).then(() => {
      this.UiLoaded = true
      this.dataLoaded = true
      this.getSettings(this.detailpageSettings,this.firstTabData,0)
    })
    this.calcTableHeight()
  },
  // mounted() {
  // },
  methods: {
    getSettings(settings,sourceData,index) {
      settings.data = [].concat(sourceData)
      this.detailPagesTabs[index].componentSetModel.components.forEach(theader => {
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
        this.tableHeight = window.innerHeight - parseInt(window.getComputedStyle(document.getElementById('qconHeader'), null).height) - 190
        this.treeHeight = (window.innerHeight - parseInt(window.getComputedStyle(document.getElementById('qconHeader'), null).height) - 100) + 'px'
      })
    },
    getUIdata() {
      return new Promise((resolve, reject) => {
        this.$http.get('openapi/shopOrderDetailUI').then((res) => {
          this.editMultiUI = res.data
          this.buttons = [...this.editMultiUI.detailViewModel.masterPage.toolbarModel.buttons]
          this.masterPageInputs = [...this.editMultiUI.detailViewModel.masterPage.componentSetModel.components]
          this.detailPagesTabs = [...this.editMultiUI.detailViewModel.detailPages]
          this.detailPagesTabs.forEach((tab, index) => {
            // this.aGridList[index] = []
          })
          this.activeTab = this.detailPagesTabs[0].name
          resolve('ok')
        })
      })
    },
    getMultiData() {
      return new Promise((resolve, reject) => {
        this.$http.get('openapi/shopOrderDetailData').then((res) => {
          this.editMultiData = res.data
          this.masterPageData = this.editMultiData.dataPackage.dataSets[0].currentTable[0]
          this.firstTabData = this.editMultiData.dataPackage.dataSets[1].currentTable
        })
        this.$http.get('openapi/shopOrderDetailData_log').then((res) => {
          // 日志
          this.aGridList[2] = []
          this.aGridList[2] = [...res.data.resultList]
        })
        this.$http.get('openapi/shopOrderDetailData_distribute').then((res) => {
          // 要货单
          this.aGridList[3] = []
          this.aGridList[3] = [...res.data.resultList]
        })
        this.$http.get('openapi/shopOrderDetailData_delivery').then((res) => {
          // 发货单
          this.aGridList[4] = []
          this.aGridList[4] = [...res.data.resultList]
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

