import request from '@/utils/request'
import router from '@/router'
import { basicConstant } from '@/smartview/VBasicConstant.js'
import { asyncRouterMap } from '@/router'
import * as UID from '@/smartview/util/uuid.js'

export default class VSmartView {
  // 窗体
  forms = [];

  findDetailForm(formName) {
    var form = this.findForm(formName)
    if (form == null || form === undefined) return null
    if (form.ctype === basicConstant.FORMTYPE_DETAIL) {
      return form
    } else {
      return null
    }
  }

  findForm(formName) {
    for (var form of this.forms) {
      if (form.componentName === formName) {
        return form
      }
    }
  }

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
  callForm(formKey, id, states, aCvar = null) {
    var vform = null
    var maper = asyncRouterMap
    var res = this.getRouter(maper, formKey, '')
    res.route.control()
      .then(module => {
        this.getUIMeta(formKey).then(formMeta => {
          vform = module.default.NewInstant(this, formMeta)
          this.getDetailData(vform.formMeta, id).then(dataPackage => {
            vform.loadDataByPackage(dataPackage) // add by max
            vform.show(states)
            // TODO 需要替代一下ID
            var routerPath = res.fullpath
            // 调用vue-router call出form
            // TODO var myRouter 的赋值是否会导致分险，需要再次评估。
            var myRouter = router
            myRouter.push({
              path: routerPath,
              query: {
                form: vform,
                cvar: aCvar
              }
            })
          }).catch(err => {
            console.log(err.message)
          })
        }).catch(err => {
          console.log(err.message)
        })
      })
      .catch(err => {
        console.log(err.message)
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

  getUIMeta(formKey) {
    return new Promise(
      (resolve, reject) => {
        request({
          url: '/api/getDetailUIMeta/' + formKey,
          method: 'get'
        }).then(resData => {
          resolve(resData.data.detailViewModel)
        }).catch(err => {
          console.log(err.message)
        })
      })
  }

  getDetailData(formMeta, id) {
    return new Promise(
      (resolve, reject) => {
        request({
          url: '/api/' + formMeta.actionUrl,
          method: 'get'
        }).then(resData => {
          this.respData = resData.data
          resolve(resData.data.dataPackage)
        }).catch(err => {
          console.log(err.message)
        })
      })
  }
}

export var vsmartview = new VSmartView()
