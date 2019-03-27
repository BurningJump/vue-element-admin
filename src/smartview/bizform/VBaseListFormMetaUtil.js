/**
 * 处理modelConfig相关工具类
 */

import VBaseFormMetaUtil from './VBaseFormMetaUtil.js'

export default class VBaseListFormMetaUtil extends VBaseFormMetaUtil {
  /**
	 * 根据viewId和cmpSetName中获取该页面的配置信息
	 * @param config
	 * @param cmpSetName
	 * @returns
	 */
  getPageConfigByCmpSet(cmpSetName) {
    var me = this
    var pageConfig = null
    var mastPageConfig = me.modelConfig.masterPage
    if (mastPageConfig.componentSetModel != null && mastPageConfig.componentSetModel.name === cmpSetName) {
      pageConfig = mastPageConfig
    } else {
      var detailPagesConfig = me.modelConfig.detailPages
      var i = 0
      for (i = 0; i < detailPagesConfig.length; i++) {
        if (detailPagesConfig[i].componentSetModel != null && detailPagesConfig[i].componentSetModel.name === cmpSetName) {
          pageConfig = detailPagesConfig[i]
          break
        }
      }
    }
    return pageConfig
  }

  /* 根据pageName中获取该页面的配置信息
  * @param config
  * @param pageName
  * @returns
  */
  getPageConfigByName(pageName) {
    var me = this
    var pageConfig = null
    var mastPageConfig = me.modelConfig.masterPage
    if (mastPageConfig.name === pageName) {
      pageConfig = mastPageConfig
    } else {
      var detailPagesConfig = me.modelConfig.detailPages
      var i = 0
      for (i = 0; i < detailPagesConfig.length; i++) {
        if (detailPagesConfig[i].name === pageName) {
          pageConfig = detailPagesConfig[i]
          break
        }
      }
    }
    return pageConfig
  }

  /**
	 *
	 * @param datasetName
	 * @returns {Array}
	 */
  getPageConfigsByDatasetName(datasetName) {
    var me = this
    var pageConfigArr = []
    var mastPageConfig = me.modelConfig.masterPage
    if (mastPageConfig.componentSetModel != null && mastPageConfig.componentSetModel.dataset === datasetName) {
      pageConfigArr.push(mastPageConfig)
    }
    var detailPagesConfig = me.modelConfig.detailPages
    var i = 0
    for (i = 0; i < detailPagesConfig.length; i++) {
      if (detailPagesConfig[i].componentSetModel != null && detailPagesConfig[i].componentSetModel.dataset === datasetName) {
        pageConfigArr.push(detailPagesConfig[i])
      }
    }
    return pageConfigArr
  }

  /**
	 * 根据配置的cmpName获取cmpSet配置信息
	 * @param cmpName
	 * @returns cmpSetConfig
	 */
  getCmpSetConfig(cmpName) {
    var me = this
    var cmpSetConfig = null
    var mastPageConfig = me.modelConfig.masterPage
    if (mastPageConfig.componentSetModel != null) {
      var components = mastPageConfig.componentSetModel.components
      for (var i = 0; i < components.length; i++) {
        if (components[i].name === cmpName) {
          cmpSetConfig = mastPageConfig.componentSetModel
          break
        }
      }
    }
    if (cmpSetConfig === null) {
      var detailPagesConfig = me.modelConfig.detailPages

      for (var i = 0; i < detailPagesConfig.length; i++) {
        if (detailPagesConfig[i].componentSetModel != null) {
          var components = detailPagesConfig[i].componentSetModel.components
          for (var j = 0; j < components.length; j++) {
            if (components[j].name === cmpName) {
              cmpSetConfig = detailPagesConfig[i].componentSetModel
              break
            }
          }
        }
        if (cmpSetConfig != null) {
          break
        }
      }
    }
    return cmpSetConfig
  }

