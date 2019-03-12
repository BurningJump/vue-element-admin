import { basicConstant } from '../VBasicConstant.js'
import VComponent from '../component/VComponent.js'

export default class VButton extends VComponent {
  iconcls;// 显示图片
  fun;// 调用功能
  panelType;// 打开方式
  funName;// 功能名称
  funParams; // 功能参数
  constructor(parent) {
    super(parent)
    this.ctype = basicConstant.CMP_BUTTON
  }
}
