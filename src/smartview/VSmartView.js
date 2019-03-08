import request from '@/utils/request'
import router  from '@/router'
import { basicConstant } from '@/smartview/VBasicConstant.js'
import { asyncRouterMap } from '@/router'

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
    for (var rt of routes) {
      if (rt.name !== undefined && rt.name === formKey) {
        var afullpath = (parentPath === '' ? rt.path:parentPath + '/' + rt.path)
        res = { route: rt, fullpath: afullpath }
        break
      } else {
        if (rt.children !== undefined) {
          res = this.getRouter(rt.children, formKey, parentPath + '/' + rt.path)
          if (res !== null) {
            break
          }
        }
      }
    }
    return res
  }

  callForm(formKey, id, states, cvar = null) {
    var form = null
    var maper = asyncRouterMap
    var res = this.getRouter(maper, formKey, '')
    res.route.control()
      .then(module => {
        this.getUIMeta(formKey).then(formMeta => {
          form = module.default.NewInstant(this, formMeta)
          this.getDetailData(form.formMeta, id).then(dataPackage => {
            form.loadDataByPackage(dataPackage) // add by max
            form.show(states)
            // TODO 需要替代一下ID
            var routerPath = res.fullpath
            // 1检查是否存在路游表，没有就创建，待考虑
            var my= router
            my.push({
              path: routerPath,
              query: {
                form: form,
                cvar: cvar
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
