<template>
  <div class="app-container">
    <el-dialog
      title="施工队"
      :visible.sync="dialogVisible"
      :width="UIMeta.selectViewModel.width > 1 ? UIMeta.selectViewModel.width + 'px' : UIMeta.selectViewModel.width*100 + '%'"
      :modal-append-to-body="false"
      center :style="{height: UIMeta.selectViewModel.height > 1 ? UIMeta.selectViewModel.height + 'px' : UIMeta.selectViewModel.height*100 + '%'}">
      <el-container v-if="UiLoaded">
        <el-header height="auto" id="qconHeader">
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
            <el-main>
              <div class="base-select-container">
                <el-table ref="multipleTable" :data="list" element-loading-text="拼命加载中" border fit stripe highlight-current-row :header-cell-style="{background:'#f6f6f6'}" :height="height" :cell-style="cellStyle" :row-style="rowStyle" @selection-change="handleSelectionChange">
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
                        <el-button @click="handleClick(scope.$index, scope.row, btn.fun)" size="mini">
                          <i class="el-icon-arrow-down"></i>
                        </el-button>
                      </el-tooltip>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
              <el-button-group v-show="selectType!=='single'" style="display:flex;justify-content:flex-end;margin:3px 0;">
                <el-button type="primary" icon="el-icon-arrow-down">下移选中</el-button>
                <el-button type="primary" icon="el-icon-arrow-down">下移全部</el-button>
                <el-button type="primary" icon="el-icon-arrow-up">上移选中</el-button>
                <el-button type="primary" icon="el-icon-arrow-up">上移全部</el-button>
              </el-button-group>
              <div class="base-select-container" v-show="selectType!=='single'">
                <el-table ref="multipleTable" :data="selectedList" element-loading-text="拼命加载中" border fit stripe highlight-current-row :header-cell-style="{background:'#f6f6f6'}" :height="height*2/3" :cell-style="cellStyle" :row-style="rowStyle">
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
                        <el-button @click="handleClick(scope.$index, scope.row, btn.fun)" size="mini">
                          <i class="el-icon-arrow-up"></i>
                        </el-button>
                      </el-tooltip>
                    </template>
                  </el-table-column>
                </el-table>
                <!-- <el-button type="primary" @click="submit">确定</el-button>
                <el-button @click="cancel">取消</el-button> -->
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
  </div>
</template>
<script>
import Pagination from '@/components/Pagination'
export default {
  data() {
    return {
      selectType: 'multi',
      dialogVisible: true,
      UiLoaded: false,
      dataLoaded: false,
      UIMeta: '',
      selectedList: [],
      list: [],
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
  mounted() {
    // this.$bus.emit('showWorkTeamDialog', {formMeta:data,selectType:single})
    this.$bus.on('showWorkTeamDialog', data => {
      this.selectType = data.selectType
    })
    this.$bus.on('listSelectionChange', data => {
      console.log(data, 'this.$bus.emit(listSelectionChange, val)');
      this.selectedList = data
    })
    this.getUIMeta().then(() => {
      this.UiLoaded = true
      this.getTree().then(() => {
        this.renderTree()
        this.calcTableHeight()
      })
      this.getListData().then(() => {
        this.dataLoaded = true
      })
    })
  },
  methods: {
    submit() {},
    cancel() {},
    getList() {},
    handleSelectionChange(val) {
      this.selectedList = val
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

