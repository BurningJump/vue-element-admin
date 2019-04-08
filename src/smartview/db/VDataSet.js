import * as UID from '@/smartview/util/uuid.js'

export default class VDataSet {
  name;// 名称

  dataStore = null; // 数据仓库
  bizClassName = null;// 对应的类名
  dataFrom = 'ajaxRequest'; // 获取数据的方法( dataPackage / ajaxRequest)

  actionMethod ;// 如果是 ajaxRequest， 获取数据的url
  currentTable = [];// 当前记录
  originalTable = [];// 原始记录
  updateLogs = []; // 更新记录

  _isOpen =false;

  isMaster; // 是否主数据

  masterIdFieldName; //  当是从数据时，数据集的从字段名称
  parentDatasetName; //  当是从数据时，父数据集的名称
  parentIdFieldName; //  当是从数据时，父数据集的的主字段名称

  /**
  * 預設默認值集
  */
  defaultValueSet = [];
  // 值变更事件集
  valueChangedListeners = [];

  constructor() {
    this.currentTable = []// 当前记录
    this.originalTable = []// 原始记录
    this.updateLogs = [] // 更新记录
  }

  get isOpen() {
    return this._isOpen
  }
  set isOpen(value) {
    this._isOpen = value
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
        if (key === this.updateLogs[k].entityID && fieldName === this.updateLogs[k].fieldname) {
          this.updateLogs.splice(k, 1)
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
        //  Object.assign(this.currentTable, ADataPackage.dataSets[j].originalTable)// 当前记录
        // this.copyTable(this.currentTable, ADataPackage.dataSets[j].originalTable)
        // this.currentTable = this.copyTableByProxy(ADataPackage.dataSets[j].originalTable)
        this.currentTable = this.copyTable(ADataPackage.dataSets[j].originalTable, true)
        // this.currentTable = ADataPackage.dataSets[j].originalTable
        //  Object.assign(this.originalTable, ADataPackage.dataSets[j].originalTable)// 原始记录
        //  this.copyTable(this.originalTable, ADataPackage.dataSets[j].originalTable)
        this.originalTable = this.copyTable(ADataPackage.dataSets[j].originalTable)
        this.updateLogs = [] // 更新记录
        this.dataFrom = 'dataPackage'
        this.isOpen = true
        break
      }
    }
  }
  /**
   * 给记录增加代理监听： 值变更的时候同步修改日志及触值依赖
   * @param {Array} record 源记录
   */
  addProxyOnRecord(record) {
    var dataset = this
    var valueChangedHandle = {
      set: function(obj, prop, value) {
        // 写入值
        obj[prop] = value
        // 字段是id/entityStatus时，不用监听变动
        if (prop !== 'id' && prop !== 'entityStatus') {
          // 同步日志
          dataset.syncLog(obj, prop, value)
          // 记录状态控制
          dataset.syncEntityStatus(obj)
          // 触发值变更事件
          dataset.fireValueChangedListener(prop, obj)
        }
        return true
      }
    }
    return new Proxy(record, valueChangedHandle)
  }

  // proxyRecordWithUpdateLog(record) {
  //   var dataset = this
  //   var logHandle = {
  //     set: function(obj, prop, value) {
  //       obj[prop] = value
  //       if (prop !== 'id' &&
  //             prop !== 'entityStatus' &&
  //              (obj['entityStatus' ] === 'U' || obj['entityStatus' ] === 'L')
  //       ) {
  //         if (dataset.updatedLog(obj['id'], prop, value) === true) {
  //           // 如果修改日志成功
  //           if (obj['entityStatus'] === 'L') {
  //             obj['entityStatus'] = 'U'
  //           }
  //         } else {
  //           // 如果修改日志不成功
  //           if (dataset._logCount(obj['id']) === 0) {
  //             // 如果没有其他修改日志
  //             obj['entityStatus'] = 'L'
  //           }
  //         }
  //       }
  //       return true
  //     }
  //   }
  //   return new Proxy(record, logHandle)
  // }

  // /** *
  //  * 复制一个TABLE
  //  */
  // copyTableByProxy(sourceTable) {
  //   var targetTable = []
  //   for (const rec of sourceTable) {
  //     var newRecord
  //     // 如果是新增状态的数据不会获取到修改日志
  //     if (rec['entityStatus'] === 'I') {
  //       newRecord = Object.assign({}, rec)
  //     } else {
  //       newRecord = this.proxyRecordWithUpdateLog(Object.assign({}, rec))
  //     }
  //     targetTable.push(newRecord)
  //   }
  //   return targetTable
  // }
  /**
   * 复制一个TABLE
   * @param {Array} sourceTable 源table
   * @param {boolean} needProxy 是否需要添加代理监听
   */
  copyTable(sourceTable, needProxy = false) {
    var targetTable = []
    for (const rec of sourceTable) {
      var newRecord = Object.assign({}, rec)
      if (needProxy) {
        newRecord = this.addProxyOnRecord(Object.assign({}, rec))
      }
      targetTable.push(newRecord)
    }
    return targetTable
  }

  // 装载DataPackage数据
  loadList(dataList) {
    // this.currentTable = this.copyTableByProxy(dataList) // 当前记录
    this.currentTable = this.copyTable(dataList, true) // 当前记录
    this.originalTable = this.copyTable(dataList) // 当前记录// 原始记录
    this.updateLogs = [] // 更新记录
    this.isOpen = true
  }

  /**
   * 根据filter过滤当前数据
   * @param {*} filter
   */
  getDatasetData(filter = null) {
    var result = []
    for (const record of this.currentTable) {
      // 如果删除的数据不会获取
      if (record['entityStatus'] === 'D') {
        continue
      }
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
      if (this.currentTable[j].id === key) {
        return this.currentTable[j][fieldName]
      }
    }
    return undefined
  }

  // 获取原始值
  getOriginalValue(key, fieldName) {
    // 寻找DataSet的记录
    for (var j = 0; j < this.originalTable.length; j++) {
      if (this.originalTable[j].id === key) {
        return this.originalTable[j][fieldName]
      }
    }
    return undefined
  }

  deleteRecord(key) {
    // 寻找DataSet的记录
    for (var j = 0; j < this.currentTable.length; j++) {
      if (this.currentTable[j].id === key) {
        if (this.currentTable[j].entityStatus === 'I') {
          // 如果记录是增加,需要删除增加记录
          this.currentTable.splice(j, 1)
        } else {
          this.currentTable[j].entityStatus = 'D'
        }
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
      for (var j = this.currentTable.length - 1; j >= 0; j--) {
        if (this.currentTable[j].entityStatus === 'I') {
          // 如果记录是增加,需要删除增加记录
          this.currentTable[j].splice(j, 1)
        } else {
          this.currentTable[j].entityStatus = 'D'
        }
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
   * 同步记录状态
   * @param {Array} record 记录
   */
  syncEntityStatus(record) {
    if (record['entityStatus'] === 'U' || record['entityStatus'] === 'L') {
      if (this._logCount(record['id']) > 0) {
        record['entityStatus'] = 'U'
      } else {
        record['entityStatus'] = 'I'
      }
    }
  }
  /**
     * DataSet是否初始化
     */
  isInited() {
    return (this.currentTable == null && this.datasetInfo == null)
  }

  /**
   * 同步日志
   * @param {Array} record 记录对象
   * @param {string} fieldName 字段名称
   * @param {*} newValue 更新的值
   */
  syncLog(record, fieldName, newValue) {
    record[fieldName] = newValue
    if (fieldName !== 'id' && fieldName !== 'entityStatus' && record['entityStatus' ] !== 'I') {
      const key = record['id']
      // 初始化更新记录
      if (this.updateLogs === null || this.updateLogs.length === 0) {
        this.updateLogs = []
      }
      // 清除日志
      this._logRemoveByField(key, fieldName)
      // 寻找原始值
      const originalValue = this.getOriginalValue(key, fieldName)
      // 和原始值不一致时
      if (newValue !== originalValue) {
        // 记录日志 log
        this.updateLogs.push({
          entityID: key,
          fieldname: fieldName,
          newValue: newValue,
          OldValue: originalValue
        })
      }
      // this.updatedLog(record['id'], fieldName, newValue)
    }
  }

  // updatedLog(key, fieldName, newValue) {
  //   // 初始化更新记录
  //   if (this.updateLogs === null || this.updateLogs.length === 0) {
  //     this.updateLogs = []
  //   }
  //   // 清除日志
  //   this._logRemoveByField(key, fieldName)
  //   // 寻找原始值
  //   const originalValue = this.getOriginalValue(key, fieldName)
  //   // 和原始值不一致时
  //   if (newValue !== originalValue) {
  //     // 记录日志 log
  //     this.updateLogs.push({
  //       entityID: key,
  //       fieldname: fieldName,
  //       newValue: newValue,
  //       OldValue: originalValue
  //     })
  //     return true
  //   }
  //   return false
  // }

  /**
 * 修改记录的值
 * 因为使用了Proxy时，自动会处理日志
 * 新增状态的数据没有用Proxy,就不会用记录日志
 * @param {*} key
 * @param {*} fieldName
 * @param {*} newValue
 */
  updateByFieldName(key, fieldName, newValue) {
    for (var record of this.currentTable) {
      if (record.id === key) {
        record[fieldName] = newValue
        return true
      }
    }
    return false
  }
  //  需要修改算法 因为使用了Proxy 修改Dataset数据 单个字段的单个数据
  // updateByFieldName(key, fieldName, newValue) {
  //   var result = false
  //   // 初始化更新记录
  //   if (this.updateLogs === null || this.updateLogs.length === 0) {
  //     this.updateLogs = []
  //   }
  //   var datas = this.currentTable
  //   // 查找对应的数据
  //   for (var j = 0; j < datas.length; j++) {
  //     var check = false
  //     if (datas[j].id === key) check = true

  //     if (check) {
  //       var oldValue = datas[j][fieldName]
  //       var entityStatus = datas[j].entityStatus
  //       datas[j][fieldName] = newValue
  //       if (entityStatus === 'I') { // 当前是插入
  //         datas[j][fieldName] = newValue // 更新修改数据
  //       }
  //       if (entityStatus === 'L') { // 当前是浏览
  //         datas[j].entityStatus = 'U'
  //         this.updateLogs.push({ // 记录日志 log
  //           entityID: key,
  //           fieldname: fieldName,
  //           newValue: newValue,
  //           OldValue: oldValue
  //         })
  //         datas[j][fieldName] = newValue
  //       }
  //       if (entityStatus === 'U') { // 当前是修改
  //         this._logRemoveByField(key, fieldName)
  //         // 防止 A ->B ->C->A的情况
  //         const originalValue = this.getOriginalValue(key, fieldName)
  //         if (originalValue !== newValue) {
  //           this.updateLogs.push({ // 记录日志 log
  //             entityID: key,
  //             fieldname: fieldName,
  //             newValue: newValue,
  //             OldValue: oldValue
  //           })
  //           datas[j][fieldName] = newValue // 更新修改数据
  //         } else {
  //           if (this._logCount(key) === 0) { // 如果没有修改日志
  //             datas[j].entityStatus = 'L'
  //           }
  //         }
  //       }
  //       break// 退出循环
  //     }
  //   }

  //   result = true
  //   return result
  // }

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
  /**
   * 添加值依赖监听
   * @param {*} fieldName 字段名称
   * @param {*} doFunction 执行函数
   */
  addValueChangedListener(fieldName, doFunction) {
    if (fieldName == null) {
      console.warn('fail to add ValueChangedListener: fieldName is null.')
    } else if (doFunction == null || typeof doFunction !== 'function') {
      console.warn('fail to add ValueChangedListener: doFunction is null/not a function.')
    } else {
      this.valueChangedListeners.push({ fieldName: fieldName, doFunction: doFunction })
    }
  }
  /**
   * 触发值变更事件
   * @param {*} fieldName 字段名称
   * @param {*} record 当前记录
   */
  fireValueChangedListener(fieldName, record) {
    for (var i = 0; i < this.valueChangedListeners.length; i++) {
      if (this.valueChangedListeners[i].fieldName === fieldName) {
        var doFunction = this.valueChangedListeners[i].doFunction
        doFunction(record, fieldName)
      }
    }
  }
  /**
   * 检查当前dataset是否有变更过
   */
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

  appendRecord() {
    // ID的获取,后面要处理成标准算法
    var dataId = new UID.UUID().toString()
    var newData = { id: dataId, entityStatus: 'I' }
    newData = this.replaceDefaultValue(newData)
    // 添加代理监控值更新
    var result = this.addProxyOnRecord(newData)
    // var result = this.proxyRecordWithUpdateLog(newData) 新增的数据不需有监控修改日志
    this.currentTable.push(result)
    return result
  }

  /**
   * 清空数据
   */
  emptyData() {
    this.currentTable = []// 当前记录
    this.originalTable = []// 原始记录
    this.updateLogs = [] // 更新记录
  }

  /**
   * 关闭数据集
   */

  close() {
    this._isOpen = false
    this.emptyData()
  }
}
