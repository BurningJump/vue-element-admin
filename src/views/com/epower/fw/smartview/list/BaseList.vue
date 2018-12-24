<template>
  <div class="app-container">
    <el-container>
      <el-header height="auto" id="qconHeader">
        <el-form :inline="true" :model="conditionForm" ref="conditionForm" class="demo-ruleForm" label-width="100px" size="mini">
          <el-form-item v-for="condition in qCondition" v-if="!condition.isMore" :key="condition.label" :style="{width: (condition.width <= 1 ? condition.width*100 + '%' : condition.width + 'px')}" :label="condition.label" :prop="conditionForm[condition.findField]">
            <el-input v-model="conditionForm[condition.findField]"/>
          </el-form-item>
          <el-form-item v-for="condition in qCondition" v-if="condition.isMore && showMoreCondition" :key="condition.label" :style="{width: (condition.width <= 1 ? condition.width*100 + '%' : condition.width + 'px')}" :label="condition.label" :prop="conditionForm[condition.findField]">
            <el-input v-model="conditionForm[condition.findField]"/>
          </el-form-item>
          <el-form-item :style="{width: 'auto'}">
            <el-button-group>
              <el-button size="mini" icon="el-icon-search">查询</el-button>
              <el-button size="mini" @click="resetForm()" icon="el-icon-close">重置</el-button>
              <el-button size="mini" @click="showMoreCondition=!showMoreCondition;calcTableHeight()">
                <span v-show="!showMoreCondition">更多</span>
                <span v-show="showMoreCondition">收起</span>
                <i v-if="!showMoreCondition" class="el-icon-arrow-down"></i>
                <i v-if="showMoreCondition" class="el-icon-arrow-up"></i>
              </el-button>
            </el-button-group>
          </el-form-item>
        </el-form>
      </el-header>
      <el-container>
        <el-aside width="200px" :style="{'height': treeHeight, 'padding': '0 5px'}">
          <div class="tree-toolbar">
            <el-button-group>
              <el-tooltip class="item" effect="dark" v-for="btn in treeToolbar" :content="btn.label" placement="top">
                <el-button v-if="btn.fun === 'new'" size="mini" icon="el-icon-document"></el-button>
                <el-button v-else-if="btn.fun === 'view'" size="mini" icon="el-icon-view"></el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="更多" placement="top">
                <el-dropdown v-if="listUI.listViewModel.tree.toolbar.showMoreButton" trigger="click" placement="bottom" szie="mini">
                  <el-button size="mini">
                    <i class="el-icon-arrow-down el-icon--right" style="margin-left:0;"></i>
                  </el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item v-for="btn in treeToolbar" v-if="btn.isMore">
                      <i v-if="btn.iconcls === 'table_add'" class="el-icon-plus"/>
                      <i v-else-if="btn.iconcls === 'table'" class="el-icon-view"/>
                      <i v-else-if="btn.iconcls === 'table_edit'" class="el-icon-edit"/>
                      <i v-else-if="btn.iconcls === 'table_delete'" class="el-icon-delete"/>
                      {{btn.label}}
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </el-tooltip>
            </el-button-group>
          </div>
          <div class="tree-container">
            <el-tree :data="tree" :props="defaultProps" highlight-current @node-expand="handleNodeExpand" @node-click="handleNodeClick">
              <!-- <span class="custom-tree-node" slot-scope="{ node, data }">
                <span v-if="node.isLeaf">
                  <i v-if="data.iconcls === 'table_add'" class="el-icon-plus"/>
                  <i v-else-if="data.iconcls === 'table_delete'" class="el-icon-delete"/>
                  <i v-else-if="data.iconcls === 'table_edit'" class="el-icon-edit"/>
                  {{ node.label }}
                </span>
                <span v-if="!node.isLeaf">
                  {{ node.label }}
                </span>
              </span> -->
            </el-tree>
          </div>
        </el-aside>
        <el-main>
          <el-tabs v-model="activeTab" @tab-click="handleTabClick">
            <el-tab-pane v-for="tab in tabs" :name="tab.name">
              <span slot="label">
                <i v-if="tab.iconcls === 'table_add'" class="el-icon-plus"/>
                <i v-else-if="tab.iconcls === 'table_delete'" class="el-icon-delete"/>
                <i v-else-if="tab.iconcls === 'table_edit'" class="el-icon-edit"/>
                {{tab.label}}
              </span>
              <el-main style="padding:0;">
                <div class="topToolbar">
                  <div v-for="gridList in gridLists" v-if="tab.viewName === gridList.name || tab.view_name === gridList.name">
                    <el-button-group>
                      <el-button v-for="btn in gridList.topToolbar.components" v-if="!btn.isMore" size="mini">
                        <i v-if="btn.iconcls === 'table_add'" class="el-icon-plus"/>
                        <i v-else-if="btn.iconcls === 'table'" class="el-icon-view"/>
                        <i v-else-if="btn.iconcls === 'table_edit'" class="el-icon-edit"/>
                        <i v-else-if="btn.iconcls === 'table_delete'" class="el-icon-delete"/>
                        {{btn.label}}
                      </el-button>
                      <el-dropdown v-if="gridList.topToolbar.showMoreButton" trigger="click" placement="bottom" szie="mini">
                        <el-button size="mini">
                          更多<i class="el-icon-arrow-down el-icon--right"></i>
                        </el-button>
                        <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item v-for="btn in gridList.topToolbar.components" v-if="btn.isMore">
                            <i v-if="btn.iconcls === 'table_add'" class="el-icon-plus"/>
                            <i v-else-if="btn.iconcls === 'table'" class="el-icon-view"/>
                            <i v-else-if="btn.iconcls === 'table_edit'" class="el-icon-edit"/>
                            <i v-else-if="btn.iconcls === 'table_delete'" class="el-icon-delete"/>
                            {{btn.label}}
                          </el-dropdown-item>
                        </el-dropdown-menu>
                      </el-dropdown>
                    </el-button-group>
                  </div>
                </div>
                <el-table v-for="gridList in gridLists" v-if="tab.viewName === gridList.name || tab.view_name === gridList.name" ref="multipleTable" :data="list" element-loading-text="拼命加载中" border fit stripe highlight-current-row :header-cell-style="{background:'#f6f6f6'}" :height="tableHeight" :cell-style="cellStyle" :row-style="rowStyle">
                  <!-- <el-table-column type="selection" align="center"/> -->
                  <el-table-column v-for="(header, index) in grid[0]" :key="header.label" :prop="header.field" :label="header.label" align="center" :fixed="gridList.gridFixColumn > index" :width="header.width > 1 ? header.width + 'px' : header.width > 0 && header.width <= 1 ? header.width*100 + '%' : ''">
                    <template slot-scope="scope">
                      <img v-if="header.ctype === 'image'" :src="scope.row[header.prop]" :width="header.width">
                      <div v-else-if="header.ctype === 'valuelistField'" v-html="scope.row[header.prop][header.valueListModel.displayField]"></div>
                      <div v-else v-html="scope.row[header.prop]"></div>
                    </template>
                  </el-table-column>
                  <el-table-column fixed="right" label="操作" width="auto" align="center">
                    <template slot-scope="scope">
                      <el-button-group>
                        <el-tooltip v-for="btn in gridList.rowToolbar.components" v-if="!btn.isMore" class="item" effect="dark" :content="btn.label" placement="top">
                          <el-button @click="handleClick(scope.$index, scope.row, btn.fun)" size="mini">
                            <i v-if="btn.iconcls === 'table_add'" class="el-icon-plus"/>
                            <i v-else-if="btn.iconcls === 'table'" class="el-icon-view"/>
                            <i v-else-if="btn.iconcls === 'table_edit'" class="el-icon-edit"/>
                            <i v-else-if="btn.iconcls === 'table_delete'" class="el-icon-delete"/>
                          </el-button>
                        </el-tooltip>
                        <el-dropdown v-if="gridList.rowToolbar.showMoreButton" trigger="click" placement="bottom" szie="mini">
                          <el-button size="mini">
                            <i class="el-icon-arrow-down el-icon--right" style="margin-left:0;"></i>
                          </el-button>
                          <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item v-for="btn in gridList.rowToolbar.components" v-if="btn.isMore">
                              <!-- <el-tooltip class="item" effect="dark" :content="btn.label" placement="top"> -->
                                <i v-if="btn.iconcls === 'table_add'" class="el-icon-plus"/>
                                <i v-else-if="btn.iconcls === 'table'" class="el-icon-view"/>
                                <i v-else-if="btn.iconcls === 'table_edit'" class="el-icon-edit"/>
                                <i v-else-if="btn.iconcls === 'table_delete'" class="el-icon-delete"/>
                                {{btn.label}}
                              <!-- </el-tooltip> -->
                            </el-dropdown-item>
                          </el-dropdown-menu>
                        </el-dropdown>
                      </el-button-group>
                    </template>
                  </el-table-column>
                </el-table>
              </el-main>
              <el-footer style="height:auto;">
                <div class="footerToolbar">
                  <div v-for="gridList in gridLists" v-if="tab.viewName === gridList.name || tab.view_name === gridList.name">
                    <el-button-group>
                      <el-button v-for="btn in gridList.footerToolbar.components" v-if="!btn.isMore" size="mini">
                        <i v-if="btn.iconcls === 'table_add'" class="el-icon-plus"/>
                        <i v-else-if="btn.iconcls === 'table'" class="el-icon-view"/>
                        <i v-else-if="btn.iconcls === 'table_edit'" class="el-icon-edit"/>
                        <i v-else-if="btn.iconcls === 'table_delete'" class="el-icon-delete"/>
                        {{btn.label}}
                      </el-button>
                      <el-dropdown v-if="gridList.footerToolbar.showMoreButton" trigger="click" placement="bottom" szie="mini">
                        <el-button size="mini">
                          更多<i class="el-icon-arrow-down el-icon--right"></i>
                        </el-button>
                        <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item v-for="btn in gridList.footerToolbar.components" v-if="btn.isMore">
                            <i v-if="btn.iconcls === 'table_add'" class="el-icon-plus"/>
                            <i v-else-if="btn.iconcls === 'table'" class="el-icon-view"/>
                            <i v-else-if="btn.iconcls === 'table_edit'" class="el-icon-edit"/>
                            <i v-else-if="btn.iconcls === 'table_delete'" class="el-icon-delete"/>
                            {{btn.label}}
                          </el-dropdown-item>
                        </el-dropdown-menu>
                      </el-dropdown>
                    </el-button-group>
                  </div>
                </div>
                <pagination v-show="list.length>0" :total="list.length" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList"/>
              </el-footer>
            </el-tab-pane>
          </el-tabs>
        </el-main>
      </el-container>
    </el-container>
    <el-dialog :visible.sync="dialogVisible" width="30%">
      <span>这是一段信息</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="mini">详细</el-button>
        <el-button type="primary" @click="dialogVisible = false" size="mini">更多</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
