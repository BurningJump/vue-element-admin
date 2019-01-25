
export default class VComponent {
  parent;
  componentName;// 组件名称
  label; // 组件展示
  width; // 展示宽度
  ctype; // 组件类型
  children = []; // 组件类型

  _dataSource = null;// 数据源,可用为空

  // 是否有效
  enable = true;
  originalEnable = true;

  // 是否隐藏
  hidden;
  originalHidden;

  constructor(parent) {
    this.parent = parent
  }

  dataList() {
    if (this._dataSource === null || this._dataSource === undefined) {
      return this._dataSource.dataList
    }
  }

  addChild(component) {
    component.parent = this
    this.children.push(component)
  }

  findChild(cmpName) {
    var result = null
    for (const cs of this.components) {
      if (cs.componentName === cmpName) {
        result = cs
        break
      }
    }
    return result
  }

  // 设置是否可以见
  setHidden(isHidden) {
    if (this.hidden !== isHidden) {
      this.hidden = isHidden
    }
  }

  setEnable(isEnable) {
    if (this.enable !== isEnable) {
      this.enable = isEnable
    }
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

  setDefaultHidden() {
    this.setHidden(this.originalHidden)
  }

  setDefaultEnable() {
    this.setEnable(this.originalEnable)
  }

  get dataSource() {
    return this._dataSource
  }
  set dataSource(value) {
    this._dataSource = value
    if (this._dataSource !== null || this._dataSource !== undefined) {
      this._dataSource.addComponent(this)
    }
  }

  getDataSet() {
    if (this._dataSource == null || this._dataSource == undefined) {
      return null
    } else {
      return this._dataSource.getDataSet()
    }
  }
}

