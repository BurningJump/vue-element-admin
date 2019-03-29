<template>
  <div class="app-container">
    <el-container >
      <!--条件区 -->
      <el-header height="auto" id="qconHeader">
           <!--条件区ref="conditionForm" -->
        <el-form :model="form.conditionDataSource.record"
                  ref="conditionForm"
                  class="demo-ruleForm"
                  label-width="100px"
                  size="mini">
          <el-form-item
                v-for="input in form.getComponent(form.UIMeta.qCondition.name).children"
                v-if="!input.isMore  ||  (condition.isMore && showMoreCondition) "
                :key="input.name"
                :style="{width: (input.width <= 1 ? condition.width*100 + '%' : condition.width + 'px')}"
                :label="input.label"
                :prop="input.findField"
                :required="!input.allowBlank">
            <!--
            <el-input v-model="conditionForm[condition.findField]"/>
             -->
             <el-input  v-if="input.ctype === 'textfield' "
                        v-model="input.inputValue" :disabled="!input.enable"  :readonly="input.readOnly"  clearable
                       @blur = "input.saveInputValue()"  />
              <el-checkbox v-else-if="input.ctype === 'checkboxField'" v-model="input.inputValue" :disabled="!input.enable "   @blur = "input.saveInputValue()" />
              <el-date-picker v-else-if="input.ctype === 'dateField'" v-model="input.inputValue" type="date" :disabled="!input.enable"  @blur = "input.saveInputValue()" />
              <el-date-picker v-else-if="input.ctype === 'dateTimeField'" v-model="input.inputValue" type="datetime" :disabled="!input.enable"    @blur = "input.saveInputValue()"/>
              <el-input v-else-if="input.ctype === 'numberfield'" v-model="input.inputValue" type="number" :disabled="!input.enable"    @blur = "input.saveInputValue()" />
              <el-select v-else-if="input.ctype === 'comboBox'" v-model="input.inputValue" filterable :disabled="!input.enable"  @blur = "input.saveInputValue()"  >
              <el-option v-for="item in input.enumModel.items" :key="item.name" :label="item.label" :value="item.value"/>
          </el-select>
          </el-form-item>
          <!--
          <el-form-item v-for="condition in UIMeta.listViewModel.qCondition.components"
              v-if="condition.isMore && showMoreCondition"
              :key="condition.name"
              :style="{width: (condition.width <= 1 ? condition.width*100 + '%' : condition.width + 'px')}"
              :label="condition.label" :prop="conditionForm[condition.findField]">
            <el-input v-model="conditionForm[condition.findField]"/>
          </el-form-item>
         -->
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
      <!--树区 -->
      <el-container>
        <el-aside v-if="form.UIMeta.tree" width="200px" :style="{'height': treeHeight, 'padding': '0 5px'}">
          <div class="tree-toolbar" v-if="form.UIMeta.tree.toolbar">
            <el-button-group>
              <el-tooltip class="item" effect="dark"
                 v-for="btn in  form.getComponent(form.UIMeta.tree.toolbar.name).children"
                 v-if="!btn.isMore"
                 :content="btn.label"
                 placement="top">
                <el-button size="mini">
                  <svg-icon :icon-class="`${btn.iconcls}`"/>
                </el-button>
              </el-tooltip>

              <el-tooltip class="item" effect="dark" content="更多" placement="top">
                <el-dropdown v-if="form.UIMeta.tree.toolbar.showMoreButton" trigger="click" placement="bottom" szie="mini">
                  <el-button size="mini">
                    <i class="el-icon-arrow-down el-icon--right" style="margin-left:0;"></i>
                  </el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item
                          v-for="btn in  form.getComponent(form.UIMeta.tree.toolbar.name).children"
                          v-if="btn.isMore">
                      <svg-icon :icon-class="`${btn.iconcls}`"/>
                      {{btn.label}}
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </el-tooltip>

            </el-button-group>
          </div>
          <div class="tree-container">
            <el-tree  :data="tree"
                      :props="treeProps" highlight-current
                      :load="form.loadTreeNode"
                       lazy
                      @node-expand="handleNodeExpand"
                      @node-click="handleNodeClick">
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
          <!--如果定义了DataType-->
          <el-tabs v-if=" form.UIMeta.dataType"
                   v-model="form.activeView"
                   @tab-click="handleTabClick">
            <el-tab-pane v-for="tab in form.UIMeta.dataType.types" :name="tab.name">
              <span slot="label">
                <svg-icon :icon-class="`${tab.iconcls}`"/>
                {{tab.label}}
              </span>
              <base-list-grid v-for="viewMeta in form.UIMeta.dataView.views"
                     v-if="viewMeta.componentSet.style === 'grid' && tab.viewName === viewMeta.name"
                     :form="form"
                     :viewMeta="viewMeta"
                     :view ="from.getComponent(viewMeta.name)"
                     :height="tableHeight" />
            </el-tab-pane>
          </el-tabs>
          <!--如果没有定义DataType-->
          <el-tabs v-else
                  v-model="form.activeView"
                  @tab-click="handleTabClick">
            <el-tab-pane v-for="tab in form.UIMeta.dataView.views" :name="tab.name">
              <span slot="label">
                <svg-icon :icon-class="`${tab.iconcls}`"/>
                {{tab.name}}
              </span>
              <base-list-grid v-for="viewMeta in form.UIMeta.dataView.views"
                      v-if="viewMeta.componentSet.style === 'grid'"
                      :form="form"
                      :viewMeta="viewMeta"
                      :view ="from.getComponent(viewMeta.name)"
                      :height="tableHeight" />
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

