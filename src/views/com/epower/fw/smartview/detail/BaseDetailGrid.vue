<template>
  <el-container class="base-detail-grid-container">
    <el-aside v-if="pageModel.treeModel" width="200px" :style="{'height': treeHeight, 'padding': '0 5px'}">
      <!-- <div class="tree-toolbar">
        <el-button-group>
          <el-tooltip class="item" effect="dark" v-for="btn in pageModel.tree.toolbar.components" :content="btn.label" placement="top">
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
        <el-tree :data="pageModel.treeModel"
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
          <el-dropdown v-if="pageModel.toolbarModel.showMoreButton" trigger="click" placement="bottom" szie="mini">
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
      <el-main>
        <div class="handson-table-container" :style="{height: height+'px'}">
          <div class="wrapper">
            <hot-table ref="hotInstance" v-if="settings" :root="root" :settings="settings"></hot-table>
          </div>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { HotTable } from '@handsontable/vue'
import Handsontable from 'handsontable'

import request from '@/utils/request'

import YUGridValueList from '@/components/ValueList4HandsonTable/valueList.js'



class CustomEditor extends Handsontable.editors.AutocompleteEditor {
  constructor(props) {
    super(props);
  }

  createElements() {
    super.createElements(); 

    this.TEXTAREA = document.createElement("input");
    this.TEXTAREA.setAttribute("type", "search");
    this.TEXTAREA.setAttribute('placeholder', '输入');
    
    // this.TEXTAREA.source= ['BMW', 'Chrysler', 'Nissan', 'Suzuki', 'Toyota', 'Volvo'];
    // this.TEXTAREA.select

    let btnel = document.createElement('button');
    btnel.innerText = '选择';
    Handsontable.dom.empty(this.TEXTAREA_PARENT);
    this.TEXTAREA_PARENT.appendChild(this.TEXTAREA);
    // this.TEXTAREA_PARENT.appendChild(btnel);
  }
}

export default {
  name: 'com-epower-fw-smartview-detail-BaseDetailGrid',
  data() {
    return {
      root: 'test-hot',
      settings: null,
      componentSet:this.page.findChild(this.pageModel.componentSetModel.name),
      toolbar:this.page.findChild(this.pageModel.toolbarModel.name)
    }
  },
  props: ['pageModel', 'activeTab', 'height','page'],
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
    
     beforeKeyDown(instance,e){
       var hottable = this.$refs.hotInstance.hotInstance;
       var selection = hottable.getSelected();
       var cellMetea = hottable.getCellMeta(selection[0],selection[1]);
       var cell = hottable.getCell(selection[0],selection[1]);
       console.log("beforeKeyDown"+cellMetea);
     },
    onClickButton:function(button){
       this.$emit('onButtonClick',{component:button});  //使用$emit()引入父组件中的方法
    },
    getSettings() {
      this.settings = {
        data: this.componentSet.datasource.dataList,
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
       // observeChanges: true,//切换表成为单向数据绑定
        afterSelection: (row, column, row2, column2, preventScrolling, selectionLayerLevel) => {
          //光标移动的时候，datasource的光标也要移动
           // console.log('to row ' + row)
            this.componentSet.datasource.scrollTo(row);

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
        // console.log('theader.ctype:'+theader.ctype);
        if('valuelistField' === theader.ctype){
          this.settings.columns.push({
              // type:"yu.gridValueList",
              editor:"YU_Grid_ValueList",
              fromAction:'http://root.yiuser.com:3001/'+theader.fromAction,
              valueField:theader.valueField,//theader.valueListModel.saveField,
              displayField:theader.displayField,//theader.valueListModel.displayField,
              data: theader.fieldName,     
              //renderer 渲染显示字段
              //TODO 后续要写到类型内，以便前端框架移植
              renderer: function(hotInstance, td, row, column, prop, value, cellProperties){
                Handsontable.renderers.TextRenderer.apply(this, arguments);
                var cellValue = Handsontable.helper.stringify(value); 
                if(Object.prototype.toString.call(value) === '[object Object]'){
                  cellValue = value[theader.displayField];
                }                       
                td.innerHTML = cellValue;
              },

              handsontable: {
                colHeaders: ['列1', '列2', '列3'],
                autoColumnSize: true,
                data: [],
                columns: [{data: "id"},{data: "materialNo"},{data: "materialName"}]         
              }
            
          });
        }else{
          this.settings.columns.push({
            type: "text",

            source:[],        //提示框列表
            strict: true,     //是否严格匹配source[]提示框列表内的值
            allowInvalid: false,  //是否允许录入提示框内容之外的值，如果允许，单元格背景颜色变红色
            search:true,

            allowHtml: true,
            renderer: this.coverRenderer,
            data: theader.fieldName
          });
        }
        
      });
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
      }else if(prop=='baseSize'){
        
        td.style.color = 'red';
        // td.innerHtml = "<button>button</button>";
        // td.remoteCombox.createElement('remote-combox');
        Handsontable.renderers.TextRenderer.apply(this, arguments);
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

.htSelectEditor {
  padding: 5px 7px;
  position: absolute;
  /*
   * This hack enables to change <select> dimensions in WebKit browsers
   */
  -webkit-appearance: menulist-button !important;
}
</style>
