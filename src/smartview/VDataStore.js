import VDataSet from '@/smartview/VDataSet.js'

export default class VDataStore {
  // 数据存放
  datasets = [];

  // 数据source
  dataView;

  constructor(datastoreMeta) {
    this.init(datastoreMeta)
  }

  getDataSet(datasetName) {
    for (var j = 0; j < this.datasets.length; j++) {
      if (this.datasets[j].name === datasetName) {
        return this.datasets[j]
      }
    }
    return null
  }

  getDataSetData(dataSetName, filter = null) {
    for (var j = 0; j < this.datasets.length; j++) {
      if (this.datasets[j].name === dataSetName) {
        return this.datasets[j].getDataSetData(filter)
      }
    }
  }

  init(dataStoreMeta) {
    for (var j = 0; j < dataStoreMeta.datasets.length; j++) {
      if (dataStoreMeta.datasets[j]) {
        this.datasets.push(new VDataSet(dataStoreMeta.datasets[j]))
      }
    }
  }

  // 装载DataPackage数据
  loadDataByPackage(ADataPackage) {
    for (const ds of this.datasets) {
      ds.loadData(ADataPackage)
    }
  }

  // 装载List数据
  loadDataByList(datasetName, list) {
    for (const ds of this.datasets) {
      if (ds.name === datasetName) {
        ds.loadList(list)
      }
    }
  }

  // 修改DataPackage的Dataset数据
  updateDPFieldByName(datasetName, key, fieldname, newValue) {
    // 寻找DataSet的记录

    // 更新修改数据

    // 记录日志 log
  }

  updateDPFieldByNames(datasetName, key, fieldNames, newValues) {
    // 寻找DataSet的记录

    // 更新修改数据

    // 记录日志 log
  }

  // 修改DataPackage的Dataset数据
  updateListFieldByName(datasetName, key, fieldname, newValue) {
    // 寻找DataSet的记录

    // 更新修改数据

    // 记录日志 log
  }

  updateListFieldByNames(datasetName, key, fieldNames, newValues) {
    // 寻找DataSet的记录

    // 更新修改数据

    // 记录日志 log
  }

  // 修改Dataset数据 单个字段的单个数据
  updateFieldByName(datasetName, key, fieldname, newValue) {
    // 寻找DataSet的记录

    // 更新修改数据

    // 记录日志 log
  }

  // 修改Dataset数据 多个字段的多个数据
  updateFieldByNames(datasetName, key, fieldNames, newValues) {
    // 寻找DataSet的记录

    // 更新修改数据

    // 记录日志 log
  }
  deleteRecord(datasetName, key) {
    // 寻找DataSet的记录

    // 更新修改数据

    // 记录日志 log
  }

  insertRecord(datasetName, fieldNames, newValues) {

    // 更新修改数据

    // 记录日志 log

  }

  // 是否有记录
  hasRecord(dataSetName) {
    return true
  }

  // 记录数量
  recordCount(dataSetName) {
    return 0
  }
}