  /**
	 * 根据配置的cmpName获取cmp配置信息
	 * @param cmpName
	 * @returns cmpConfig
	 */
  getCmpConfig(cmpName) {
    var me = this
    var cmpConfig = null
    var mastPageConfig = me.modelConfig.masterPage
    if (mastPageConfig.componentSetModel != null) {
      var components = mastPageConfig.componentSetModel.components
      for (var i = 0; i < components.length; i++) {
        if (components[i].name === cmpName) {
          cmpConfig = components[i]
          break
        }
      }
    }
    if (cmpConfig === null) {
      var detailPagesConfig = me.modelConfig.detailPages

      for (var i = 0; i < detailPagesConfig.length; i++) {
        if (detailPagesConfig[i].componentSetModel != null) {
          var components = detailPagesConfig[i].componentSetModel.components
          for (var j = 0; j < components.length; j++) {
            if (components[j].name === cmpName) {
              cmpConfig = components[j]
              break
            }
          }
        }
        if (cmpConfig != null) {
          break
        }
      }
    }
    return cmpConfig
  }

  /**
	 * 根据datasetName获取该dataset的配置信息
	 * @param datasetName
	 * @returns
	 */
  getDatasetInfo(datasetName) {
    var me = this
    var datasetInfo = null
    var datasets = me.modelConfig.datasetInfo.datasets
    for (var i = 0; i < datasets.length; i++) {
      if (datasets[i].name === datasetName) {
        datasetInfo = datasets[i]
        break
      }
    }
    return datasetInfo
  }

  /**
	 * 根据datasetName获取下游dataset信息
	 * @param datasetName
	 * @returns {Array}
	 */
  getChildDatasetInfos(datasetName) {
    var me = this
    var datasetInfoArr = []
    var datasets = me.modelConfig.datasetInfo.datasets
    for (var i = 0; i < datasets.length; i++) {
      if (datasets[i].parentDataset === datasetName) {
        datasetInfoArr.push(datasets[i])
      }
    }
    return datasetInfoArr
  }

  /**
	 * 获取 master's dataset的配置信息
	 * @param datasetName
	 * @returns
	 */
  getMasterDatasetInfo() {
    var me = this
    var datasetInfo = null
    var datasets = me.modelConfig.datasetInfo.datasets
    for (var i = 0; i < datasets.length; i++) {
      if (eval(datasets[i].isMaster)) {
        datasetInfo = datasets[i]
        break
      }
    }
    return datasetInfo
  }

  /**
	 *
	 * @param datasetName
	 * @returns {Array}
	 */
  getColumns(datasetName) {
    var me = this
    var datasetInfo = me.getDatasetInfo(datasetName)
    var columns = datasetInfo.columns
    var fieldsArr = []
    for (var key in columns) {
      switch (columns[key].type) {
	    	case 'Integer':
	    		fieldsArr.push({
            name: columns[key].name,
            type: 'int'
          })
	    		break
	    	case 'String':
	    		fieldsArr.push({
            name: columns[key].name,
            type: 'string',
            defaultValue: null,
            useNull: true
          })
          break
	    	case 'Date':
	    		fieldsArr.push({
            name: columns[key].name,
            type: 'date',
	    	        dateFormat: 'Y-m-d' + 'T' + 'H:i:s'
          })
	    		break

	    	case 'Class':
	    		break
	    	case 'Set':
	    		break
	    	default:
	    		fieldsArr.push({
            name: columns[key].name,
            type: 'auto',
            defaultValue: null
          })
    			break
      }
    }
    return fieldsArr
  }

  /**
	 * 获取所有的多语言字段
	 * @param cmpSetName
	 * @returns {Array}
	 */
  getLanguageComponents(cmpSetName) {
    var me = this
    var pageConfig = me.getPageConfig(cmpSetName)
    var components = pageConfig.componentSetModel.components
    var cmpArr = []
    for (var key in components) {
      if (components[key].ctype.toLocaleLowerCase() === 'languagefield') {
        cmpArr.push(components[key])
      }
    }

    return cmpArr
  }
}
