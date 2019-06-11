import VBaseForm from './VBaseForm'

import VToolbar from '../component/VToolbar.js'
import VPanel from '../component/VPanel.js'

import VDBComponent from '../component/VDBComponent.js'
import VDBComponentSet from '../component/VDBComponentSet.js'

import VButton from '../component/VButton.js'
import VTree from '../component/VTree.js'
import VTabSet from '../component/VTabSet.js'

import * as cf from '../util/commonFun'
import {
  basicConstant, SmartViewEnv, DbConstant,DefaultActionMethod
} from '../VBasicConstant.js'

import request from '@/utils/request'
import VBaseListFormMetaUtil from './VBaseListFormMetaUtil'
import VDataStore from '../db/VDataStore.js'
import VDataSet from '../db/VDataSet.js'
import VDataSource from '../db/VDataSource.js'

export default class VBaseListForm extends VBaseForm {
  // 当前活动的Tab
  _activeViewName = '';

  // 查询对象值
  // queryCondition

  // 条件存储对象
  conditionDataSource;

  // 装载数据
   loadingData =false;

   constructor(parent, formMeta) {
     super(parent, formMeta)
     this.ctype = basicConstant.FORMTYPE_LIST
     this.conditionDataSource = new VDataSource(formMeta.qCondition.name)
     // this.queryCondition = this.conditionDataSource.getRecord()
     this.init()
   }

   createMetaUtil(value) {
     this.metaUtil = new VBaseListFormMetaUtil(value)
   }

   static NewInstant(parent, formMeta) {
     return new VBaseListForm(parent, formMeta)
   }

   get activeViewName() {
     return this._activeViewName
   }

   set activeViewName(value) {
     if (this._activeViewName !== value) {
       this._activeViewName = value
       this.activePage(value)
     }
   }

   resetCondition() {
     Object.keys(this.conditionDataSource).forEach(key => obj[key] = null)
   }

  /**
   *  懒装载数据节点
   * @param {*} node
   * @param {*} resolve
   */
   loadTreeNode(node, resolve) {
     if (node.level === 0) {
       return resolve([{ name: 'region' }])
     }
     if (node.level > 1) return resolve([])
   }

   activePage(pageName) {
     console.log('activePage:' + pageName)
     // var pageMeta = this.metaUtil.getPageConfigByName(pageName)
     // if (pageMeta !== null) {
     //   var componentSet = this.getComponent(pageMeta.componentSetModel.name)
     //   var datasource = componentSet.datasource
     //   var aDataset = datasource.dataset
     //   if (aDataset.dataFrom === 'ajaxRequest' && aDataset.isOpen === false) {
     //     this.requestAjaxTableData(aDataset).then(dataList => {
     //       aDataset.loadList(dataList)
     //       datasource.open()
     //     }).catch(err => {
     //       console.log(err.message)
     //     })
     //   }
     // }
   }

  /**
   * 初始化form
   */
   init() {
     // 创建数据存储
     this.createDataStore(this.formMeta.querys)
     // this.dataStore = new VDataStore(this.formMeta.datasetInfo)
     // 创建数据感知
     this.createDefultDataSource()
     // for (const dataset of this.dataStore.datasets) {
     //   var datasource = new VDataSource(dataset.name, dataset)
     //   this.datasources.set(datasource.name, datasource)
     // }
     // 建立UI
     this.createUI(this.formMeta)
     // 建立UI的默认业务依赖
     this.createBizDependence()
     // 业务逻辑初始化
     this.bizInit()
   }

  /**
  * 初始化datastore
  * 根据元数据定义赋值
  * @param {*} querysMeta
  */
   createDataStore(querysMeta) {
     this.dataStore = new VDataStore()
     this.dataStore.dataView = this
     for (var j = 0; j < querysMeta.length; j++) {
       if (querysMeta[j]) {
         var dataset = new VDataSet()
         this.initDataSet(dataset, querysMeta[j])
         dataset.dataStore = this.dataStore
         this.dataStore.datasets.push(dataset)
       }
     }
   }
  /**
  * 初始化DataSet
  * 根据元数据定义赋值
  *
  */
   initDataSet(dataset, queryMeta) {
     if (queryMeta != null) {
       dataset.dataFrom = 'ajaxRequest'

       if (queryMeta.bizClassName !== undefined) {
         dataset.bizClassName = queryMeta.bizClassName
       }
       if (queryMeta.name !== undefined) {
         dataset.name = queryMeta.name
       }

       if (queryMeta.actionUrl !== undefined) {
         dataset.actionUrl = queryMeta.actionUrl
       }

       if (queryMeta.queryMethod !== undefined) {
         dataset.actionMethod = queryMeta.queryMethod
       }

       if (queryMeta.sqlFrom !== undefined) {
         dataset.sqlFrom = queryMeta.sqlFrom
       }

       if (queryMeta.sqlOrder !== undefined) {
         dataset.sqlOrder = queryMeta.sqlOrder
       }

       if (queryMeta.sqlWhere !== undefined) {
         dataset.sqlWhere = queryMeta.sqlWhere
       }
     }
   }

