import VValueComponent from './VValueComponent.js'

export default class VDBComponent extends VValueComponent {
  // 对应的数据字段数据源,可用为空
  _datasource = null;

  // 对应的数据字段名称
  fieldName; // 对应的数据字段名称

  get datasource() {
    return this._datasource
  }
  set datasource(value) {
    this._datasource = value
    if (this._datasource !== null || this._datasource !== undefined) {
      this._datasource.addComponent(this)
    }
  }

  getDataSet() {
    if (this._datasource == null || this._datasource === undefined) {
      return null
    } else {
      return this._datasource.getDataSet()
    }
  }

  canSetValue(newValue) {
    return this.datasource.updateFieldValue(this.fieldName, newValue)
  }
}

