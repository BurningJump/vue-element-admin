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
            <el-button size="mini" style="width:83.55px;">
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
    <!-- <el-dialog :visible.sync="dialogVisible" width="30%"> -->
          <!-- <base-select :dialogVisiblePop='dialogVisible'></base-select> -->
   <!-- </el-dialog> -->
  </el-container>


</template>

<script>
import { HotTable } from '@handsontable/vue'
import Handsontable from 'handsontable'

import request from '@/utils/request'

import YUGridValueList from '../components/Component4HandsonTable/valueList.js'
import YUGridCombox from '../components/Component4HandsonTable/combox.js'

// import BaseSelect from '../select/BaseSelect'
import {vsmartview} from '@/smartview/VSmartView.js'

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
    this.TEXTAREA_PARENT.appendChild(btnel);
  }
}

export default {
  name: 'com-epower-fw-smartview-detail-BaseDetailGrid',
  data() {
    return {
      dialogVisible:false,
      root: 'test-hot',
      settings: null

//       ,
//       manufacturerData : [
//   {name: 'BMW', country: 'Germany', owner: 'Bayerische Motoren Werke AG'},
//   {name: 'Chrysler', country: 'USA', owner: 'Chrysler Group LLC'},
//   {name: 'Nissan', country: 'Japan', owner: 'Nissan Motor Company Ltd'},
//   {name: 'Suzuki', country: 'Japan', owner: 'Suzuki Motor Corporation'},
//   {name: 'Toyota', country: 'Japan', owner: 'Toyota Motor Corporation'},
//   {name: 'Volvo', country: 'Sweden', owner: 'Zhejiang Geely Holding Group'}
// ]
    }
  },
  props: ['pageModel','page', 'activeTab', 'height'],
  components: {
    HotTable
  },
  created(){
      this.getSettings()
  },
  computed:{
      componentSet:function(){
        return this.page.findChild(this.pageModel.componentSetModel.name)
      },
      toolbar:function(){
        return  this.page.findChild(this.pageModel.toolbarModel.name)
      }
  },
  methods: {

    CallValueListFormInCell(row,col,querytxt,cellProp,instance){

      // this.dialogVisible = true;

      var _this = this;
      function callValueListFromRefeed(resData){
        let form = cellProp.form;
        let component = cellProp.component;

        let res = resData;
        if((resData||'')!='')
        {

          instance.selectCell(row,col);
          instance.setDataAtCell(row,col,resData[0]);

          let res = resData[0];
          let maps = cellProp.maps;
          let form = cellProp.form;
          if((res||'')!=''){
            for(let m of maps){
              form.setCmpValue(m['toComponent'],res[m['fromField']]);
            }
          }
          // instance.loadData(_this.componentSet.datasource.dataList);
          instance.view.render();
          // console.log('materialName'+instance.getDataAtCell(row,col+1));
        }else{
          console.log('select form feedback no data');
        }
      }
      console.log('handsontable select fromjsclass:'+cellProp.fromJsclass)
      vsmartview.callSelectForm(cellProp.fromJsclass,(this.multiple?'multi':'single'),callValueListFromRefeed)
      // let formJsPath = '/com/epower/am/operation/SelectList'
      // this.$router.push({
      //   path:formJsPath,
      //   query:{
      //     selectType:this.multiple?'multi':'single' ,
      //     callValueListFromRefeed: callValueListFromRefeed
      //   }
      // });
    },
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
        licenseKey:'non-commercial-and-evaluation',  //handsontable 授权
        data: this.componentSet.datasource.dataList,
        dataSchema: {},
        colHeaders: [],
        rowHeaders: true,// 显示序列号 by max
        columns: [
    //       {
    //   type: 'handsontable',
    //   handsontable: {
    //     colHeaders: ['Marque', 'Country', 'Parent company'],
    //     autoColumnSize: true,
    //     data: this.manufacturerData,
    //     getValue: function() {
    //     	var selection = this.getSelectedLast();

    //       // Get always manufacture name of clicked row
    //       return this.getSourceDataAtRow(selection[0]).name;
    //     },
    //   }
    // }
    ],
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
           console.log('to row ' + row)
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
        this.settings.columns.push(this.createColumn(component));
        // console.log('theader.ctype:'+theader.ctype);


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
      } else if(component.ctype === 'valuelistField'){
          column ={
              type:"yu.gridValueList",
              fromAction:'http://root.yiuser.com:3001/'+component.fromAction,
              component:component,
              inputField:component.inputField,
              valueField:component.valueField,//theader.valueListModel.saveField,
              displayField:component.displayField,//theader.valueListModel.displayField,
              maps: component.maps,
              form: component.form,
              fromJsclass: component.fromJsclass,
              cellFunction:this.CallValueListFormInCell,
              data: component.fieldName,
              handsontable: {
                colHeaders: ['列1', '列2', '列3'],  //TODO 增加配置
                autoColumnSize: true,
                data: [],
                columns: [{data: "id"},{data: "materialNo"},{data: "materialName"}]  //TODO 增加配置
              }
          }
        }else if(component.ctype === 'comboBox'){
          column ={
              type:"yu.gridCombox",
              data: component.fieldName,
              enumModel:component.enumModel,
              form: component.form
          }
        }
        else  {
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

.handsontableInputHolder {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
}
.handsontableInput {
  width: calc(100% - 48px) !important;
  min-width: calc(100% - 48px) !important;
  max-width: calc(100% - 48px) !important;
}
.valueListBtn {
  padding: 0;
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
