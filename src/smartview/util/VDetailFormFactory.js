import VDetailForm from '../bizform/VDetailForm.js'
import VComponentSet from '../component/VComponentSet.js'
import VDBComponent from '../component/VDBComponent.js'
import VButton from '../component/VButton.js'
import VToolbar from '../component/VToolbar.js'
import VPanel from '../component/VPanel.js'

export default class VDetailFormFactory {
  static createInstant(dataView, formMeta) {
    var detailForm = new VDetailForm(dataView)
    detailForm.componentName = formMeta.id

    // 建立Master视图
    var masterPanel = new VPanel(detailForm)
    VDetailFormFactory._initPanel(detailForm, masterPanel, formMeta.masterPage)

    // 1.建立componentSet
    var mComponentSet = new VComponentSet(masterPanel)
    VDetailFormFactory._initComponentSet(detailForm, mComponentSet, formMeta.masterPage.componentSetModel)

    // 2.建立toolbar
    var toolbar = new VToolbar(masterPanel)
    VDetailFormFactory._initToolbar(detailForm, toolbar, formMeta.masterPage.toolbarModel)
    // 建立detialpage视图

    for (var page of formMeta.detailPages) {
      // 建立视图
      var detailPanel = new VPanel(detailForm)
      VDetailFormFactory._initPanel(detailForm, detailPanel, page)

      // 1.建立componentSet
      var dComponentSet = new VComponentSet(detailPanel)
      VDetailFormFactory._initComponentSet(detailForm, dComponentSet, page.componentSetModel)

      //  2.建立toolbar
      var dToolbar = new VToolbar(detailPanel)
      VDetailFormFactory._initToolbar(detailForm, dToolbar, page.toolbarModel)
    }

    return detailForm
  }

  static _initPanel(detailForm, panel, panelMeta) {
    VDetailFormFactory._initComponent(detailForm, panel, panelMeta)
  }

  /**
   * 初始化ComponentSet
     *  @param {*} componentSetMeta 元数据
     */
  static _initComponentSet(detailForm, componentSet, componentSetMeta) {
    VDetailFormFactory._initComponent(detailForm, componentSet, componentSetMeta)

    for (var j = 0; j < componentSetMeta.components.length; j++) {
      var cmp = new VDBComponent(componentSet)
      VDetailFormFactory._initDBComponent(detailForm, cmp, componentSetMeta.components[j])
      cmp.dataSource = componentSet.dataSource
    }
  }

  /**
   * 初始化DBComponent
   * @param {*} component
   * @param {*} aComponentMeta
   */
  static _initDBComponent(form, component, aComponentMeta) {
    VDetailFormFactory._initComponent(form, component, aComponentMeta)

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
  static _initComponent(form, component, aComponentMeta) {
    component.componentName = aComponentMeta.name

    if (aComponentMeta.label !== undefined) {
      component.label = aComponentMeta.label
    }

    if (aComponentMeta.width !== undefined) {
      component.width = aComponentMeta.width
    }

    if (component.ctype !== undefined) {
      component.ctype = aComponentMeta.ctype
    }

    // 可用特性
    component.enable = (aComponentMeta.enable === undefined || aComponentMeta.enable === null) ? true : (aComponentMeta.enable === 'true')
    component.originalEnable = component.enable

    // 可视特性
    component.hidden = (aComponentMeta.hidden === undefined || aComponentMeta.hidden === null) ? false : (aComponentMeta.hidden === 'true')
    component.originalHidden = component.hidden

    // 数据连接
    if (aComponentMeta.dataset !== undefined) {
      var ds = form.parent.getDataSource(aComponentMeta.dataset)
      component.dataSource = ds
      form.addRefDataSource(toolbar.dataSource)
    }

    // 添加form的组件
    form.addComponent(component)
  }

  /**
   * 初始化ComponentSet
     *  @param {*} componentSetMeta 元数据
     */
  static _initToolbar(detailForm, toolbar, toolbarMeta) {
    VDetailFormFactory._initComponent(detailForm, toolbar, toolbarMeta)
    toolbar.showMoreButton = toolbarMeta.showMoreButton
    for (var buttonMeta of toolbarMeta.buttons) {
      var cmp = new VButton(toolbar)
      VDetailFormFactory._initToolbarButton(detailForm, cmp, buttonMeta)
    }
  }
  /**
   * 初始化按钮
     *  @param {*} componentSetMeta 元数据
     */
  static _initToolbarButton(form, cmp, cmpMeta) {
    VDetailFormFactory._initComponent(form, cmp, cmpMeta)
    cmp.fun = cmpMeta.fun
    cmp.iconcls = cmpMeta.iconcls
    cmp.panelType = cmpMeta.panelType
  }
}
