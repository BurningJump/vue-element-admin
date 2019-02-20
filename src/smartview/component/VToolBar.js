import { basicConstant } from '../VBasicConstant.js'
import VComponent from './VComponent'

export default class VToolbar extends VComponent {
  showMoreButton;// 是否有更多按钮
  constructor(parent) {
    super(parent)
    this.ctype = basicConstant.CMP_TOOLBAR
  }
}
