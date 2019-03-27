import VComponent from './VComponent.js'
import { basicConstant } from '../VBasicConstant.js'

export default class VTree extends VComponent {
  initUrl = null ;
  initMethod = null ;
  actionUrl = null ;
  method = null ;
  constructor(parent) {
    super(parent)
    this.ctype = basicConstant.CMP_TREE
  }
}