  /**
   * 业务处理
   */
   bizInit() {
     var form = this
     // 增加按钮监听事件
     this.setFormButton(form)
     // 可用依赖
     this.setFormEnableDependence(form)
     // 值依赖
     this.setFormValueDependence(form)
     // 默认值依赖
     this.setFormDefaultValue(form)
     // 唯一依赖
     this.setFormUniqueDependence(form)
     // 必填依赖
     this.setFormRequireDependence(form)
     // 只读依赖
     this.setFormReadOnlyDependence(form)
     // 可手输入依赖
     this.setFormEditableDependence(form)
     // 通用业务设置
     this.setFormBiz(form)
   }
   setFormBiz(form) {}
   setFormEnableDependence(form) {}
   setFormButton(form) {}
   setFormValueDependence(form) {}
   setFormValueListFilter(form) {}
   setFormDefaultValue(form) {}
   setFormUniqueDependence(form) {}
   setFormRequireDependence(form) {}
   setFormReadOnlyDependence(form) {}
   setFormEditableDependence(form) {}

  /**
   * 设置UI状态
   * @param {状态} state
   */
   setUIState() {
     this._setComponentSetUIState()
   }
  /**
   * 设置控件的状态
   */
   _setComponentSetUIState() {
     // 设置默认状态
     for (const component of this.components.values()) {
       component.setDefaultEnable()
       component.setDefaultHidden()
       // 执行可用依赖
       this.enableDependenceControl(component)
       // 执行隐藏依赖
       this.hiddenDependenceControl(component)
       // 执行必填依赖
       this.requiredDependenceControl(component)

       // if (typeof component.setReadOnly === 'function') {
       //   component.setReadOnly(false) // 看模式下只可以查看
       // }
       // if (typeof component.setDefaultAllowBlank === 'function') {
       //   component.setDefaultAllowBlank()
       // }
     }
   }

   show() {
     super.show()
     this.openDataSources()
     this.setUIState()
   }

   createBizDependence() {
     this._createEnableDependence()
   }

   _createEnableDependence() {
     // Detail的处理是否可用状态依赖设置
     var detailPages = this.formMeta.dataView.views
     for (var j = 0; j < detailPages.length; j++) {
       if (detailPages[j].topToolbar !== undefined && detailPages[j].topToolbar !== null) {
         var topToolbar = this.getComponent(detailPages[j].topToolbar.name)
         for (const button of topToolbar.children) {
           this._addButtonDependence(button)
         }
       }

       if (detailPages[j].rowToolbar !== undefined && detailPages[j].rowToolbar !== null) {
         var rowToolbar = this.getComponent(detailPages[j].rowToolbar.name)
         for (const button of rowToolbar.children) {
           this._addButtonDependence(button)
         }
       }

       if (detailPages[j].footerToolbar !== undefined && detailPages[j].footerToolbar !== null) {
         var footerToolbar = this.getComponent(detailPages[j].footerToolbar.name)
         for (const button of footerToolbar.children) {
           this._addButtonDependence(button)
         }
       }
     }
   }

