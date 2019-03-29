import VComponent from './VComponent.js'
import { basicConstant } from '../VBasicConstant.js'

export default class VComponentSet extends VComponent {
  // 固定行
  gridFixColumn = 0 ;

  // 类型
  style;

  // 明细字段的名称
  detailIdFieldName;

  // 明细对应的form名称（如com.epower.am.operation.OperationDetail）
  detailFormName;

  constructor(parent) {
    super(parent)
    this.ctype = basicConstant.CMP_COMPONENTSET
  }
}

