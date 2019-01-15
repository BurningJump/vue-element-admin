export default class VComponent {
  componentSet;
  componentName;// 元件名称
  fieldName;

  label;
  width;
  ctype;

  hidden;
  editable;
  allowBlank;
  readOnly;

  _value;
  oldValue;
  originalValue;

  loading = false;// 是否是数据装载状态

  enumModel;

  constructor(myParent, componentMeta) {
    this.componentSet = myParent
    this.init(componentMeta)
  }

  get value() {
    return this._value
  }

  set value(v) {
    let canUpdate = true
    if (this.loading === false) {
      canUpdate = this.componentSet.updateFieldValue(this.fieldName, v)
    }
    if (canUpdate) {
      this.oldValue = this._value
      this._value = v
    }
  }
  // 初始化
  init(aComponentMeta) {
    this.componentName = aComponentMeta.name
    this.fieldName = aComponentMeta.field
    this.label = aComponentMeta.label
    this.width = aComponentMeta.width
    this.ctype = aComponentMeta.ctype

    this.hidden = aComponentMeta.hidden
    this.editable = aComponentMeta.editable
    this.allowBlank = aComponentMeta.allowBlank
    this.readOnly = aComponentMeta.readOnly

    this.enumModel = aComponentMeta.enumModel
  }

  // 设置是否可以见
  setVisable(isVisable) {

  }

  // 设置是否可以编辑
  setReadOnly(isReadOnly) {

  }

  /**
   * 装载数据
   * @param {*} aValue
   */
  loadData(aValue) {
    this.loading = true
    this.value = aValue
    this.oldValue = aValue
    this.originalValue = aValue
    this.loading = false
  }

  /**
   * 清除数据
   */
  clearData() {
    this.oldValue = undefined
    this._value = undefined
    this.originalValue = undefined
  }
  /**
    * 设置是否可见
    * @param {*} componentName
    */
  isVisable(componentName) {
    return true
  }

  isEnable(componentName) {
    return true
  }
}

