import VDataStore from '@/smartview/VDataStore.js'
import VComponentSet from '@/smartview/VComponentSet.js'
import VEvent from '@/smartview/VEvent.js'
import { vEventType } from '@/smartview/VEvent.js'
import { basicConstant } from '@/smartview/VBasicConstant.js'

export default class VDataView {
  // 数据存储
  dataStore;

  // 数据UI
  componentSets = [];

  // componentSet的数据过滤函数
  fielters = new Map();

  // 记录当前窗体是执行过保存，删除操作
  hasSaved = false;

  checkChanged = true;

  // 当前状态
  state = basicConstant.VIEWSTATE_VIEW;

  // 事件处理中心
  eventBus = new VEvent();

  // 控件UI( 可用/可见/可修改 )依赖设置
  dependenceSet = [];

  // 控件值依赖设置
  valueDependenceSet = [];

  /**
   * 初始化
   * @param {*} viewModel  视图
   */
  initByDetail(viewModel) {
    // 建立数据
    this.dataStore = new VDataStore(viewModel.datasetInfo)
    this.dataStore.dataView = this
    // 开始建立视图
    var cs
    // 建立Master视图
    cs = new VComponentSet(viewModel.masterPage.componentSetModel)
    cs.dataView = this
    this.componentSets.push(cs)
    // 建立detialpage视图
    for (var j = 0; j < viewModel.detailPages.length; j++) {
      cs = new VComponentSet(viewModel.detailPages[j].componentSetModel)
      this.addComponentSet(cs)
    }
    //
  }

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
   * 添加一个数据视图
   * @param {*} AComponentSet
   */
  addComponentSet(aComponentSet) {
    this.componentSets.push(aComponentSet)
    aComponentSet.dataView = this
  }

  /**
   * 删除一个数据视图
   * @param {*} AComponentSet
   */
  deleteComponentSet(aComponentSet) {
    this.componentSets.delete(aComponentSet)
    aComponentSet.dataView = null
  }

  /**
   * 根据名称获取一个数据视图
   * @param {} componentSetName
   */
  getComponentSet(componentSetName) {
    var result = null
    for (const cs of this.componentSets) {
      if (cs.name === componentSetName) {
        result = cs
        break
      }
    }
    return result
  }

  /**
   * 返回数据是否修改过 curd
   */
  isChanged() {
    return this.dataStore.isChanged()
  }

  openAll() {
    const datasetNames = new Set()
    for (const cs of this.componentSets) {
      if (datasetNames.has(cs.dataSetName) === false) {
        datasetNames.add(cs.dataSetName)
      }
    }
    for (const cs of this.componentSets) {
      this.open(cs.datasetName)
    }
  }
  /**
   * 装载视图的数据集合
   * @param {*} dataSetName
   * @param {*} filter
   */
  open(dataSetName, filter = null) {
    var list
    this.fielters.set(dataSetName, filter)
    for (const ds of this.dataStore.datasets) {
      if (ds.name === dataSetName) {
        list = ds.getDataSetData(filter)
      }
    }

    for (const cs of this.componentSets) {
      if (cs.datasetName === dataSetName) {
        cs.openByData(list)
      }
    }
  }

  /**
 * 装载视图的数据集合
 * @param {*} dataSetName
 * @param {*} filter
 */
  refresh(dataSetName) {
    var list
    for (var j = 0; j < this.dataStore.datasets.length; j++) {
      if (this.dataStore.datasets[j].name === dataSetName) {
        list = this.dataStore.datasets[j].getDataSetData(this.fielters.get(dataSetName))
        break
      }
    }

    for (const cs of this.componentSets) {
      if (cs.datasetName === dataSetName) {
        cs.refresh(list)
      }
    }
  }

  /**
 * 设置可用依赖
 * @param cmpName
 * @param condition/condition()
 */
  setEnableDependence(cmpName, condition) {
    var cmp = this.getCmpByName(cmpName)
    if (cmp !== null || cmp !== undefined) {
      this.dependenceSet.push({
        type: basicConstant.DEPENDENCE_ENABLE,
        cmpName: cmpName,
        cmp: cmp,
        condition: condition
      })
    }
  }

