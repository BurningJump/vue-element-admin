export default class VComponent {
  componentSet;
  componentName;// 元件名称
  fieldName;

  label;
  width;
  ctype;

  // 是否有效
  enable = true;
  originalEnable = true;

  // 是否隐藏
  hidden;
  originalHidden;

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

  constructor(myParent, componentMeta) {
    this.componentSet = myParent
    this.init(componentMeta)
  }

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
        canUpdate = this.componentSet.updateFieldValue(this.fieldName, v)
      }
      if (canUpdate) {
        this.oldValue = this._value
        this._value = v
      }
    }
  }
  // 初始化
  init(aComponentMeta) {
    this.componentName = aComponentMeta.name
    this.fieldName = aComponentMeta.field
    this.label = aComponentMeta.label
    this.width = aComponentMeta.width
    this.ctype = aComponentMeta.ctype

    if (aComponentMeta.enable === undefined) {
      this.enable = true
      this.originalEnable = true
    } else {
      this.enable = (aComponentMeta.enable === 'true')
      this.originalEnable = (aComponentMeta.enable === 'true')
    }

    // 可视特性
    this.hidden = (aComponentMeta.hidden === 'true')
    this.originalHidden = (aComponentMeta.hidden === 'true')

    this.editable = (aComponentMeta.editable === 'true')
    this.originalEditable = (aComponentMeta.editable === 'true')

    this.readOnly = (aComponentMeta.readOnly === 'true')
    this.originalReadOnly = (aComponentMeta.readOnly === 'true')

    this.allowBlank = (aComponentMeta.allowBlank === 'true')
    this.originalAllowBlank = (aComponentMeta.allowBlank === 'true')







    this.enumModel = aComponentMeta.enumModel
  }

  // 设置是否可以见
  setHidden(isHidden) {
    if (this.hidden !== isHidden) {
      this.hidden = isHidden
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

  setEnable(isEnable) {
    if (this.enable !== isEnable) {
      this.enable = isEnable
    }
  }

  /**
   * 装载数据
   * @param {*} aValue
   */
  loadData(aValue) {
    this.loading = true
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
  /**
    * 设置是否可见
    * @param {*} componentName
    */
  isVisable() {
    return !this.hidden
  }

  /**
   * 返回是否可用
   */
  isEnable() {
    return this.enable
  }

  setDefaultReadOnly() {
    this.setReadOnly(this.originalReadOnly)
  }
  setDefaultHidden() {
    this.setHidden(this.originalHidden)
  }

  setDefaultEnable() {
    this.setDefaultEnable(this.originalEnable)
  }

  saveInputValue() {
    this.value = this.inputValue
  }
}

