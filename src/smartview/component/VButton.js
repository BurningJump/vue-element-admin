import { basicConstant } from '../VBasicConstant.js'
import VComponent from '../component/VComponent.js'

export default class VButton extends VComponent {
  constructor(parent) {
    super(parent)
    this.ctype = basicConstant.CMP_BUTTON
  }
}
