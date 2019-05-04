import Layout from '@/views/layout/Layout'

const amoperationRouter = {
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
}

export default amoperationRouter
