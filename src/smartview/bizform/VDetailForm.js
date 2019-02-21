import VBaseForm from './VBaseForm'
import * as cf from '../util/commonFun'
import {
  basicConstant
} from '@/smartview/VBasicConstant.js'

export default class VDetailForm extends VBaseForm {
  // 当前状态
  state = basicConstant.VIEWSTATE_VIEW;

  constructor(parent) {
    super(parent)
    this.ctype = basicConstant.FORMTYPE_DETAIL
  }

  initBiz() {
    this.createBizDependence()
  }
  /**
   * 获取Master Table的数据记录
   */
  getMasterRecord() {
    // TODO  获取主数据
    return  null
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
        this.parent.enableDependenceControl(component)
        // 执行隐藏依赖
        this.parent.hiddenDependenceControl(component)

        if (typeof component.setReadOnly === 'function') {
          component.setReadOnly(true) // 查看模式下只可以查看
        }
        if (typeof component.setDefaultAllowBlank === 'function') {
          component.setDefaultAllowBlank()
          // 执行必填依赖
          this.parent.requiredDependenceControl(component)
        }
      }
    } else { // 新增和修改模式
      // 设置默认状态
      for (const component of this.components.values()) {
        component.setDefaultEnable()
        component.setDefaultHidden()
        // 执行可用依赖
        this.parent.enableDependenceControl(component)
        // 执行隐藏依赖
        this.parent.hiddenDependenceControl(component)

        // 只读处理
        if (typeof component.setDefaultReadOnly === 'function') {
          component.setDefaultReadOnly()
          // 执行只读依赖
          this.parent.readOnlyDependenceControl(component)
        }

        if (typeof component.setDefaultAllowBlank === 'function') {
          component.setDefaultAllowBlank()
          // 执行必填依赖
          this.parent.requiredDependenceControl(component)
        }
      }
    }
  }

  show(state) {
    super.show()
    this.loadData()
    this.setUIState(state)
  }

  setEnableDependence(cmpName, condition) {
    var cmp = this.getComponent(cmpName)
    if (cmp !== null && cmp !== undefined) {
      this.setComponentEnableDependence(cmp, condition)
    }
    return false
  }

  setComponentEnableDependence(component, condition) {
    this.parent.setComponentEnableDependence(component, condition)
  }

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
            if (masterData !== null  && (masterData.rstatus === 1 || masterData.rstatus === 0)) {
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
            if (masterData !== null  && masterData.rstatus === 1) {
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
            if (masterData !== null  &&  masterData.rstatus === 0) {
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
            if (masterData !== null  && masterData.rstatus === 0) {
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
            if (masterData !== null  && masterData.rstatus === 1 && masterData.bstatus !== 5) {
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
            if (masterData !== null  && masterData.rstatus === 1 && masterData.bstatus === 5) {
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
              if (masterData !== null  && masterData.rstatus === 1 && masterData.bstatus !== toStatus) {
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
}
