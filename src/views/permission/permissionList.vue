<template>
  <div class="app-container">
    <el-container>
      <el-header height="auto">查询条件</el-header>
      <el-main>
        <el-form v-for="condition in qCondition" :key="condition.label" :style="{width: condition.width*100 + '%'}" class="demo-ruleForm" label-width="100px" size="mini">
          <el-form-item :label="condition.label">
            <el-input/>
          </el-form-item>
        </el-form>
        <el-button type="primary" icon="el-icon-search">查询</el-button>
        <el-button type="primary">重置</el-button>
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
        <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
      </el-aside>
      <el-main>
        <el-table ref="multipleTable" :data="list" element-loading-text="拼命加载中" border fit highlight-current-row>
          <el-table-column type="selection" align="center"/>
          <el-table-column label="行号" align="center">
            <template slot-scope="scope">
              {{ scope.$index }}
            </template>
          </el-table-column>
          <el-table-column v-for="header in grid" :key="header.label" :prop="header.prop" :label="header.label" align="center"/>
        </el-table>
        <pagination v-show="list.length>0" :total="list.length" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList"/>
      </el-main>
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
      data: [{
        label: '一级 1',
        children: [{
          label: '二级 1-1',
          children: [{
            label: '三级 1-1-1'
          }]
        }]
      }, {
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
      }, {
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
      }
    }
  },
  mounted() {
    this.getUIdata()
    this.getListData()
  },
  methods: {
    getUIdata() {
      this.qCondition = [].concat(this.listUI.listViewModel.qCondition.components)
      this.buttons = [].concat(this.listUI.listViewModel.toolbar.buttons)
      this.tree = [].concat(this.listUI.listViewModel.tree)
      this.listUI.listViewModel.grid.components.forEach((item) => {
        this.grid.push({
          prop: item.name,
          label: item.label
        })
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
    handleNodeClick(data) {
      console.log(data)
    }
  }
}
</script>

<style lang="scss">
.toolbar {
  margin-bottom: 10px;
}
</style>