  /**
 * 设置可见依赖
 * @param cmpName
 * @param condition/condition()
 */
  setEditableDependence(cmpName, condition) {
    var cmp = this.getCmpByName(cmpName)
    if (cmp !== null || cmp !== undefined) {
      this.dependenceSet.push({
        type: basicConstant.DEPENDENCE_EDITABLE,
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
    if (cmp !== null || cmp !== undefined) {
      this.dependenceSet.push({
        type: basicConstant.DEPENDENCE_READONLY,
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
    if (cmp !== null || cmp !== undefined) {
      this.dependenceSet.push({
        type: basicConstant.DEPENDENCE_REQUIRED,
        cmpName: cmpName,
        cmp: cmp,
        condition: condition })
    }
  }

  /**
 * 设置隐藏
 * @param cmpName
 * @param conditionFun
 */
  setHiddenDependence(cmpName, condition) {
    var cmp = this.getCmpByName(cmpName)
    if (cmp !== null || cmp !== undefined) {
      this.dependenceSet.push({
        type: basicConstant.DEPENDENCE_HIDDEN,
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
    if (cmp !== null || cmp !== undefined) {
      this.dependenceSet.push({
        type: basicConstant.DEPENDENCE_UNIQUE,
        cmpName: cmpName,
        cmp: cmp,
        condition: condition })
    }
  }

  getCmpByName(cmpName) {
    var result = null
    for (const cs of this.componentSets) {
      result = cs.getCmpByName(cmpName)
      if (result !== null) return result
    }
    return result
  }

  /**
 * 编辑依赖处理
 */
  editableDependenceControl() {
    if (this.state === basicConstant.VIEWSTATE_VIEW) return
    for (const ds of this.dependenceSet) {
      if (ds.type === basicConstant.DEPENDENCE_EDITABLE) {
        var record = ds.cmp.componentSet.getRecord()
        var isEditable = true
        if (typeof this.ds.condition === 'function') {
          isEditable = this.ds.condition({ record: record })
        } else {
          isEditable = this.ds.condition
        }
        ds.cmp.setEditable(!isEditable)
      }
    }
  }

  /**
   * 编辑依赖处理
   */
  readOnlyDependenceControl() {
    if (this.state === basicConstant.VIEWSTATE_VIEW) return
    for (const ds of this.dependenceSet) {
      if (ds.type === basicConstant.DEPENDENCE_READONLY) {
        var record = ds.cmp.componentSet.getRecord()
        var isReadOnly = false
        if (typeof ds.condition === 'function') {
          isReadOnly = ds.condition({ record: record, cmp: ds.cmp })
        } else {
          isReadOnly = this.ds.condition
        }
        ds.cmp.setReadOnly(!isReadOnly)
      }
    }
  }

  /**
   * 可用依赖处理
   */
  enableDependenceControl() {
    for (const ds of this.dependenceSet) {
      if (ds.type === basicConstant.DEPENDENCE_ENABLE) {
        var record = ds.cmp.componentSet.getRecord()
        var isEnable = true
        if (typeof this.ds.condition === 'function') {
          isEnable = this.ds.condition({ record: record, cmp: ds.cmp })
        } else {
          isEnable = this.ds.condition
        }
        ds.cmp.setEnable(isEnable)
      }
    }
  }

  /**
   * 隐藏依赖处理
   */
  hiddenDependenceControl() {
    for (const ds of this.dependenceSet) {
      if (ds.type === basicConstant.DEPENDENCE_HIDDEN) {
        var record = ds.cmp.componentSet.getRecord()
        var isHidden = false
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
   * 设置DataView的UI状态
   * @param {状态} state
   */
  setDataViewUIState(state) {
    this.state = state
    this.setComponentSetUIState()
  }

  /**
   * 设置控件的状态
   */
  setComponentSetUIState() {
    if (this.state === basicConstant.VIEWSTATE_VIEW) { // 查看状态下只是看看
      // 设置默认状态
      for (const cs of this.componentSets) {
        cs.setDefaultEnable()
        cs.setDefaultHidden()
        cs.setReadOnly(true)// 查看模式下只可以查看
      }
      // 执行可用依赖
      this.enableDependenceControl()
      // 执行隐藏依赖
      this.hiddenDependenceControl()
    } else { // 新增和修改模式
      // 设置默认状态
      for (const cs of this.componentSets) {
        cs.setDefaultEnable()
        cs.setDefaultHidden()
        cs.setDefaultReadOnly()
      }
      // 执行可用依赖
      this.enableDependenceControl()
      // 执行只读依赖
      this.readOnlyDependenceControl()
      // 执行隐藏依赖
      this.hiddenDependenceControl()
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
    var me = this
    var dependenceCmpNameSet = []
    if (typeof dependenceCmpNames === 'string') {
      dependenceCmpNameSet.push(dependenceCmpNames)
    } else {
      dependenceCmpNameSet = dependenceCmpNames
    }
    me.valueDependenceSet.push(
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
}

