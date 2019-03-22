import {
  basicConstant
} from '../VBasicConstant.js'
import VForm from '../component/VForm'

import {
  vEventType
} from '../VEventBus.js'
import VDataSource from '../db/VDataSource.js'
import VDataStore from '../db/VDataStore.js'

import * as VMessage from '../util/VMessage.js'
import VDBComponent from '../component/VDBComponent.js'

export default class VBaseForm extends VForm {
  // 所有有关的数据源
  dataSources = [];

  // 操作代码
  operationCode = null;

  // 数据存储
  dataStore;

  // form的元数据定义
  formMeta;

  /**
     * 本地变量集
     */
  cvars=null;

  /**
     * 需传到后台服务的变量集
     */
  svars=null;

  // 权限
  permissionSet = [];

  // 可用依赖
  enableDependenceSet = [];
  // 可见依赖
  hiddenDependenceSet = [];
  // 只读依赖
  readOnlyDependenceSet = [];
  // 唯一值依赖
  uniquedDependenceSet = [];
  // 必填依赖
  requiredDependenceSet = [];
  // 编辑依赖
  editableDependenceSet = [];
  // 值依赖依赖
  valueDependenceSet = [];

  constructor(parent, formMeta) {
    super(parent)
    this.ctype = basicConstant.FORMTYPE_BASE
    this.formMeta = formMeta
  }

  createDataStore(dataStoreValue) {
    this.dataStore = new VDataStore(dataStoreValue)
    this.dataStore.dataView = this
  }

  createDefultDataSource() {
    for (const dataset of this.dataStore.datasets) {
      var dataSource = new VDataSource(dataset.name, dataset)
      this.dataSources.push(dataSource)
    }
  }

  /**
   * 返回数据是否修改过 curd
   */
  isChanged() {
    for (const ds of this.dataSources) {
      if (ds.isChanged() === true) return true
    }
    return false
  }

  show() {
    super.show()
  }

  openDataSources() {
    for (const ds of this.dataSources) {
      ds.open()
    }
  }

  getDataset(datasetName) {
    return this.dataStore.getDataset(datasetName)
  }

  getDataSource(datasourceName) {
    var result
    for (var ds of this.dataSources) {
      if (ds.name === datasourceName) {
        result = ds
        break
      }
    }
    return result
  }

  addRefDataSource(dataSource) {
    if (dataSource !== undefined || dataSource === null) {
      this.dataSources.push(dataSource)
    }
  }

  /**
   * 根据datapackage装载数据
   * @param {*} dataPackage
   */

  loadDataByPackage(dataPackage) {
    if (this.fireEvent(vEventType.beforeLoadDataPackage) === false) return
    this.dataStore.loadDataByPackage(dataPackage)
    this.fireEvent(vEventType.afterLoadDataPackage)
  }

  loadDataByList(datasetName, list) {
    if (this.fireEvent(vEventType.beforeLoadDataList) === false) return
    this.dataStore.loadDataByList(datasetName, list)
    this.fireEvent(vEventType.afterLoadDataList)
  }

  /**
	 * 設置默認值
	 * @param datasetName
	 * @param fieldName
	 * @param value
	 */
  setDefaultValue(datasetName, fieldName, value) {
    var dataset = this.dataStore.getDataset(datasetName)
    if (dataset !== null) {
      dataset.setDefaultValue(fieldName, value)
    }
  }

  /**
   * 设置可用依赖
   * @param cmpName
   * @param condition/condition()
   */
  setEnableDependence(cmpName, condition) {
    var cmp = this.getComponent(cmpName)
    if (cmp !== null && cmp !== undefined) {
      this.setComponentEnableDependence(cmp, condition)
    }
    return false
  }

  /**
   * 设置可用依赖
   * @param cmpName
   * @param condition/condition()
   */
  setComponentEnableDependence(cmp, condition) {
    if (cmp !== null && cmp !== undefined) {
      this.enableDependenceSet.push({
        cmpName: cmp.componentName,
        cmp: cmp,
        condition: condition
      })
      return true
    }
    return false
  }

