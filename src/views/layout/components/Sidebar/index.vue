<template>
  <el-scrollbar wrap-class="scrollbar-wrapper">
    <el-menu
      :show-timeout="200"
      :collapse="isCollapse"
      mode="vertical"
      background-color="#304156"
      text-color="#bfcbd9"
      active-text-color="#409EFF"
    >
      <sidebar-item v-for="menu in menus"
              :key="menu.id"
              :item="menu" />
    </el-menu>
  </el-scrollbar>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'
import {menuData} from './memu.js'

export default {
  components: { SidebarItem },
  data() {
    return {
      menus:[]
    }
  },
   created() {
    this.getData();
  },
  methods: {
    getData() {
    //   findPermissions(this.findPermissions).then(response => {
    //     if(response.code == 200)
    //      {
    //     this.menus = response.data
    //     }
    // });
     this.menus =  menuData
    }
  },
  computed: {
    ...mapGetters([
      'sidebar'
    ]),
    isCollapse() {
      return !this.sidebar.opened
    }
  }
}
</script>
