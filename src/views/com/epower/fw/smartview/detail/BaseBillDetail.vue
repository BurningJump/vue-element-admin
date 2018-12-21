<template>
  <hot-table :settings="settings"></hot-table>
</template>

<script>
import { HotTable } from '@handsontable/vue'

export default {
  name: 'com.epower.fw.smartview.detail.BaseBillDetail',
  data: function() {
    return {
      // settings: {
      //   data: [
      //     {id: 1, name: 'Ted Right', address: ''},
      //     {id: 2, name: 'Frank Honest', address: ''},
      //     {id: 3, name: 'Joan Well', address: ''},
      //     {id: 4, name: 'Gail Polite', address: ''},
      //     {id: 5, name: 'Michael Fair', address: ''},
      //   ],
      //   colHeaders: true,
      //   rowHeaders: true,
      // }
    }
  },
  props: ['settings'],
  components: {
    HotTable
  }
}
</script>

<style>
@import "handsontable/dist/handsontable.full.css"
</style>