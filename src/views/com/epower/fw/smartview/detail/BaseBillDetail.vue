<template>
  <div class="handson-table-container" :style="{height: height+'px'}">
    <div class="wrapper">
      <hot-table :root="root" :settings="settings"></hot-table>
    </div>
  </div>
</template>

<script>
import { HotTable } from '@handsontable/vue'
import Handsontable from 'handsontable'

export default {
  name: 'com.epower.fw.smartview.detail.BaseBillDetail',
  data: function() {
    return {
      root: 'test-hot',
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
  props: ['settings', 'height'],
  components: {
    HotTable
  },
  mounted() {
    this.$nextTick(() => {
    })
  },
  methods: {
    coverRenderer (instance, td, row, col, prop, value, cellProperties) {
      var escaped = Handsontable.helper.stringify(value),
        img;

      if (escaped.indexOf('http') === 0) {
        img = document.createElement('IMG');
        img.src = value;

        Handsontable.dom.addEvent(img, 'mousedown', function (e){
          e.preventDefault(); // prevent selection quirk
        });

        Handsontable.dom.empty(td);
        td.appendChild(img);
      }
      else {
        // render as text
        Handsontable.renderers.TextRenderer.apply(this, arguments);
      }

      return td;
    },
  }
}
</script>

<style lang="scss">
@import "handsontable/dist/handsontable.full.css";
.handson-table-container {
  width: 100%;
  overflow: hidden;
  .wrapper {
    width: 100%;
    height: 100%;
    overflow: auto;
    th {
      color: #909399;
      font-size: 14px;
      font-weight: bold;
      background: rgb(246, 246, 246);
    }
    td {
      color: #606266;
      font-size: 12px;
    }
    tbody {
      tr:nth-child(2n) {
        td {
        background-color: #fafafa;

        }
      }
    }
  }
}
</style>