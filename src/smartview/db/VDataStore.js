import request from '@/utils/request'

export default class VDataStore {
  // 数据存放
  datasets = [];
  // 对应的视图：detail、list等form
  dataView = null;

  commitToDB(AUrl, AParams = null) {
    return new Promise(
      (resolve, reject) => {
        request({
          url: AUrl,
          params: AParams,
          method: 'get'
        }).then(resData => {
          resolve(resData)
        }).catch(err => {
          console.log(err.message)
        })
      })
  }
  getDataset(datasetName) {
    for (var j = 0; j < this.datasets.length; j++) {
      if (this.datasets[j].name === datasetName) {
        return this.datasets[j]
      }
    }
    return null
  }

  isChanged() {
    for (const ds of this.datasets) {
      if (ds.isChanged() === true) return true
    }
    return false
  }

  getDatasetData(dataSetName, filter = null) {
    for (var j = 0; j < this.datasets.length; j++) {
      if (this.datasets[j].name === dataSetName) {
        return this.datasets[j].getDatasetData(filter)
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

  /**
	 * 設置默認值
	 * @param datasetName
	 * @param fieldName
	 * @param value
	 */
  setDefaultValue(datasetName, fieldName, value) {
    const ds = this.getDataset(datasetName)
    if (ds !== null) ds.defaultValue(fieldName, value)
  }

  /**
   * 清空数据集
   * @param {} datasetName
   */
  emptyDataSet(datasetName = null) {
    for (const ds of this.datasets) {
      if (datasetName == null) {
        ds.emptyData()
      } else if (ds.name === datasetName) {
        ds.emptyData()
      }
    }
  }

  /**
   * 删除数据集
   * @param {} datasetName
   */
  deleteDataSet(datasetName = null) {
    for (const ds of this.datasets) {
      if (datasetName == null) {
        ds.deleteAllRecord()
      } else if (ds.name === datasetName) {
        ds.deleteAllRecord()
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