export default{
  name: 'com.epower.fw.smartview.list.BaseList',
  components: {
    Pagination
  },
  data() {
    return {
      gotUIData: false,  // 是否已获取UI数据
      showMoreCondition: false,
      treeHeight: '600px',
      tableHeight: 600, // 表头高度
      dialogVisible: false,
      activeTab: '',
      tabs: [],
      listUI: '',
      treeToolbar: [],
      options: [
        {
          value: 'more',
          label: '更多'
        }, {
          value: 'less',
          label: '收起'
        }
      ],
      gridLists: [],
      listData: require('../../../am/operation/list-data.json'),
      treeRoot: {},
      treeChild: {},
      treeGrandchild: {},
      qCondition: [],
      buttons: [],
      tree: [],
      grid: [],
      list: [],
      listQuery: {
        page: 1,
        limit: 20
      },
      multipleSelection: [],
      data: [
        {
          label: '一级 1',
          children: [{
            label: '二级 1-1',
            children: [{
              label: '三级 1-1-1'
            }]
          }]
        },
        {
        label: '一级 2',
        children: [{
          label: '二级 2-1',
          children: [{
            label: '三级 2-1-1'
          }]
        }, {
          label: '二级 2-2',
          children: [{
            label: '三级 2-2-1'
          }]
        }]
      },
      {
        label: '一级 3',
        children: [{
          label: '二级 3-1',
          children: [{
            label: '三级 3-1-1'
          }]
        }, {
          label: '二级 3-2',
          children: [{
            label: '三级 3-2-1'
          }]
        }]
      }],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      conditionForm: {}
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
      console.log(rowIndex)
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
  mounted() {
    this.getUIdata().then(() => {
      this.gotUIData = true
      this.renderTree()
      this.calcTableHeight()
    })
    this.getListData()
  },
  methods: {
    calcTableHeight() {
      setTimeout(() => {
        this.tableHeight = window.innerHeight - parseInt(window.getComputedStyle(document.getElementById('qconHeader'), null).height) - 190
        this.treeHeight = (window.innerHeight - parseInt(window.getComputedStyle(document.getElementById('qconHeader'), null).height) - 100) + 'px'
      })
    },
    renderContent(h, { node, data, store }) {
      return (
        <span class="custom-tree-node">
          <i class={data.className}></i>
          <span style="margin-left:5px;">{node.label}</span>
        </span>
      );
    },
    handleClick(index,row, action) {
      switch(action) {
        case 'modify':
          console.log('修改')
          this.dialogVisible = true;
        break
        case 'new':
          console.log('增加')
          this.dialogVisible = true;
        break
        case 'delete':
          console.log('删除')
        break
      }
    },
    getUIdata() {
      return new Promise((resolve,reject) => {
        this.$http.get('http://root.yiuser.com:3001/openapi/listUi').then((res) => {
          this.listUI = res.data;
          this.treeToolbar = [...this.listUI.listViewModel.tree.toolbar.components]
          this.tabs = [...this.listUI.listViewModel.dataType.types]
          this.activeTab = this.listUI.listViewModel.dataType.default
          this.qCondition = [...this.listUI.listViewModel.qCondition.components]
          this.gridLists = [...this.listUI.listViewModel.dataView.views]

          this.gridLists.forEach((item, index) => {
            this.grid.push([])
            item.components.forEach((thead) => {
              this.grid[index].push({
                prop: thead.name,
                label: thead.label
              })
            })
          })
        })
        this.$http.get('http://root.yiuser.com:3001/openapi/treeRoot').then((res) => {
          this.treeRoot = JSON.parse(JSON.stringify(res.data));
          this.$http.get('http://root.yiuser.com:3001/openapi/treeChild').then((res) => {
            this.treeChild = JSON.parse(JSON.stringify(res.data));
            this.$http.get('http://root.yiuser.com:3001/openapi/treeGrandChild').then((res) => {
              this.treeGrandchild = JSON.parse(JSON.stringify(res.data));
              resolve(true);
            }).catch((err) => {
              reject(err)
            })
          })
        })
      })
    },
    // 生成目录树
    renderTree() {
      if (!this.treeRoot.treeRoot.leaf) {
        this.tree.push({
          iconcls: this.treeRoot.treeRoot.iconcls,
          label: this.treeRoot.treeRoot.text,
          children: []
        })
      } else {
        this.tree.push({
          iconcls: this.treeRoot.treeRoot.iconcls,
          label: this.treeRoot.treeRoot.text
        })
      }
      this.treeChild.forEach((child) => {
        if (!child.leaf && this.tree[0].children) {
          this.tree[0].children.push({
            iconcls: child.iconcls,
            label: child.text,
            children: []
          })
        } else {
          this.tree[0].children.push({
            iconcls: child.iconcls,
            label: child.text
          })
        }
      })
      this.treeGrandchild.forEach((grandchild) => {
        if (!grandchild.leaf) {
          this.tree[0].children.forEach((treeChild) => {
            if (treeChild.children) {
              treeChild.children.push({
                iconcls: grandchild.iconcls,
                label: grandchild.text,
                children: []
              })
            }
          })
        } else {
          this.tree[0].children.forEach((treeChild) => {
            if (treeChild.children) {
              treeChild.children.push({
                iconcls: grandchild.iconcls,
                label: grandchild.text
              })
            }
          })
        }
      })
    },
    getListData() {
      this.$http.get('http://root.yiuser.com:3001/openapi/listGridData').then((res) => {
        this.listGridData = res.data
        this.listGridData.resultList.forEach((item) => {
          this.list.push({
            l_operationNo: item.operationNo,
            l_operationName: item.operationName,
            l_operationType: item.type ? item.type : 0,
            l_parentOperationNumber: item.parentOperationRef ? item.parentOperationRef.operationNo : '',
            l_parentOperationName: item.parentOperationRef ? item.parentOperationRef.operationName : '',
            l_appType: item.appType
          })
        })
      })
    },
    getList() {
      // 获取分页数据
    },
    handleTabClick() {},
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleNodeExpand(data, node, ref) {
      // 展开节点
      // console.log(data,node,ref)
    },
    handleNodeClick(data, node, ref) {
    //   // 点击节点时获取子节点及表数据
      console.log(data, node, ref)
    //   if (data.children && data.children.length > 0) {
    //     // 已加载过节点
    //     return
    //   }
    //   if (data.children && data.children.length === 0) {
    //     // 获取子节点
    //     if (node.level === 1) {
    //       this.treeChild.forEach((child) => {
    //         if (!child.leaf) {
    //           data.children.push({
    //             label: child.text,
    //             children: []
    //           })
    //         } else {
    //           data.children.push({
    //             label: child.text
    //           })
    //         }
    //       })
    //     } else if (node.level === 2) {
    //       this.treeGrandchild.forEach((grandchild) => {
    //         if (!grandchild.leaf) {
    //           data.children.push({
    //             label: grandchild.text,
    //             children: []
    //           })
    //         } else {
    //           data.children.push({
    //             label: grandchild.text
    //           })
    //         }
    //       })
    //     }
    //   }
    //   if (node.isLeaf) {
    //     // 叶节点，加载表数据
    //     console.log('加载叶节点数据')
    //   }
    },
    resetForm() {
      Object.keys(this.conditionForm).forEach(key => obj[key] = '');
    }
  }
}
</script>

<style lang="scss">
body .el-table th.gutter{
  display: table-cell!important;
}
body .el-table colgroup.gutter{
  display: table-cell!important;
}
.el-form {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
}
.el-form-item__label {
  font-size: 12px;
  font-weight: normal;
}
.el-form-item--mini.el-form-item, .el-form-item--small.el-form-item {
  margin-bottom: 2px;
}
.el-tabs {
  width: 100%;
}
.el-tabs__active-bar {
  background-color: red;
}
.el-tabs__item:hover {
  color: red;
}
.el-tabs__item.is-active {
  color: red;
}
.el-tabs__content {
  overflow: visible;
}
.el-tabs__nav-wrap::after {
  height: 1px;
}
.el-tabs__header {
  margin: 0 0 6px;
}
.topToolbar {
  display: inline-flex;
  position: absolute;
  top: -40px;
  right: 0px;
}
.footerToolbar {
  display: inline-flex;
}
.el-header {
  border-bottom: 1px solid #e4e7ed;
}
.el-tree {
  .el-tree-node__label {
    font-size: 12px;
  }
}
.tree-toolbar {
  display: flex;
  justify-content: flex-end;
  padding: 6px 2px 2px 0;
  border-bottom: 1px solid #e4e7ed;
  background-color: #fff;
}
.tree-container {
  height: calc(100% - 41px);
  overflow: auto;
}
.pagination-container {
  display: inline-block;
  margin-top: 0;
}
.el-footer {
  padding: 6px 0;
  display: flex;
  justify-content: space-between;
  border-top: 1px solid #e4e7ed;
}
.el-aside {
  border-right: 1px solid #e4e7ed;
}
thead tr {
  background-color: #fafafa;
}
.el-main {
  padding: 0 6px;
}
</style>

