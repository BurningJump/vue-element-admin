import { basicConstant } from '../VBasicConstant.js'
import VComponent from '../component/VComponent.js'

export default class VButton extends VComponent {
  iconcls;// 显示图片
  fun;// 调用功能
  panelType;// 打开方式
  funName;// 功能名称
  funParams; // 功能参数

  _datasource = null;// 数据源,可用为空


  constructor(parent) {
    super(parent)
    this.ctype = basicConstant.CMP_BUTTON
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
