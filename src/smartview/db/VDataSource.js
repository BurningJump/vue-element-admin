
export default class VDataSource {
  name; // 名称

  _isOpen;

  _type = 'dataset';// dataset模式 还是 对象模式 dataset、object

  // 单记录模式
  _record;

  dataset;// 数据集
  dataList=[]; // 保存可视数据列表
  rowIndex;// 当前数据展现行号,零代表第一行，因为js的数组是从零开始
  filter;// 获取过滤

  components = []; // 数据可视控件

  /**
   * 构造函数
   * @param {*} componentSetMeta
   */
  constructor(name, dataset = null) {
    // this.dataStore = dataStore
    // this.datasetName = datasetName
    this.name = name

    if (dataset === null) {
      // 如果数据集为空，表示从对象中取
      this._type = 'object'
      this._record = {}
    } else {
      // 如果数据集，表示从数据集中取
      this._type = 'dataset'
      this.dataset = dataset
      this.rowIndex = -1 // 当前数据展现行号,零代表第一行，因为js的数组是从零开始
    }
  }

  get record() {
    if (this._type === 'object') {
      return this._record
    } else {
      if (this.dataList == null || this.dataList === undefined) {
        return null
      }
      return this.dataList[this.rowIndex]
    }
  }
  set record(value) {
    if (this._type === 'object') {
      this._record = value
    } else {
      this.dataList[this.rowIndex] = value
    }
  }

  get isOpen() {
    return this._isOpen
  }
  set isOpen(value) {
    this._isOpen = value
  }
  /**
   * 获取可见数据列表的个数
   */
  getRecordCount() {
    if (this._type === 'object') {
      return 1
    } else {
      if (this.dataList == null || this.dataList === undefined) {
        return 0
      } else {
        return this.dataList.length
      }
    }
  }

  /**
     * 获取当前记录
     */
  getRecord() {
    return this.record
  }
  /**
   * 当前光标移到第一笔
   */
  first() {
    if (this._type === 'object') return false
    if (this.getRecordCount() > 0) {
      return this.scrollTo(0)
    }
    return false
  }
  /**
   * 当前光标下移
   */
  next() {
    if (this._type === 'object') return false
    if (this.rowIndex < this.getRecordCount()) {
      return this.scrollTo(this.rowIndex + 1)
    }
    return false
  }

  /**
  * 当前光标上移
  */
  proio() {
    if (this._type === 'object') return false
    if (this.rowIndex > 0) {
      return this.scrollTo(this.rowIndex - 1)
    }
    return false
  }
  /**
  * 当前光标移到第几行
  */
  scrollTo(newRowIndex) {
    if (this._type === 'object') return false
    if (newRowIndex > this.getRecordCount() - 1) return false
    if (this.rowIndex === newRowIndex) return true
    this.rowIndex = newRowIndex
    this._loadComponentData(this.rowIndex)
    return true
  }

  // _loadDataList(filter = null) {
  //   this.dataList = this.dataView.dataStore.getDatasetData(this.datasetName, filter)
  //   this.rowIndex = -1
  // }

  // 装载元件数据
  _loadComponentTableData(index) {
    for (const component of this.components) {
      if (component.loadData !== undefined) {
        if (index === -1) {
          component.loadData(null)
        } else {
          component.loadData(this.record)
        }
      }
    }
  }

  // 装载元件数据
  _loadComponentData() {
    for (const component of this.components) {
      if (component.loadData !== undefined) {
        component.loadData(this.record)
      }
    }
  }

  /**
   * 清除元件数据
   */
  _clearComponentData() {
    for (const component of this.components) {
      if (component.fieldName !== undefined) {
        component.clearData()
      }
    }
  }
  /**
   * 装载可视数据 光标设置为零
   * @param {*} listData
   */
  openByDataList(listData) {
    if (this._type === 'object') return false
    this.dataList = listData
    if (this.dataList !== null || this.dataList !== undefined) {
      if (this.dataList.length > 0) {
        this.rowIndex = 0
        this._loadComponentTableData(this.rowIndex)
      } else {
        this.rowIndex = -1
        this._clearComponentData()
      }
    }
    this.isOpen = true
  }

  /**
   * 装载可视数据 光标设置为零
   * @param {*} objectValue
   */
  openByObject(objectValue) {
    this._record = objectValue
    this._loadComponentData()
    this.isOpen = true
  }

  /**
   * 根据过滤条件打开数据
   *    * @param {*} filter
   */
  open(filter = null) {
    if (this._type === 'object') return false
    this.filter = filter
    var data = this.dataset.getDatasetData(this.datasetName, this.filter)
    this.openByDataList(data)
  }

  /**
   * 装载可视数据 光标设置为当前key
   * 如果当前key不在，就取当前行号
   * 如果当前行号不在，就第一行
   * @param {*} listData
   */
  refresh() {
    if (this._type === 'object') {
      return this._loadComponentData()
    } else {
      return this._refreshByList()
    }
  }

  _refreshByList() {
    var curIndex = this.rowIndex
    var data = this.dataset.getDatasetData(this.datasetName, this.filter)
    this.dataList = data
    if (this.dataList !== null || this.dataList !== undefined) {
      if (this.dataList.length > 0) {
        // TODO  这里有Bug，需要按Key重新定位index
        this.rowIndex = curIndex
        this._loadComponentTableData(this.rowIndex)
      } else {
        this.rowIndex = -1
        this._clearComponentData()
      }
    }
  }

  isChanged() {
    if (this._type === 'object') {
      return false
    } else return this.dataset.isChanged()
  }

  // 是否最底
  isEof() {
    if (this._type === 'object') return false
    if (this.dataList != null && this.dataList !== undefined && this.dataList.length > 0) {
      return (this.rowIndex === this.dataList.length)
    }
    return false
  }

  isfirst() {
    if (this._type === 'object') return false
    if (this.dataList != null && this.dataList !== undefined && this.dataList.length > 0) {
      return (this.rowIndex === 0)
    }
    return false
  }

  updateFieldValue(fieldName, newValue) {
    this.record[fieldName] = newValue // 修改展示数据
    return true
    // var result = false
    // // 修改dataset的数据
    // const key = this.record['id']
    // const dataset = this.getDataSet()
    // if (key !== null && dataset !== null) {
    //   if (dataset.updateByFieldName(key, fieldName, newValue)) { // 修改存储数据
    //     this.record[fieldName] = newValue // 修改展示数据
    //     result = true
    //   }
    // }
    // return result
  }

  addComponent(component) {
    this.components.push(component)
  }

  getDataSet() {
    if (this._type === 'object') return null
    return this.dataset
  }

  emptyData(filter = null) {
    if (this._type === 'object') {
      this._record = {}
    } else {
      return this.emptyListData(filter)
    }
  }
  emptyListData(filter = null) {
    this.filter = filter
    // this.dataList =[] handsontable无法清空数据
    if (this.dataList != null) {
      this.dataList.splice(0, this.dataList.length)
    }

    this.rowIndex = -1
    this._clearComponentData()
  }

  appendRecord() {
    if (this._type === 'object') return false
    var record = this.dataset.appendRecord()
    this.dataList.push(record)
    this.rowIndex = this.dataList.length - 1
    this._loadComponentData(this.rowIndex)
  }

  deleteRecord() {
    if (this._type === 'object') {
      this._record = {}
      return true
    }

    var deleteRecord = this.getRecord()
    if (this.dataset.deleteRecord(deleteRecord['id']) === true) {
      this.dataList.splice(this.rowIndex, 1)
      this.rowIndex = this.rowIndex - 1
      this._loadComponentData(this.rowIndex)
    }
  }
}