   _addButtonDependence(button) {
     // var btnFun = cf.parseFunctionName(button.fun)
     // var params = cf.parseFunctionParams(button.fun)
     // var conditionFun
     // var vForm = this
     // if (btnFun !== null) btnFun = btnFun.toLocaleLowerCase()
     // switch (btnFun) {
     //   case 'new':
     //     return
     //   case 'refresh':
     //     conditionFun = function() {
     //       if (this.state === basicConstant.VIEWSTATE_NEW) {
     //         return false
     //       } else {
     //         return true
     //       }
     //     }
     //     this.setComponentEnableDependence(button, conditionFun)
     //     return
     //   case 'save':
     //     conditionFun = function() {
     //       if (this.state === basicConstant.VIEWSTATE_VIEW) {
     //         return false
     //       } else {
     //         return true
     //       }
     //     }
     //     this.setComponentEnableDependence(button, conditionFun)

     //     return

     //   case 'delete':
     //     conditionFun = function() {
     //       if (this.state === basicConstant.VIEWSTATE_NEW) {
     //         return false
     //       } else {
     //         var masterData = vForm.getMasterRecord()
     //         if (masterData !== null && masterData.rstatus === 2 && (masterData.sys == null || masterData.sys === 0)) {
     //           return true
     //         }
     //         return false
     //       }
     //     }
     //     this.setComponentEnableDependence(button, conditionFun)

     //     return
     //   case 'attachmentmanage':
     //     conditionFun = function() {
     //       if (this.state === basicConstant.VIEWSTATE_NEW) {
     //         return false
     //       } else {
     //         return true
     //       }
     //     }
     //     this.setComponentEnableDependence(button, conditionFun)

     //     return

     //   case 'addrow':
     //     conditionFun = function() {
     //       if (this.state === basicConstant.VIEWSTATE_VIEW) {
     //         return false
     //       } else {
     //         return true
     //       }
     //     }
     //     this.setComponentEnableDependence(button, conditionFun)

     //     return

     //   case 'copyrow':
     //     conditionFun = function() {
     //       if (this.state === basicConstant.VIEWSTATE_VIEW) {
     //         return false
     //       } else {
     //         return true
     //       }
     //     }
     //     this.setComponentEnableDependence(button, conditionFun)

     //     return

     //   case 'deleterow':

     //     conditionFun = function() {
     //       if (this.state === basicConstant.VIEWSTATE_VIEW) {
     //         return false
     //       } else {
     //         return true
     //       }
     //     }
     //     this.setComponentEnableDependence(button, conditionFun)
     //     return
     //   case 'approvetxn':
     //     conditionFun = function() {
     //       if (this.state === basicConstant.VIEWSTATE_VIEW) {
     //         var masterData = vForm.getMasterRecord()
     //         if (masterData !== null && (masterData.rstatus === 1 || masterData.rstatus === 0)) {
     //           return false
     //         }
     //         return true
     //       } else {
     //         return false
     //       }
     //     }
     //     this.setComponentEnableDependence(button, conditionFun)
     //     return
     //   case 'unapprovetxn':
     //     conditionFun = function() {
     //       if (this.state === basicConstant.VIEWSTATE_VIEW) {
     //         var masterData = vForm.getMasterRecord()
     //         if (masterData !== null && masterData.rstatus === 1) {
     //           return true
     //         }
     //         return false
     //       } else {
     //         return false
     //       }
     //     }
     //     this.setComponentEnableDependence(button, conditionFun)
     //     return
     //   case 'canceltxn':
     //     conditionFun = function() {
     //       if (this.state === basicConstant.VIEWSTATE_VIEW) {
     //         var masterData = vForm.getMasterRecord()
     //         if (masterData !== null && masterData.rstatus === 0) {
     //           return false
     //         }
     //         return true
     //       } else {
     //         return false
     //       }
     //     }
     //     this.setComponentEnableDependence(button, conditionFun)
     //     return
     //   case 'uncanceltxn':
     //     conditionFun = function() {
     //       if (this.state === basicConstant.VIEWSTATE_VIEW) {
     //         var masterData = vForm.getMasterRecord()
     //         if (masterData !== null && masterData.rstatus === 0) {
     //           return true
     //         }
     //         return false
     //       } else {
     //         return false
     //       }
     //     }
     //     this.setComponentEnableDependence(button, conditionFun)
     //     return
     //   case 'closetxn':
     //     conditionFun = function() {
     //       if (this.state === basicConstant.VIEWSTATE_VIEW) {
     //         var masterData = vForm.getMasterRecord()
     //         if (masterData !== null && masterData.rstatus === 1 && masterData.bstatus !== 5) {
     //           return true
     //         }
     //         return false
     //       } else {
     //         return false
     //       }
     //     }
     //     this.setComponentEnableDependence(button, conditionFun)
     //     return
     //   case 'unclosetxn':
     //     conditionFun = function() {
     //       if (this.state === basicConstant.VIEWSTATE_VIEW) {
     //         var masterData = vForm.getMasterRecord()
     //         if (masterData !== null && masterData.rstatus === 1 && masterData.bstatus === 5) {
     //           return true
     //         }
     //         return false
     //       } else {
     //         return false
     //       }
     //     }
     //     this.setComponentEnableDependence(button, conditionFun)
     //     return
     //   case 'suspendtxn':
     //     conditionFun = function() {
     //       if (this.state === basicConstant.VIEWSTATE_VIEW) {
     //         return true
     //       } else {
     //         return false
     //       }
     //     }
     //     this.setComponentEnableDependence(button, conditionFun)
     //     return
     //   case 'uncuspendtxn':
     //     conditionFun = function() {
     //       if (this.state === basicConstant.VIEWSTATE_VIEW) {
     //         return true
     //       } else {
     //         return false
     //       }
     //     }
     //     this.setComponentEnableDependence(button, conditionFun)
     //     return
     //   case 'tobstatustxn':
     //     conditionFun = function(toStatus) {
     //       return function() {
     //         if (this.state !== basicConstant.VIEWSTATE_VIEW) {
     //           return false
     //         } else {
     //           var masterData = vForm.getMasterRecord()
     //           if (masterData !== null && masterData.rstatus === 1 && masterData.bstatus !== toStatus) {
     //             return true
     //           }
     //           return false
     //         }
     //       }
     //     }
     //     this.setComponentEnableDependence(button, conditionFun(params[1]))
     //     return

     //   default:
     //     return
     // }
   }

