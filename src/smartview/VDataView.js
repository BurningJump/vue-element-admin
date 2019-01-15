import VDataStore from '@/smartview/VDataStore.js'
import VComponentSet from '@/smartview/VComponentSet.js'

export default class VDataView {
    // detal的数据存储
    dataStore;

    // 数据UI
    componentSets=[];

    // 过滤函数
    fielters = new Map();

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
    }

  /**
 * 根据datapackage装载数据
 * @param {*} dataPackage
 */
    loadDataByPackage(dataPackage) {
      this.dataStore.loadDataByPackage(dataPackage)
    }

    loadDataByList(datasetName, list) {
      this.dataStore.loadDataByList(datasetName, list)
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
}

