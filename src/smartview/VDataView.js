import VDataStore from '@/smartview/db/VDataStore.js'
import VEvent from '@/smartview/VEvent.js'
import { vEventType } from '@/smartview/VEvent.js'
import { basicConstant } from '@/smartview/VBasicConstant.js'
import VDataSource from './db/VDataSource.js'
import VDetailFormFactory from './util/VDetailFormFactory.js'

export default class VDataView {
  // 数据存储
  dataStore;

  // 窗体
  forms = [];

  // 数据源
  dataSources = new Map()

  // 事件处理中心
  eventBus = new VEvent();

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

  /**
   * 添加监听
   * @param {*} type
   * @param {*} func
   */
  addListener(type, func) {
    return this.eventBus.add(type, func)
  }
  /**
    * 触发事件
    * @param {*} type
    */
  fireEvent(type) {
    return this.eventBus.fire(type)
  }

  static newDetailInstant(detailFormMeta) {
    var detailDataView = new VDataView()
    detailDataView.createDataStore(detailFormMeta.datasetInfo)
    detailDataView.addDetailForm(detailFormMeta)
    return detailDataView
  }

  createDataStore(metaValue) {
    this.dataStore = new VDataStore(metaValue)
    this.dataStore.dataView = this
    this.createDefultDataSource()
  }

  createDefultDataSource() {
    for (const dataset of this.dataStore.datasets) {
      var dataSource = new VDataSource(dataset.name, dataset)
      this.dataSources.set(dataSource.name, dataSource)
    }
  }

  addDetailForm(detailFormMeta) {
    var detalForm = VDetailFormFactory.createInstant(this, detailFormMeta)
    this.forms.push(detalForm)
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
   * 返回数据是否修改过 curd
   */
  isChanged() {
    return this.dataStore.isChanged()
  }

  getDataset(datasetName) {
    return this.dataStore.getDataset(datasetName)
  }

  getDataSource(datasourceName) {
    return this.dataSources.get(datasourceName)
  }

  /**
   * 设置可用依赖
   * @param cmpName
   * @param condition/condition()
   */
  setEnableDependence(cmpName, condition) {
    var cmp = this.getCmpByName(cmpName)
    if (cmp !== null && cmp !== undefined) {
      this.enableDependenceSet.push({
        cmpName: cmpName,
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
    var cmp = this.getCmpByName(cmpName)
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
    var cmp = this.getCmpByName(cmpName)
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
    var cmp = this.getCmpByName(cmpName)
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
    var cmp = this.getCmpByName(cmpName)
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
    var cmp = this.getCmpByName(cmpName)
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
    this.valueDependenceSet.push(
      {
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

  getCmpByName(componentName) {
    var result = null
    for (const form of this.forms) {
      result = form.getComponent(componentName)
      if (result !== null) {
        return result
      }
    }
    return result
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
          isEditable = ds.condition({ record: record, cmp: ds.cmp })
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
          isReadOnly = ds.condition({ record: record, cmp: ds.cmp })
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
          isEnable = ds.condition({ record: record, cmp: ds.cmp })
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
          isHidden = ds.condition({ record: record, cmp: ds.cmp })
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
          isRequired = ds.condition({ record: record, cmp: ds.cmp })
        } else {
          isRequired = ds.condition
        }
        ds.cmp.setAllowBlank(!isRequired)
      }
    }
  }

  showDetailForm(formName, formState = basicConstant.VIEWSTATE_VIEW) {
    var detailForm = this.findDetailForm(formName)
    if (detailForm !== null) detailForm.show(formState)
  }

  findDetailForm(formName) {
    var form = this.findForm(formName)
    if (form == null || form === undefined) return null
    if (form.ctype === basicConstant.FORMTYPE_DETAIL) {
      return form
    } else {
      return null
    }
  }

  findForm(formName) {
    for (var form of this.forms) {
      if (form.componentName === formName) {
        return form
      }
    }
  }
}