   createUI(formMeta) {
     this.componentName = formMeta.id
     this.formMeta = formMeta

     // 建立Condition视图
     var conditionCS = new VDBComponentSet(this)
     this._initConditionComponentSet(this, conditionCS, formMeta.qCondition)

     // 建立Tree视图
     if (formMeta.tree !== undefined && formMeta.tree !== null) {
       var conditionTree = new VTree(this)
       this._initConditionTree(this, conditionTree, formMeta.tree)
     }
     // 建立DataType视图
     if (formMeta.dataType !== undefined && formMeta.dataType !== null) {
       var dataType = new VTabSet(this)
       this._initDataType(this, dataType, formMeta.dataType)
     }

     // 3.建立dataView视图
     var dataViewMeta = formMeta.dataView
     for (var page of dataViewMeta.views) {
       // 建立Detail视图
       var pagePanel = new VPanel(this)
       this._initComponent(this, pagePanel, page)

       // 1.视图中建立componentSet
       var dComponentSet = new VDBComponentSet(pagePanel)
       this._initDBComponentSet(this, dComponentSet, page.componentSet)

       // 2.视图中建立toolbar
       if (page.topToolbar !== undefined && page.topToolbar !== null) {
         var topToolbar = new VToolbar(pagePanel)
         this._initToolbar(this, topToolbar, page.topToolbar, dComponentSet.datasource)
       }
       //  3.视图中建立toolbar
       if (page.footerToolbar !== undefined && page.footerToolbar !== null) {
         var footerToolbar = new VToolbar(pagePanel)
         this._initToolbar(this, footerToolbar, page.footerToolbar, dComponentSet.datasource)
       }
     }

     // TODO 重新设置 activeViewName

     if (this.formMeta.dataType !== undefined && this.formMeta.dataType !== null) {
       this.activeViewName = this.formMeta.dataType.defaultType
     } else {
       if (this.formMeta.dataView.defaultView !== undefined && this.formMeta.dataView.defaultView !== null) {
         this.activeViewName = this.formMeta.dataView.defaultView
       } else {
         this.activeViewName = this.formMeta.dataView.views[0].name
       }
     }
     return true
   }

