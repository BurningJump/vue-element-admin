<template>
  <div class="app-container">
    <el-container>
      <el-header height="auto">查询条件</el-header>
      <el-main>
        <el-form :model="conditionForm" ref="conditionForm" class="demo-ruleForm" label-width="100px" size="mini">
          <el-form-item v-for="condition in qCondition" :key="condition.label" :style="{width: condition.width*100 + '%'}" :label="condition.label" :prop="conditionForm[condition.findField]">
            <el-input v-model="conditionForm[condition.findField]"/>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search">查询</el-button>
            <el-button type="primary" @click="resetForm()">重置</el-button>
          </el-form-item>
        </el-form>
      </el-main>
    </el-container>
    <div class="toolbar">
      <el-button v-for="btn in buttons" :key="btn.label">
        <i v-if="btn.iconcls === 'table_add'" class="el-icon-plus"/>
        <i v-else-if="btn.iconcls === 'table'" class="el-icon-view"/>
        <i v-else-if="btn.iconcls === 'table_edit'" class="el-icon-edit"/>
        <i v-else-if="btn.iconcls === 'table_delete'" class="el-icon-delete"/>
        {{ btn.label }}
      </el-button>
    </div>
    <el-container>
      <el-aside width="200px">
        <el-tree :data="tree" :props="defaultProps" @node-expand="handleNodeExpand" @node-click="handleNodeClick"></el-tree>
      </el-aside>
      <el-container>
        <el-main>
          <el-table ref="multipleTable" expand-on-click-node :data="list" element-loading-text="拼命加载中" border fit highlight-current-row>
            <el-table-column type="selection" align="center"/>
            <el-table-column label="行号" align="center">
              <template slot-scope="scope">
                {{ scope.$index }}
              </template>
            </el-table-column>
            <!-- <el-table-column v-for="header in grid" :key="header.label" :prop="header.prop" :label="header.label" align="center"/> -->
            <el-table-column v-for="header in grid" :key="header.label" :label="header.label" align="center">
              <template slot-scope="scope">
                <div v-html="scope.row[header.prop]"></div>
              </template>
            </el-table-column>
          </el-table>
        </el-main>
        <el-footer>
          <pagination v-show="list.length>0" :total="list.length" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList"/>
        </el-footer>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
export default{
  name: 'PermissionList',
  components: {
    Pagination
  },
  data() {
    return {
      listUI: require('./list-ui.json'),
      listData: require('./list-data.json'),
      treeRoot: require('./root.json'),
      treeChild: require('./child.json'),
      treeGrandchild: require('./grandchild.json'),
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
  mounted() {
    this.getUIdata()
    this.getListData()
    this.renderTree()
    // console.log(this.$.getJSON('http://112.93.248.117:3001/treeRoot.json'))
  },
  methods: {
    getUIdata() {
      this.qCondition = [].concat(this.listUI.listViewModel.qCondition.components)
      this.qCondition.forEach((condition) => {
        this.conditionForm[condition.findField] = ''
      })
      this.buttons = [].concat(this.listUI.listViewModel.toolbar.buttons)
      this.listUI.listViewModel.grid.components.forEach((item) => {
        this.grid.push({
          prop: item.name,
          label: item.label
        })
      })
      this.$http.get('/api/treeRoot.json').then((res) => {
        console.log(res, 'json-----')
      })
      
    },
    // 生成目录树
    renderTree() {
      if (!this.treeRoot.treeRoot.leaf) {
        this.tree.push({
          label: this.treeRoot.treeRoot.text,
          children: []
        })
      } else {
        this.tree.push({
          label: this.treeRoot.treeRoot.text
        })
      }
      this.treeChild.forEach((child) => {
        if (!child.leaf && this.tree[0].children) {
          this.tree[0].children.push({
            label: child.text,
            children: []
          })
        } else {
          this.tree[0].children.push({
            label: child.text
          })
        }
      })
      this.treeGrandchild.forEach((grandchild) => {
        if (!grandchild.leaf) {
          this.tree[0].children.forEach((treeChild) => {
            if (treeChild.children) {
              treeChild.children.push({
                label: grandchild.text,
                children: []
              })
            }
          })
        } else {
          this.tree[0].children.forEach((treeChild) => {
            if (treeChild.children) {
              treeChild.children.push({
                label: grandchild.text
              })
            }
          })
        }
      })
    },
    getListData() {
      this.listData.resultList.forEach((item) => {
        this.list.push({
          l_operationNo: item.operationNo,
          l_operationName: item.operationName,
          l_operationType: item.type ? item.type : 0,
          l_parentOperationNumber: item.parentOperationRef ? item.parentOperationRef.operationNo : '',
          l_parentOperationName: item.parentOperationRef ? item.parentOperationRef.operationName : '',
          l_appType: item.appType
        })
      })
    },
    getList() {
      // 获取分页数据
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleNodeExpand(data, node, ref) {
      // 展开节点
      // console.log(data,node,ref)
    },
    handleNodeClick(data, node, ref) {
    //   // 点击节点时获取子节点及表数据
    //   console.log(data, node, ref)
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
.toolbar {
  margin-bottom: 10px;
}
.el-form {
  display: flex;
  width: 100%;
}
</style>

