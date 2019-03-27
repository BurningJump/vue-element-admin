import VComponent from './VComponent.js'
import { basicConstant } from '../VBasicConstant.js'

export default class VComponentSet extends VComponent {
  constructor(parent) {
    super(parent)
    this.ctype = basicConstant.CMP_COMPONENTSET
  }

  _datasource = null;// 数据源,可用为空

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

