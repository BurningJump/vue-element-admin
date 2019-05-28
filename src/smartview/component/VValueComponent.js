import VComponent from './VComponent.js'
import Vue from 'vue'

export default class VValueComponent extends VComponent {
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

  // 多选选择模型
  enumModel;

  loading = false;// 是否是数据装载状态

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
      this.oldValue = this._value
      this._value = v
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
  loadValue(aValue) {
    this.loading = true
    this._inputValue = aValue
    this._value = aValue
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
    this.inputValue = undefined
  }

  setDefaultReadOnly() {
    this.setReadOnly(this.originalReadOnly)
  }

  setDefaultAllowBlank() {
    this.setAllowBlank(this.originalAllowBlank)
  }

  saveInputValue(val = null) {
    if (val != null) {
      Vue.set(this, this._inputValue, this.value)
      // this._inputValue = val
    }
    // this.value = this.inputValue
    Vue.set(this, this.value, this.inputValue)
  }
}