   _initDataType(form, dataType, dataTypeMeta) {
     this._initComponent(form, dataType, dataTypeMeta)

     for (var item of dataTypeMeta.types) {
       dataType.addTab(item.name, item.label, item.viewName, item.iconcls)
     }

     if (dataTypeMeta.defaultType !== undefined) {
       dataType.defaultTabName = dataTypeMeta.defaultType
       dataType.activeTabName = dataTypeMeta.defaultType
     }
   }
   _initConditionTree(form, tree, treeMeta) {
     this._initComponent(form, tree, treeMeta)

     if (treeMeta.initUrl !== undefined) {
       tree.initUrl = treeMeta.initUrl
     }

     if (treeMeta.initMethod !== undefined) {
       tree.initMethod = treeMeta.initMethod
     }

     if (treeMeta.actionUrl !== undefined) {
       tree.actionUrl = treeMeta.actionUrl
     }
     if (treeMeta.method !== undefined) {
       tree.method = treeMeta.method
     }
     // 初始化 tree
     if (treeMeta.toolbar !== undefined && treeMeta.toolbar !== null) {
       var TreeToolbar = new VToolbar(tree)
       var treeToolbarMeta = treeMeta.toolbar
       this._initComponent(form, TreeToolbar, treeToolbarMeta)
       toolbar.showMoreButton = treeToolbarMeta.showMoreButton
       // 初始化 tree
       for (var componentMeta of treeToolbarMeta.components) {
         if (componentMeta.ctype === 'button') {
           var cmp = new VButton(toolbar)
           this._initToolbarButton(form, cmp, componentMeta)
         }
       }
     }
   }

   _initConditionComponentSet(form, componentSet, componentSetMeta) {
     this._initComponent(form, componentSet, componentSetMeta)
     componentSet.datasource = this.conditionDataSource
     for (var componentMeta of componentSetMeta.components) {
       var cmp = new VDBComponent(componentSet)
       this._initConditionComponent(form, cmp, componentMeta)
       cmp.datasource = componentSet.datasource
     }
   }
  /**
   * 初始化DBComponent
   * @param {*} component
   * @param {*} aComponentMeta
   */
   _initConditionComponent(form, component, aComponentMeta) {
     this._initComponent(form, component, aComponentMeta)
     this._initValueComponent(component, aComponentMeta)

     // 使用控件名称 因为findField有可能不会设置
     component.fieldName = aComponentMeta.name

     if (aComponentMeta.findField !== undefined) {
       component.findField = aComponentMeta.findField
     }

     if (aComponentMeta.operation !== undefined) {
       component.operation = aComponentMeta.operation
     }

     if (aComponentMeta.isExtendField !== undefined) {
       component.isExtendField = aComponentMeta.isExtendField
     }
   }

  /**
   * 初始化ComponentSet
   *  @param {*} componentSetMeta 元数据
   */
   _initDBComponentSet(form, componentSet, componentSetMeta) {
     this._initComponent(form, componentSet, componentSetMeta)

     // 数据连接
     if (componentSetMeta.queryName !== undefined) {
       var ds = form.getDataSource(componentSetMeta.queryName)
       componentSet.datasource = ds
     }

     for (var componentMeta of componentSetMeta.components) {
       var cmp = new VDBComponent(componentSet)
       this._initDBComponent(form, cmp, componentMeta)
       cmp.datasource = componentSet.datasource
     }
   }

  // _initValuelist(form, component, aComponentMeta) {
  //   this._initDBComponent(form, component, aComponentMeta)
  //   if (aComponentMeta.valueListModel !== undefined && aComponentMeta.valueListModel !== null) {
  //     component.fromAction = aComponentMeta.valueListModel.fromAction // 远程数据请求地址
  //     component.valueField = aComponentMeta.valueListModel.valueField // 数据存储的字段
  //     component.valueFieldType = aComponentMeta.valueListModel.valueFieldType // ：//数据存储字段的类型
  //     component.displayField = aComponentMeta.valueListModel.displayField // ：前端显示字段
  //     component.displayFieldType = aComponentMeta.valueListModel.displayFieldType // ：前端显示字段的类型
  //   }
  // }

  // _initRemoteCombox(form, component, aComponentMeta) {
  //   this._initDBComponent(form, component, aComponentMeta)
  //   if (aComponentMeta.remoteComboBoxModel !== undefined && aComponentMeta.remoteComboBoxModel !== null) {
  //     component.fromAction = aComponentMeta.remoteComboBoxModel.fromAction // 远程数据请求地址
  //     component.valueField = aComponentMeta.remoteComboBoxModel.valueField // 数据存储的字段
  //     component.valueFieldType = aComponentMeta.remoteComboBoxModel.valueFieldType // ：//数据存储字段的类型
  //     component.displayField = aComponentMeta.remoteComboBoxModel.displayField // ：前端显示字段
  //     component.displayFieldType = aComponentMeta.remoteComboBoxModel.displayFieldType // ：前端显示字段的类型
  //   }
  // }
  /**
   * 初始化DBComponent
   * @param {*} component
   * @param {*} aComponentMeta
   */
   _initDBComponent(form, component, aComponentMeta) {
     this._initComponent(form, component, aComponentMeta)
     this._initValueComponent(component, aComponentMeta)
     component.fieldName = aComponentMeta.field
   }

