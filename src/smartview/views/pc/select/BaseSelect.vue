<template>
  <div class="app-container">

      <el-container>

      <!--条件区 -->
      <el-header height="auto" id="select-qCon">
           <!--条件区ref="conditionForm" -->
        <el-form  ref="conditionForm"
                  class="demo-ruleForm"
                  size="mini">
          <el-form-item
                v-for="component in form.getComponent(UIMeta.qCondition.name).children"
                v-if="!component.isMore || (showMoreCondition &&  component.isMore ) "
                :key="component.componentName"
                :style="{width: (component.width <= 1 ? component.width*100 + '%' : component.width + 'px')}"
                :label="component.label"
                :label-width="component.labelWidth+'px'"
                :required="!component.allowBlank">
              <el-switch   v-if="component.ctype === 'checkboxfield'"
                              :readonly="component.readOnly"
                              v-model="component.inputValue"
                              :disabled="!component.enable "
                              @change = "component.saveInputValue()" />

              <el-date-picker v-else-if="component.ctype === 'dateField'"
                              :readonly="component.readOnly"
                              v-model="component.inputValue" type="date"
                              :disabled="!component.enable"
                              @change = "component.saveInputValue()"
                              />

              <el-date-picker v-else-if="component.ctype === 'dateTimeField'"
                              :readonly="component.readOnly"
                              v-model="component.inputValue" type="datetime"
                              :disabled="!component.enable"
                               @change = "component.saveInputValue()"
                               :width = "'auto'" />

              <el-input v-else-if="component.ctype === 'numberfield'" :readonly="component.readOnly"
                        v-model="component.inputValue" type="number" :disabled="!component.enable"
                          @change = "component.saveInputValue()" />

              <el-select v-else-if="component.ctype === 'comboBox'" :readonly="component.readOnly"
                          v-model="component.inputValue" filterable
                          :disabled="!component.enable"    @change = "component.saveInputValue()"  >
                    <el-option v-for="item in component.enumModel.items"
                               :key="item.name" :label="item.label" :value="item.value"/>
              </el-select>

              <el-input v-else
                        v-model="component.inputValue" :disabled="!component.enable"
                        :readonly="component.readOnly"  clearable
                          @change = "component.saveInputValue()" />
          </el-form-item>

          <el-form-item :style="{width: 'auto'}" label-width="100px" >
            <el-button-group>
              <el-button size="mini" @click="queryData()" icon="el-icon-search">查询</el-button>
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


          <!--树区 -->
          <el-aside
              v-if="UIMeta.tree"
              width="200px"
              :style="{'height': treeHeight, 'padding': '0 5px'}">
          <div class="tree-toolbar" v-if="UIMeta.tree.toolbar">
            <el-button-group>
              <el-tooltip class="item" effect="dark"
                 v-for="btn in  form.getComponent(UIMeta.tree.toolbar.name).children"
                 v-if="!btn.isMore"
                 :content="btn.label"
                 placement="top">
                <el-button size="mini">
                  <svg-icon :icon-class="`${btn.iconcls}`"/>
                </el-button>
              </el-tooltip>

              <el-tooltip class="item" effect="dark" content="更多" placement="top">
                <el-dropdown v-if="UIMeta.tree.toolbar.showMoreButton"
                              trigger="click" placement="bottom" szie="mini">
                  <el-button size="mini">
                    <i class="el-icon-arrow-down el-icon--right" style="margin-left:0;"></i>
                  </el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item
                          v-for="btn in  form.getComponent(UIMeta.tree.toolbar.name).children"
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
            <el-tree
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


         <!--数据展示区-->
          <el-container>

              <!--顶部工具栏 -->
            <el-header    height="35px"
                          style="display: flex; justify-content: space-between;">

              <el-button-group v-if="toolbar.children">
                <el-button
                  v-if="toolbar.children > 0 && !component.isMore"
                  v-for="component in toolbar.children"
                  :key="component.componentName"
                  size="mini"
                >
                  <svg-icon :icon-class="`${component.iconcls}`"/>
                  {{ component.label }}
                </el-button>
                <el-dropdown
                  v-if="toolbar.showMoreButton && toolbar.children > 0 "
                  trigger="click"
                  placement="bottom"
                  szie="mini"
                >
                  <el-button size="mini">更多
                    <i class="el-icon-arrow-down el-icon--right" style="margin-left:0;"></i>
                  </el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item v-for="component in toolbar.children"
                              v-if="component.isMore">
                      <svg-icon :icon-class="`${component.iconcls}`"/>
                      {{component.label}}
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </el-button-group>

               <!--分页 -->
              <pagination :total="list.length"
                          :page.sync="listQuery.page"
                          :limit.sync="listQuery.limit"
                          @pagination="queryData" style="margin-top: 0;"/>
            </el-header>

             <!--数据区域 -->
            <el-main class="table-container">

               <!--可选数据列表 -->
              <div class="base-select-container">

  <!-- :height="tableHeight1"  -->
                <el-table ref="originTable"
                            :data="this.componentSet.datasource.dataList"
                            element-loading-text="拼命加载中" border fit stripe
                            :highlight-current-row="selectType === 'single'"
                            :header-cell-style="{background:'#f6f6f6'}"
                            :height="tableHeight1"
                            :cell-style="cellStyle"
                            :row-style="rowStyle"
                            @selection-change="handleOriginSelectionChange"
                            @row-click="handleOriginRowClick"
                            @select="handleSelect">
                   <!--选择标识 -->
                  <el-table-column type="selection" align="center"/>

                  <!--定义数据列 -->
                  <el-table-column
                          v-for="(componentMeta, index) in UIMeta.view.components"
                          :key="componentMeta.name"
                          :prop="componentMeta.field"
                          :label="componentMeta.label" align="left"
                          :fixed="componentMeta.gridFixColumn > index"
                          :width="componentMeta.width > 1 ? componentMeta.width + 'px' : componentMeta.width > 0 && componentMeta.width <= 1 ? componentMeta.width*100 + '%' : ''">

                      <template slot-scope="scope">
                        <img  v-if="componentMeta.ctype === 'image'"
                              :src="scope.row[componentMeta.field]"
                              :width="componentMeta.width">
                        <div v-else-if="componentMeta.ctype === 'valuelistField'"
                              v-html="scope.row[componentMeta.field][componentMeta.valueListModel.displayField]"></div>
                        <div v-else v-html="scope.row[componentMeta.field]"></div>
                      </template>
                  </el-table-column>

                  <!--选择按钮 -->
                  <el-table-column v-if="selectType === 'multi'"
                                fixed="right" label="操作" width="auto" align="center">
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

                 <!--选择工具栏 -->
              <el-button-group v-show="selectType =='multi'"
                                style="display:flex;justify-content:flex-end;margin:3px 0;">
                <el-button type="primary" icon="el-icon-arrow-down"
                            @click="toggleSelection(originSelecttion, 'originTable')">下移选中
                </el-button>
                <el-button type="primary" icon="el-icon-arrow-down"
                           @click="toggleSelection(null, 'originTable')">下移全部
                </el-button>
                <el-button type="primary" icon="el-icon-arrow-up"
                            @click="toggleSelection(selectedSelecttion, 'selectedTable')">上移选中</el-button>
                <el-button type="primary" icon="el-icon-arrow-up"
                           @click="toggleSelection(null, 'selectedTable')">上移全部</el-button>
              </el-button-group>

                <!--多选类型下的已选数据列表 -->
              <div class="base-select-container" v-show="selectType=='multi'">

                <el-table ref="selectedTable"
                        :data="selectedList"
                        element-loading-text="拼命加载中" border fit stripe highlight-current-row
                        :header-cell-style="{background:'#f6f6f6'}"
                        :height="tableHeight2"
                        :cell-style="cellStyle"
                        :row-style="rowStyle"
                        @selection-change="handleSelectedSelectionChange"
                        @row-click="handleSelectedRowClick">
                  <!--选择标识 -->
                  <el-table-column type="selection" align="center"/>

                  <!--定义数据列 -->
                  <el-table-column
                          v-for="(componentMeta, index) in UIMeta.view.components"
                          :key="componentMeta.name"
                          :prop="componentMeta.field"
                          :label="componentMeta.label" align="left"
                          :fixed="componentMeta.gridFixColumn > index"
                          :width="componentMeta.width > 1 ? componentMeta.width + 'px' : componentMeta.width > 0 && componentMeta.width <= 1 ? componentMeta.width*100 + '%' : ''">

                      <template slot-scope="scope">
                        <img  v-if="componentMeta.ctype === 'image'"
                              :src="scope.row[componentMeta.field]"
                              :width="componentMeta.width">
                        <div v-else-if="componentMeta.ctype === 'valuelistField'"
                              v-html="scope.row[componentMeta.field][componentMeta.valueListModel.displayField]"></div>
                        <div v-else v-html="scope.row[componentMeta.field]"></div>
                      </template>
                    </el-table-column>

                  <!--取消选择按钮 -->
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
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="submitFun">确 定</el-button>
      </span>

  </div>
