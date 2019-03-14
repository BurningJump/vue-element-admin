import VComponent from './VComponent.js'

export default class VDBComponent extends VComponent {

  fieldName; // 对应的数据字段名称

  // 允许为空
  allowBlank;
  originalAllowBlank

  // 只读
  readOnly;
  originalReadOnly;

  // 是否手工输入值、选择值
  editable;
  originalEditable;

  /** 输入值,用于绑定Vue。
   * 因为Vue修改时会立刻进行业务保存,从业务的角度,需要修改完成后,进行业务保存
   * 所以在失去焦点时，做业务保存。
   * */
  _inputValue;

  // 当前值
  _value;
  // 前次值
  oldValue;
  // 原始值
  originalValue;

  loading = false;// 是否是数据装载状态

  // 多选选择模型
  enumModel;

  get inputValue() {
    return this._inputValue
  }

  set inputValue(v) {
    this._inputValue = v
  }

  get value() {
    return this._value
  }

  set value(v) {
    if (this._value !== v) {
      let canUpdate = true
      if (this.loading === false) {
        canUpdate = this.dataSource.updateFieldValue(this.fieldName, v)
      }
      if (canUpdate) {
        this.oldValue = this._value
        this._value = v
      }
    }
  }

  // 设置是否可以编辑
  setReadOnly(isReadOnly) {
    if (this.readOnly !== isReadOnly) {
      this.readOnly = isReadOnly
    }
  }
  setEditable(isEditable) {
    if (this.isEditable !== isEditable) {
      this.editable = isEditable
    }
  }
  setAllowBlank(isAllowBlank) {
    if (this.allowBlank !== isAllowBlank) {
      this.allowBlank = isAllowBlank
    }
  }
  /**
   * 装载数据
   * @param {*} aValue
   */
  loadData(aValue) {
    this.loading = true
    //TODO 2019-03-13 xiao  在新增记录时，如果是多选模式，但未指定[]类型时，将无法绑定数据
    //如果是多选 this.inputValue = [].concat(aValue)
    //如果是单选 this.inputValue = aValue
    this.inputValue = aValue
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

  setDefaultReadOnly() {
    this.setReadOnly(this.originalReadOnly)
  }

  setDefaultAllowBlank() {
    this.setAllowBlank(this.originalAllowBlank)
  }

  saveInputValue(val=null) {
    if(val!=null)
      this._inputValue=val;
    this.value = this.inputValue
  }
}

