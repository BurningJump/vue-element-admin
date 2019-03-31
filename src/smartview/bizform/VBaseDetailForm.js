import VBaseForm from './VBaseForm'
import VDBComponentSet from '../component/VDBComponentSet.js'
import VToolbar from '../component/VToolbar.js'
import VPanel from '../component/VPanel.js'
import VDBComponent from '../component/VDBComponent.js'
import VButton from '../component/VButton.js'
import VRemoteCombox from '../component/VRemoteCombox.js'
import * as cf from '../util/commonFun'
import {
  basicConstant
} from '../VBasicConstant.js'

import request from '@/utils/request'
import VBaseDetailFormMetaUtil from './VBaseDetailFormMetaUtil'
import VDataStore from '../db/VDataStore.js'
import VDataSet from '../db/VDataSet.js'

export default class VBaseDetailForm extends VBaseForm {
  // 当前活动的Tab
  _activeDetailPage = '';

  // 当前状态
  state = basicConstant.VIEWSTATE_VIEW;

  // 当前DetailID
   dataId;

   constructor(parent, formMeta) {
     super(parent, formMeta)
     this.ctype = basicConstant.FORMTYPE_DETAIL
     this.init()
   }

   createMetaUtil(value) {
     this.metaUtil = new VBaseDetailFormMetaUtil(value)
   }

   static NewInstant(parent, formMeta) {
     return new VBaseDetailForm(parent, formMeta)
   }

   get activeDetailPage() {
     return this._activeDetailPage
   }

   set activeDetailPage(value) {
     if (this._activeDetailPage !== value) {
       this._activeDetailPage = value
       this.activePage(value)
     }
   }

   activePage(pageName) {
     var pageMeta = this.metaUtil.getPageConfigByName(pageName)
     if (pageMeta !== null) {
       var componentSet = this.getComponent(pageMeta.componentSetModel.name)
       var datasource = componentSet.datasource
       var aDataset = datasource.dataset
       if (aDataset.dataFrom === 'ajaxRequest' && aDataset.isOpen === false) {
         this.requestAjaxTableData(aDataset).then(dataList => {
           aDataset.loadList(dataList)
           datasource.open()
         }).catch(err => {
           console.log(err.message)
         })
       }
     }
   }

