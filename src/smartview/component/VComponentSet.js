import VComponent from '@/smartview/component/VComponent.js'
import { basicConstant } from '@/smartview/VBasicConstant.js'

export default class VComponentSet extends VComponent {
  constructor(parent) {
    super(parent)
    this.ctype = basicConstant.CMP_COMPONENTSET
  }

  // /**
  //    * 获取可见数据列表的个数
  //    */
  // getRecordCount() {
  //   return this.dataSource.getRecordCount()
  // }

  // /**
  //    * 获取当前记录
  //    */
  // getRecord() {
  //   return this.dataSource.getRecord()
  // }

  // /**
  //    * 当前光标下移
  //    */
  // next() {
  //   return this.dataSource.next()
  // }

  // /**
  //   * 当前光标上移
  //   */
  // proio() {
  //   return this.dataSource.proio()
  // }

  // _loadDataList(filter = null) {
  //   this.dataList = this.dataView.dataStore.getDatasetData(this.datasetName, filter)
  //   this.rowIndex = -1
  // }

  // /**
  //    * 装载可视数据 光标设置为零
  //    * @param {*} listData
  //    */
  // openByData(listData) {
  //   this.dataList = listData
  //   if (this.dataList !== null || this.dataList !== undefined) {
  //     if (this.dataList.length > 0) {
  //       this.rowIndex = 0
  //       this._loadComponentData(this.rowIndex)
  //     } else {
  //       this.rowIndex = -1
  //       this._clearComponentData()
  //     }
  //   }
  // }

  // open(filter = null) {
  //   this.dataView.open(this.datasetName, filter)
  // }

  // /**
  //  * 装载可视数据 光标设置为当前key
  //  * 如果当前key不在，就取当前行号
  //  * 如果当前行号不在，就第一行
  //  * @param {*} listData
  //  */
  // refresh() {

  // }

  // // 是否最底
  // isEof() {
  //   if (this.dataList != null && this.dataList !== undefined && this.dataList.length > 0) {
  //     return (this.rowIndex === this.dataList.length)
  //   }
  //   return false
  // }

  // isfirst() {
  //   if (this.dataList != null && this.dataList !== undefined && this.dataList.length > 0) {
  //     return (this.rowIndex === 0)
  //   }
  //   return false
  // }

  // loadDataToDataSet(list) {
  //   this.dataSource.dataView.loadDataByList(this.datasetName, list)
  // }

  // getCmpByName(cmpName) {
  //   var result = null
  //   for (const cs of this.components) {
  //     if (cs.componentName === cmpName) {
  //       result = cs
  //       break
  //     }
  //   }
  //   return result
  // }

  // setReadOnly(isReadOnly) {
  //   for (const cs of this.components) {
  //     cs.setReadOnly(isReadOnly)
  //   }
  // }
  // setEnable(isEnable) {
  //   for (const cs of this.components) {
  //     cs.setEnable(isEnable)
  //   }
  // }
  // setDefaultReadOnly(isReadOnly) {
  //   for (const cs of this.components) {
  //     cs.setDefaultReadOnly()
  //   }
  // }
  // setDefaultHidden(isHidden) {
  //   for (const cs of this.components) {
  //     cs.setDefaultHidden()
  //   }
  // }
}

