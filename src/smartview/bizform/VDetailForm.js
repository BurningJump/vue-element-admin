import { basicConstant } from '@/smartview/VBasicConstant.js'
import VBaseForm from './VBaseForm'

export default class VDetailForm extends VBaseForm {
  // 当前状态
  state = basicConstant.VIEWSTATE_VIEW;

  constructor(parent) {
    super(parent)
    this.ctype = basicConstant.FORMTYPE_DETAIL
  }
  /**
 * 设置DataView的UI状态
 * @param {状态} state
 */
  setUIState(state) {
    this.state = state
    this._setComponentSetUIState()
  }
  /**
 * 设置控件的状态
 */
  _setComponentSetUIState() {
    if (this.state === basicConstant.VIEWSTATE_VIEW) { // 查看状态下只是看看
      // 设置默认状态
      for (const component of this.components.values()) {
        component.setDefaultEnable()
        component.setDefaultHidden()
        if (typeof component.setReadOnly === 'function') {
          component.setReadOnly(true)// 查看模式下只可以查看
        }

        // 执行可用依赖
        this.parent.enableDependenceControl(component)
        // 执行隐藏依赖
        this.parent.hiddenDependenceControl(component)
      }
    } else { // 新增和修改模式
      // 设置默认状态
      for (const component of this.components.values()) {
        component.setDefaultEnable()
        component.setDefaultHidden()
        if (typeof component.setDefaultReadOnly === 'function') {
          component.setDefaultReadOnly()
        }
        // 执行可用依赖
        this.parent.enableDependenceControl(component)
        // 执行只读依赖
        this.parent.readOnlyDependenceControl(component)
        // 执行隐藏依赖
        this.parent.hiddenDependenceControl(component)
      }
    }
  }

  show(state) {
    super.show()
    this.openALLDataSource()
    this.setUIState(state)
  }
}
