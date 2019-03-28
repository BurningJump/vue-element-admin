import Handsontable from 'handsontable'
import request from '@/utils/request'

(function(Handsontable){
  var ValueListEdit = Handsontable.editors.HandsontableEditor.prototype.extend();
  // var _selectObject=void 0;  //用来保存选中的记录object
  var _oldValue = void 0; //修改前的值

  ValueListEdit.prototype.prepare = function (td, row, col, prop, value, cellProperties) {
    Handsontable.editors.HandsontableEditor.prototype.prepare.apply(this, arguments);
    // if(_selectObject !== void 0)
    // console.log('_selectObject:'+_selectObject['teamName']);
  }

  ValueListEdit.prototype.open = function () {
    Handsontable.editors.HandsontableEditor.prototype.open.apply(this, arguments);
    this.instance.addHook('beforeKeyDown', onBeforeKeyDown);
    this.instance.addHook('afterBeginEditing', onAfterBeginEditing);

    var choicesListHot = this.htEditor.getInstance();
    choicesListHot.updateSettings({
      getValue:function() {
        var selection = this.getSelectedLast();
        return this.getSourceDataAtRow(selection[0]);
        // Get always manufacture name of clicked row
        //TODO 更新datasource
        // return this.getSourceDataAtRow(selection[0]).teamName;
        // return _selectObject;
      }
    }); 
  };

  ValueListEdit.prototype.setValue = function(newValue){
    var cellValue = Handsontable.helper.stringify(newValue); 
    if(Object.prototype.toString.call(newValue) === '[object Object]'){
      cellValue = newValue[this.cellProperties.displayField];
    }
    this.TD.innerHTML = cellValue;
  };
  ValueListEdit.prototype.getValue = function(){
    let choiceRes = this.htEditor.getInstance().getValue();
    //在这里设置cell的值 
    this.instance.setDataAtCell(this.row,this.col,choiceRes);
    //TODO 设置map的值
    let component = this.cellProperties.component;
    let maps = this.cellProperties.maps;
    let form = this.cellProperties.form;
    for(let m of maps){
      
      // this.instance.setDataAtCell(this.row,  ,choiceRes[m['fromField']]);
      form.setCmpValue(m['toComponent'],choiceRes[m['fromField']]);
      
    }
    // this.instance.setDataAtRowProp(this.row,fieldName,value);
    return choiceRes; //返回任何值都不起效果
  };

  ValueListEdit.prototype.close = function () {
    Handsontable.editors.HandsontableEditor.prototype.close.apply(this, arguments);
    this.instance.removeHook('beforeKeyDown', onBeforeKeyDown);
    this.instance.removeHook('afterBeginEditing', onAfterBeginEditing); 
    // this.instance.removeHook('afterChange', testHook);
  };

  var skipOne = false;  //路过第一个？ 没用上？
  function onBeforeKeyDown(event) {
    skipOne = false;
    var editor = this.getActiveEditor();
    //isPrintableChar 有关键字符录入（space， 0-9，a-z）
    if (Handsontable.helper.isPrintableChar(event.keyCode) 
      || event.keyCode === Handsontable.helper.KEY_CODES.BACKSPACE 
      || event.keyCode === Handsontable.helper.KEY_CODES.DELETE 
      || event.keyCode === Handsontable.helper.KEY_CODES.INSERT) {
      var timeOffset = 0; // on ctl+c / cmd+c don't update suggestion list
  
      //键盘动作ctrl+c 即copy
      if (event.keyCode === Handsontable.helper.KEY_CODES.C && (event.ctrlKey || event.metaKey)) {
        return;
      }
      //TODO 这里减少远程请求，不够全面，待完善->当中文输入法情况下，输入汉字，在汉字没有出来之前，每次键盘动作还是会触发以下代码
      if(_oldValue === editor.TEXTAREA.value || editor.TEXTAREA.value===void 0
        || editor.TEXTAREA.value==='')
        return;
      
        _oldValue = editor.TEXTAREA.value;  
      //如果editor没有open
      if (!editor.isOpened()) {
        timeOffset += 10;
      }
      
      if (editor.htEditor) {
        editor.instance._registerTimeout(function () {
          editor.queryChoices(editor.TEXTAREA.value);
          skipOne = true;
        }, timeOffset);
      }
    }
  }
  
  ValueListEdit.prototype.queryChoices = function (query) {
    var _this = this;

    this.query = query;

    let cellProp = this.cellProperties;
    let fromaction = cellProp.fromAction;
    var htEditorInstance = this.htEditor.getInstance();
    request({
      url: fromaction,
      method: 'get'
    }).then(resData => {
      var options=resData.data.resultList;  
      for(let item of options){
        // item['teamNo']=this.query;
        // item['user1']='';  
        // item['user2']='';
        // item['user3']='';  
      }       
      cellProp['source']=options;
      //更新可选列表
      htEditorInstance.loadData(options);//(Handsontable.helper.pivot([options]));
    }).catch(err => {
      console.log(err.message)
    })
       
  };
  
  //TODO valueList组件，输入时显示字段可以此事件中完成？【afterBeginEditing】
  function onAfterBeginEditing(row,column) {
    let editor = this.getActiveEditor();
    let _cellProp = editor.cellProperties;    
    let objValue = this.getDataAtCell(row,column);
    if(_cellProp !== void 0  && objValue !== void 0 && objValue != null)
      editor.TEXTAREA.value=objValue[_cellProp.inputField];
      // editor.TEXTAREA.value=objValue['teamName'];
  };
  
  //renderer 渲染显示字段
  //TODO 后续要写到类型内，以便前端框架移植
  function  cellRenderer(hotInstance, td, row, column, prop, value, cellProperties){
    Handsontable.renderers.TextRenderer.apply(this, arguments);
    let _cellProp = cellProperties; 
    var cellValue = Handsontable.helper.stringify(value); 
    if(Object.prototype.toString.call(value) === '[object Object]'){
      cellValue = value[_cellProp.displayField];
    }                       
    td.innerHTML = cellValue;
  };

  // Put editor in dedicated namespace
  Handsontable.editors.YU_Grid_ValueList = ValueListEdit;

  // Register alias
  Handsontable.editors.registerEditor('YU_Grid_ValueList', ValueListEdit);

  // Handsontable.cellTypes.registerCellType('yu.gridValueList', {
  //   editor: ValueListEdit,
  //   renderer: cellRenderer,
  //   // validator: customValidator,
  //   // You can add additional options to the cell type based on Handsontable settings
  //   className: 'yu_gridValueList',
  //   allowInvalid: true,
  //   // Or you can add custom properties which will be accessible in `cellProperties`
  //   myCustomCellState: 'complete',
  // });
})(Handsontable);