</template>
<script>
import router from '@/router'  //临时代码
import Pagination from '@/components/Pagination'
export default {
  data() {
    return {
     // selectType: 'multi',
     // dialogVisible: true,
     // UiLoaded: false,
      dataLoaded: false,
     // UIMeta: '',
      selectedList: [], // 下表数据
      list: [],  // 上表数据
      height: 300,
      showMoreCondition: false,
      treeHeight: '600px',
     // conditionForm: {},
      //treeRoot: {},
      //treeChild: {},
      //treeGrandchild: {},
      // tree: [],
      //grid: [],
      listQuery: {
        page: 1,
        limit: 20
      },
      //defaultProps: {
     //   children: 'children',
      //  label: 'label'
      //},
      treeProps: {
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
  props: ['form','selectType','callback'],

  computed:{

     UIMeta:function(){
        return this.form.formMeta
      },

      componentSet:function(){
        return this.form.findChild(this.UIMeta.view.name)
      },

      tree:function(){
        return this.form.findChild(this.UIMeta.tree.name)
      },

      toolbar:function(){
        return this.form.findChild(this.UIMeta.toolbar.name)
      },


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
    //this.selectType = this.getParams().selectType

    this.setDialogHeight()
    this.setBodyHeight()
    this.calcHeight()

    // this.$bus.emit('showWorkTeamDialog', {formMeta:data,selectType:single})
    // this.$bus.on('showWorkTeamDialog', data => {
    //   this.dialogVisible = true
    //   this.selectType = data.selectType
    // this.setDialogHeight()
    // this.setBodyHeight()
    // this.calcHeight()
    // })
    this.$bus.on('listSelectionChange', data => {
      console.log(data, 'this.$bus.emit(listSelectionChange, val)');
      this.selectedList = data
    })

     this.getTree().then(() => {
        this.renderTree()
        this.setDialogHeight()
        this.setBodyHeight()
        // this.calcHeight()
      })
      // this.getListData().then(() => {
      //   this.dataLoaded = true
      // })

    // this.getUIMeta().then(() => {
    // //  this.UiLoaded = true
    //   this.getTree().then(() => {
    //     this.renderTree()
    //     this.setDialogHeight()
    //     this.setBodyHeight()
    //     this.calcHeight()
    //   })
    //   this.getListData().then(() => {
    //     this.dataLoaded = true
    //   })
    // })

  },
  methods: {
    // getParams(){
    //   return this.$route.query;
    // },
    closeDialog(){
      this.$bus.emit('closeAppDialog', {
            })
    },
    submitFun(){
      console.log('here call submitFun');
      if(this.selectType === 'single') {
        // 单选模式下，在选中记录后，点击确认时也要把选中记录插入到 selectedList 列表中
        this.toggleSelection(this.originSelecttion, 'originTable')
      }
     // this.getParams().callValueListFromRefeed(this.selectedList);
      this.callback(this.selectedList)
      this.closeDialog()
    },
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
      document.getElementsByClassName('el-dialog')[0].style.height =
          this.UIMeta.height > 1 ? this.UIMeta.height + 'px' : this.UIMeta.height*100 + '%'
      // document.getElementsByClassName('el-dialog')[0].style.height = this.UIMeta.selectViewModel.height > 1 ? this.UIMeta.selectViewModel.height + 'px' : this.UIMeta.selectViewModel.height*100 + '%'
    },
    setBodyHeight() {
      document.getElementsByClassName('el-dialog__body')[0].style.height = parseInt(window.getComputedStyle(document.getElementsByClassName('el-dialog')[0], null).height)
                                                                           - parseInt(window.getComputedStyle(document.getElementsByClassName('el-dialog__header')[0], null).height) - 3
                                                                           - parseInt(window.getComputedStyle(document.getElementsByClassName('el-dialog__footer')[0], null).height) - 3
                                                                           + 'px'
      document.getElementsByClassName('table-container')[0].style.height = parseInt(document.getElementsByClassName('el-dialog__body')[0].style.height)
                                                                          - parseInt(window.getComputedStyle(document.getElementById('select-qCon'), null).height) - 35 + 'px'
    },
    calcHeight() { // 计算弹窗各部分高度
      let footer = document.getElementsByClassName('el-dialog__footer')[0],
          header = document.getElementsByClassName('el-dialog__header')[0],
          qCon = document.getElementById('select-qCon'),
          elDialog = document.getElementsByClassName('el-dialog')[0],
          // elDialog = document.getElementsByClassName('app-container')[0],

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
    handleOriginSelectionChange(val) {
      this.originSelecttion = val;
    },
    handleSelectedSelectionChange(val) {
      this.selectedSelecttion = val
    },
    // getUIMeta() {
    //   return new Promise((resolve,reject) => {
    //     this.$http.get('/api/getSelectUIMeta/com.epower.abd.material.MaterialList').then((res) => {
    //       this.UIMeta = res.data
    //       this.grid = []
    //       this.UIMeta.selectViewModel.view.components.forEach((item, index) => {
    //         // item.forEach((thead) => {
    //           this.grid.push({
    //             prop: item.field,
    //             label: item.label
    //           })
    //         // })
    //       })
    //       resolve(true)
    //     })
    //   })
    // },
    // getListData() {
    //   return new Promise((resolve,reject) => {
    //     this.$http.get('/api/openapi/materialListData').then((res) => {
    //       this.list = [...res.data.resultList]
    //       // this.$set(this.list, res.data.resultList)
    //       // res.data.resultList.forEach((item, index) => {
    //         // this.list[index] = {}
    //         // this.$set(this.list, index, {})
    //         // this.grid.forEach((thead, tIndex) => {
    //         //   this.list[index][thead.prop] = item[thead.prop]
    //         //   this.$set(this.list[index], thead.prop, item[thead.prop])
    //         // })
    //       // })
    //     })
    //   })
    // },
    getTree() {
      return new Promise((resolve,reject) => {
        this.$http.get(`/api/${this.UIMeta.tree.initUrl}/${this.UIMeta.tree.initMethod}`).then((res) => {
          this.treeRoot = JSON.parse(JSON.stringify(res.data))
          this.$http.get(`/api/${this.UIMeta.tree.actionUrl}/${this.UIMeta.tree.method}`).then((res) => {
            this.treeChild = JSON.parse(JSON.stringify(res.data))
            this.$http.get(`/api/${this.UIMeta.tree.actionUrl}/${this.UIMeta.tree.method}`).then((res) => {
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
      console.log(this.tree, 'tree')
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
       this.form.resetCondition()
    },
    queryData(){
       this.form.queryData()
      // setTimeout(() => {
        this.calcHeight()
      // }, 1000)
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
  background-color: #fafafa;
}
.el-dialog__footer {
  padding: 0 10px 10px 10px;
  margin-top: 3px;
  display: flex;
  justify-content: center;
}
.dialog-footer {
  .el-button+.el-button {
    margin-left: 70px;
  }
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
</style>

