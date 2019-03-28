import VEventBus from '@/smartview/VEventBus.js'

export default class VComponent {
  parent;

  componentName;// 组件名称

  componentMeta;// 存储组件的xml定义

  label; // 组件展示
  width; // 展示宽度
  ctype; // 组件类型
  children = []; // 组件类型

  // 是否有效
  enable = true;
  originalEnable = true;

  // 是否隐藏
  hidden;
  originalHidden;

  // 事件处理中心
  eventBus = new VEventBus();

  // 组件所在的form
  form;

  /**
   * 添加监听
   * @param {*} type
   * @param {*} func
   */
  addListener(type, func) {
    return this.eventBus.add(type, func)
  }

  /**
   * api兼容
   * @param {类型} type
   * @param {*} func
   */
  on(type, func) {
    this.addListener(type, func)
  }

  /**
 * 触发事件
 * @param {*} type
 */
  fireEvent(type, param = null) {
    return this.eventBus.fire(type, param)
  }

  /**
 * 触发事件
 * @param {*} type
 */
  fire(type, param = null) {
    return this.fireEvent(type, param)
  }

  constructor(parent = null) {
    this.parent = parent
    if ((this.parent == null || this.parent === undefined) === false) {
      // 如果有添加子组件的方法，执行添加子组件
      if (typeof parent.addChild === 'function') {
        parent.addChild(this)
      }
    }
  }

  addChild(component) {
    component.parent = this
    this.children.push(component)
  }

  findChild(cmpName) {
    var result = null
    for (const cs of this.children) {
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

  // dataList() {
  //   if (this._datasource === null || this._datasource === undefined) {
  //     return this._datasource.dataList
  //   }
  // }
}

