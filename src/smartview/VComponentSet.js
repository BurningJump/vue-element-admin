import VComponent from '@/smartview/VComponent.js'

export default class VComponentSet {
    dataView;

    name;
    datasetName;
    dataList; // 保存可视数据列表
    rowIndex = -1;// 当前数据展现行号 因为数组是从零开始
    components=[];// 展示对象

    /**
     * 构造函数
     * @param {*} ComponentSetMeta
     */
    constructor(ComponentSetMeta) {
      this.init(ComponentSetMeta)
    }

    /**
     * 初始化
     * @param {*} ComponentSetMeta 元数据
     */
    init(ComponentSetMeta) {
      this.name = ComponentSetMeta.name
      this.datasetName = ComponentSetMeta.dataset
      for (var j = 0; j < ComponentSetMeta.components.length; j++) {
        this.components.push(new VComponent(this, ComponentSetMeta.components[j]))
      }
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

    _loadDataList(filter = null) {
      this.dataList = this.dataView.dataStore.getDataSetData(this.datasetName, filter)
      this.rowIndex = -1
    }

    // 装载数据
    _loadComponentData(index) {
      for (const component of this.components) {
        component.loadData(this.dataList[index][component.fieldName])
      }
    }

    /**
     * 清除元件数据
     */
    _clearComponentData() {
      for (const component of this.components) {
        component.clearData()
      }
    }
    /**
     * 装载可视数据 光标设置为零
     * @param {*} listData
     */
    open(listData) {
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
   * 装载可视数据 光标设置为当前key
   * 如果当前key不在，就取当前行号
   * 如果当前行号不在，就第一行
   * @param {*} listData
   */
    refresh(listData) {

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
      const dataset = this.dataView.dataStore.getDataSet(this.datasetName)
      if (key !== null && dataset !== null) {
        if (dataset.updateByFieldName(key, fieldName, newValue)) { // 修改存储数据
          this.dataList[this.rowIndex][fieldName] = newValue // 修改展示数据
          result = true
        }
      }
      return result
    }
}

