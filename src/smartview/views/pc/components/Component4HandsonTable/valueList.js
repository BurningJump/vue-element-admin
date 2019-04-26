import Handsontable from 'handsontable'
import request from '@/utils/request'
// import router from '@/router'  //临时代码

(function(Handsontable){
  var ValueListEdit = Handsontable.editors.HandsontableEditor.prototype.extend();
  var _selectObject=void 0;  //用来保存object
  var _allowInvalid = false; //是否允许保存非选择列表内的值
  var _isStrict  = false;    //是否的严格来源于合法的内值
  var _oldValue = void 0; //editor keydown修改前的值,用来判断是否远程请求

  ValueListEdit.prototype.createElements = function () {
    // Handsontable.editors.TextEditor.prototype.createElements.apply(this, arguments);
    this.TEXTAREA = document.createElement('TEXTAREA');
    this.TEXTAREA.tabIndex = -1;
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

    function onValueListBtnClick(event) {
      let row= editor.row;
      let col = editor.col;
      let textValue = editor.TEXTAREA.value;
      let cellProperties = editor.cellProperties;

      // editor.instance = editor.originalValue;
      //打开弹窗后，editor 失去焦点，需要重新设置焦点
      // editor.instance.selectCell(row,col);  //如果启用，会导致cell getValue() 函数触发
      editor.cellProperties.cellFunction(row,col,textValue,cellProperties,editor.instance);

      //关闭editor,
      // var choicesListHot = editor.htEditor;
      // choicesListHot.destroy();
      // editor.close(true);

      // choicesListHot.rootElement.style.display = 'none';

      // editor.instance.destroyEditor();

    }
    // function callValueListFromRefeed(resData){
    //   if((resData||'')!='')
    //   {
    //     editor.instance.setDataAtCell(editor.row,editor.col,resData[0]);
    //   }
    // }

    this.VALUEL_BTN = document.createElement('button');
    this.VALUEL_BTN.innerText = '选择';
    this.VALUEL_BTN.className = 'valueListBtn el-button el-button--default el-button--mini';
    this.VALUEL_BTN.onclick = onValueListBtnClick;//(this.row,this.col,this.TEXTAREA.value);

    this.SEARCH_ICON = document.createElement('i');
    this.SEARCH_ICON.className = 'el-icon-search';
    this.VALUEL_BTN.appendChild(this.SEARCH_ICON);

    this.TEXTAREA_PARENT.appendChild(this.VALUEL_BTN);

    var DIV = document.createElement('DIV');
    DIV.className = 'handsontableEditor';
    this.TEXTAREA_PARENT.appendChild(DIV);
    this.htContainer = DIV;
    this.assignHooks();
  }



  ValueListEdit.prototype.prepare = function (td, row, col, prop, value, cellProperties) {
    if (!cellProperties.readOnly) {
      Handsontable.editors.HandsontableEditor.prototype.prepare.apply(this, arguments);
    }
    showValueListMaps(this,this.originalValue);
  };

  ValueListEdit.prototype.open = function () {
    Handsontable.editors.HandsontableEditor.prototype.open.apply(this, arguments);
    this.instance.addHook('beforeKeyDown', onBeforeKeyDown);
    this.instance.addHook('afterBeginEditing', onAfterBeginEditing);

    // this.instance.addHook('afterDocumentKeyDown', onAfterDocumentKeyDown);


    //自定义的hook
    Handsontable.hooks.register('afterInput');
    this.instance.addHook('afterInput', onInput);

    Handsontable.hooks.register('beforeBlur');
    this.instance.addHook('beforeBlur', onBlur);

    _selectObject = this.originalValue;
    _isStrict = isValueObjecgtExists(_selectObject);
    _allowInvalid = false;//this.cellProperties.allowInvalid;
    if(isValueObjecgtExists(_selectObject)){
      _oldValue = _selectObject[this.cellProperties.inputField];
    }else{
      _oldValue = _selectObject;
    }

    //原始值
    // this.htEditor.getInstance().loadData(this.instance.getDataAtCell(this.row,this.col));

    var choicesListHot = this.htEditor.getInstance();
    choicesListHot.updateSettings({
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

  ValueListEdit.prototype.close = function () {
    Handsontable.editors.HandsontableEditor.prototype.close.apply(this, arguments);
    this.instance.removeHook('beforeKeyDown', onBeforeKeyDown);
    this.instance.removeHook('afterBeginEditing', onAfterBeginEditing);
    // this.instance.removeHook('afterDocumentKeyDown', onAfterDocumentKeyDown);
    this.instance.removeHook('afterInput', onInput);
    this.instance.removeHook('beforeBlur', onBlur);
  };


  ValueListEdit.prototype.setValue = function(newValue){
    var cellValue = Handsontable.helper.stringify(newValue);
    if(isValueObjecgtExists(newValue) ){
      cellValue = newValue[this.cellProperties.displayField];
    }
    this.TD.innerHTML = cellValue;
  };

  ValueListEdit.prototype.getValue = function(){
    // let choiceRes = this.htEditor.getInstance().getValue();
    //在这里设置cell的值
    // this.instance.setDataAtCell(this.row,this.col,choiceRes);
    //TODO 设置map的值

    // let maps = this.cellProperties.maps;
    // let form = this.cellProperties.form;
    // for(let m of maps){

    //   // this.instance.setDataAtCell(this.row,  ,choiceRes[m['fromField']]);
    //   form.setCmpValue(m['toComponent'],choiceRes[m['fromField']]);

    // }
    // this.instance.setDataAtRowProp(this.row,fieldName,value);
    // return choiceRes;
    return _selectObject;
  };


  ValueListEdit.prototype.saveValue = function(){
    let savevalue = _selectObject;// thisthis.getValue();
    if(!isValueObjecgtExists(savevalue)  && !_allowInvalid){
      _selectObject = this.originalValue;
      savevalue = _selectObject;
      // return;
    }
    this.instance.setDataAtCell(this.row,this.col,savevalue);
    showValueListMaps(this,savevalue);
  };


  var skipOne = false;  //路过第一个？ 没用上？

  ValueListEdit.prototype.queryChoices = function (query) {
    var _this = this;

    this.query = query;
    // console.log('this.query:'+query);
    let cellProp = this.cellProperties;
    let fromaction = cellProp.fromAction;
    var htEditorInstance = this.htEditor.getInstance();
    request({
      url: fromaction,
      method: 'get'
    }).then(resData => {
      var options=resData.data.resultList;
      // for(let item of options){
      //   item['materialNo']=this.query;
        // item['user1']='';
        // item['user2']='';
        // item['user3']='';
      // }
      // cellProp['source']=options;
      //更新可选列表
      htEditorInstance.loadData(options);//(Handsontable.helper.pivot([options]));
    }).catch(err => {
      console.log(err.message)
    });

  };

  //TODO valueList组件，输入时显示字段可以此事件中完成？【afterBeginEditing】
  function onAfterBeginEditing(row,column) {
    let editor = this.getActiveEditor();
    let _cellProp = editor.cellProperties;
    let objValue = this.getDataAtCell(row,column);
    if(_cellProp !== void 0  && objValue !== void 0 && objValue != null && _isStrict){
      editor.TEXTAREA.value=objValue[_cellProp.inputField];
    }else if (_allowInvalid){
      editor.TEXTAREA.value=objValue;
    }else{
      // editor.TEXTAREA.value='';
    }

      // editor.TEXTAREA.value=objValue['teamName'];
  }
  function onAfterDocumentKeyDown(event){
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
  function showValueListMaps(valueEditor,valueObject){
    var editor = valueEditor;
    let maps = editor.cellProperties.maps;
    let form = editor.cellProperties.form;
    for(let m of maps){
      // this.instance.setDataAtCell(this.row,  ,choiceRes[m['fromField']]);
      form.setCmpValue(m['toComponent'],'');

    }
    if( (valueObject||'') != ''){
      for(let m of maps){
        form.setCmpValue(m['toComponent'],valueObject[m['fromField']]);
      }
    }

  };

  function onBlur(event){
    var editor = this.getActiveEditor();
    if(!isValueObjecgtExists(editor.getValue())  && !_allowInvalid){
      editor.TD.innerHTML ='';
    }
  }
  //edit 值输入处理
  function onInput(event){
    var editor = this.getActiveEditor();
    var timeOffset = 0;

      //TODO 这里减少远程请求，不够全面，待完善->当中文输入法情况下，输入汉字，在汉字没有出来之前，每次键盘动作还是会触发以下代码
      if(_oldValue === editor.TEXTAREA.value || editor.TEXTAREA.value===void 0
        || editor.TEXTAREA.value==='')
        return;

        _selectObject=editor.TEXTAREA.value;
        _oldValue = editor.TEXTAREA.value;
        showValueListMaps(editor,_selectObject);
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

  //renderer 渲染显示字段
  //TODO 后续要写到类型内，以便前端框架移植
  function  cellRenderer(hotInstance, td, row, column, prop, value, cellProperties){
    Handsontable.renderers.TextRenderer.apply(this, arguments);
    Handsontable.dom.addClass(td,"htMiddle");  //居中显示
    Handsontable.dom.addClass(td,"htCenter");
    let _cellProp = cellProperties;
    let cellValue = Handsontable.helper.stringify(value);
    if(isValueObjecgtExists(value)){
      cellValue = value[_cellProp.displayField];
    }
    // this is faster than innerHTML. See: https://github.com/handsontable/handsontable/wiki/JavaScript-&-DOM-performance-tips
    Handsontable.dom.fastInnerText(td,cellValue);
    // td.innerHTML = cellValue;
  }

  //判断是否有效对象
  function isValueObjecgtExists(val){
    if(Object.prototype.toString.call(val) === '[object Object]'){
      return true;
    }else{
      return false;
    }
  }

  // Put editor in dedicated namespace
  Handsontable.editors.YU_Grid_ValueList = ValueListEdit;

  // Register alias
  Handsontable.editors.registerEditor('YU_Grid_ValueList', ValueListEdit);

  Handsontable.cellTypes.registerCellType('yu.gridValueList', {
    editor: ValueListEdit,
    renderer: cellRenderer,
    // validator: customValidator,
    // You can add additional options to the cell type based on Handsontable settings
    className: 'yu_gridValueList',
    allowInvalid: true,
    // Or you can add custom properties which will be accessible in `cellProperties`
    myCustomCellState: 'complete',
  });
})(Handsontable);
