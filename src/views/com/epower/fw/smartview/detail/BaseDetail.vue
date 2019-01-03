<template>
  <!-- <div class="base-detail-container"> -->
    <el-container class="base-detail-container">
    <el-aside v-if="tab.treeModel" width="200px" :style="{'height': treeHeight, 'padding': '0 5px'}">
      <!-- <div class="tree-toolbar">
        <el-button-group>
          <el-tooltip class="item" effect="dark" v-for="btn in tab.tree.toolbar.components" :content="btn.label" placement="top">
            <el-button v-if="btn.fun === 'new'" size="mini" icon="el-icon-document"></el-button>
            <el-button v-else-if="btn.fun === 'view'" size="mini" icon="el-icon-view"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="更多" placement="top">
            <el-dropdown v-if="supplyUI.listViewModel.tree.toolbar.showMoreButton" trigger="click" placement="bottom" szie="mini">
              <el-button size="mini">
                <i class="el-icon-arrow-down el-icon--right" style="margin-left:0;"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-for="btn in treeToolbar" v-if="btn.isMore">
                  <svg-icon :icon-class="`${btn.iconcls}`"/>
                  {{btn.label}}
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-tooltip>
        </el-button-group>
      </div> -->
      <div class="tree-container">
        <el-tree :data="tab.treeModel" :props="defaultProps" highlight-current @node-expand="handleNodeExpand" @node-click="handleNodeClick">
        </el-tree>
      </div>
    </el-aside>
    <el-container>
      <el-header v-if="tab.toolbarModel.buttons.length > 0 || tab.componentSetModel.style === 'aGrid'" height="35px">
        <el-button-group v-if="tab.toolbarModel.buttons.length > 0">
          <el-button v-for="btn in tab.toolbarModel.buttons" v-if="tab.toolbarModel.buttons.length > 0 && !btn.isMore" :key="btn.label" size="mini">
            <svg-icon :icon-class="`${btn.iconcls}`"/>
            {{ btn.label }}
          </el-button>
          <el-dropdown v-if="tab.toolbarModel.showMoreButton" trigger="click" placement="bottom" szie="mini">
            <el-button size="mini">
              更多<i class="el-icon-arrow-down el-icon--right" style="margin-left:0;"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-for="btn in tab.toolbarModel.buttons" v-if="btn.isMore">
                <svg-icon :icon-class="`${btn.iconcls}`"/>
                {{btn.label}}
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-button-group>
        <pagination v-show="tab.componentSetModel.style === 'aGrid'" :total="list.length" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" style="position: absolute; right: 50px; top: 0; margin-top: 0;"/>
      </el-header>
      <el-main v-if="activeTab === tab.name">
        <base-detail-grid v-if="type === 'grid'" :settings="settings" :height="tableHeight"/>
        <base-detail-a-grid v-else-if="type === 'aGrid'" :listLoading="listLoading" :agridData="agridData" :headers="headers" :height="tableHeight"/>
        <base-detail-column v-else-if="type === 'column'" :inputs="inputs"/>
      </el-main>
    </el-container>
    </el-container>
  <!-- </div> -->
</template>

<script>
import Pagination from '@/components/Pagination'
import BaseDetailAGrid from '@/views/com/epower/fw/smartview/detail/BaseDetailAGrid'
import BaseDetailColumn from '@/views/com/epower/fw/smartview/detail/BaseDetailColumn'
import BaseDetailGrid from '@/views/com/epower/fw/smartview/detail/BaseDetailGrid'
export default {
  data() {
    return {
      list: [],
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20
      },
      defaultProps: {
        children: 'children',
        label: 'label'
      },
    }
  },
  props: {
    url: String,
    tab: Object,
    activeTab: String,
    type: String,
    settings: Object,
    tableHeight: [Number, String],
    inputs: Array,
    headers: Array,
    agridData: Array,
    treeHeight: [Number, String],
  },
  components: {
    Pagination,
    BaseDetailAGrid,
    BaseDetailColumn,
    BaseDetailGrid,
  },
  methods: {
    getList() {
      this.listLoading = true
      this.$http.get(`http://root.yiuser.com:3001/${this.url}`).then((res) => {
        this.listLoading = false
      })
      // fetchList(this.listQuery).then(response => {
      //   this.list = response.data.items
      //   this.total = response.data.total
      //   // Just to simulate the time of the request
      //   setTimeout(() => {
      //     this.listLoading = false
      //   }, 1.5 * 1000)
      // })
    },
  }
}
</script>

<style lang="scss">
.base-detail-container {
  width: 100%;
}
</style>