  /**
   * 初始化form
   */
   init() {
     // 创建数据存储
     this.createDataStore(this.formMeta.datasetInfo)
     // this.dataStore = new VDataStore(this.formMeta.datasetInfo)
     // 创建数据感知
     this.createDefultDataSource()
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
    * @param {*} dataStoreMeta
    */
   createDataStore(dataStoreMeta) {
     this.dataStore = new VDataStore()
     this.dataStore.dataView = this
     for (var j = 0; j < dataStoreMeta.datasets.length; j++) {
       if (dataStoreMeta.datasets[j]) {
         var dataset = new VDataSet()
         this.initDataSet(dataset, dataStoreMeta.datasets[j])
         dataset.dataStore = this.dataStore
         this.dataStore.datasets.push(dataset)
       }
     }
   }
  /**
    * 初始化DataSet
    * 根据元数据定义赋值
    * @param {*} dataStoreMeta
    */
   initDataSet(dataset, datasetMeta) {
     if (datasetMeta != null) {
       if (datasetMeta.bizClassName !== undefined) {
         dataset.bizClassName = datasetMeta.bizClassName
       }
       if (datasetMeta.name !== undefined) {
         dataset.name = datasetMeta.name
       }

       if (datasetMeta.actionMethod !== undefined) {
         dataset.actionMethod = datasetMeta.actionMethod
       }

       if (datasetMeta.datasource !== undefined) {
         dataset.dataFrom = datasetMeta.datasource
       }

       if (datasetMeta.isMaster !== undefined) {
         dataset.isMaster = (datasetMeta.isMaster === 'true')
       }

       if (datasetMeta.masterIdField !== undefined) {
         dataset.masterIdFieldName = datasetMeta.masterIdField
       }

       if (datasetMeta.parentDataset !== undefined) {
         dataset.parentDatasetName = datasetMeta.parentDataset
       }

       if (datasetMeta.parentIdField !== undefined) {
         dataset.parentIdFieldName = datasetMeta.parentIdField
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
   * 获取Master Table的数据记录
   */
   getMasterRecord() {
     const ds = this.getMasterDataSource()
     return ds.getRecord()
   }

  /**
   * 获取MasterPage上面的数据名称
   */
   getMasterDataSetName() {
     return this.formMeta.masterPage.componentSetModel.dataset
   }

  /** *
   * 获取Master Datesource
   */

   getMasterDataSource() {
     return this.getDataSource(this.getMasterDataSetName())
   }

  /** *
   * 获取Master DataSet
   */

   getMasterDataSet() {
     return this.getDataSet(this.getMasterDataSetName())
   }

  /**
   * 设置UI状态
   * @param {状态} state
   */
   setUIState(state = null) {
     if (state !== null) {
       this.state = state
     }
     this._setComponentSetUIState()
   }
  /**
   * 设置控件的状态
   */
   _setComponentSetUIState() {
     if (this.state === basicConstant.VIEWSTATE_VIEW) { // 查看状态下只是看看
       // 设置默认状态
       for (const component of this.components.values()) {
         component.setDefaultEnable()
         component.setDefaultHidden()
         // 执行可用依赖
         this.enableDependenceControl(component)
         // 执行隐藏依赖
         this.hiddenDependenceControl(component)

         if (typeof component.setReadOnly === 'function') {
           component.setReadOnly(true) // 查看模式下只可以查看
         }
         if (typeof component.setDefaultAllowBlank === 'function') {
           component.setDefaultAllowBlank()
           // 执行必填依赖
           this.requiredDependenceControl(component)
         }
       }
     } else if (this.state === basicConstant.VIEWSTATE_NULL) {
       // 没有数据状态时
       for (const component of this.components.values()) {
         component.setEnable(false)
         if (typeof component.setReadOnly === 'function') {
           component.setReadOnly(true) // 查看模式下只可以查看
         }
       }
     } else { // 新增和修改模式
       // 设置默认状态
       for (const component of this.components.values()) {
         component.setDefaultEnable()
         component.setDefaultHidden()
         // 执行可用依赖
         this.enableDependenceControl(component)
         // 执行隐藏依赖
         this.hiddenDependenceControl(component)

         // 只读处理
         if (typeof component.setDefaultReadOnly === 'function') {
           component.setDefaultReadOnly()
           // 执行只读依赖
           this.readOnlyDependenceControl(component)
         }

         if (typeof component.setDefaultAllowBlank === 'function') {
           component.setDefaultAllowBlank()
           // 执行必填依赖
           this.requiredDependenceControl(component)
         }
       }
     }
   }

   show(state) {
     super.show()
     this.openDataSources()
     this.setUIState(state)
   }

  // setEnableDependence(cmpName, condition) {
  //   var cmp = this.getComponent(cmpName)
  //   if (cmp !== null && cmp !== undefined) {
  //     this.setComponentEnableDependence(cmp, condition)
  //   }
  //   return false
  // }

  // setComponentEnableDependence(component, condition) {
  //   this.parent.setComponentEnableDependence(component, condition)
  // }

   createBizDependence() {
     this._createEnableDependence()
   }

   _createEnableDependence() {
     // 处理masterpage上的按钮
     var masterToolbar =
      this.getComponent(this.formMeta.masterPage.toolbarModel.name)
     for (var button of masterToolbar.children) {
       this._addButtonDependence(button)
     }

     // Detail的处理是否可用状态依赖设置
     var detailPages = this.formMeta.detailPages
     for (var j = 0; j < detailPages.length; j++) {
       // 页面的按钮处理
       var detailToolbar = this.getComponent(detailPages[j].toolbarModel.name)
       for (const button of detailToolbar.children) {
         this._addButtonDependence(button)
       }

       //  聚合页面的处理
       if (detailPages[j].componentSetModel != null && detailPages[j].componentSetModel.style === basicConstant.AGRID) {
         var conditionFun = function() {
           if (this.state === basicConstant.VIEWSTATE_NEW || this.state === basicConstant.VIEWSTATE_MODIFY) {
             return false
           } else {
             return true
           }
         }
         this.setEnableDependence(detailPages[j].name, conditionFun)
       }
     }
   }

   _addButtonDependence(button) {
     var btnFun = cf.parseFunctionName(button.fun)
     var params = cf.parseFunctionParams(button.fun)
     var conditionFun
     var vForm = this
     if (btnFun !== null) btnFun = btnFun.toLocaleLowerCase()
     switch (btnFun) {
       case 'new':
         return
       case 'refresh':
         conditionFun = function() {
           if (this.state === basicConstant.VIEWSTATE_NEW) {
             return false
           } else {
             return true
           }
         }
         this.setComponentEnableDependence(button, conditionFun)
         return
       case 'save':
         conditionFun = function() {
           if (this.state === basicConstant.VIEWSTATE_VIEW) {
             return false
           } else {
             return true
           }
         }
         this.setComponentEnableDependence(button, conditionFun)

         return

       case 'delete':
         conditionFun = function() {
           if (this.state === basicConstant.VIEWSTATE_NEW) {
             return false
           } else {
             var masterData = vForm.getMasterRecord()
             if (masterData !== null && masterData.rstatus === 2 && (masterData.sys == null || masterData.sys === 0)) {
               return true
             }
             return false
           }
         }
         this.setComponentEnableDependence(button, conditionFun)

         return
       case 'attachmentmanage':
         conditionFun = function() {
           if (this.state === basicConstant.VIEWSTATE_NEW) {
             return false
           } else {
             return true
           }
         }
         this.setComponentEnableDependence(button, conditionFun)

         return

       case 'addrow':
         conditionFun = function() {
           if (this.state === basicConstant.VIEWSTATE_VIEW) {
             return false
           } else {
             return true
           }
         }
         this.setComponentEnableDependence(button, conditionFun)

         return

       case 'copyrow':
         conditionFun = function() {
           if (this.state === basicConstant.VIEWSTATE_VIEW) {
             return false
           } else {
             return true
           }
         }
         this.setComponentEnableDependence(button, conditionFun)

         return

       case 'deleterow':

         conditionFun = function() {
           if (this.state === basicConstant.VIEWSTATE_VIEW) {
             return false
           } else {
             return true
           }
         }
         this.setComponentEnableDependence(button, conditionFun)
         return
       case 'approvetxn':
         conditionFun = function() {
           if (this.state === basicConstant.VIEWSTATE_VIEW) {
             var masterData = vForm.getMasterRecord()
             if (masterData !== null && (masterData.rstatus === 1 || masterData.rstatus === 0)) {
               return false
             }
             return true
           } else {
             return false
           }
         }
         this.setComponentEnableDependence(button, conditionFun)
         return
       case 'unapprovetxn':
         conditionFun = function() {
           if (this.state === basicConstant.VIEWSTATE_VIEW) {
             var masterData = vForm.getMasterRecord()
             if (masterData !== null && masterData.rstatus === 1) {
               return true
             }
             return false
           } else {
             return false
           }
         }
         this.setComponentEnableDependence(button, conditionFun)
         return
       case 'canceltxn':
         conditionFun = function() {
           if (this.state === basicConstant.VIEWSTATE_VIEW) {
             var masterData = vForm.getMasterRecord()
             if (masterData !== null && masterData.rstatus === 0) {
               return false
             }
             return true
           } else {
             return false
           }
         }
         this.setComponentEnableDependence(button, conditionFun)
         return
       case 'uncanceltxn':
         conditionFun = function() {
           if (this.state === basicConstant.VIEWSTATE_VIEW) {
             var masterData = vForm.getMasterRecord()
             if (masterData !== null && masterData.rstatus === 0) {
               return true
             }
             return false
           } else {
             return false
           }
         }
         this.setComponentEnableDependence(button, conditionFun)
         return
       case 'closetxn':
         conditionFun = function() {
           if (this.state === basicConstant.VIEWSTATE_VIEW) {
             var masterData = vForm.getMasterRecord()
             if (masterData !== null && masterData.rstatus === 1 && masterData.bstatus !== 5) {
               return true
             }
             return false
           } else {
             return false
           }
         }
         this.setComponentEnableDependence(button, conditionFun)
         return
       case 'unclosetxn':
         conditionFun = function() {
           if (this.state === basicConstant.VIEWSTATE_VIEW) {
             var masterData = vForm.getMasterRecord()
             if (masterData !== null && masterData.rstatus === 1 && masterData.bstatus === 5) {
               return true
             }
             return false
           } else {
             return false
           }
         }
         this.setComponentEnableDependence(button, conditionFun)
         return
       case 'suspendtxn':
         conditionFun = function() {
           if (this.state === basicConstant.VIEWSTATE_VIEW) {
             return true
           } else {
             return false
           }
         }
         this.setComponentEnableDependence(button, conditionFun)
         return
       case 'uncuspendtxn':
         conditionFun = function() {
           if (this.state === basicConstant.VIEWSTATE_VIEW) {
             return true
           } else {
             return false
           }
         }
         this.setComponentEnableDependence(button, conditionFun)
         return
       case 'tobstatustxn':
         conditionFun = function(toStatus) {
           return function() {
             if (this.state !== basicConstant.VIEWSTATE_VIEW) {
               return false
             } else {
               var masterData = vForm.getMasterRecord()
               if (masterData !== null && masterData.rstatus === 1 && masterData.bstatus !== toStatus) {
                 return true
               }
               return false
             }
           }
         }
         this.setComponentEnableDependence(button, conditionFun(params[1]))
         return

       default:
         return
     }
   }

   createUI(formMeta) {
     this.componentName = formMeta.id
     this.formMeta = formMeta

     // 建立Master视图
     var masterPanel = new VPanel(this)
     this._initPanel(this, masterPanel, formMeta.masterPage)

     // 1.视图中建立componentSet
     var mComponentSet = new VDBComponentSet(masterPanel)
     this._initComponentSet(this, mComponentSet, formMeta.masterPage.componentSetModel)

     // 2.视图中建立toolbar
     var mToolbar = new VToolbar(masterPanel)
     this._initToolbar(this, mToolbar, formMeta.masterPage.toolbarModel, mComponentSet.datasource)

     // 3.建立detialpage视图
     for (var page of formMeta.detailPages) {
       // 建立Detail视图
       var detailPanel = new VPanel(this)
       this._initPanel(this, detailPanel, page)

       // 1.视图中建立componentSet
       var dComponentSet = new VDBComponentSet(detailPanel)
       this._initComponentSet(this, dComponentSet, page.componentSetModel)

       //  2.视图中建立toolbar
       var dToolbar = new VToolbar(detailPanel)
       this._initToolbar(this, dToolbar, page.toolbarModel, dComponentSet.datasource)
     }

     if (formMeta.detailPages !== undefined && formMeta.detailPages.length > 0) {
       this.activeDetailPage = formMeta.detailPages[0].name
     }

     return true
   }

   _initPanel(detailForm, panel, panelMeta) {
     this._initComponent(detailForm, panel, panelMeta)
   }

  /**
   * 初始化ComponentSet
   *  @param {*} componentSetMeta 元数据
   */
   _initComponentSet(detailForm, componentSet, componentSetMeta) {
     this._initComponent(detailForm, componentSet, componentSetMeta)
     // 数据连接
     if (componentSetMeta.dataset !== undefined) {
       var ds = detailForm.getDataSource(componentSetMeta.dataset)
       componentSet.datasource = ds
     }

     for (var componentMeta of componentSetMeta.components) {
       var cmp
       if (componentMeta.ctype === 'remoteComboBox') {
         cmp = new VRemoteCombox(componentSet)
         this._initRemoteCombox(detailForm, cmp, componentMeta)
       }
       // TODO 初始化valuelistCompoent
       else if (componentMeta.ctype === 'valuelistField') {
         cmp = new VRemoteCombox(componentSet)
         this._initValuelist(detailForm, cmp, componentMeta)
       } else {
         cmp = new VDBComponent(componentSet)
         this._initDBComponent(detailForm, cmp, componentMeta)
       }
       cmp.datasource = componentSet.datasource
     }
   }

   _initValuelist(form, component, aComponentMeta) {
     this._initDBComponent(form, component, aComponentMeta)
     if (aComponentMeta.valueListModel !== undefined && aComponentMeta.valueListModel !== null) {
       component.fromAction = aComponentMeta.valueListModel.fromAction // 远程数据请求地址
       component.valueField = aComponentMeta.valueListModel.saveField // 数据存储的字段
       component.valueFieldType = aComponentMeta.valueListModel.valueFieldType // ：//数据存储字段的类型
       component.displayField = aComponentMeta.valueListModel.displayField // ：前端显示字段
       component.displayFieldType = aComponentMeta.valueListModel.displayFieldType // ：前端显示字段的类型

       component.inputField = aComponentMeta.valueListModel.inputField
       component.maps = aComponentMeta.valueListModel.maps  
     }
   }

   _initRemoteCombox(form, component, aComponentMeta) {
     this._initDBComponent(form, component, aComponentMeta)
     if (aComponentMeta.remoteComboBoxModel !== undefined && aComponentMeta.remoteComboBoxModel !== null) {
       component.fromAction = aComponentMeta.remoteComboBoxModel.fromAction // 远程数据请求地址
       component.valueField = aComponentMeta.remoteComboBoxModel.valueField // 数据存储的字段
       component.valueFieldType = aComponentMeta.remoteComboBoxModel.valueFieldType // ：//数据存储字段的类型
       component.displayField = aComponentMeta.remoteComboBoxModel.displayField // ：前端显示字段
       component.displayFieldType = aComponentMeta.remoteComboBoxModel.displayFieldType // ：前端显示字段的类型
     }
   }
  /**
   * 初始化DBComponent
   * @param {*} component
   * @param {*} aComponentMeta
   */
   _initDBComponent(form, component, aComponentMeta) {
     this._initComponent(form, component, aComponentMeta)
     // 数据连接
     if (aComponentMeta.dataset !== undefined) {
       var ds = form.getDataSource(aComponentMeta.dataset)
       component.datasource = ds
     }

     component.fieldName = aComponentMeta.field

     component.editable = (aComponentMeta.editable === undefined) ? true : (aComponentMeta.editable === 'true')
     component.originalEditable = component.editable

     component.readOnly = (aComponentMeta.readOnly === undefined) ? false : (aComponentMeta.readOnly === 'true')
     component.originalReadOnly = component.readOnly

     component.allowBlank = (aComponentMeta.allowBlank === undefined) ? false : (aComponentMeta.allowBlank === 'true')
     component.originalAllowBlank = component.allowBlank

     component.enumModel = aComponentMeta.enumModel
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

     if (aComponentMeta.ctype !== undefined) {
       component.ctype = aComponentMeta.ctype
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

  /**
   * 初始化ComponentSet
   *  @param {*} componentSetMeta 元数据
   */
   _initToolbar(detailForm, toolbar, toolbarMeta, datasource) {
     this._initComponent(detailForm, toolbar, toolbarMeta)
     toolbar.showMoreButton = toolbarMeta.showMoreButton
     for (var buttonMeta of toolbarMeta.buttons) {
       var cmp = new VButton(toolbar)
       this._initToolbarButton(detailForm, cmp, buttonMeta, datasource)
     }
   }
  /**
   * 初始化按钮
   *  @param {*} componentSetMeta 元数据
   */
   _initToolbarButton(form, cmp, cmpMeta, datasource) {
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

   modifyData() {
     var me = this

     if (me.isChanged()) {
       this.alert('当前记录已经修改过了,请先保存')
       return false
     }

     if (this.state === basicConstant.VIEWSTATE_NULL ||
              this.state === basicConstant.VIEWSTATE_NEW
     ) {
       return false
     }

     if (!me.checkFunPermission('modify')) return false
     if (me.fireEvent('beforeModify') === false) { return false }
     me.state = basicConstant.VIEWSTATE_MODIFY
     me.setUIState()
     me.fireEvent('afterModify')
   }

   saveData() {
     if (this.state === basicConstant.VIEWSTATE_VIEW ||
      this.state === basicConstant.VIEWSTATE_NULL) {
       this.showFailMesg({ msg: '记录查看状态，无法保存单据！' })
       return false
     }
     var me = this

     if (me.isChanged() === false) {
       return false
     }

     if (!me.checkFunPermission('save')) return
     // 监听master删除前置事件,返回false中断
     if (me.fireEvent('beforeSave') === false) { return false }
     // TODO 需要添加 sVars
     this.dataStore.commitToDB(this.formMeta.actionUrl + '!save.action',
       { sVars: JSON.stringify(this.svars) })
       .then(resdata => {
         me.loadDataByPackage(resdata.dataPackage)
         me.openDataSources()
         me.setUIState()
         me.success('恭喜您，保存单据成功！')
         me.fireEvent('afterSave')
       }).catch(err => {
         console.log(err.message)
         me.showFailMesg('保存失败！ 原因是：' + err.message)
       })
   }

  /**
   *  删除单据
   */
   deleteData() {
     var deletefun = function() {
       var me = this
       if (!me.checkFunPermission('delete')) return false
       // 监听master删除前置事件,返回false中断
       if (me.fireEvent('beforeDelete') === false) { return false }
       this.dataStore.DeleteDataSet()
       // TODO 需要添加 sVars
       this.dataStore.commitToDB(this.formMeta.actionUrl + '!save.action',
         { sVars: JSON.stringify(this.svars) })
         .then(resdate => {
           for (const ds of this.datasources.values()) {
             ds.emptyData()
           }
           this.state = basicConstant.VIEWSTATE_NULL
           me.setUIState()
           me.fireEvent('afterDelete')
           me.success('恭喜您，删除单据成功！')
         }).catch(err => {
           console.log(err.message)
         })
     }

     this.askMesg({ message: '确认删除吗？', fn: deletefun })
   }

  /**
   *  新增单据
   */
   addData() {
     var me = this
     if ((this.state === basicConstant.VIEWSTATE_VIEW ||
          this.state === basicConstant.VIEWSTATE_NULL) === false) {
       this.showFailMesg({ msg: '记录不是查看状态，无法进入新增状态！' })
       return false
     }
     if (me.isChanged()) {
       this.alert('当前记录已经修改过了,请先保存')
       return false
     }

     if (me.checkFunPermission('new') === false) return false
     // 监听master新增前置事件,返回false中断
     if (me.fireEvent('beforeNew') === false) { return false }

     // 清空数据集中的数据
     this.dataStore.emptyDataSet()
     for (const ds of this.datasources.values()) {
       ds.emptyData()
     }

     // 改变DetailForm状态为NEW
     var initDataPackage = me.getCVar('initDataPackage')
     // 判断是否有初始datapackage
     if (initDataPackage == null) { // 没有初始datapackage时
       // 设置记录的初始值
       var mDatasource = this.getMasterDataSource()
       mDatasource.appendRecord()
       // TODO 刷新相关的treepanel
       // me.syncTreeData(dataSetName, recData)
     } else { // 有初始数据时
       // 装载初始数据
       me.loadDataByPackage(initDataPackage) // add by max
       // 清空初始数据，防止下次出问题
       me.addCVar({ initDataPackage: null })
       // 新增有初始化数据的不进行初始化赋值
     }
     this.setUIState(basicConstant.VIEWSTATE_NEW)
     // 监听新增后置事件
     this.fireEvent('afterNew')
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

  /**
     * 根据DetailPage的增加记录
     * @param cmpSetName
     * @returns {Boolean}
  */
   addRow(datasource) {
     datasource.appendRecord()
   }

  /**
     * 根据DetailPage的增加记录
     * @param cmpSetName
     * @returns {Boolean}
  */
   deleteRow(datasource) {
     datasource.deleteRecord()
   }

   getIdValue() {
     var result = null
     var recData = this.getMasterDataSource().getRecord()
     if (recData !== null) {
       result = recData['id']
     }
     return result
   }

   requestAjaxTableData(dataset) {
     var me = this
     var dataId = me.getIdValue()
     // ID 赋值

     var params = {
       dataId: dataId,
       language: '', // TODO设置语言
       sVars: JSON.stringify(me.svars)
     }
     return new Promise(
       (resolve, reject) => {
         request({
           url: '/api/' + dataset.actionMethod,
           //   params: params,
           method: 'get'
         }).then(resData => {
           this.respData = resData.data
           resolve(resData.data.resultList)
         }).catch(err => {
           console.log(err.message)
         })
       })
   }

   requestDetailData(id = null) {
     var me = this
     var dataId
     // ID 赋值
     if (id !== null) {
       dataId = id
     } else {
       dataId = me.getIdValue()
       if (dataId == null) {
         if (me.cvars.aggregationId != null) {
           dataId = me.cvars.aggregationId
         } else {
           dataId = me.cvars.recData.id
         }
       }
     }
     var params = {
       dataId: dataId,
       language: '', // TODO设置语言
       sVars: JSON.stringify(me.svars)
     }
     return new Promise(
       (resolve, reject) => {
         request({
           url: '/api/' + this.formMeta.actionUrl,
           params: params,
           method: 'get'
         }).then(resData => {
           this.respData = resData.data
           resolve(resData.data.dataPackage)
         }).catch(err => {
           console.log(err.message)
         })
       })
   }
}
