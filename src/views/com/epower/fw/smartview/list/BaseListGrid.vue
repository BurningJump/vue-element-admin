<template>
  <div>
    <el-main style="padding:0;" class="base-list-grid-container">

     <!--顶部按钮 -->
      <div class="topToolbar">
        <div>
          <el-button-group>
            <el-button
                v-for="btn in form.getComponent(viewMeta.topToolbar.name).children"
                v-if="!btn.isMore" size="mini">
              <svg-icon :icon-class="`${btn.iconcls}`"/>
              {{btn.label}}
            </el-button>
            <el-dropdown
                v-if="viewMeta.topToolbar.showMoreButton"
                trigger="click" placement="bottom" szie="mini">
              <el-button size="mini">
                更多<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                      v-for="btn in form.getComponent(viewMeta.topToolbar.name).children"
                      v-if="btn.isMore">
                  <svg-icon :icon-class="`${btn.iconcls}`"/>
                  {{btn.label}}
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-button-group>
        </div>
      </div>

     <!--grid绘制处理-->
      <el-table ref="multipleTable"
                :data="this.componentSet.datasource.dataList"
                element-loading-text="拼命加载中" border fit stripe highlight-current-row
                :header-cell-style="{background:'#f6f6f6'}"
                :height="height"
                :cell-style="cellStyle"
                :row-style="rowStyle"
                @selection-change="handleSelectionChange">

        <el-table-column type="selection" align="center"/>

        <el-table-column
              v-for="(componentMeta, index) in viewMeta.componentSet.components"
               v-if="componentMeta.ctype !== 'rowToolbar' "
              :key="componentMeta.name"
              :prop="componentMeta.field"
              :label="componentMeta.label" align="left"
              :fixed="componentMeta.gridFixColumn > index"
              :width="componentMeta.width > 1 ? componentMeta.width + 'px' : componentMeta.width > 0 && componentMeta.width <= 1 ? componentMeta.width*100 + '%' : ''">

          <template slot-scope="scope">
            <img  v-if="componentMeta.ctype === 'image'"
                  :src="scope.row[componentMeta.fieldName]"
                  :width="componentMeta.width">
            <div v-else-if="componentMeta.ctype === 'valuelistField'" v-html="scope.row[componentMeta.fieldName][componentMeta.valueListModel.displayField]"></div>
            <div v-else v-html="scope.row[componentMeta.fieldName]"></div>
          </template>
        </el-table-column>

        <el-table-column
            v-for="(componentMeta, index) in viewMeta.componentSet.components"
            v-if="componentMeta.ctype === 'rowToolbar' "
            fixed="right" label="操作" width="auto" align="center">
          <template slot-scope="scope">
            <el-button-group>
              <el-tooltip
                    v-for="btn in componentMeta.components"
                    v-if="!btn.isMore" class="item" effect="dark"
                    :content="btn.label" placement="top">
                <el-button @click="handleClick(scope.$index, scope.row, btn.fun)" size="mini">
                  <svg-icon :icon-class="`${btn.iconcls}`"/>
                </el-button>
              </el-tooltip>

              <el-dropdown v-if="componentMeta.showMoreButton" trigger="click" placement="bottom" szie="mini">
                <el-button size="mini">
                  <i class="el-icon-arrow-down el-icon--right" style="margin-left:0;"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item v-for="btn in componentMeta.components" v-if="btn.isMore">
                    <svg-icon :icon-class="`${btn.iconcls}`"/>
                    {{btn.label}}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-button-group>
          </template>
        </el-table-column>


      </el-table>
    </el-main>

     <!--底部按钮-->
    <el-footer style="height:auto;" id="grid-footer">
      <div class="footerToolbar" v-if="viewMeta.footerToolbar">
        <div>
          <el-button-group>
            <el-button
                v-for="btn in form.getComponent(viewMeta.footerToolbar.name).children"
                v-if="!btn.isMore" size="mini">
              <svg-icon :icon-class="`${btn.iconcls}`"/>
              {{btn.label}}
            </el-button>
            <el-dropdown
                v-if="viewMeta.footerToolbar.showMoreButton"
                trigger="click" placement="bottom" szie="mini">
              <el-button size="mini">
                更多<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                    v-for="btn in form.getComponent(viewMeta.footerToolbar.name).children"
                    v-if="btn.isMore">
                  <svg-icon :icon-class="`${btn.iconcls}`"/>
                  {{btn.label}}
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-button-group>
        </div>
      </div>
      <pagination v-show="this.componentSet.datasource.dataList.length>0"
                  :total="this.componentSet.datasource.dataList.length"
                  :page.sync="listQuery.page"
                  :limit.sync="listQuery.limit"
                  @pagination="getList"/>
    </el-footer>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
export default {
  name: 'com-epower-fw-smartview-list-BaseListGrid',
  data() {
    return {
      listQuery: {
        page: 1,
        limit: 20
      },
      componentSet:this.page.findChild(this.viewMeta.componentSet.name)
    }
  },
  props: ['form','view','viewMeta', 'height'], //, 'list', 'grid'
  components: {
    Pagination
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
    getList() {

    },
    handleSelectionChange(val) {
      this.$bus.emit('listSelectionChange', val)
    }
  }
}
</script>

<style lang="scss" scoped>
.topToolbar {
  display: inline-flex;
  position: absolute;
  top: -40px;
  right: 0px;
}
</style>