  /**
   * 设置可编辑依赖
   * @param cmpName
   * @param condition/condition()
   */
  setEditableDependence(cmpName, condition) {
    var cmp = this.getComponent(cmpName)
    if (cmp !== null && cmp !== undefined) {
      this.editableDependenceSet.push({
        cmpName: cmpName,
        cmp: cmp,
        condition: condition
      })
    }
  }

  /**
   * 设置编辑依赖
   * @param cmpName
   * @param condition/condition()
   */
  setReadOnlyDependence(cmpName, condition) {
    var cmp = this.getComponent(cmpName)
    if (cmp !== null && cmp !== undefined) {
      this.readOnlyDependenceSet.push({
        cmpName: cmpName,
        cmp: cmp,
        condition: condition
      })
    }
  }
  /**
   * 设置必填依赖
   * @param cmpName
   * @param conditionFun
   */
  setRequiredDependence(cmpName, condition) {
    var cmp = this.getComponent(cmpName)
    if (cmp !== null && cmp !== undefined) {
      this.requiredDependenceSet.push({
        cmpName: cmpName,
        cmp: cmp,
        condition: condition
      })
    }
  }

  /**
   * 设置隐藏
   * @param cmpName
   * @param conditionFun
   */
  setHiddenDependence(cmpName, condition) {
    var cmp = this.getComponent(cmpName)
    if (cmp !== null && cmp !== undefined) {
      this.hiddenDependenceSet.push({
        cmpName: cmpName,
        cmp: cmp,
        condition: condition
      })
    }
  }

  /**
   * 设置唯一性依赖
   * @param cmpName
   * @param conditionFun
   */
  setUniqueDependence(cmpName, condition) {
    var cmp = this.getComponent(cmpName)
    if (cmp !== null && cmp !== undefined) {
      this.uniqueDependenceSet.push({
        cmpName: cmpName,
        cmp: cmp,
        condition: condition
      })
    }
  }
  /**
   * 设置值依赖
   * @param String targetCmpName
   * @param String[] dependenceFields
   * @param Boolean/function condition
   * @param value/function value
   */
  setValueDependence(targetCmpName, dependenceCmpNames, condition, value) {
    var dependenceCmpNameSet = []
    if (typeof dependenceCmpNames === 'string') {
      dependenceCmpNameSet.push(dependenceCmpNames)
    } else {
      dependenceCmpNameSet = dependenceCmpNames
    }
    this.valueDependenceSet.push({
      type: basicConstant.DEPENDENCE_VALUE,
      cmpName: targetCmpName,
      dependenceCmpNames: dependenceCmpNameSet,
      condition: condition,
      value: value
    })
  }

  /**
   * 根据所依赖的字段，获取对应的依赖集
   * @param denpendeceCmpName
   * @returns {Array} denpendeceSet
   */
  getValueDependenceSet(dependenceCmpName) {
    var dependenceSet = []
    for (var i = 0; i < this.valueDependenceSet.length; i++) {
      var dependenceCmpNames = this.valueDependenceSet[i].dependenceCmpNames
      var isDependence = false
      if (dependenceCmpName == null) {
        isDependence = true
      } else {
        for (var j = 0; j < dependenceCmpNames.length; j++) {
          if (dependenceCmpNames[j] === dependenceCmpName) {
            isDependence = true
            break
          }
        }
      }
      if (isDependence) {
        dependenceSet.push(this.valueDependenceSet[i])
      }
    }
    return dependenceSet
  }
  /**
   * 编辑依赖处理
   */
  editableDependenceControl(component = null) {
    var findit = false
    for (const ds of this.editableDependenceSet) {
      if (component === null) {
        findit = true
      } else {
        if (findit === true) break
        if (ds.cmp === component) {
          findit = true
        }
      }
      if (findit === true) {
        var isEditable = true
        var record = null
        if (ds.cmp.dataSource !== null) {
          record = ds.cmp.dataSource.getRecord()
        }
        if (typeof ds.condition === 'function') {
          isEditable = ds.condition({
            record: record,
            cmp: ds.cmp
          })
        } else {
          isEditable = ds.condition
        }
        ds.cmp.setEnable(isEditable)
      }
    }
  }

