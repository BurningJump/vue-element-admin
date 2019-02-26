<template>
  <div class="app-container">
    <el-container v-if="UiLoaded">
      <el-header height="auto" id="qconHeader">
        <el-form :inline="true" :model="conditionForm" ref="conditionForm" class="demo-ruleForm" label-width="100px" size="mini">
          <el-form-item v-for="condition in UIMeta.listViewModel.qCondition.components" v-if="!condition.isMore" :key="condition.label" :style="{width: (condition.width <= 1 ? condition.width*100 + '%' : condition.width + 'px')}" :label="condition.label" :prop="conditionForm[condition.findField]">
            <el-input v-model="conditionForm[condition.findField]"/>
          </el-form-item>
          <el-form-item v-for="condition in UIMeta.listViewModel.qCondition.components" v-if="condition.isMore && showMoreCondition" :key="condition.label" :style="{width: (condition.width <= 1 ? condition.width*100 + '%' : condition.width + 'px')}" :label="condition.label" :prop="conditionForm[condition.findField]">
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
        <el-aside v-if="UIMeta.listViewModel.tree" width="200px" :style="{'height': treeHeight, 'padding': '0 5px'}">
          <div class="tree-toolbar" v-if="UIMeta.listViewModel.tree.toolbar">
            <el-button-group>
              <el-tooltip class="item" effect="dark" v-for="btn in UIMeta.listViewModel.tree.toolbar.components" :content="btn.label" placement="top">
                <el-button size="mini">
                  <svg-icon :icon-class="`${btn.iconcls}`"/>
                </el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="更多" placement="top">
                <el-dropdown v-if="UIMeta.listViewModel.tree.toolbar.showMoreButton" trigger="click" placement="bottom" szie="mini">
                  <el-button size="mini">
                    <i class="el-icon-arrow-down el-icon--right" style="margin-left:0;"></i>
                  </el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item v-for="btn in UIMeta.listViewModel.tree.toolbar.components" v-if="btn.isMore">
                      <svg-icon :icon-class="`${btn.iconcls}`"/>
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
                  <svg-icon :icon-class="`${data.iconcls}`"/>
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
          <el-tabs v-if="UIMeta.listViewModel.dataType" v-model="activeTab" @tab-click="handleTabClick">
            <el-tab-pane v-for="tab in UIMeta.listViewModel.dataType.types" :name="tab.name">
              <span slot="label">
                <svg-icon :icon-class="`${tab.iconcls}`"/>
                {{tab.label}}
              </span>
              <base-list-grid v-for="view in UIMeta.listViewModel.dataView.views" v-if="view.viewType === 'grid' && tab.viewName === view.name" :view="view" :height="tableHeight" :list="list" :grid="grid"/>
            </el-tab-pane>
          </el-tabs>
          <el-tabs v-else v-model="activeTab" @tab-click="handleTabClick">
            <el-tab-pane v-for="tab in UIMeta.listViewModel.dataView.views" :name="tab.name">
              <span slot="label">
                <svg-icon :icon-class="`${tab.iconcls}`"/>
                {{tab.name}}
              </span>
              <base-list-grid v-for="view in UIMeta.listViewModel.dataView.views" v-if="view.viewType === 'grid'" :view="view" :height="tableHeight" :list="list" :grid="grid"/>
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
import BaseListGrid from '@/views/com/epower/fw/smartview/list/BaseListGrid'
import BaseListCard from '@/views/com/epower/fw/smartview/list/BaseListCard'
// import BaseSelect from '@/views/com/epower/fw/smartview/select/BaseSelect'
export default{
  name: 'com.epower.fw.smartview.list.BaseList',
  components: {
    BaseListGrid,
    BaseListCard,
    // BaseSelect,
  },
  // extends: {BaseListGrid,BaseDetailCard},
  data() {
    return {
      id: null,
      tempRoute: {},
      UiLoaded: false,  // UI获取完成
      dataLoaded: false,  // 数据获取完成
      showMoreCondition: false,
      treeHeight: '600px',
      tableHeight: 600, // 表头高度
      dialogVisible: false,
      activeTab: '',
      UIMeta: '',
      options: [
        {
          value: 'more',
          label: '更多'
        }, {
          value: 'less',
          label: '收起'
        }
      ],
      treeRoot: {},
      treeChild: {},
      treeGrandchild: {},
      tree: [],
      grid: {},
      list: {},
      listQuery: {
        page: 1,
        limit: 20
      },
      multipleSelection: [],
      // data: [
      //   {
      //     label: '一级 1',
      //     children: [{
      //       label: '二级 1-1',
      //       children: [{
      //         label: '三级 1-1-1'
      //       }]
      //     }]
      //   },
      //   {
      //   label: '一级 2',
      //   children: [{
      //     label: '二级 2-1',
      //     children: [{
      //       label: '三级 2-1-1'
      //     }]
      //   }, {
      //     label: '二级 2-2',
      //     children: [{
      //       label: '三级 2-2-1'
      //     }]
      //   }]
      // },
      // {
      //   label: '一级 3',
      //   children: [{
      //     label: '二级 3-1',
      //     children: [{
      //       label: '三级 3-1-1'
      //     }]
      //   }, {
      //     label: '二级 3-2',
      //     children: [{
      //       label: '三级 3-2-1'
      //     }]
      //   }]
      // }],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      conditionForm: {},
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
  // created() {
  //   this.id = 888
  //   // const id = this.$route.params && this.$route.params.id
  //   this.getListData(this.id)
  //   this.tempRoute = Object.assign({}, this.$route)
  //   this.setTagsViewTitle()
  // },
  created() {
    this.getUIMeta().then(() => {
      this.UiLoaded = true
      this.getTree().then(() => {
        this.calcTableHeight()
        this.renderTree()
      })
      this.getListData().then(() => {
        this.dataLoaded = true
      })
    })
  },
  methods: {
    setTagsViewTitle() {
      this.id = Math.floor(1000*Math.random())
      const title = 'List'
      const route = Object.assign({}, this.tempRoute, { title: `${title}-${this.id}` })
      console.log(route,'route----------');
      
      this.$store.dispatch('updateVisitedView', route)
    },
    calcTableHeight() {
      setTimeout(() => {
        this.tableHeight = window.innerHeight - parseInt(window.getComputedStyle(document.getElementById('qconHeader'), null).height) - 190
        this.treeHeight = (window.innerHeight - parseInt(window.getComputedStyle(document.getElementById('qconHeader'), null).height) - 96) + 'px'
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
    getUIMeta() {
      return new Promise((resolve,reject) => {
        this.$http.get(`/api/getListUIMeta/${this.$options.name}`).then((res) => {
          this.UIMeta = res.data
          this.activeTab = this.UIMeta.listViewModel.dataType
          ? this.UIMeta.listViewModel.dataType.default
          : this.UIMeta.listViewModel.dataView.defaultView
          this.UIMeta.listViewModel.dataView.views.forEach((item, index) => {
            // this.grid[item.name] = []
            this.$set(this.grid, item.name, [])
            item.components.forEach((thead) => {
              this.grid[item.name].push({
                prop: thead.field,
                label: thead.label
              })
            })
          })
          resolve(true)
        })
      })
    },
    getTree() {
      return new Promise((resolve,reject) => {
        if (!this.UIMeta.listViewModel.tree) {
          resolve('notree')
        }
        this.$http.get(`/api/${this.UIMeta.listViewModel.tree.initUrl}/${this.UIMeta.listViewModel.tree.initMethod}`).then((res) => {
          this.treeRoot = JSON.parse(JSON.stringify(res.data))
          this.$http.get(`/api/${this.UIMeta.listViewModel.tree.actionUrl}/${this.UIMeta.listViewModel.tree.method}`).then((res) => {
            this.treeChild = JSON.parse(JSON.stringify(res.data))
            this.$http.get(`/api/${this.UIMeta.listViewModel.tree.actionUrl}/${this.UIMeta.listViewModel.tree.method}`).then((res) => {
              this.treeGrandchild = JSON.parse(JSON.stringify(res.data))
              resolve(true)
            }).catch((err) => {
              reject(err)
            })
          })
        })
      })
    },
    // 生成目录树
    renderTree() {
      if (!this.UIMeta.listViewModel.tree) return
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
      return new Promise((resolve,reject) => {
        this.UIMeta.listViewModel.dataView.views.forEach((view, vIndex) => {
          this.UIMeta.listViewModel.querys.forEach((query, qIndex) => {
            if (view.queryName === query.name) {
              this.$http.get(`/api/${query.actionUrl}/${query.queryMethod}`).then((res) => {
                console.log(view.name,'view.name---------');
                
                // this.list[view.name] = []
                this.$set(this.list, view.name, [])
                res.data.resultList.forEach((item, index) => {
                  // this.list[view.name][index] = {}
                  this.$set(this.list[view.name], index, {})
                  this.grid[view.name].forEach((thead, tIndex) => {
                    // this.list[view.name][index][thead.prop] = item[thead.prop]
                    this.$set(this.list[view.name][index], thead.prop, item[thead.prop])
                  })
                })
                if (vIndex === this.UIMeta.listViewModel.dataView.views.length-1 && qIndex === this.UIMeta.listViewModel.querys.length-1) {
                  console.log(this.list, 'this.list[view.name]');
                  console.log(this.grid, 'this.grid[view.name]');
                  
                  resolve('ok')
                }
              })
            }
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
      // 点击节点时获取子节点及表数据
      console.log(data, node, ref)
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
#qconHeader {
  padding-top: 6px;
  background-color: #fafafa;
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
  height: calc(100% - 42px);
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