   _initValueComponent(component, aComponentMeta) {
     component.editable = (aComponentMeta.editable === undefined) ? true : (aComponentMeta.editable === 'true')
     component.originalEditable = component.editable

     component.readOnly = (aComponentMeta.readOnly === undefined) ? false : (aComponentMeta.readOnly === 'true')
     component.originalReadOnly = component.readOnly

     component.allowBlank = (aComponentMeta.allowBlank === undefined) ? true : (aComponentMeta.allowBlank === 'true')
     component.originalAllowBlank = component.allowBlank
   }

  // 初始化
   _initComponent(form, component, aComponentMeta) {
     component.componentMeta = aComponentMeta

     component.componentName = aComponentMeta.name

     if (aComponentMeta.label !== undefined) {
       component.label = aComponentMeta.label
     }

     if (aComponentMeta.width !== undefined) {
       component.width = aComponentMeta.width
     }

     component.labelWidth = (aComponentMeta.labelwidth !== undefined) ? 80 : component.labelwidth

     if (aComponentMeta.ctype !== undefined) {
       component.ctype = aComponentMeta.ctype
     }
     if (aComponentMeta.enumModel !== undefined) {
       component.enumModel = aComponentMeta.enumModel
     }

     // 可用特性
     component.enable = (aComponentMeta.enable === undefined || aComponentMeta.enable === null) ? true : (aComponentMeta.enable === 'true')
     component.originalEnable = component.enable

     // 可视特性
     component.hidden = (aComponentMeta.hidden === undefined || aComponentMeta.hidden === null) ? false : (aComponentMeta.hidden === 'true')
     component.originalHidden = component.hidden

     // 添加form的组件
     form.addComponent(component)
   }

   _initPanel(form, panel, panelMeta) {
     this._initComponent(form, panel, panelMeta)
   }

  /**
   * 初始化ComponentSet
   *  @param {*} componentSetMeta 元数据
   */
   _initToolbar(form, toolbar, toolbarMeta, datasource) {
     this._initComponent(form, toolbar, toolbarMeta)
     toolbar.showMoreButton = toolbarMeta.showMoreButton
     for (var componentMeta of toolbarMeta.components) {
       var cmp = new VButton(toolbar)
       this._initToolbarButton(form, cmp, componentMeta, datasource)
     }
   }
  /**
   * 初始化按钮
   *  @param {*} componentSetMeta 元数据
   */
   _initToolbarButton(form, cmp, cmpMeta, datasource = null) {
     this._initComponent(form, cmp, cmpMeta)
     cmp.fun = cmpMeta.fun
     cmp.iconcls = cmpMeta.iconcls
     cmp.panelType = cmpMeta.panelType
     if (cmpMeta.fun !== undefined && cmpMeta.fun !== null) {
       cmp.funName	= cf.parseFunctionName(cmpMeta.fun)
       cmp.funParams = cf.parseFunctionParams(cmpMeta.fun)
       // 如果定义了function 会强制赋予一个datasouce
       if (cmp.funName !== undefined && cmp.funName !== null && cmp.funName.trim() !== '') {
         if (cmp.datasource === null && datasource !== null) {
           cmp.datasource = datasource
         }
         // 添加标准响应
         cmp.on('click', this.doStandFunction)
       }
     }
   }

