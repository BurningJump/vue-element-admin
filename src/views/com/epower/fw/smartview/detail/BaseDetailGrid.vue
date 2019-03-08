<template>
  <el-container class="base-detail-grid-container">
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
                  <svg-icon :icon-class="`${btn.iconcls}`"/>
                  {{btn.label}}
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-tooltip>
        </el-button-group>
      </div> -->
      <div class="tree-container">
        <el-tree :data="tab.treeModel" :props="defaultProps" highlight-current @node-expand="handleNodeExpand" @node-click="handleNodeClick">
        </el-tree>
      </div>
    </el-aside>
    <el-container>
      <el-header v-if="tab.toolbarModel.buttons.length > 0 || tab.componentSetModel.style === 'aGrid'" height="35px">
        <el-button-group v-if="tab.toolbarModel.buttons.length > 0">
          <el-button v-for="btn in tab.toolbarModel.buttons" v-if="tab.toolbarModel.buttons.length > 0 && !btn.isMore" :key="btn.label" size="mini">
            <svg-icon :icon-class="`${btn.iconcls}`"/>
            {{ btn.label }}
          </el-button>
          <el-dropdown v-if="tab.toolbarModel.showMoreButton" trigger="click" placement="bottom" szie="mini">
            <el-button size="mini">
              更多<i class="el-icon-arrow-down el-icon--right" style="margin-left:0;"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-for="btn in tab.toolbarModel.buttons" v-if="btn.isMore">
                <svg-icon :icon-class="`${btn.iconcls}`"/>
                {{btn.label}}
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-button-group>
      </el-header>
      <el-main v-if="activeTab === tab.name">
        <div class="handson-table-container" :style="{height: height+'px'}">
          <div class="wrapper">
            <hot-table v-if="settings" :root="root" :settings="settings"></hot-table>
          </div>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { HotTable } from '@handsontable/vue'
import Handsontable from 'handsontable'

export default {
  name: 'com.epower.fw.smartview.detail.BaseDetailGrid',
  data() {
    return {
      root: 'test-hot',
      settings: null,
    }
  },
  props: ['tab', 'activeTab', 'height','componentSet', 'dataLoaded'],
  components: {
    HotTable
  },
  mounted() {
    this.$bus.on('getSetting', () => {
      this.getSettings()
    })
  },
  methods: {
    getSettings() {
      this.settings = {
        data: this.componentSet.dataSource.dataList,
        dataSchema: {},
        colHeaders: [],
        rowHeaders: false,
        columns: [],
        colWidths: [],
        rowHeights: 55,
        className: "htCenter htMiddle",
        contextMenu: true,
        manualColumnFreeze: true,
        fixedColumnsLeft: 0, // 冻结前n列
        fixedRowsTop: 0 // 冻结前n行
      }
      this.componentSet.children.forEach(theader => {
        this.settings.colHeaders.push(theader.label);
        this.settings.dataSchema[theader.fieldName] = null;
        this.settings.colWidths.push(
          theader.width > 1
            ? theader.width
            : ""
        );
        this.settings.columns.push({
          type: "autocomplete",
          allowHtml: true,
          renderer: this.coverRenderer,
          data: theader.fieldName
        });
      });
    },
    coverRenderer (instance, td, row, col, prop, value, cellProperties) {
      var escaped = Handsontable.helper.stringify(value),
        img;

      if (escaped.indexOf('http') === 0) {
        img = document.createElement('IMG');
        img.src = value;
        img.width = instance.getColWidth()

        Handsontable.dom.addEvent(img, 'mousedown', function (e){
          e.preventDefault(); // prevent selection quirk
        });

        Handsontable.dom.empty(td);
        td.className = "htCenter htMiddle";
        td.appendChild(img);
      }
      else {
        // render as text
        Handsontable.renderers.TextRenderer.apply(this, arguments);
      }

      return td;
    },
  }
}
</script>

<style lang="scss">
@import "handsontable/dist/handsontable.full.css";
.handson-table-container {
  width: 100%;
  overflow: hidden;
  .wrapper {
    width: 100%;
    height: 100%;
    overflow: auto;
    th {
      color: #909399;
      font-size: 14px;
      font-weight: bold;
      background: rgb(246, 246, 246);
    }
    td {
      color: #606266;
      font-size: 12px;
    }
    tbody {
      tr:nth-child(2n) {
        td {
          background-color: #fafafa;
        }
      }
    }
  }
}
</style>
