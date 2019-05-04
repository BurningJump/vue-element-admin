import Layout from '@/views/layout/Layout'

const invrequestRouter = {
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
}

export default invrequestRouter