   doStandFunction(param) {
     var funName = param.component.funName
     var params = param.component.funParams
     var datasource = param.component.datasource
     var form = param.form
     var result = false
     if (funName === 'save') {
       result = form.saveData()
     } else if (funName === 'new') {
       result = form.addData()
     } else if (funName === 'refresh') {
       result = form.refreshData()
     } else if (funName === 'modify') {
       result = form.modifyData()
     } else if (funName === 'delete') {
       result = form.deleteData()
     } else if (funName === 'copynew') {
       result = form.copyNew()
     } else if (funName === 'addrow') {
       result = form.addRow(datasource)
     } else if (funName === 'copyrow') {
       result = form.copyRow(datasource)
     } else if (funName === 'deleterow') {
       result = form.deleteRow(datasource)
     } else if (funName === 'addaggregation') {
       result = form.addAggregation(datasource)
     } else if (funName === 'modifyaggregation') {
       result = form.modifyAggregation(datasource)
     } else if (funName === 'viewaggregation') {
       result = form.viewAggregation(datasource)
     } else if (funName === 'deleteaggregation') {
       result = form.deleteAggregation(datasource)
     } else if (funName === 'approvetxn') {
       result = form.approveTxn(datasource, params)
     } else if (funName === 'unapprovetxn') {
       result = form.unApproveTxn(datasource, params)
     } else if (funName === 'canceltxn') {
       result = form.cancelTxn(datasource, params)
     } else if (funName === 'uncanceltxn') {
       result = form.unCancelTxn(datasource, params)
     } else if (funName === 'closetxn') {
       result = form.closeTxn(datasource, params)
     } else if (funName === 'unclosetxn') {
       result = form.unCloseTxn(datasource, params)
     } else if (funName === 'suspendtxn') {
       result = form.suspendTxn(datasource, params)
     } else if (funName === 'unsuspendtxn') {
       result = form.unSuspendTxn(datasource, params)
     } else if (funName === 'tobstatustxn') {
       result = form.toBStatusTxn(datasource, params)
     } else if (funName === 'uploadattachment') {
       result = form.uploadAttachment()
     } else if (funName === 'downloadattachment') {
       result = form.downloadAttachment()
     } else if (funName === 'attachmentmanage') {
       result = form.attachmentmanage()
     } else {
       result = true
     }
     return result
   }

  /**
   * 检查操作权限
   * @param {*} operation
   */
   checkFunPermission(operation = null) {
     // TODO  检查操作权限
     return true
   }

  /**
   *  新增单据
   */
   refreshData() {
     var me = this

     if (me.isChanged()) {
       this.alert('当前记录已经修改过了,请先保存')
       return false
     }

     // 新增状态刷新无效
     if (me.state === basicConstant.VIEWSTATE_NEW ||
      me.state === basicConstant.VIEWSTATE_NULL
     ) return false

     if (!me.checkFunPermission('refresh')) return

     if (me.fireEvent('beforeRefresh') === false) { return }

     this.requestDetailData().then(dataPackage => {
       this.loadDataByPackage(dataPackage)
       this.show(this.state)
     }).catch(err => {
       console.log(err.message)
     })

     me.fireEvent('afterRefresh')
   }

   queryData() {
     var me = this
     if (!me.checkFunPermission('query')) return

     const view = this.getComponent(this.activeViewName)
     var componentSet = this.getComponent(view.componentMeta.componentSet.name)
     var datasource = componentSet.datasource
     var aDataset = datasource.dataset
     var queryUrl = aDataset.getStrutsUrl()
     var filter = me.getFilter()
     // 封装后台组装字段
     me.pushFieldSVar()

     // 如果有tree存在
     if (this.formMeta.tree != null && this.formMeta.tree.name != null) {
       // 封装 url数据
       queryUrl = aDataset.actionUrl + '!'+ DefaultActionMethod.listQueryByTreeNode+'.action'
       // 封装 treeNode 数据
     }

     this.loadingData = true
     if (aDataset.dataFrom === 'ajaxRequest') {
       this.requestAjaxTableData(aDataset, queryUrl, filter).then(dataList => {
         aDataset.loadList(dataList)
         datasource.open()
         this.loadingData = false
       }).catch(err => {
         console.log(err.message)
         this.loadingData = false
       })
     }
   }

   requestAjaxTableData(dataset, queryUrl, filter) {
     var me = this

     // ID 赋值
     var params = {
       language: '', // TODO设置语言
       sVars: JSON.stringify(me.svars),
       filter: filter
     }

     return new Promise(
       (resolve, reject) => {
         request({
           url: queryUrl,
           method: 'get',
           params: params
         }).then(resData => {
           this.respData = resData.data
           resolve(resData.data.resultList)
         }).catch(err => {
           console.log(err.message)
         })
       })
   }

