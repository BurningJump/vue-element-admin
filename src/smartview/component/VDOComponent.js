import VValueComponent from './VValueComponent.js'

export default class VDOComponent extends VValueComponent {
    // 对应的对象值
    _dataObject = null;
    // 对应的数据字段名称
    fieldName;

    get dataObject() {
      return this._dataObject
    }
    set dataObject(value) {
      this._dataObject = value
    }

    canSetValue(newValue) {
      this._dataObject[this.fieldName] = newValue
      return true
    }
}

