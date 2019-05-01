import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/views/layout/Layout'

/** note: Submenu only appear when children.length>=1
 *  detail see  https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 **/
export const constantRouterMap = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/authredirect'),
    hidden: true
  },
  {
    path: '',
    component: Layout,
    redirect: 'dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: 'dashboard', icon: 'dashboard', noCache: true }
      }
    ]
  }
]

export default new Router({
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const asyncRouterMap = [
  {
    path: '/com/epower/am/operation',
    component: Layout,
    redirect: '/com/epower/am/operation/operationList',
    alwaysShow: true, // will always show the root menu
    meta: {
      title: 'operation',
      icon: 'lock',
      roles: ['admin', 'editor'] // you can set roles in root nav
    },
    children: [
      {
        // path: 'operationList/:id',
        path: 'operationList',
        component: () => import('@/views/com/epower/am/operation/operationList'),
        name: 'com.epower.am.operation.OperationList',
        meta: {
          title: 'operationList',
          roles: ['admin'] // or you can only set roles in sub nav
        }
      },
      {
        path: 'SelectList',
        component: () => import('@/views/com/epower/am/operation/SelectList'),
        name: 'com.epower.am.operation.SelectList',
        meta: {
          title: 'SelectList',
          roles: ['admin'] // or you can only set roles in sub nav
        }
      }
    ]
  },
  {
    path: '/com/epower/dp/dpshoporder',
    component: Layout,
    redirect: '/com/epower/dp/dpshoporder/DpShopOrderForsupplyList',
    alwaysShow: true, // will always show the root menu
    meta: {
      title: 'dpshoporder',
      icon: 'lock',
      roles: ['admin', 'editor'] // you can set roles in root nav
    },
    children: [
      {
        path: 'DpShopOrderDetail/:dataId',
        component: () => import('@/views/com/epower/dp/dpshoporder/DpShopOrderDetail'),
        name: 'com.epower.dp.dpshoporder.DpShopOrderDetail',
        hidden: true,
        meta: {
          title: 'DpShopOrderDetail',
          roles: ['admin'] // or you can only set roles in sub nav
        }
      },
      {
        path: 'DpShopOrderList/:formId',
        component: () => import('@/views/com/epower/dp/dpshoporder/DpShopOrderList'),
        name: 'com.epower.dp.dpshoporder.shopOrderList',
        hidden: true,
        meta: {
          title: 'DpShopOrderDetail',
          roles: ['admin'] // or you can only set roles in sub nav
        }
      },
      {
        path: 'DpShopOrderForsupplyList',
        component: () => import('@/views/com/epower/dp/dpshoporder/DpShopOrderForsupplyList'),
        name: 'com.epower.dp.dpshoporder.DpShopOrderForsupplyList',
        meta: {
          title: 'DpShopOrderForsupplyList',
          roles: ['admin'] // or you can only set roles in sub nav
        }
      }
    ]
  },

  {
    path: '/com/epower/inv/invrequest',
    component: Layout,
    redirect: '/com/epower/inv/invrequest/InvRequestDetail',
    alwaysShow: true, // will always show the root menu
    meta: {
      title: 'invrequest',
      icon: 'lock',
      roles: ['admin', 'editor'] // you can set roles in root nav
    },
    children: [
      {
        path: 'InvRequestDetail/:id',
        component: () => import('@/views/com/epower/inv/invrequest/InvRequestDetail'),
        name: 'com.epower.inv.invrequest.InvRequestDetail',
        hidden: true,
        meta: {
          title: 'InvRequestDetail',
          roles: ['admin'] // or you can only set roles in sub nav
        }
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]