  /**
   * 编辑依赖处理
   */
  readOnlyDependenceControl(component = null) {
    var findit = false
    for (const ds of this.readOnlyDependenceSet) {
      if (component === null) {
        findit = true
      } else {
        if (findit === true) break
        if (ds.cmp === component) {
          findit = true
        }
      }
      if (findit === true) {
        var isReadOnly = true
        var record = null
        if (ds.cmp.dataSource !== null) {
          record = ds.cmp.dataSource.getRecord()
        }
        if (typeof ds.condition === 'function') {
          isReadOnly = ds.condition({
            record: record,
            cmp: ds.cmp
          })
        } else {
          isReadOnly = ds.condition
        }
        ds.cmp.setReadOnly(!isReadOnly)
      }
    }
  }

  /**
   * 可用依赖处理
   */
  enableDependenceControl(component = null) {
    var findit = false
    for (const ds of this.enableDependenceSet) {
      if (component === null) {
        findit = true
      } else {
        if (findit === true) break
        if (ds.cmp === component) {
          findit = true
        }
      }
      if (findit === true) {
        var isEnable = true
        var record = null
        if (ds.cmp.dataSource !== null) {
          record = ds.cmp.dataSource.getRecord()
        }
        if (typeof ds.condition === 'function') {
          isEnable = ds.condition({
            record: record,
            cmp: ds.cmp
          })
        } else {
          isEnable = ds.condition
        }
        ds.cmp.setEnable(isEnable)
      }
    }
  }

  /**
   * 隐藏依赖处理
   */
  hiddenDependenceControl(component) {
    var findit = false
    for (const ds of this.hiddenDependenceSet) {
      if (component === null) {
        findit = true
      } else {
        if (findit === true) break
        if (ds.cmp === component) {
          findit = true
        }
      }
      if (findit === true) {
        var isHidden = true
        var record = null
        if (ds.cmp.dataSource !== null) {
          record = ds.cmp.dataSource.getRecord()
        }
        if (typeof ds.condition === 'function') {
          isHidden = ds.condition({
            record: record,
            cmp: ds.cmp
          })
        } else {
          isHidden = ds.condition
        }
        ds.cmp.setHidden(isHidden)
      }
    }
  }

  /**
   * 隐藏依赖处理
   */
  requiredDependenceControl(component) {
    var findit = false
    for (const ds of this.requiredDependenceSet) {
      if (component === null) {
        findit = true
      } else {
        if (findit === true) break
        if (ds.cmp === component) {
          findit = true
        }
      }
      if (findit === true) {
        var isRequired = true
        var record
        if (ds.cmp.dataSource === null || ds.cmp.dataSource === undefined) {
          record = null
        } else {
          record = ds.cmp.dataSource.getRecord()
        }
        if (typeof ds.condition === 'function') {
          isRequired = ds.condition({
            record: record,
            cmp: ds.cmp
          })
        } else {
          isRequired = ds.condition
        }
        ds.cmp.setAllowBlank(!isRequired)
      }
    }
  }

  showSucMesg(config) {
    VMessage.showSucMesg(config)
  }

  showFailMesg(config) {
    VMessage.showFailMesg(config)
  }
  askMesg(config) {
    VMessage.askMesg(config)
  }

  alert(mesage) {
    VMessage.alert(mesage)
  }
  /**
	 * 添加Cvar
	 * @param varObject
	 */
  addCVar(varObject) {
    var me = this
    if (me.cvars == null) {
      me.cvars = varObject
    } else {
      Object.extend(me.cvars, varObject)
    }
  }

  /**
	 * 获取CVar的值，不存在就返回空
	 * @param varName
	 * @returns varValue
	 */
  getCVar(varName) {
    var me = this
    if (me.cvars == null) {
      return null
    } else {
      return me.cvars[varName]
    }
  }
  setCmpValue(cmpName, value, rowIndex = null) {
    var component = this.getComponent(cmpName)
    if (component !== null) {
      if (component instanceof VDBComponent) {
        component.inputValue = value
        component.value = value
      }
    }
  }
}