export default{
  name: 'com.epower.fw.smartview.list.BaseList',
  components: {
    BaseListGrid,
    BaseListCard,
  },
  props: ['form'],
  data() {
    return {
      id: null,
      tempRoute: {},
   //   UiLoaded: false,  // UI获取完成
   //   dataLoaded: false,  // 数据获取完成
      showMoreCondition: false,
      treeHeight: '600px',
      tableHeight: 600, // 表头高度
      dialogVisible: false,
     // activeView: '',activeView
    //  UIMeta: this.form.UIMeta,
      // options: [
      //   {
      //     value: 'more',
      //     label: '更多'
      //   }, {
      //     value: 'less',
      //     label: '收起'
      //   }
      // ],
      // treeRoot: {},
      // treeChild: {},
      // treeGrandchild: {},
      // tree: [],


      // grid: {},
      // list: {},
      // listQuery: {
      //   page: 1,
      //   limit: 20
      // },
      // multipleSelection: [],
      treeProps: {
        children: 'children',
        label: 'label'
      }
      //conditionForm: {},
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
      this.calcTableHeight()
    // this.getUIMeta().then(() => {
    //   this.UiLoaded = true
    //   this.getTree().then(() => {
    //     this.renderTree()
    //   })
    //   this.getListData().then(() => {
    //     this.dataLoaded = true
    //     this.calcTableHeight()
    //   })
    // })
  },
  methods: {
    setTagsViewTitle() {
      this.id = Math.floor(1000*Math.random())
      const title = 'List'
      const route = Object.assign({}, this.tempRoute, { title: `${title}-${this.id}` })
      this.$store.dispatch('updateVisitedView', route)
    },
    calcTableHeight() {
      setTimeout(() => {
        this.tableHeight = window.innerHeight - parseInt(window.getComputedStyle(document.getElementById('qconHeader'), null).height) - parseInt(window.getComputedStyle(document.getElementById('grid-footer'), null).height) - 130
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
    // handleClick(index,row, action) {
    //   switch(action) {
    //     case 'modify':
    //       console.log('修改')
    //       this.dialogVisible = true;
    //     break
    //     case 'new':
    //       console.log('增加')
    //       this.dialogVisible = true;
    //     break
    //     case 'delete':
    //       console.log('删除')
    //     break
    //   }
    // },
    // getUIMeta() {
    //   return new Promise((resolve,reject) => {
    //     this.$http.get(`/api/getListUIMeta/${this.$options.name}`).then((res) => {
    //    //   this.UIMeta = res.data
    //  //     this.activeTab = this.form.UIMeta.dataType
    //       ? this.form.UIMeta.dataType.default
    //       : this.form.UIMeta.dataView.defaultView
    //       this.form.UIMeta.dataView.views.forEach((item, index) => {
    //         this.$set(this.grid, item.name, [])
    //         item.components.forEach((thead) => {
    //           this.grid[item.name].push({
    //             prop: thead.field,
    //             label: thead.label
    //           })
    //         })
    //       })
    //       resolve(true)
    //     })
    //   })
    // },
    // getTree() {
    //   return new Promise((resolve,reject) => {
    //     if (!this.form.UIMeta.tree) {
    //       resolve('notree')
    //     }
    //     this.$http.get(`/api/${this.form.UIMeta.tree.initUrl}/${this.form.UIMeta.tree.initMethod}`).then((res) => {
    //       this.treeRoot = JSON.parse(JSON.stringify(res.data))
    //       this.$http.get(`/api/${this.form.UIMeta.tree.actionUrl}/${this.form.UIMeta.tree.method}`).then((res) => {
    //         this.treeChild = JSON.parse(JSON.stringify(res.data))
    //         this.$http.get(`/api/${this.form.UIMeta.tree.actionUrl}/${this.form.UIMeta.tree.method}`).then((res) => {
    //           this.treeGrandchild = JSON.parse(JSON.stringify(res.data))
    //           resolve(true)
    //         }).catch((err) => {
    //           reject(err)
    //         })
    //       })
    //     })
    //   })
    // },
    // 生成目录树
    // renderTree() {
    //   if (!this.form.UIMeta.tree) return
    //   if (!this.treeRoot.treeRoot.leaf) {
    //     this.tree.push({
    //       iconcls: this.treeRoot.treeRoot.iconcls,
    //       label: this.treeRoot.treeRoot.text,
    //       children: []
    //     })
    //   } else {
    //     this.tree.push({
    //       iconcls: this.treeRoot.treeRoot.iconcls,
    //       label: this.treeRoot.treeRoot.text
    //     })
    //   }
    //   this.treeChild.forEach((child) => {
    //     if (!child.leaf && this.tree[0].children) {
    //       this.tree[0].children.push({
    //         iconcls: child.iconcls,
    //         label: child.text,
    //         children: []
    //       })
    //     } else {
    //       this.tree[0].children.push({
    //         iconcls: child.iconcls,
    //         label: child.text
    //       })
    //     }
    //   })
    //   this.treeGrandchild.forEach((grandchild) => {
    //     if (!grandchild.leaf) {
    //       this.tree[0].children.forEach((treeChild) => {
    //         if (treeChild.children) {
    //           treeChild.children.push({
    //             iconcls: grandchild.iconcls,
    //             label: grandchild.text,
    //             children: []
    //           })
    //         }
    //       })
    //     } else {
    //       this.tree[0].children.forEach((treeChild) => {
    //         if (treeChild.children) {
    //           treeChild.children.push({
    //             iconcls: grandchild.iconcls,
    //             label: grandchild.text
    //           })
    //         }
    //       })
    //     }
    //   })
    // },
    // getListData() {
    //   return new Promise((resolve,reject) => {
    //     this.form.UIMeta.dataView.views.forEach((view, vIndex) => {
    //       this.form.UIMeta.querys.forEach((query, qIndex) => {
    //         if (view.queryName === query.name) {
    //           this.$http.get(`/api/${query.actionUrl}/${query.queryMethod}`).then((res) => {
    //             this.$set(this.list, view.name, [])
    //             res.data.resultList.forEach((item, index) => {
    //               this.$set(this.list[view.name], index, {})
    //               this.grid[view.name].forEach((thead, tIndex) => {
    //                 this.$set(this.list[view.name][index], thead.prop, item[thead.prop])
    //               })
    //             })
    //             if (vIndex === this.form.UIMeta.dataView.views.length-1
    //                   && qIndex === this.form.UIMeta.querys.length-1) {
    //               resolve('ok')
    //             }
    //           })
    //         }
    //       })
    //     })
    //   })
    // },
    // getList() {
    //   // 获取分页数据
    // },
    handleTabClick() {},
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleNodeExpand(data, node, ref) {
      // 展开节点
      console.log(data,node,ref)
    },
    handleNodeClick(data, node, ref) {
      // 点击节点时获取子节点及表数据
      console.log(data, node, ref)
    },
    resetForm() {
      form.resetCondition
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

