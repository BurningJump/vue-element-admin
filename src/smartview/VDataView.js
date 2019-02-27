import VDataStore from '@/smartview/db/VDataStore.js'
import VEventBus from '@/smartview/VEventBus.js'
import { vEventType } from '@/smartview/VEventBus.js'
import { basicConstant } from '@/smartview/VBasicConstant.js'
import VDataSource from './db/VDataSource.js'
import VDetailFormFactory from './util/VDetailFormFactory.js'

export default class VDataView {
  // 数据存储
  dataStore;

  // 数据源
  dataSources = new Map()

  // 窗体
  forms = [];

  // 事件处理中心
  eventBus = new VEventBus();

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

  static newDetailInstant(detailFormMeta) {
    var detailDataView = new VDataView()
    detailDataView.createDataStore(detailFormMeta.datasetInfo)
    detailDataView.addDetailForm(detailFormMeta)
    return detailDataView
  }

  createDataStore(metaValue) {
    this.dataStore = new VDataStore(metaValue)
    this.dataStore.dataView = this
    this.createDefultDataSource()
  }

  createDefultDataSource() {
    for (const dataset of this.dataStore.datasets) {
      var dataSource = new VDataSource(dataset.name, dataset)
      this.dataSources.set(dataSource.name, dataSource)
    }
  }

  addDetailForm(detailFormMeta) {
    var detalForm = VDetailFormFactory.createInstant(this, detailFormMeta)
    detalForm.initBiz()
    this.forms.push(detalForm)
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
   * 返回数据是否修改过 curd
   */
  isChanged() {
    return this.dataStore.isChanged()
  }

  getDataset(datasetName) {
    return this.dataStore.getDataset(datasetName)
  }

  getDataSource(datasourceName) {
    return this.dataSources.get(datasourceName)
  }

  getCmpByName(componentName) {
    var result = null
    for (const form of this.forms) {
      result = form.getComponent(componentName)
      if (result !== null) {
        return result
      }
    }
    return result
  }

  showDetailForm(formName, formState = basicConstant.VIEWSTATE_VIEW) {
    var detailForm = this.findDetailForm(formName)
    if (detailForm !== null) detailForm.show(formState)
  }

  findDetailForm(formName) {
    var form = this.findForm(formName)
    if (form == null || form === undefined) return null
    if (form.ctype === basicConstant.FORMTYPE_DETAIL) {
      return form
    } else {
      return null
    }
  }

  findForm(formName) {
    for (var form of this.forms) {
      if (form.componentName === formName) {
        return form
      }
    }
  }
}

