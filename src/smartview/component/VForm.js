import VComponent from '@/smartview/component/VComponent.js'
import { basicConstant } from '@/smartview/VBasicConstant.js'

export default class VForm extends VComponent {
  // form上面的所有组件
  components = new Map();

  /**
   *
   * @param {DataView} parent
   */
  constructor(parent) {
    super(parent)
    this.ctype = basicConstant.FORMTYPE_FORM
  }

  show() {

  }

  getComponent(componentName) {
    return this.components.get(componentName)
  }

  addComponent(component) {
    return this.components.set(component.componentName, component)
  }

  addChild(component) {
    super.addChild(component)
    this.addComponent(component)
  }
}
