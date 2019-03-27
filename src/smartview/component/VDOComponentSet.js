import VComponentSet from './VComponentSet.js'
import { basicConstant } from '../VBasicConstant.js'

export default class VDOComponentSet extends VComponentSet {
  constructor(parent) {
    super(parent)
    this.ctype = basicConstant.CMP_COMPONENTSET
  }

  _dataObject = null;

  get dataObject() {
    return this._dataObject
  }
  set dataObject(value) {
    this._dataObject = value
  }

}

