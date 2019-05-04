import Layout from '@/views/layout/Layout'

const dpshoporderRouter = {
  path: '/com/epower/dpdpshoporder',
  component: Layout,
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
    }
  ]
}

export default dpshoporderRouter
