import { basicConstant } from '../VBasicConstant.js'
import VComponent from './VComponent'

export default class VToolbar extends VComponent {
  constructor(parent) {
    super(parent)
    this.ctype = basicConstant.CMP_TOOLBAR
  }
}
