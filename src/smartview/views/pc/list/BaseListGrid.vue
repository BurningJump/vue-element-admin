<template>
  <div>
    <el-main style="padding:0;" class="base-list-grid-container">

     <!--顶部按钮 -->
      <div class="topToolbar" v-if="viewMeta.topToolbar"  >
        <div>
          <el-button-group>
            <el-button
                v-for="btn in topToolbar.children "
                v-if="!btn.isMore" size="mini">
              <svg-icon :icon-class="`${btn.iconcls}`"/>
              {{btn.label}}
            </el-button>
            <el-dropdown
                v-if="topToolbar.showMoreButton"
                trigger="click" placement="bottom" szie="mini">
              <el-button size="mini">
                更多<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                      v-for="btn in topToolbar.children"
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
                @selection-change="handleSelectionChange"
                @row-dblclick ="handleGridRowDBClick">

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
                  :src="scope.row[componentMeta.field]"
                  :width="componentMeta.width">
            <div v-else-if="componentMeta.ctype === 'valuelistField'"
                  v-html="scope.row[componentMeta.field][componentMeta.valueListModel.displayField]"></div>
            <div v-else v-html="scope.row[componentMeta.field]"></div>
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
                <el-button @click="handleRowButtonClick(scope.$index, scope.row, btn)" size="mini">
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
                v-for="btn in footerToolbar.children"
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
                    v-for="btn in footerToolbar.children"
                    v-if="btn.isMore">
                  <svg-icon :icon-class="`${btn.iconcls}`"/>
                  {{btn.label}}
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-button-group>
        </div>
      </div>
      <pagination v-show="rowTotal>0"
                  :total="rowTotal"
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
      componentSet:this.view.findChild(this.viewMeta.componentSet.name),
    }
  },
  props: ['form','view','viewMeta', 'height'], //, 'list', 'grid'
  components: {
    Pagination
  },
  computed: {
    rowTotal(){
       return  this.componentSet.datasource.getRecordCount()
    },
    topToolbar(){
      if  (this.viewMeta.topToolbar!==undefined){
         return  this.view.findChild(this.viewMeta.topToolbar.name)
      }
      return null
    },
    footerToolbar(){
      if  (this.viewMeta.footerToolbar!==undefined){
         return  this.view.findChild(this.viewMeta.footerToolbar.name)
      }
      return null
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
  methods: {
    handleRowButtonClick(index,row, button) {
       form.handleGridRowButtonClick({sender:button,index:index, row:row})
    },
    getList() {
    },
    handleSelectionChange(val) {
      this.$bus.emit('listSelectionChange', val)
    },
    handleGridRowDBClick(row, column, event){
      this.form.handleGridRowDBClick({sender:this.componentSet,row:row, column:column})
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

