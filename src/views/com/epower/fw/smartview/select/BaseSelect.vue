<template>
  <!-- <div class="app-container" v-if="UiLoaded"> -->
    <el-dialog
      title="施工队"
      :visible.sync="dialogVisible"
      :width="UIMeta.selectViewModel.width > 1 ? UIMeta.selectViewModel.width + 'px' : UIMeta.selectViewModel.width*100 + '%'"
      :modal-append-to-body="false" center>
      <el-container v-if="UiLoaded">
        <el-header height="auto" id="select-qCon">
          <el-form :inline="true" :model="conditionForm" ref="conditionForm" class="demo-ruleForm" label-width="100px" size="mini">
            <el-form-item v-for="condition in UIMeta.selectViewModel.qCondition.components" v-if="!condition.isMore" :key="condition.label" :style="{width: (condition.width <= 1 ? condition.width*100 + '%' : condition.width + 'px')}" :label="condition.label" :prop="conditionForm[condition.findField]">
              <el-input v-model="conditionForm[condition.findField]"/>
            </el-form-item>
            <el-form-item v-for="condition in UIMeta.selectViewModel.qCondition.components" v-if="condition.isMore && showMoreCondition" :key="condition.label" :style="{width: (condition.width <= 1 ? condition.width*100 + '%' : condition.width + 'px')}" :label="condition.label" :prop="conditionForm[condition.findField]">
              <el-input v-model="conditionForm[condition.findField]"/>
            </el-form-item>
            <el-form-item :style="{width: 'auto'}">
              <el-button-group>
                <el-button size="mini" icon="el-icon-search">查询</el-button>
                <el-button size="mini" @click="resetForm()" icon="el-icon-close">重置</el-button>
                <el-button size="mini" @click="showMoreCondition=!showMoreCondition;calcHeight()">
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
            <div class="tree-toolbar" v-if="UIMeta.selectViewModel.tree.toolbar">
              <el-button-group>
                <el-tooltip class="item" effect="dark" v-for="btn in UIMeta.selectViewModel.tree.toolbar.components" :content="btn.label" placement="top">
                  <el-button size="mini">
                    <svg-icon :icon-class="`${btn.iconcls}`"/>
                  </el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="更多" placement="top">
                  <el-dropdown v-if="UIMeta.selectViewModel.tree.toolbar.showMoreButton" trigger="click" placement="bottom" szie="mini">
                    <el-button size="mini">
                      <i class="el-icon-arrow-down el-icon--right" style="margin-left:0;"></i>
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item v-for="btn in UIMeta.selectViewModel.tree.toolbar.components" v-if="btn.isMore">
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
          <el-container>
            <el-header
              v-if="UIMeta.selectViewModel.toolbar.components.length > 0"
              height="35px" style="display: flex; justify-content: space-between;"
            >
              <el-button-group v-if="UIMeta.selectViewModel.toolbar.components.length > 0">
                <el-button
                  v-for="btn in UIMeta.selectViewModel.toolbar.components"
                  v-if="UIMeta.selectViewModel.toolbar.components.length > 0 && !btn.isMore"
                  :key="btn.label"
                  size="mini"
                >
                  <svg-icon :icon-class="`${btn.iconcls}`"/>
                  {{ btn.label }}
                </el-button>
                <el-dropdown
                  v-if="UIMeta.selectViewModel.toolbar.showMoreButton"
                  trigger="click"
                  placement="bottom"
                  szie="mini"
                >
                  <el-button size="mini">更多
                    <i class="el-icon-arrow-down el-icon--right" style="margin-left:0;"></i>
                  </el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item v-for="btn in UIMeta.selectViewModel.toolbar.buttons" v-if="btn.isMore">
                      <svg-icon :icon-class="`${btn.iconcls}`"/>
                      {{btn.label}}
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </el-button-group>
              <pagination :total="list.length" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" style="margin-top: 0;"/>
            </el-header>
            <el-main class="table-container">
              <div class="base-select-container">
                <el-table ref="originTable" :data="list" element-loading-text="拼命加载中" border fit stripe :highlight-current-row="selectType === 'single'" :header-cell-style="{background:'#f6f6f6'}" :height="tableHeight1" :cell-style="cellStyle" :row-style="rowStyle" @selection-change="handleOriginSelectionChange" @row-click="handleOriginRowClick" @select="handleSelect">
                  <el-table-column type="selection" align="center"/>
                  <el-table-column v-for="(header, index) in grid" :key="header.label" :prop="header.field" :label="header.label" align="center" :fixed="UIMeta.selectViewModel.view.gridFixColumn > index" :width="header.width > 1 ? header.width + 'px' : header.width > 0 && header.width <= 1 ? header.width*100 + '%' : ''">
                    <template slot-scope="scope">
                      <img v-if="header.ctype === 'image'" :src="scope.row[header.prop]" :width="header.width">
                      <div v-else-if="header.ctype === 'valuelistField'" v-html="scope.row[header.prop][header.valueListModel.displayField]"></div>
                      <div v-else v-html="scope.row[header.prop]"></div>
                    </template>
                  </el-table-column>
                  <el-table-column fixed="right" label="操作" width="auto" align="center">
                    <template slot-scope="scope">
                      <el-tooltip class="item" effect="dark" content="下移" placement="top">
                        <el-button @click="addToSelectedTable(scope.$index, scope.row)" size="mini">
                          <i class="el-icon-arrow-down"></i>
                        </el-button>
                      </el-tooltip>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
              <el-button-group v-show="selectType!=='single'" style="display:flex;justify-content:flex-end;margin:3px 0;">
                <el-button type="primary" icon="el-icon-arrow-down" @click="toggleSelection(originSelecttion, 'originTable')">下移选中</el-button>
                <el-button type="primary" icon="el-icon-arrow-down" @click="toggleSelection(null, 'originTable')">下移全部</el-button>
                <el-button type="primary" icon="el-icon-arrow-up"  @click="toggleSelection(selectedSelecttion, 'selectedTable')">上移选中</el-button>
                <el-button type="primary" icon="el-icon-arrow-up" @click="toggleSelection(null, 'selectedTable')">上移全部</el-button>
              </el-button-group>
              <div class="base-select-container" v-show="selectType!=='single'">
                <el-table ref="selectedTable" :data="selectedList" element-loading-text="拼命加载中" border fit stripe highlight-current-row :header-cell-style="{background:'#f6f6f6'}" :height="tableHeight2" :cell-style="cellStyle" :row-style="rowStyle" @selection-change="handleSelectedSelectionChange" @row-click="handleSelectedRowClick">
                  <el-table-column type="selection" align="center"/>
                  <el-table-column v-for="(header, index) in grid" :key="header.label" :prop="header.field" :label="header.label" align="center" :fixed="UIMeta.selectViewModel.view.gridFixColumn > index" :width="header.width > 1 ? header.width + 'px' : header.width > 0 && header.width <= 1 ? header.width*100 + '%' : ''">
                    <template slot-scope="scope">
                      <img v-if="header.ctype === 'image'" :src="scope.row[header.prop]" :width="header.width">
                      <div v-else-if="header.ctype === 'valuelistField'" v-html="scope.row[header.prop][header.valueListModel.displayField]"></div>
                      <div v-else v-html="scope.row[header.prop]"></div>
                    </template>
                  </el-table-column>
                  <el-table-column fixed="right" label="操作" width="auto" align="center">
                    <template slot-scope="scope">
                      <el-tooltip class="item" effect="dark" content="上移" placement="top">
                        <el-button @click="deleteRow(scope.$index, selectedList)" size="mini">
                          <i class="el-icon-arrow-up"></i>
                        </el-button>
                      </el-tooltip>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </el-main>
          </el-container>
        </el-container>
      </el-container>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  <!-- </div> -->
