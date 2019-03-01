<template>
  <div>
    <el-main style="padding:0;" class="base-list-grid-container">
      <div class="topToolbar">
        <div>
          <el-button-group>
            <el-button v-for="btn in view.topToolbar.components" v-if="!btn.isMore" size="mini">
              <svg-icon :icon-class="`${btn.iconcls}`"/>
              {{btn.label}}
            </el-button>
            <el-dropdown v-if="view.topToolbar.showMoreButton" trigger="click" placement="bottom" szie="mini">
              <el-button size="mini">
                更多<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-for="btn in view.topToolbar.components" v-if="btn.isMore">
                  <svg-icon :icon-class="`${btn.iconcls}`"/>
                  {{btn.label}}
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-button-group>
        </div>
      </div>
      <el-table ref="multipleTable" :data="list[view.name]" element-loading-text="拼命加载中" border fit stripe highlight-current-row :header-cell-style="{background:'#f6f6f6'}" :height="height" :cell-style="cellStyle" :row-style="rowStyle" @selection-change="handleSelectionChange">
        <el-table-column type="selection" align="center"/>
        <el-table-column v-for="(header, index) in grid[view.name]" :key="header.label" :prop="header.prop" :label="header.label" align="center" :fixed="view.gridFixColumn > index" :width="header.width > 1 ? header.width + 'px' : header.width > 0 && header.width <= 1 ? header.width*100 + '%' : ''">
          <template slot-scope="scope">
            <img v-if="header.ctype === 'image'" :src="scope.row[header.prop]" :width="header.width">
            <div v-else-if="header.ctype === 'valuelistField'" v-html="scope.row[header.prop][header.valueListModel.displayField]"></div>
            <div v-else v-html="scope.row[header.prop]"></div>
          </template>
        </el-table-column>
        <el-table-column v-if="view.rowToolbar" fixed="right" label="操作" width="auto" align="center">
          <template slot-scope="scope">
            <el-button-group>
              <el-tooltip v-for="btn in view.rowToolbar.components" v-if="!btn.isMore" class="item" effect="dark" :content="btn.label" placement="top">
                <el-button @click="handleClick(scope.$index, scope.row, btn.fun)" size="mini">
                  <svg-icon :icon-class="`${btn.iconcls}`"/>
                </el-button>
              </el-tooltip>
              <el-dropdown v-if="view.rowToolbar.showMoreButton" trigger="click" placement="bottom" szie="mini">
                <el-button size="mini">
                  <i class="el-icon-arrow-down el-icon--right" style="margin-left:0;"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item v-for="btn in view.rowToolbar.components" v-if="btn.isMore">
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
    <el-footer style="height:auto;" id="grid-footer">
      <div class="footerToolbar" v-if="view.footerToolbar">
        <div>
          <el-button-group>
            <el-button v-for="btn in view.footerToolbar.components" v-if="!btn.isMore" size="mini">
              <svg-icon :icon-class="`${btn.iconcls}`"/>
              {{btn.label}}
            </el-button>
            <el-dropdown v-if="view.footerToolbar.showMoreButton" trigger="click" placement="bottom" szie="mini">
              <el-button size="mini">
                更多<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-for="btn in view.footerToolbar.components" v-if="btn.isMore">
                  <svg-icon :icon-class="`${btn.iconcls}`"/>
                  {{btn.label}}
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-button-group>
        </div>
      </div>
      <pagination v-show="list[view.name].length>0" :total="list[view.name].length" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList"/>
    </el-footer>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
export default {
  name: 'com.epower.fw.smartview.list.BaseListGrid',
  data() {
    return {
      listQuery: {
        page: 1,
        limit: 20
      },
    }
  },
  props: ['view', 'height', 'list', 'grid'],
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
    getList() {},
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

