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
            <hot-table :root="root" :settings="settings"></hot-table>
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
  data: function() {
    return {
      root: 'test-hot',
      // settings: {
      //   data: [
      //     {id: 1, name: 'Ted Right', address: ''},
      //     {id: 2, name: 'Frank Honest', address: ''},
      //     {id: 3, name: 'Joan Well', address: ''},
      //     {id: 4, name: 'Gail Polite', address: ''},
      //     {id: 5, name: 'Michael Fair', address: ''},
      //   ],
      //   colHeaders: true,
      //   rowHeaders: true,
      // }
    }
  },
  props: ['tab', 'activeTab', 'settings', 'height'],
  components: {
    HotTable
  },
  mounted() {
    this.$nextTick(() => {
    })
  },
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