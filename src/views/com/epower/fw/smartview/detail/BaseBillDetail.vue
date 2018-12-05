<template>
  <hot-table :settings="settings"></hot-table>
</template>

<script>
import { HotTable } from '@handsontable-pro/vue'

export default {
  name: 'com.epower.fw.smartview.detail.BaseBillDetail',
  data: function() {
    return {
      settings: {
        data: [
          ["", "Ford", "Volvo", "Toyota", "Honda"],
          ["2016", 10, 11, 12, 13],
          ["2017", 20, 11, 14, 13],
          ["2018", 30, 15, 12, 13]
        ],
        colHeaders: true,
        rowHeaders: true,
      }
    }
  },
  components: {
    HotTable
  }
}
</script>

<style>
@import "handsontable-pro/dist/handsontable.full"
</style>