import VComponent from './VComponent.js'
import { basicConstant } from '../VBasicConstant.js'

export default class VComponentSet extends VComponent {
  constructor(parent) {
    super(parent)
    this.ctype = basicConstant.CMP_COMPONENTSET
  }
}

