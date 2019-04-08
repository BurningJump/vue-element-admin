import VComponent from './VComponent.js'
import { basicConstant } from '../VBasicConstant.js'

export default class VTabSet extends VComponent {
  // 当前活动的TabName
  _activeTabName;

  // 默认的Tab
  defaultTabName;

  // tab项目
  tabs = [];

  get activeTabName() {
    return this._activeTabName
  }
  set activeTabName(value) {
    this._activeTabName = value
  }

  constructor(parent) {
    super(parent)
    this.ctype = basicConstant.CMP_TABSET
  }

  addTab(name, label, viewName, iconcls) {
    this.tabs.push({ name: name, label: label, viewName: viewName, iconcls: iconcls })
  }

  getTab(tabName) {
    for (var tab of this.tabs) {
      if (tab.name = tabName) {
        return tab
      }
    }
    return null
  }
  getActiveViewName() {
    if (this.getTab(this._activeTabName) !== null) {
      return this.getTab(this._activeTabName).viewName
    }
    return null
  }
}

