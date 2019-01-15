<template>
  <div class="app-container">
    <el-container v-if="UiLoaded&&dataLoaded">
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
              <el-dropdown-item v-for="btn in buttons" v-if="btn.isMore">
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
            <el-input v-if="input.ctype === 'textfield' || input.ctype === 'valuelistField'" v-model="supplyData.dataPackage.dataSets[0].currentTable[0][input.field]"/>
            <el-date-picker v-else-if="input.ctype === 'dateField'" v-model="supplyData.dataPackage.dataSets[0].currentTable[0][input.field]" type="date"/>
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
    </el-container>
    <el-tabs v-model="activeTab" type="card" @tab-click="handleClick">
      <el-tab-pane v-for="(tab,tabIndex) in UIMeta.detailViewModel.detailPages" :key="tab.name" :name="tab.name">
        <span slot="label">
          <svg-icon :icon-class="`${tab.iconcls}`"/>
          {{tab.label}}
        </span>
          <base-detail :treeHeight="treeHeight" :tab="tab" :activeTab="activeTab" :settings="settings[tabIndex]" :tableHeight="tableHeight"/>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import BaseDetailGrid from '@/views/com/epower/fw/smartview/detail/BaseDetailGrid'
import Handsontable from 'handsontable'
import BaseDetail from '@/views/com/epower/fw/smartview/detail/BaseDetail'
export default {
  name: 'com.epower.fw.smartview.detail.BaseDataDetail',
  data() {
    return {
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      tableHeight: 600, // 表头高度
      UIMeta: '',
      UiLoaded: false,  // UI获取完成
      dataLoaded: false,  // 数据获取完成
      supplyData: '',
      activeTab: '',
      settings: [],
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
    BaseDetailGrid,
    BaseDetail,
  },
  mounted() {
    Promise.all([this.getUIdata(), this.getSupplyData()]).then(() => {
      this.activeTab = this.UIMeta.detailViewModel.detailPages[0].name
      this.getSettings(this.detailpageSettings,this.supplyData.dataPackage.dataSets[1].currentTable,0)
      this.getSettings(this.detailPage3Settings,this.supplyData.dataPackage.dataSets[2].currentTable,1)
      this.settings[0] = this.detailpageSettings
      this.settings[1] = this.detailPage3Settings
      this.calcTableHeight()
    })
  },
  methods: {
    handleClick(tab, event) {
      this.activeTab = tab.name
    },
    handleNodeExpand() {},
    handleNodeClick() {},
    calcTableHeight() {
      setTimeout(() => {
        this.tableHeight = window.innerHeight - parseInt(window.getComputedStyle(document.getElementById('qconHeader'), null).height) - 190
        this.treeHeight = (window.innerHeight - parseInt(window.getComputedStyle(document.getElementById('qconHeader'), null).height) - 100) + 'px'
      })
    },
    getSettings(settings,sourceData,index) {
      settings.data = [].concat(sourceData)
      this.UIMeta.detailViewModel.detailPages[index].componentSetModel.components.forEach(theader => {
        settings.colHeaders.push(theader.label)
        settings.dataSchema[theader.field] = null
        // settings.colWidths.push(theader.width > 1 ? theader.width : theader.width > 0 && theader.width <= 1 ? theader.width*100 + '%' : '')
        settings.colWidths.push(theader.width > 1 ? theader.width : '')
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
          this.UIMeta = res.data
          this.UiLoaded = true
          resolve('ok')
        })
      })
    },
    getSupplyData() {
      return new Promise((resolve, reject) => {
        this.$http.get('http://root.yiuser.com:3001/openapi/invRequestDetailData').then((res) => {
          this.supplyData = res.data
          this.dataLoaded = true
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

