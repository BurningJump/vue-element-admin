import Handsontable from 'handsontable'
import request from '@/utils/request'
import { throttleAfterHits } from '_handsontable@7.0.0@handsontable/es/helpers/function';
// import router from '@/router'  //临时代码

(function(Handsontable){
  var ComboxEdit = Handsontable.editors.HandsontableEditor.prototype.extend();
  var _selectObject=void 0;  //用来保存object
  var _allowInvalid = false; //是否允许保存非选择列表内的值
  var _isStrict  = false;    //是否的严格来源于合法的内值
  var _oldValue = void 0; //editor keydown修改前的值,用来判断是否远程请求

  ComboxEdit.prototype.createElements = function () {
    // Handsontable.editors.TextEditor.prototype.createElements.apply(this, arguments);
    this.TEXTAREA = document.createElement('TEXTAREA');
    this.TEXTAREA.tabIndex = -1;
    this.TEXTAREA.readOnly = true;

    Handsontable.dom.addClass(this.TEXTAREA, 'handsontableInput');
    this.textareaStyle = this.TEXTAREA.style;
    this.textareaStyle.width = 0;
    this.textareaStyle.height = 0;
    this.TEXTAREA_PARENT = document.createElement('DIV');
    Handsontable.dom.addClass(this.TEXTAREA_PARENT, 'handsontableInputHolder');
    this.textareaParentStyle = this.TEXTAREA_PARENT.style;
    this.textareaParentStyle.zIndex = '-1';
    this.TEXTAREA_PARENT.appendChild(this.TEXTAREA);
    this.instance.rootElement.appendChild(this.TEXTAREA_PARENT);

    var editor = this;
    this.TEXTAREA.oninput = onInput;
    function onInput(event) {
      editor.instance.runHooks('afterInput',event);
    }
    this.TEXTAREA.onblur = onBlur;
    function onBlur(event) {
      editor.instance.runHooks('beforeBlur',event);
    }
        
    var DIV = document.createElement('DIV');
    DIV.className = 'handsontableEditor';
    this.TEXTAREA_PARENT.appendChild(DIV);
    this.htContainer = DIV;
    this.assignHooks();   
  }
  
  //edit 值输入处理
  function onInput(event){
      
      var editor = this.getActiveEditor();

        if(_oldValue === editor.TEXTAREA.value || editor.TEXTAREA.value===void 0
          || editor.TEXTAREA.value==='')
          return;
        
          _selectObject=editor.TEXTAREA.value; //允许值输入时要做处理
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
      // }
  }

  ComboxEdit.prototype.prepare = function (td, row, col, prop, value, cellProperties) {
    if (!cellProperties.readOnly) {
      Handsontable.editors.HandsontableEditor.prototype.prepare.apply(this, arguments);      
    }   
  };

  ComboxEdit.prototype.open = function () {
    Handsontable.editors.HandsontableEditor.prototype.open.apply(this, arguments);
    this.instance.addHook('beforeKeyDown', onBeforeKeyDown);
    this.instance.addHook('afterBeginEditing', onAfterBeginEditing); 
    Handsontable.hooks.register('beforeBlur');
    this.instance.addHook('beforeBlur', onBlur);

    //原始值
    // this.htEditor.getInstance().loadData(this.instance.getDataAtCell(this.row,this.col));
    let _cellProp = this.cellProperties;
    let _enumModelItems= _cellProp['enumModel'].items;
    
    let _objValue = this.instance.getDataAtCell(this.row,this.col);
    for(let item of _enumModelItems){
      if(item['value'] === _objValue){
        //原值
        _selectObject=item;
        break;
      }
    }

    var choicesListHot = this.htEditor.getInstance();
    choicesListHot.updateSettings({
      colHeaders:false,
      data: _enumModelItems,
      autoColumnSize: true,
      columns: [{data: "label"}],
      getValue:function() {
        var selection = this.getSelectedLast();
        if(selection != void 0 && (selection||'') != ''){
          _selectObject =  this.getSourceDataAtRow(selection[0]);
          _isStrict = true;
        }else{
          _isStrict = false;
          _selectObject =  [];
        }
        return _selectObject;           
      }
    }); 
  };

  ComboxEdit.prototype.close = function () {    
    Handsontable.editors.HandsontableEditor.prototype.close.apply(this, arguments);
    this.instance.removeHook('beforeKeyDown', onBeforeKeyDown);
    this.instance.removeHook('afterBeginEditing', onAfterBeginEditing); 
    this.instance.removeHook('beforeBlur', onBlur);
  };



  ComboxEdit.prototype.setValue = function(newValue){
    var cellValue = Handsontable.helper.stringify(newValue); 
    if(isValueObjecgtExists(newValue) ){
      cellValue = newValue['label'];
    }else{
      cellValue = '';
    }
    this.TD.innerHTML = cellValue;    
  };

  ComboxEdit.prototype.getValue = function(){
    return _selectObject;
  };

  ComboxEdit.prototype.saveValue = function(){
    if(isValueObjecgtExists(_selectObject)){
      this.instance.setDataAtCell(this.row,this.col,_selectObject['value']);
    }    
  };

  
  var skipOne = false;  //路过第一个？ 没用上？

  
  ComboxEdit.prototype.queryChoices = function (query) {
    this.query = query;
    // console.log('this.query:'+query);
    let _cellProp = this.cellProperties;
    let _enumModelItems= _cellProp['enumModel'].items;
    var htEditorInstance = this.htEditor.getInstance();
    htEditorInstance.loadData(_enumModelItems);       
  };
  
  //renderer 渲染显示字段
  //TODO 后续要写到类型内，以便前端框架移植
  function  cellRenderer(hotInstance, td, row, column, prop, value, cellProperties){
    Handsontable.renderers.TextRenderer.apply(this, arguments);
    Handsontable.dom.addClass(td,"htMiddle");  //居中显示
    Handsontable.dom.addClass(td,"htCenter");

    showComboxDisplayValue(td,value,cellProperties);
  }

  //判断是否有效对象
  function isValueObjecgtExists(val){
    if(Object.prototype.toString.call(val) === '[object Object]'){
      return true;
    }else{
      return false;
    }
  }

  //combox显示值
  function showComboxDisplayValue(td,cellValue,_cellProp){
    let _cellValue = Handsontable.helper.stringify(cellValue); 
    let _enumModelItems= _cellProp['enumModel'].items;
    if(cellValue !== void 0 && _enumModelItems !== void 0 && Array.isArray(_enumModelItems) ){
      for(let item of _enumModelItems){
        if(item['value'] === cellValue){
          _cellValue=item['label'] ;
          break;
        }
      }
    }
    // this is faster than innerHTML. See: https://github.com/handsontable/handsontable/wiki/JavaScript-&-DOM-performance-tips
    Handsontable.dom.fastInnerText(td,_cellValue);  
  }
  function showEditorDisplayValue(_this){
    let editor = _this.getActiveEditor();

    let _cellValue='';
    let _cellProp = editor.cellProperties;    
    let _objValue = _this.getDataAtCell(editor.row,editor.col);
    let _enumModelItems= _cellProp['enumModel'].items;
    
    for(let item of _enumModelItems){
      if(item['value'] === _objValue){
        _cellValue=item['label'] ;
        break;
      }
    }
    editor.TEXTAREA.value=_cellValue; 
  }

  function onBeforeKeyDown(event) {    
    skipOne = false;
    _isStrict = false;
    var editor = this.getActiveEditor();
    // console.log('afterDocumentKeyDown---:'+_selectObject);
    //如果按tab,enter键 
    if(event.keyCode === Handsontable.helper.KEY_CODES.TAB
      || event.keyCode === Handsontable.helper.KEY_CODES.ENTER){  

      if(!isValueObjecgtExists(editor.getValue())  && !_allowInvalid){
        event.preventDefault();
        Handsontable.dom.stopImmediatePropagation(event);
        editor.hot.listen();
        editor.TEXTAREA.focus();
      }
    }

    if(event.keyCode === Handsontable.helper.KEY_CODES.ESCAPE){
      editor.saveValue();
    }
  }
  function onBlur(event){
    var editor = this.getActiveEditor();
    if(!isValueObjecgtExists(editor.getValue())  && !_allowInvalid){ 
      editor.TD.innerHTML ='';   
    }      
  }
  //TODO valueList组件，输入时显示字段可以此事件中完成？【afterBeginEditing】
  function onAfterBeginEditing(row,column) {
    showEditorDisplayValue(this);
  }

  // Put editor in dedicated namespace
  Handsontable.editors.YU_Grid_Combox = ComboxEdit;

  // Register alias
  Handsontable.editors.registerEditor('YU_Grid_Combox', ComboxEdit);

  Handsontable.cellTypes.registerCellType('yu.gridCombox', {
    editor: ComboxEdit,
    renderer: cellRenderer,
    // validator: customValidator,
    // You can add additional options to the cell type based on Handsontable settings
    className: 'yu_gridCombox',
    allowInvalid: true,
    // Or you can add custom properties which will be accessible in `cellProperties`
    myCustomCellState: 'complete',
  });
})(Handsontable);