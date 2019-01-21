export default class VDataSet {
  dataStore = null; // 数据仓库
  bizClassName = null;// 对应的类名
  name = null; // 名称
  datasource = null; // dataPackage / ajaxRequest
  currentTable = null;// 当前记录
  originalTable = null;// 原始记录
  updateLogs = null; // 更新记录


  /**
* 預設默認值集
*/
  defaultValueSet = [];

  constructor(datasetMeta) {
    this.init(datasetMeta)
  }

  init(datasetMeta) {
    if (datasetMeta != null) {
      this.bizClassName = datasetMeta.bizClassName
      this.name = datasetMeta.name
    }
    this.currentTable = []// 当前记录
    this.originalTable = []// 原始记录
    this.updateLogs = [] // 更新记录
  }

  /**
   * 删除log中的文件
   * @param {*} key
   */
  _logRemove(key) {
    var k = 0
    if (this.updateLogs != null) {
      for (k = this.updateLogs.length - 1; k > -1; k--) {
        if (key === this.updateLogs[k].entityID) {
          this.updateLogs.remove(this.updateLogs[k])
        }
      }
    }
  }

  /**
 * 删除log中的文件
 * @param {*} key 和fieldName相同的字段
 */
  _logRemoveByField(key, fieldName) {
    var k = 0
    if (this.updateLogs != null) {
      for (k = this.updateLogs.length - 1; k > -1; k--) {
        if (key === this.updateLogs[k].entityID && fieldName === this.updateLogs[k].fieldName) {
          this.updateLogs.remove(this.updataLogs[k])
          break
        }
      }
    }
  }

  _logCount(key) {
    var count = 0
    if (this.updateLogs != null) {
      for (var k = this.updateLogs.length - 1; k > -1; k--) {
        if (key === this.updateLogs[k].entityID) {
          count++
        }
      }
    }
    return count
  }

  /**
* 删除log中的文件
* @param {*} key
*/
  _logRemoveAll() {
    var k = 0
    if (this.updateLogs != null) {
      for (k = this.updateLogs.length - 1; k > -1; k--) {
        this.updateLogs.remove(this.updateLogs[k])
      }
    }
  }

  // 装载DataPackage数据
  loadData(ADataPackage) {
    // 寻找DataSet的记录
    for (var j = 0; j < ADataPackage.dataSets.length; j++) {
      if (ADataPackage.dataSets[j].name === this.name) {
        this.currentTable = ADataPackage.dataSets[j].originalTable// 当前记录
        this.originalTable = ADataPackage.dataSets[j].originalTable// 原始记录
        this.updateLogs = [] // 更新记录
        this.datasource = 'dataPackage'
        break
      }
    }
  }

  // 装载DataPackage数据
  loadList(dataList) {
    this.currentTable = dataList// 当前记录
    this.originalTable = dataList// 原始记录
    this.updateLogs = [] // 更新记录
    this.datasource = 'ajaxRequest'
  }

  /**
   * 根据filter过滤当前数据
   * @param {*} filter
   */
  getDataSetData(filter = null) {
    var result = []
    for (const record of this.currentTable) {
      if (filter != null) {
        if (filter(record) === true) {
          result.push(record)
        }
      } else {
        result.push(record)
      }
    }

    return result
  }
  // 获取当前值
  getValue(key, fieldName) {
    // 寻找DataSet的记录
    for (var j = 0; j < this.currentTable.length; j++) {
      if (this.currentTable[j].entityID === key) {
        return this.currentTable[j][fieldName]
      }
    }
    return undefined
  }

  // 获取原始值
  getOriginalValue(key, fieldName) {
    // 寻找DataSet的记录
    for (var j = 0; j < this.originalTable.length; j++) {
      if (this.originalTable[j].entityID === key) {
        return this.originalTable[j][fieldName]
      }
    }
    return undefined
  }

  deleteRecord(key) {
    // 寻找DataSet的记录
    for (var j = 0; j < this.currentTable.length; j++) {
      if (this.currentTable[j].entityID === key) {
        this.currentTable[j].entityStatus = 'D'
        this._logRemove(key)
        return true
      }
    }
    return false
  }
  /**
     * 清除所有记录
     */
  deleteAllRecord() {
    if (this.recordCount() > 0) {
      for (var j = 0; j < this.currentTable.length; j++) {
        this.currentTable[j].entityStatus = 'D'
      }
      this._logRemoveAll()
      return true
    }
    return false
  }
  /**
     * 插入记录
     * @param {*} ARecord
     * @param {*} ADatasetInfo
     */
  insertRecord(ARecord, ADatasetInfo = null) {
    if (this.isInited()) {
      this.init(ADatasetInfo)
    }
    this.currentTable.push(ARecord)
    this._logRemove(ARecord.entityID)
    return true
  }

  // 是否有记录
  hasRecord() {
    return (this.currentTable === null || this.currentTable === undefined ? false : this.currentTable.length > 0)
  }

  // 记录数量
  recordCount() {
    return (this.currentTable === null || this.currentTable === undefined ? 0 : this.currentTable.length)
  }

  /**
     * DataSet是否初始化
     */
  isInited() {
    return (this.currentTable == null && this.datasetInfo == null)
  }

  // 修改Dataset数据 单个字段的单个数据
  updateByFieldName(key, fieldName, newValue) {
    var result = false
    // 初始化更新记录
    if (this.updateLogs === null || this.updateLogs.length === 0) {
      this.updateLogs = []
    }
    var datas = this.currentTable
    // 查找对应的数据
    for (var j = 0; j < datas.length; j++) {
      var check = false
      if (datas[j].id === key) check = true

      if (check) {
        var oldValue = datas[j][fieldName]
        var entityStatus = datas[j].entityStatus
        datas[j][fieldName] = newValue
        if (entityStatus === 'I') { // 当前是插入
          datas[j][fieldName] = newValue // 更新修改数据
        }
        if (entityStatus === 'L') { // 当前是浏览
          datas[j].entityStatus = 'U'
          this.updateLogs.push({ // 记录日志 log
            entityID: key,
            fieldname: fieldName,
            newValue: newValue,
            OldValue: oldValue
          })
          datas[j][fieldName] = newValue
        }
        if (entityStatus === 'U') { // 当前是修改
          this._logRemoveByField(key, fieldName)
          // 防止 A ->B ->C->A的情况
          const originalValue = this.getOriginalValue(key, fieldName)
          if (originalValue !== newValue) {
            this.updateLogs.push({ // 记录日志 log
              entityID: key,
              fieldname: fieldName,
              newValue: newValue,
              OldValue: oldValue
            })
            datas[j][fieldName] = newValue // 更新修改数据
          } else {
            if (this._logCount(key) === 0) { // 如果没有修改日志
              datas[j].entityStatus = 'L'
            }
          }
        }
        break// 退出循环
      }
    }

    result = true
    return result
  }

  /**
	 * 設置默認值
	 * @param datasetName
	 * @param fieldName
	 * @param value
	 */
  setDefaultValue(fieldName, value) {
    this.defaultValueSet.push(
      {
        fieldName: fieldName,
        value: value

      })
  }

  /**
 * 替代默認值
 * @param datasetName
 * @param dataObject
 * @returns 替代後的dataObject
 */
  replaceDefaultValue(dataObject) {
    for (var i = 0; i < this.defaultValueSet.length; i++) {
      var value = null
      if (typeof this.defaultValueSet[i].value === 'function') {
        var fun = this.defaultValueSet[i].value
        value = fun()
      } else {
        value = this.defaultValueSet[i].value
      }
      dataObject[this.defaultValueSet[i].fieldName] = value
    }
    return dataObject
  }

  isChanged() {
    if (this.updateLogs !== null && this.updateLogs.length > 0) {
      return true
    }
    var currDatas = this.currentTable
    if (currDatas != null && currDatas.length > 0) {
      for (var i = 0; i < currDatas.length; i++) {
        if (currDatas[i].entityStatus === 'I' || currDatas[i].entityStatus === 'D') {
          return true
        }
      }
    }
    return false
  }
}