   pushFieldSVar() {
     var me = this
 		 var conditions = this._formMeta.qCondition.components
     for (var key in conditions) {
       var aValue = this.conditionDataSource.getFieldValue(conditions[key].name)
       var isExtendField = conditions[key].isExtendField
       if (isExtendField === 'true') {
         var svarString = ''
         if ((aValue || '') === '') {
           me.removeSVar(conditions[key].name)
         } else {
           switch (conditions[key].ftype.toLocaleLowerCase()) {
			    	case 'int':
			    		svarString = 'me.addSVar({' + conditions[key].name + ':' + aValue + '});'
			    		break
			    	case 'string':
		    			svarString = 'me.addSVar({' + conditions[key].name + ':' + "'" + aValue.replace(/(^\s*)|(\s*$)/g, '') + "'" + '});'
			    		break
			    	case 'date':
			    		aValue = this.dateFormat(aValue, 'yyyy-MM-dd')
			    		svarString = 'me.addSVar({' + conditions[key].name + ':' + "'" + aValue + "'" + '});'
			    		break
			    	case 'datetime':
			    		aValue = this.dateFormat(aValue, 'yyyy-MM-dd h:m:s')
			    		svarString = 'me.addSVar({' + conditions[key].name + ':' + "'" + aValue + "'" + '});'
			    		break

			    	default:
			    		svarString = 'me.addSVar({' + conditions[key].name + ':' + "'" + aValue + "'" + '});'
		    			break
           }
           eval(svarString)
         }
       }
     }
   }
   	/**
	 * 拼接过滤条件成过滤SQL
	 * @returns {String}
	 */
   getFilter() {
     var me = this
     var filters = ''
     var conditions = this._formMeta.qCondition.components
     for (var key in conditions) {
       var aValue = this.conditionDataSource.getFieldValue(conditions[key].name)
       var operation = conditions[key].operation
       var isExtendField = conditions[key].isExtendField
       if (isExtendField !== 'true') {
         if (((aValue || '') != '' || aValue === 0) && (conditions[key].findField || '') != '') {
           var filter
           switch (conditions[key].ftype.toLocaleLowerCase()) {
			    	case 'int':
			    		filter = conditions[key].findField + operation + aValue
			    		break
			    	case 'string':
			    		if (operation == 'like') { aValue = '%' + aValue.replace(/(^\s*)|(\s*$)/g, '') + '%' }

			    		if (aValue.indexOf('%') >= 0) { operation = 'like' }

		    			filter = conditions[key].findField + ' ' + operation + " \'" + aValue + "\'"
			    		break
			    	case 'date':
			    		if (SmartViewEnv.DB_DIALECT === DbConstant.ORACLE) {
			    			filter = 'to_char(' + conditions[key].findField + ",\'YYYY-MM-dd\') " + operation + " \'" + this.dateFormat(aValue, 'yyyy-MM-dd') + "\'"
			    		} else if (SmartViewEnv.DB_DIALECT === DbConstant.MYSQL) {
			    			filter = 'date(' + conditions[key].findField + ') ' + operation + " \'" + this.dateFormat(aValue, 'yyyy-MM-dd') + "\'"
			    		} else {
			    			filter = 'date(' + conditions[key].findField + ') ' + operation + " \'" + this.dateFormat(aValue, 'yyyy-MM-dd') + "\'"
			    		}
			    		break
			    	case 'datetime':
			    		if (SmartViewEnv.DB_DIALECT === DbConstant.ORACLE) {
			    			filter = conditions[key].findField + operation + ' ' + "to_date(\'" + this.dateFormat(aValue, 'yyyy-MM-dd H:i:s') + "\'" + ",\'YYYY-MM-dd hh24:mi:ss\') " + ''
			    		} else {
			    			filter = conditions[key].findField + operation + " \'" + this.dateFormat(aValue, 'yyyy-MM-dd H:i:s') + "\'"
			    		}

			    		break

			    	default:
			    		filter = conditions[key].findField + operation + "\'" + aValue + "\'"
		    			break
           }
           if (filters === '') {
             filters += filter
           } else {
             filters = filters + ' and ' + filter
           }
         }
       }
     }

     if (me.getCVar('fromField') != null) {
       var extraFilter = me.getCVar('fromField').getFilter() || ''
       if (filters === '') {
         filters += extraFilter
       } else {
         if (extraFilter !== '') {
           filters += ' and ' + extraFilter
         }
       }
     }

     if (me.getCVar('filters') != null) {
       var extraFilter = me.getCVar('filters') || ''
       if (filters === '') {
         filters += extraFilter
       } else {
         if (extraFilter !== '') {
           filters += ' and ' + extraFilter
         }
       }
     }

     return encodeURIComponent(encodeURIComponent(filters))
   }
}
