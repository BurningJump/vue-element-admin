
export default class VDataSource {
  // dataStore
  // datasetName
  name; // 名称
  dataset;// 数据集
  dataList; // 保存可视数据列表
  rowIndex = -1;// 当前数据展现行号,零代表第一行，因为js的数组是从零开始
  filter;// 获取过滤
  components = []; // 数据可视控件
  _isOpen;

  /**
   * 构造函数
   * @param {*} componentSetMeta
   */
  constructor(name, dataset) {
    // this.dataStore = dataStore
    // this.datasetName = datasetName
    this.name = name
    this.dataset = dataset
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
    if (this.dataList == null || this.dataList === undefined) {
      return null
    }
    return this.dataList.length()
  }

  /**
     * 获取当前记录
     */
  getRecord() {
    if (this.dataList == null || this.dataList === undefined) {
      return null
    }
    return this.dataList[this.rowIndex]
  }
  /**
   * 当前光标移到第一笔
   */
  first() {
    if (this.getRecordCount() > 0) {
      this.rowIndex = 0
      this._loadComponentData(this.rowIndex)
      return true
    }
    return false
  }
  /**
   * 当前光标下移
   */
  next() {
    if (this.rowIndex < this.getRecordCount()) {
      this.rowIndex++
      this._loadComponentData(this.rowIndex)
      return true
    }
    return false
  }

  /**
  * 当前光标上移
  */
  proio() {
    if (this.rowIndex > 0) {
      this.rowIndex--
      this._loadComponentData(this.rowIndex)
      return true
    }
    return false
  }

  // _loadDataList(filter = null) {
  //   this.dataList = this.dataView.dataStore.getDatasetData(this.datasetName, filter)
  //   this.rowIndex = -1
  // }

  // 装载元件数据
  _loadComponentData(index) {
    for (const component of this.components) {
      if (component.fieldName !== undefined) {
        component.loadData(this.dataList[index][component.fieldName])
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
    this.dataList = listData
    if (this.dataList !== null || this.dataList !== undefined) {
      if (this.dataList.length > 0) {
        this.rowIndex = 0
        this._loadComponentData(this.rowIndex)
      } else {
        this.rowIndex = -1
        this._clearComponentData()
      }
    }
  }

  /**
   * 根据过滤条件打开数据
   *    * @param {*} filter
   */
  open(filter = null) {
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
    var curIndex = this.rowIndex
    var data = this.dataset.getDatasetData(this.datasetName, this.filter)
    this.dataList = data
    if (this.dataList !== null || this.dataList !== undefined) {
      if (this.dataList.length > 0) {
        // TODO  这里有Bug，需要按Key重新定位index
        this.rowIndex = curIndex
        this._loadComponentData(this.rowIndex)
      } else {
        this.rowIndex = -1
        this._clearComponentData()
      }
    }
  }

  // 是否最底
  isEof() {
    if (this.dataList != null && this.dataList !== undefined && this.dataList.length > 0) {
      return (this.rowIndex === this.dataList.length)
    }
    return false
  }

  isfirst() {
    if (this.dataList != null && this.dataList !== undefined && this.dataList.length > 0) {
      return (this.rowIndex === 0)
    }
    return false
  }

  updateFieldValue(fieldName, newValue) {
    var result = false
    // 修改dataset的数据
    const key = this.dataList[this.rowIndex]['id']
    const dataset = this.getDataSet()
    if (key !== null && dataset !== null) {
      if (dataset.updateByFieldName(key, fieldName, newValue)) { // 修改存储数据
        this.dataList[this.rowIndex][fieldName] = newValue // 修改展示数据
        result = true
      }
    }
    return result
  }

  addComponent(component) {
    this.components.push(component)
  }

  getDataSet() {
    return this.dataset
  }
}

