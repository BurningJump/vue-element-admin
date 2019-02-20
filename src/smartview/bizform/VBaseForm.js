import { basicConstant } from '@/smartview/VBasicConstant.js'
import VForm from '../component/VForm'

export default class VBaseForm extends VForm {
  // 所有有关的数据源
  refDataSources = new Map();
  // form的元数据定义
  formMeta;

  constructor(parent) {
    super(parent)
    this.ctype = basicConstant.FORMTYPE_BASE
  }

  /**
       * 返回数据是否修改过 curd
       */
  isChanged() {
    for (const ds of this.dataSources) {
      if (ds.isChanged() === true) return true
    }
    return false
  }

  show() {
    super.show()
  }

  openALLDataSource() {
    for (const ds of this.refDataSources.values()) {
      ds.open()
    }
  }

  addRefDataSource(dataSource) {
    if (dataSource !== undefined || dataSource === null) {
      this.refDataSources.set(dataSource.name, dataSource)
    }
  }
}
