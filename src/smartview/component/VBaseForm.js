import { basicConstant } from '@/smartview/VBasicConstant.js'
import VForm from './VForm'

export default class VBaseForm extends VForm {
  // dataSource
  refDataSources = new Map();

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
    this.refDataSources.set(dataSource.name , dataSource)
  }
}
