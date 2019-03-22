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
        <el-tree :data="tab.treeModel"
                  :props="defaultProps" highlight-current
                  @node-expand="handleNodeExpand"
                  @node-click="handleNodeClick">
        </el-tree>
      </div>
    </el-aside>
    <el-container>
      <el-header v-if="toolbar.children.length > 0" height="35px">
        <el-button-group v-if="toolbar.children.length > 0">
          <el-button v-for="btn in toolbar.children"
          v-if=" !btn.hidden && !btn.isMore"
          :key="btn.componentName"
          :disabled="!btn.enable"
          @click="onClickButton(btn)"
           size="mini">
            <svg-icon :icon-class="`${btn.iconcls}`"/>
            {{ btn.label }}
          </el-button>
          <el-dropdown v-if="tab.toolbarModel.showMoreButton" trigger="click" placement="bottom" szie="mini">
            <el-button size="mini">
              更多<i class="el-icon-arrow-down el-icon--right" style="margin-left:0;"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-for="btn in toolbar.children" v-if="btn.isMore">
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
  name: 'com-epower-fw-smartview-detail-BaseDetailGrid',
  data() {
    return {
      root: 'test-hot',
      settings: null,
      componentSet:this.page.findChild(this.tab.componentSetModel.name),
      toolbar:this.page.findChild(this.tab.toolbarModel.name)
    }
  },
  props: ['tab', 'activeTab', 'height','page'],
  components: {
    HotTable
  },
  mounted() {
    this.getSettings()
    this.$bus.on('getSetting', () => {
      this.getSettings()
    })
  },
  methods: {
    onClickButton:function(button){
       this.$emit('onButtonClick',{component:button});  //使用$emit()引入父组件中的方法
    },
    getSettings() {
      this.settings = {
        data: this.componentSet.dataSource.dataList,
        dataSchema: {},
        colHeaders: [],
        rowHeaders: true,// 显示序列号 by max
        columns: [],
        colWidths: [],
        rowHeights: 55,
        className: "htCenter htMiddle",
        activeHeaderClassName: 'ht__active_highlight',
        currentRowClassName: 'currentRow',
        autoWrapCol:false,
        autoWrapRow:true,
        manualColumnResize: true,
        manualRowResize: true,
        contextMenu: false ,
        fillHandle: {
            // enable plugin in vertical direction and with autoInsertRow as false
            autoInsertRow: false,
            direction: 'vertical'
        }, //启用填充句柄（向下拖放和向下复制）功能 by max
        manualColumnFreeze: true,
        fixedColumnsLeft: 0, // 冻结前n列
        fixedRowsTop: 0 ,// 冻结前n行
        selectionMode: 'single',//Only a single cell can be selected.  by max
        observeChanges: true,//切换表成为单向数据绑定
        afterSelection: (row, column, row2, column2, preventScrolling, selectionLayerLevel) => {
          //光标移动的时候，datasource的光标也要移动
           // console.log('to row ' + row)
            this.componentSet.dataSource.scrollTo(row);

          },
        afterChange:(changes,source)=>{
          if (source == "loadData") {
            //装载数据时不处理
          } else{
            changes.forEach(([row, prop, oldValue, newValue]) => {
                console.log('row:'+row + '  prop:'+prop + ' oldValue:'+oldValue + ' newValue:'+newValue )
            });
         }
        }
      }
      this.componentSet.children.forEach(component => {
        this.settings.colHeaders.push(component.label);
        this.settings.dataSchema[component.fieldName] = null;
        this.settings.colWidths.push(
          component.width > 1
            ? component.width
            : ""
        );
        this.settings.columns.push(this.createColumn(component));
      });
    },
    createColumn(component){
      var column
      if (component.ctype==='image'){
         column ={
          type: "autocomplete",
          allowHtml: true,
          renderer: this.imageCoverRenderer,
          data: component.fieldName
        }
      } else   if (component.ctype==='checkboxField'){
         column ={
          type: "checkbox",
          data: component.fieldName,
          checkedTemplate: 1 ,
          uncheckedTemplate: 0
        }
      } else  if (component.ctype==='dateField'){
         column ={
          type: "date",
          dateFormat: 'YYYY-MM-DD',
          correctFormat: true,
          data: component.fieldName
        }
      } else if (component.ctype==='dateTimeField'){
         column ={
          type: "date",
          dateFormat: component.format,
          correctFormat: true,
          data: component.fieldName
        }
      } else if (component.ctype==='numberfield'){
         column ={
          type: "numeric",
          data: component.fieldName
        }
      } else  {
       column ={
          type: "text",
          allowHtml: true,
          data: component.fieldName
        }
      }
     return column
    },
    safeHtmlRenderer(instance, td, row, col, prop, value, cellProperties) {
        var escaped = Handsontable.helper.stringify(value);
        escaped = strip_tags(escaped, '<em><b><strong><a><big>'); //be sure you only allow certain HTML tags to avoid XSS threats (you should also remove unwanted HTML attributes)
        td.innerHTML = escaped;
        return td;
    },

    imageCoverRenderer (instance, td, row, col, prop, value, cellProperties) {
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
