<template>
  <el-table :data="agridData" ref="multipleTable" element-loading-text="拼命加载中" border fit stripe highlight-current-row :header-cell-style="{background:'#f6f6f6'}" :height="height" :cell-style="cellStyle" :row-style="rowStyle">
    <el-table-column type="selection" align="center"/>
    <el-table-column v-for="header in headers" :key="header.label" :prop="header.field" :label="header.label" align="center" :width="header.width > 1 ? header.width + 'px' : header.width > 0 && header.width <= 1 ? header.width*100 + '%' : ''">
      <template slot-scope="scope">
        <img v-if="header.ctype === 'image'" :src="scope.row[header.field]" :width="header.width">
        <div v-else-if="header.ctype === 'valuelistField'" v-html="scope.row[header.field][header.valueListModel.displayField]"></div>
        <div v-else v-html="scope.row[header.field]"></div>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  name: 'com.epower.fw.smartview.detail.BaseDetailAGrid',
  data() {
    return {}
  },
  props: ['agridData', 'height', 'headers'],
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
}
</script>

