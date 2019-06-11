import VValueComponent from './VValueComponent.js'

export default class VDBComponent extends VValueComponent {
  // 对应的数据字段数据源,可用为空
  _datasource = null;

  // 对应的数据字段名称
  fieldName;

  get value() {
    return this._value
  }

  set value(v) {
    if (this.value !== v) {
      super.value = v
      if (this._datasource !== null) {
        this._datasource.record[this.fieldName] = v
      }
    }
  }

  loadData(record) {
    return super.loadValue( record[this.fieldName])
  }

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

}

