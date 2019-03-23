<template>
  <el-container class="base-detail-agrid-container">
    <el-aside v-if="pageModel.treeModel" width="200px"
              :style="{'height': treeHeight, 'padding': '0 5px'}">
      <!-- <div class="tree-toolbar">
        <el-button-group>
          <el-tooltip class="item" effect="dark" v-for="btn in pageModel.tree.toolbar.components" :content="btn.label" placement="top">
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
        <el-tree  :data="pageModel.treeModel"
                  :props="defaultProps" highlight-current
                  @node-expand="handleNodeExpand"
                  @node-click="handleNodeClick">
        </el-tree>
      </div>
    </el-aside>
    <el-container>
      <el-header  height="35px">
        <el-button-group v-if="toolbar.children.length > 0">
          <el-button v-for="btn in toolbar.children"
               v-if="!btn.hidden && !btn.isMore"
               :key="btn.componentName" size="mini">
            <svg-icon :icon-class="`${btn.iconcls}`"/>
            {{ btn.label }}
          </el-button>
          <el-dropdown v-if="toolbar.showMoreButton" trigger="click" placement="bottom" szie="mini">
            <el-button size="mini">
              更多<i class="el-icon-arrow-down el-icon--right" style="margin-left:0;"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-for="btn in toolbar.children" v-if="btn.isMore">
                <svg-icon :icon-class="`${btn.iconcls}`"/>
                {{btn.label}}
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-button-group>
        <pagination   :total="listQuery.totalCount"
                      :page.sync="listQuery.page"
                      :limit.sync="listQuery.limit"
                      @pagination="getList"
                      style="position: absolute; right: 50px; top: 0; margin-top: 0;"/>
      </el-header>
      <el-main>
        <el-table
              :data="this.componentSet.datasource.dataList"
              ref="multipleTable"
              element-loading-text="拼命加载中" border fit stripe highlight-current-row
              :header-cell-style="{background:'#f6f6f6'}"
              :height="height" :cell-style="cellStyle" :row-style="rowStyle">
          <el-table-column type="selection" align="center"/>
          <el-table-column v-for="header in pageModel.componentSetModel.components"
              :key="header.name"
              :prop="header.field"
              :label="header.label"
               align="left"
              :width="header.width > 1 ? header.width + 'px' : header.width > 0 && header.width <= 1 ? header.width*100 + '%' : ''">
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
  name: 'com-epower-fw-smartview-detail-BaseDetailAGrid',
  props: ['pageModel', 'activeTab', 'height','page'],
  components: {
    Pagination
  },

  data() {
    return {
   //   list:[],
    //  listLoading: false,

      listQuery: {
        // start开始行，limit个数
        // start = page数*limit+1
        totalCount:0,
        page: 1,
        limit: 20
      },
      componentSet:this.page.findChild(this.pageModel.componentSetModel.name),
      toolbar:this.page.findChild(this.pageModel.toolbarModel.name)
    }
  },
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
      // this.listLoading = true
      // this.$http.get(`/api/${this.url}`).then((res) => {
      //   this.componentSet.getDataSet().loadList(res.data.resultList);
      //   this.componentSet.datasource.open();
      //   this.list =this.componentSet.datasource.dataList;
      //   this.listLoading = false
      // })
    },
  }
}
</script>

