<template>
  <el-container class="base-detail-agrid-container">
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
        <el-table v-loading="listLoading" :data="agridData" ref="multipleTable" element-loading-text="拼命加载中" border fit stripe highlight-current-row :header-cell-style="{background:'#f6f6f6'}" :height="height" :cell-style="cellStyle" :row-style="rowStyle">
          <el-table-column type="selection" align="center"/>
          <el-table-column v-for="header in tab.componentSetModel.components" :key="header.label" :prop="header.field" :label="header.label" align="center" :width="header.width > 1 ? header.width + 'px' : header.width > 0 && header.width <= 1 ? header.width*100 + '%' : ''">
            <template slot-scope="scope">
              <img v-if="header.ctype === 'image'" :src="scope.row[header.field]" :width="header.width">
              <div v-else-if="header.ctype === 'valuelistField'" v-html="scope.row[header.field][header.valueListModel.displayField]"></div>
              <div v-else v-html="scope.row[header.field]"></div>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import Pagination from '@/components/Pagination'
export default {
  name: 'com.epower.fw.smartview.detail.BaseDetailAGrid',
  data() {
    return {
      list: [],
      listLoading: false,
      listQuery: {
        // start开始行，limit个数
        // start = page数*limit+1
        page: 1,
        limit: 20
      },
    }
  },
  components: {
    Pagination
  },
  props: ['url', 'tab', 'activeTab', 'agridData', 'height'],
  computed: {
    cellStyle() {
      return {
        'padding-left': '6px',
        'padding-right': '6px'
      }
    },
    rowStyle({ row, rowIndex}) {
      if (rowIndex%2 === 0) {
        return {
          'fontSize': '12px',
          'backgroundColor': '#fafafa'
        }
      } else {
        return {
          'fontSize': '12px',
          'backgroundColor': '#fff'
        }
      }
    }
  },
  methods: {
    getList() {
      this.listLoading = true
      this.$http.get(this.url).then((res) => {
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

