import VComponent from './VComponent.js'
import { basicConstant } from '../VBasicConstant.js'

export default class VPanel extends VComponent {
  constructor(parent) {
    super(parent)
    this.ctype = basicConstant.CMP_PANEL
  }
}
