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
        path: 'operationList',
        component: () => import('@/views/com/epower/am/operation/operationList'),
        name: 'com.epower.am.operation.OperationList',
        meta: {
          title: 'operationList',
          roles: ['admin'] // or you can only set roles in sub nav
        }
      }
    ]
  },
  {
    path: '/edit',
    component: Layout,
    redirect: '/edit/index',
    alwaysShow: true, // will always show the root menu
    meta: {
      title: 'edit',
      icon: 'lock',
      roles: ['admin', 'editor'] // you can set roles in root nav
    },
    children: [
      {
        path: 'editSingle',
        component: () => import('@/views/edit/editSingle'),
        name: 'EditSingle',
        meta: {
          title: 'editSingle',
          roles: ['admin'] // or you can only set roles in sub nav
        }
      },
      {
        path: 'editMulti',
        component: () => import('@/views/edit/editMulti'),
        name: 'EditMulti',
        meta: {
          title: 'editMulti',
          roles: ['admin'] // or you can only set roles in sub nav
        }
      }
    ]
  },
  {
    path: '/supply',
    component: Layout,
    redirect: '/supply/index', //重定向地址，在面包屑中点击会重定向去的地址
    alwaysShow: false, //一直显示根路由
    meta: { roles: ['admin', 'editor'] }, //你可以在根路由设置权限，这样它下面所以的子路由都继承了这个权限
    children: [{
      path: 'index',
      component: () => import('@/views/supply/index'),
      name: 'supply',
      meta: {
        title: 'supply',
        icon: 'lock', //图标
        role: ['admin', 'editor'], //或者你可以给每一个子路由设置自己的权限
        noCache: true // 不会被 <keep-alive> 缓存
      }
    }]
  },
  { path: '*', redirect: '/404', hidden: true }
]
