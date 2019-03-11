import VBaseForm from './VBaseForm'
import VComponentSet from '../component/VComponentSet.js'
import VToolbar from '../component/VToolbar.js'
import VPanel from '../component/VPanel.js'
import VDBComponent from '../component/VDBComponent.js'
import VButton from '../component/VButton.js'
import * as cf from '../util/commonFun'
import {
  basicConstant
} from '@/smartview/VBasicConstant.js'
import VDataStore from '@/smartview/db/VDataStore.js'
import VDataSource from '@/smartview/db/VDataSource.js'

export default class VBaseDetailForm extends VBaseForm {
  // 当前活动的Tab
  activeDetailPage = '';

  // 当前状态
  state = basicConstant.VIEWSTATE_VIEW;

  constructor(parent, formMeta) {
    super(parent, formMeta)
    this.ctype = basicConstant.FORMTYPE_DETAIL
    this.init()
  }

  static NewInstant(parent, formMeta) {
    return new VBaseDetailForm(parent, formMeta)
  }

  /**
   * 初始化form
   */
  init() {
    // 创建数据存储
    this.dataStore = new VDataStore(this.formMeta.datasetInfo)
    // 创建数据感知
    for (const dataset of this.dataStore.datasets) {
      var dataSource = new VDataSource(dataset.name, dataset)
      this.dataSources.set(dataSource.name, dataSource)
    }
    // 建立UI
    this.createUI(this.formMeta)
    // 建立UI的默认业务依赖
    this.createBizDependence()
    // 业务逻辑初始化
    this.bizInit()
  }

  /**
   * 业务处理
   */
  bizInit() {
    var form = this
    // 增加按钮监听事件
    this.setFormButtonListener(form)
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
  setFormButtonListener(form) {}
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
  setUIState(state) {
    this.state = state
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
    var mComponentSet = new VComponentSet(masterPanel)
    this._initComponentSet(this, mComponentSet, formMeta.masterPage.componentSetModel)

    // 2.视图中建立toolbar
    var mToolbar = new VToolbar(masterPanel)
    this._initToolbar(this, mToolbar, formMeta.masterPage.toolbarModel)

    // 3.建立detialpage视图
    for (var page of formMeta.detailPages) {
      // 建立Detail视图
      var detailPanel = new VPanel(this)
      this._initPanel(this, detailPanel, page)

      // 1.视图中建立componentSet
      var dComponentSet = new VComponentSet(detailPanel)
      this._initComponentSet(this, dComponentSet, page.componentSetModel)

      //  2.视图中建立toolbar
      var dToolbar = new VToolbar(detailPanel)
      this._initToolbar(this, dToolbar, page.toolbarModel)
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

    for (var j = 0; j < componentSetMeta.components.length; j++) {
      var cmp = new VDBComponent(componentSet)
      this._initDBComponent(detailForm, cmp, componentSetMeta.components[j])
      cmp.dataSource = componentSet.dataSource
    }
  }

  /**
   * 初始化DBComponent
   * @param {*} component
   * @param {*} aComponentMeta
   */
  _initDBComponent(form, component, aComponentMeta) {
    this._initComponent(form, component, aComponentMeta)

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

    // 数据连接
    if (aComponentMeta.dataset !== undefined) {
      var ds = form.getDataSource(aComponentMeta.dataset)
      component.dataSource = ds
    }

    // 添加form的组件
    form.addComponent(component)
  }

  /**
   * 初始化ComponentSet
   *  @param {*} componentSetMeta 元数据
   */
  _initToolbar(detailForm, toolbar, toolbarMeta) {
    this._initComponent(detailForm, toolbar, toolbarMeta)
    toolbar.showMoreButton = toolbarMeta.showMoreButton
    for (var buttonMeta of toolbarMeta.buttons) {
      var cmp = new VButton(toolbar)
      this._initToolbarButton(detailForm, cmp, buttonMeta)
    }
  }
  /**
   * 初始化按钮
   *  @param {*} componentSetMeta 元数据
   */
  _initToolbarButton(form, cmp, cmpMeta) {
    this._initComponent(form, cmp, cmpMeta)
    cmp.fun = cmpMeta.fun
    cmp.iconcls = cmpMeta.iconcls
    cmp.panelType = cmpMeta.panelType
  }
}
