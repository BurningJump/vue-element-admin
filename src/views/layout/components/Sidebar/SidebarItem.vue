<template>
  <div class="menu-wrapper">

    <template v-if="hasChild(item) == false">
      <app-link :to="item.menuUrl"
                :key="item.id" >
        <el-menu-item
              :index="item.id"
              :class="{'submenu-title-noDropdown':!isNest}"
              @click="handleItemClick(item)" >
          <item
                :icon="(item.menuIcon==null||item.menuIcon==undefined)?'doc':child.item"
                :title="item.menuName" />
        </el-menu-item>
      </app-link>
    </template>

    <el-submenu v-else ref="submenu" :index = "item.id"  :key="item.id" >

        <template slot="title">
          <item
                :icon="(item.menuIcon==null||item.menuIcon==undefined)?'list':item.menuIcon"
                :title="item.menuName" />
        </template>



      <template v-for="child in item.children" >

        <sidebar-item   v-if="hasChild(child)"
          :is-nest="true"
          :item="child"
          :key="child.id"
          class="nest-menu" />

          <el-menu-item  v-else
                  :index="child.id"  @click="handleItemClick(child)"
                  >
              <item :icon="(child.menuIcon==null||child.menuIcon==undefined)?'doc':child.menuIcon"
                    :title="child.menuName" />
          </el-menu-item>

<!--
         <app-link  v-else
           :to="child.menuUrl"
           :key="child.id">
          <el-menu-item :index="child.id">
            <item :icon="child.menuIcon" :title="child.menuName" />
          </el-menu-item>
        </app-link> -->
      </template>
    </el-submenu>

  </div>
</template>

<script>
import path from 'path'
import { generateTitle } from '@/utils/i18n'
import { isExternal } from '@/utils'
import Item from './Item'
import AppLink from './Link'
import FixiOSBug from './FixiOSBug'
import {vsmartview} from '@/smartview/VSmartView.js'

export default {
  name: 'SidebarItem',
  components: { Item, AppLink },
  mixins: [FixiOSBug],
  props: {
    // memu object
    item: {
      type: Object,
      required: true
    },
    isNest: {
      type: Boolean,
      default: false
    },
    basePath: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      onlyOneChild: null
    }
  },
  methods: {
     hasChild(item) {
      if (item.children == undefined) return false
      if (item.children == null) return false
      return  (item.children.length > 0)
    },
    handleItemClick(item){

      console.log("click"+item.menuUrl)
     if ( item.menuType === '1' ) {
       //列表类型
        vsmartview.callListForm(item.menuUrl, 1)
        //  vsmartview.callListForm('com.epower.dp.dpshoporder.shopOrderList', 1, 'VIEW')
      //  vsmartview.callListForm('com.epower.dp.dpshoporder.shopOrderList', 1, 'VIEW')
     } else if ( item.menuType === '2') {
       //明细类型
        vsmartview.callDetailForm(item.menuUrl, 1, 'VIEW')
     }


    },
    resolvePath(routePath) {
      if (this.isExternalLink(routePath)) {
        return routePath
      }

      return path.resolve(this.basePath, routePath)
    },

    isExternalLink(routePath) {
      return isExternal(routePath)
    },

  }
}
</script>