</template>
<script>
import Pagination from '@/components/Pagination'
export default {
  data() {
    return {
      selectType: 'single',
      dialogVisible: true,
      UiLoaded: false,
      dataLoaded: false,
      UIMeta: '',
      selectedList: [], // 下表数据
      list: [],  // 上表数据
      height: 300,
      showMoreCondition: false,
      treeHeight: '600px',
      conditionForm: {},
      treeRoot: {},
      treeChild: {},
      treeGrandchild: {},
      tree: [],
      grid: [],
      listQuery: {
        page: 1,
        limit: 20
      },
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      tableHeight1: 0,
      tableHeight2: 0,
      index1: 0.6,
      index2: 0.4,
      originSelecttion: [], // 上表选中数据
      selectedSelecttion: []  // 下表选中数据
    }
  },
  components: {
    Pagination
  },
  // props: ['grid', 'view'],
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
  watch: {
    selectType(val) {
      if (val === 'multi') {
        this.index1 = 0.6
        this.index2 = 0.4
      } else {
        this.index1 = 1
        this.index2 = 0
      }
    }
  },
  mounted() {
    // this.$bus.emit('showWorkTeamDialog', {formMeta:data,selectType:single})
    this.$bus.on('showWorkTeamDialog', data => {
      this.dialogVisible = true
      this.selectType = data.selectType
      this.setDialogHeight()
      this.setBodyHeight()
      this.calcHeight()
    })
    this.$bus.on('listSelectionChange', data => {
      console.log(data, 'this.$bus.emit(listSelectionChange, val)');
      this.selectedList = data
    })
    this.getUIMeta().then(() => {
      this.UiLoaded = true
      this.getTree().then(() => {
        this.renderTree()
        this.setDialogHeight()
        this.setBodyHeight()
        this.calcHeight()
      })
      this.getListData().then(() => {
        this.dataLoaded = true
      })
    })
  },
  methods: {
    handleSelect(selection, row) {
      if (this.selectType === 'single') {
        // 单选模式下， 只能选中一条，一旦选中其中一条，之前选中的数据取消选中
        this.$refs.originTable.clearSelection();
        this.$refs.originTable.toggleRowSelection(row, true);
      }
    },
    handleOriginRowClick(row, event, column) {
      // 点击行数据=选中行数据，选中框勾选上
      if (this.selectType === 'single') {
        // 单选模式下， 只能选中一条，一旦选中其中一条，之前选中的数据取消选中
        this.$refs.originTable.clearSelection();
      }
      this.$refs.originTable.toggleRowSelection(row, true);
    },
    handleSelectedRowClick(row, event, column) {
      // 点击行数据=选中行数据，选中框勾选上
      this.$refs.selectedTable.toggleRowSelection(row, true);
    },
    addToSelectedTable(index, row) {
      // 下移
      this.$refs.originTable.toggleRowSelection(row, true);
      for (let i = 0, len = this.selectedList.length; i < len; i++) {
        if (JSON.stringify(this.selectedList[i]) === JSON.stringify(row)) {
          return
        }
      }
      this.selectedList.push(row)
    },
    toggleSelection(rows, tableName) {
      switch (tableName) {
        case 'originTable':
          if (rows) {
            // 下移选中
            rows.forEach(row => {
              this.$refs.originTable.toggleRowSelection(row, true);
            });
            this.selectedList = [...this.originSelecttion]
          } else {
            // 下移全部
            this.list.forEach(row => {
              this.$refs.originTable.toggleRowSelection(row, true);
            });
            this.selectedList = [...this.list]
          }
          break;
        case 'selectedTable':
          if (rows) {
            // 上移选中
            for (let i = 0; i < this.$refs.selectedTable.selection.length; i++) {
              for (let j = 0; j < this.selectedList.length; j++) {
                if (JSON.stringify(this.$refs.selectedTable.selection[i]) === JSON.stringify(this.selectedList[j])) {
                  // 删除相同数据
                  this.selectedList.splice(j, 1)
                  break;
                }
              }
            }
          } else {
            // 上移全部
            this.$refs.selectedTable.clearSelection();
            this.selectedList = []
          }
          break;
      }
      
      
    },
    deleteRow(index, rows) {
      // 上移
      rows.splice(index, 1);
    },
    setDialogHeight() {
      document.getElementsByClassName('el-dialog')[0].style.height = this.UIMeta.selectViewModel.height > 1 ? this.UIMeta.selectViewModel.height + 'px' : this.UIMeta.selectViewModel.height*100 + '%'
    },
    setBodyHeight() {
      document.getElementsByClassName('el-dialog__body')[0].style.height = parseInt(window.getComputedStyle(document.getElementsByClassName('el-dialog')[0], null).height)
                                                                           - parseInt(window.getComputedStyle(document.getElementsByClassName('el-dialog__header')[0], null).height) - 3
                                                                           - parseInt(window.getComputedStyle(document.getElementsByClassName('el-dialog__footer')[0], null).height) - 3
                                                                           + 'px'
    },
    calcHeight() { // 计算弹窗各部分高度
      let footer = document.getElementsByClassName('el-dialog__footer')[0],
          header = document.getElementsByClassName('el-dialog__header')[0],
          qCon = document.getElementById('select-qCon'),
          elDialog = document.getElementsByClassName('el-dialog')[0],
          body = document.getElementsByClassName('el-dialog__body')[0]

      if (this.selectType === 'multi') {
        this.index1 = 0.6
        this.index2 = 0.4
      } else {
        this.index1 = 1
        this.index2 = 0
      }

      this.tableHeight1 = this.index1 * (parseInt(window.getComputedStyle(elDialog, null).height)
                          - parseInt(window.getComputedStyle(header, null).height) - 3
                          - parseInt(window.getComputedStyle(qCon, null).height)
                          - parseInt(window.getComputedStyle(footer, null).height) - 3)
                          - 35
      this.tableHeight2 = this.index2 * (parseInt(window.getComputedStyle(elDialog, null).height)
                          - parseInt(window.getComputedStyle(header, null).height) - 3
                          - parseInt(window.getComputedStyle(qCon, null).height)
                          - parseInt(window.getComputedStyle(footer, null).height) - 3)
                          - 41
      this.treeHeight = parseInt(window.getComputedStyle(body, null).height)
                        // - 25 - 30
                        - parseInt(window.getComputedStyle(qCon, null).height)
                        + 'px'
    },
    getList() {},
    handleOriginSelectionChange(val) {
      this.originSelecttion = val;
    },
    handleSelectedSelectionChange(val) {
      this.selectedSelecttion = val
    },
    getUIMeta() {
      return new Promise((resolve,reject) => {
        this.$http.get('http://root.yiuser.com:3001/getSelectUIMeta/com.epower.abd.abdworkteam.AbdWorkTeamList').then((res) => {
          this.UIMeta = res.data
          this.grid = []
          this.UIMeta.selectViewModel.view.components.forEach((item, index) => {
            // item.forEach((thead) => {
              this.grid.push({
                prop: item.field,
                label: item.label
              })
            // })
          })
          resolve(true)
        })
      })
    },
    getListData() {
      return new Promise((resolve,reject) => {
        this.$http.get('http://root.yiuser.com:3001/openapi/workTeamListData').then((res) => {
          this.list = []
          res.data.resultList.forEach((item, index) => {
            this.list[index] = {}
            this.grid.forEach((thead, tIndex) => {
              this.list[index][thead.prop] = item[thead.prop]
            })
          })
        })
      })
    },
    getTree() {
      return new Promise((resolve,reject) => {
        this.$http.get(`http://root.yiuser.com:3001/${this.UIMeta.selectViewModel.tree.initUrl}/${this.UIMeta.selectViewModel.tree.initMethod}`).then((res) => {
          this.treeRoot = JSON.parse(JSON.stringify(res.data))
          this.$http.get(`http://root.yiuser.com:3001/${this.UIMeta.selectViewModel.tree.actionUrl}/${this.UIMeta.selectViewModel.tree.method}`).then((res) => {
            this.treeChild = JSON.parse(JSON.stringify(res.data))
            this.$http.get(`http://root.yiuser.com:3001/${this.UIMeta.selectViewModel.tree.actionUrl}/${this.UIMeta.selectViewModel.tree.method}`).then((res) => {
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
.el-dialog__wrapper {
  overflow: hidden;
}
.el-dialog__header {
  text-align: left;
  padding: 0;
  margin-bottom: 3px;
  border-bottom: 1px solid #d8dce5;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);
}
.el-dialog__title {
  margin-left: 10px;
  line-height: 40px;
}
#select-qCon {
  border-bottom: 1px solid #e4e7ed;
}
.el-dialog__footer {
  padding: 0 0 10px 0;
  margin-top: 3px;
}
.el-dialog--center .el-dialog__body {
  padding: 0;
}
.el-dialog__body {
  overflow: hidden;
  padding: 0;
}
.table-container {
  padding: 0 20px;
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
</style>

