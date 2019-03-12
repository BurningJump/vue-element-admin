export default class VEventBus {
  handleFunc = {};

  constructor() {
    this.handleFunc = {}
  }

  add(type, func) {
    if (this.handleFunc[type]) {
      if (this.handleFunc[type].indexOf(func) === -1) {
        this.handleFunc[type].push(func)
      }
    } else {
      this.handleFunc[type] = [func]
    }
  }

  fire(type, params = null) {
    try {
      const target = this.handleFunc[type]
      if (target === null || target === undefined) { return true }
      const count = target.length
      for (var i = 0; i < count; i++) {
        if (target[i](params) === false) {
          return false
        }
      }

      // if (arguments.length === 1) {
      //   const target = this.handleFunc[type]
      //   const count = target.length
      //   for (var i = 0; i < count; i++) {
      //     target[i](params)
      //   }
      // } else {
      //   const target = this.handleFunc[type]
      //   const index = target.indexOf(func)
      //   if (index === -1) { throw error }
      //   func()
      // }
      return true
    } catch (e) {
      console.error(e.message)
      return false
    }
  }
  remove(type, func) {
    try {
      const target = this.handleFunc[type]
      const index = target.indexOf(func)
      if (index === -1) { throw new Error('can not find func') }
      target.splice(index, 1)
    } catch (e) {
      console.error(e.message)
    }
  }
  once(type, func) {
    this.fire(type, func)
      ? this.remove(type, func) : null
  }
}

export var vEventType = {
  /**
                 * @event beforeNew
                 * 新增业务单据前触发.
                 * 返回false中断，不予通过.
                 */
  beforeNew: 'beforeNew',

  /**
                 * @event afterNew
                 * 新增业务单据后触发.
                 */
  afterNew: 'afterNew',
  /**
                 * @event beforeCopyNew
                 * 复制新增业务单据前触发.
                 * 返回false中断，不予通过.
                 */
  beforeCopyNew: 'beforeCopyNew',

  /**
                 * @event afterCopyNew
                 * 复制新增业务单据后触发.
                 */
  afterCopyNew: 'afterCopyNew',

  /**
                 * @event beforeRefresh
                 * 刷新业务单据前触发.
                 * 返回false中断，不予通过.
                 */
  beforeRefresh: 'beforeRefresh',

  /**
                 * @event afterRefresh
                 * 刷新业务单据后触发.
                 */
  afterRefresh: 'afterRefresh',

  /**
                 * @event beforeAddRow
                 * 增加行记录时触发.
                 * 返回false中断，不予通过.
                 * @param {String} cmpsetName
                 */
  beforeAddRow: 'beforeAddRow',		// (string cmpsetName)

  /**
                 * @event afterAddRow
                 * 增加行记录后触发.
                 * @param {String} cmpsetName
                 */
  afterAddRow: 'afterAddRow',
  /**
                 * @event beforeCopyRow
                 * 复制增加行记录时触发.
                 * 返回false中断，不予通过.
                 * @param {String} cmpsetName
                 */
  beforeCopyRow: 'beforeCopyRow',		// (string cmpsetName)

  /**
                 * @event afterCopyRow
                 * 复制增加行记录后触发.
                 * @param {String} cmpsetName
                 */
  afterCopyRow: 'afterCopyRow',

  /**
                 * @event beforeModify
                 * 业务单据转化修改状态前触发.
                 * 返回false中断，不予通过.
                 */
  beforeModify: 'beforeModify',

  /**
                 * @event afterModify
                 * 业务单据转化修改状态后触发.
                 */
  afterModify: 'afterModify',

  /**
                 * @event beforeSave
                 * 业务单据修改保存前触发.
                 * 返回false中断，不予通过.
                 */
  beforeSave: 'beforeSave',

  /**
                 * @event afterSave
                 * 业务单据保存成功后触发.
                 */
  afterSave: 'afterSave',
  /**
                 * @event beforeDelete
                 * 删除业务单据前触发.
                 * 返回false中断，不予通过.
                 */
  beforeDelete: 'beforeDelete',

  /**
                 * @event afterDelete
                 * 删除业务单据后触发.
                 */
  afterDelete: 'afterDelete',

  /**
                 * @event beforeLoadData
                 * 填充数据前触发.
                 * 返回false中断，不予通过.
                 */
  beforeLoadData: 'beforeLoadData',

  /**
                 * @event afterLoadData
                 * 填充数据后触发.
                 */
  afterLoadData: 'afterLoadData',
  /**
   *
   */
  beforeToBStatus: 'beforeToBStatus',

  afterToBStatus: 'afterToBStatus',

  afterScroll: 'afterScroll',
  componentChanged: 'componentChanged',
  beforeCloseTxn: 'beforeCloseTxn',
  afterCloseTxn: 'afterCloseTxn',
  beforeRefreshAggregationData: 'beforeRefreshAggregationData',

  beforeLoadDataPackage: 'beforeLoadDataPackage',
  afterLoadDataPackage: 'afterLoadDataPackage',
  beforeLoadDataList: 'beforeLoadDataList',
  afterLoadDataList: 'afterLoadDataList',
  activeTab: 'activeTab'

}
