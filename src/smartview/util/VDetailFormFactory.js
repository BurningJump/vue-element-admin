import VDetailForm from '../bizform/VDetailForm.js'
import VComponentSet from '../component/VComponentSet.js'
import VDBComponent from '../component/VDBComponent.js'

export default class VDetailFormFactory {
  static createInstant(dataView, formMeta) {
    var detailForm = new VDetailForm(dataView)
    detailForm.componentName = formMeta.id

    // 建立Master视图
    // 1.建立componentSet
    var mComponentSet = new VComponentSet(detailForm)
    VDetailFormFactory._initComponentSet(detailForm, mComponentSet, formMeta.masterPage.componentSetModel)
    detailForm.addChild(mComponentSet)
    // TODO 2.建立toolbar

    // 建立detialpage视图
    for (var j = 0; j < formMeta.detailPages.length; j++) {
      var dComponentSet = new VComponentSet(detailForm)
      VDetailFormFactory._initComponentSet(detailForm, dComponentSet, formMeta.detailPages[j].componentSetModel)
      detailForm.addChild(dComponentSet)
    }
    //
    return detailForm
  }
  /**
   * 初始化ComponentSet
     *  @param {*} componentSetMeta 元数据
     */
  static _initComponentSet(detailForm, componentSet, componentSetMeta) {
    VDetailFormFactory._initComponent(componentSet, componentSetMeta)
    componentSet.componentName = componentSetMeta.name
    var ds = detailForm.parent.getDefaultDataSource(componentSetMeta.dataset)
    componentSet.dataSource = ds
    detailForm.addRefDataSource(componentSet.dataSource)
    for (var j = 0; j < componentSetMeta.components.length; j++) {
      var cmp = new VDBComponent(componentSet)
      cmp.dataSource = componentSet.dataSource
      VDetailFormFactory._initDBComponent(cmp, componentSetMeta.components[j])
      componentSet.addChild(cmp)
      detailForm.addComponent(cmp)
    }
  }

  /**
   * 初始化DBComponent
   * @param {*} component
   * @param {*} aComponentMeta
   */
  static _initDBComponent(component, aComponentMeta) {
    VDetailFormFactory._initComponent(component, aComponentMeta)
    component.componentName = aComponentMeta.name
    component.fieldName = aComponentMeta.field

    component.editable = (aComponentMeta.editable === undefined) ? true : (aComponentMeta.editable === 'true')
    component.originalEditable = component.editable

    component.readOnly = (aComponentMeta.readOnly === undefined) ? false : (aComponentMeta.readOnly === 'true')
    component.originalReadOnly = component.readOnly

    component.allowBlank = (aComponentMeta.allowBlank === undefined) ? false : (aComponentMeta.allowBlank === 'true')
    component.originalAllowBlank = component.allowBlank
    component.enumModel = aComponentMeta.enumModel
  }

  // 初始化
  static _initComponent(component, aComponentMeta) {
    component.componentName = aComponentMeta.name
    component.label = aComponentMeta.label
    component.width = aComponentMeta.width
    component.ctype = aComponentMeta.ctype

    // 可用特性
    component.enable = (aComponentMeta.enable === undefined || aComponentMeta.enable === null) ? true : (aComponentMeta.enable === 'true')
    component.originalEnable = component.enable

    // 可视特性
    component.hidden = (aComponentMeta.hidden === undefined || aComponentMeta.hidden === null) ? false : (aComponentMeta.hidden === 'true')
    component.originalHidden = component.hidden
  }
}
