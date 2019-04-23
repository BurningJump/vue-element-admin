import request from '@/utils/request'
import router from '@/router'
import { basicConstant } from '@/smartview/VBasicConstant.js'
import { asyncRouterMap } from '@/router'
import * as UID from './util/uuid.js'

export default class VSmartView {
  // 窗体元数据定义
  formMetas = new Map();

  // 窗体调用上下文
  callContents= new Map();

  // findDetailForm(formName, dataId) {
  //   for (var form of this.forms) {
  //     if (form.componentName === formName &&
  //           form.ctype === basicConstant.FORMTYPE_DETAIL &&
  //          form.dataId === dataId) {
  //       return form
  //     }
  //   }
  // }

  // findFormById(formId) {
  //   for (var form of this.forms) {
  //     if (form.formId === formId) {
  //       return form
  //     }
  //   }
  // }
  // addForm(form) {
  //   this.forms.push(form)
  // }

  getRouter(routes, formKey, parentPath) {
    var res = null
    var afullpath
    for (var rt of routes) {
      if (rt.name !== undefined && rt.name === formKey) {
        afullpath = parentPath === '' ? rt.path : parentPath + '/' + rt.path
        res = { route: rt, fullpath: afullpath }
        break
      } else {
        if (rt.children !== undefined) {
          afullpath = parentPath === '' ? rt.path : parentPath + '/' + rt.path
          res = this.getRouter(rt.children, formKey, afullpath)
          if (res !== null) {
            break
          }
        }
      }
    }
    return res
  }

  // 通过router call from
  callListForm(formKey, formId, ACvar = null) {
    // 获取路游表
    var maper = asyncRouterMap
    var res = this.getRouter(maper, formKey, '')
    var routerPath = res.fullpath.replace(/:formId/g, formId)
    this.getListUIMeta(formKey).then(formMeta => {
      var callContent = new Map()
      callContent['formKey'] = formKey
      callContent['formMeta'] = formMeta
      callContent['formId'] = formId
      this.callContents[formKey + formId] = callContent

      var myRouter = router
      myRouter.push({
        path: routerPath,
        query: {
          formId: formId,
          formKey: formKey
        }
      })
    }).catch(err => {
      console.log(err.stack)
    })
  }

  // 通过router call from
  callDetailForm(formKey, dataId, states, ACvar = null) {
    // 获取路游表
    var maper = asyncRouterMap
    var res = this.getRouter(maper, formKey, '')
    var routerPath = res.fullpath.replace(/:dataId/g, dataId)
    this.getDetailUIMeta(formKey).then(formMeta => {
      var callContent = new Map()
      callContent['formKey'] = formKey
      callContent['formMeta'] = formMeta
      callContent['formDataId'] = dataId
      callContent['formStates'] = states
      this.callContents[formKey + dataId] = callContent
      var myRouter = router
      myRouter.push({
        path: routerPath,
        query: {
          formKey: formKey,
          dataId: dataId
        }
      })
    }).catch(err => {
      console.log(err.stack)
    })
  }
  // TODO 通过动态加载js call from 目前没有搞定，原因import时提示模块不存在
  // callForm(formKey, id, states) {
  //   var formJsPath = formKey.replace(/\./g, '/')
  //   var form = null
  //   var importJs = '@/views/' + formJsPath + 'Form.js'
  //   // var formJsPath = 'com/epower/dp/dpshoporder'
  //   // var formName = 'DpShopOrderDetail'
  //   // import('@/views/com/epower/dp/dpshoporder/DpShopOrderDetailForm.js')
  //   import(importJs)
  //     .then(module => {
  //       this.getUIMeta(formKey).then(formMeta => {
  //         form = module.default.NewInstant(this, formMeta)
  //         this.getDetailData(form.formMeta, id).then(dataPackage => {
  //           form.loadDataByPackage(dataPackage) // add by max
  //           form.show(states)
  //           var routerPath = form.getVueComponentPath() + '/' + id
  //           // 1检查是否存在路游表，没有就创建

  //           // 2.显示form
  //           Vue.router.push({
  //             path: routerPath,
  //             query: {
  //               form: form
  //             }
  //           })
  //         }).catch(err => {
  //           console.log(err.message)
  //         })
  //       }).catch(err => {
  //         console.log(err.message)
  //       })
  //     })
  //     .catch(err => {
  //       console.log(err.message)
  //     })
  // }

  getDetailUIMeta(formKey) {
    return new Promise(
      (resolve, reject) => {
        if (this.formMetas[formKey] !== undefined && this.formMetas[formKey] !== null) {
          resolve(this.formMetas[formKey])
        } else {
          request({
            url: '/api/getDetailUIMeta/' + formKey,
            method: 'get'
          }).then(resData => {
            if (resData.data.detailViewModel !== null) {
              this.formMetas[resData.data.detailViewModel.name] = resData.data.detailViewModel
            }
            resolve(resData.data.detailViewModel)
          }).catch(err => {
            console.log(err.message)
          })
        }
      })
  }

  getListUIMeta(formKey) {
    return new Promise(
      (resolve, reject) => {
        if (this.formMetas[formKey] !== undefined && this.formMetas[formKey] !== null) {
          resolve(this.formMetas[formKey])
        } else {
          request({
            url: '/api/getListUIMeta/' + formKey,
            method: 'get'
          }).then(resData => {
            if (resData.data.listViewModel !== null) {
              this.formMetas[resData.data.listViewModel.name] = resData.data.listViewModel
            }
            resolve(resData.data.listViewModel)
          }).catch(err => {
            console.log(err.message)
          })
        }
      })
  }

  // getDetailData(formMeta, id) {
  //   return new Promise(
  //     (resolve, reject) => {
  //       request({
  //         url: '/api/' + formMeta.actionUrl,
  //         method: 'get'
  //       }).then(resData => {
  //         this.respData = resData.data
  //         resolve(resData.data.dataPackage)
  //       }).catch(err => {
  //         console.log(err.message)
  //       })
  //     })
  // }
}

export var vsmartview = new VSmartView()
