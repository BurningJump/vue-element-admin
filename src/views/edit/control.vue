<template>
  <div class="control-container">
    <!-- 控件组件 -->
    <el-form v-for="input in inputs" :key="input.label" :style="{width: input.width*100 + '%'}" class="demo-ruleForm" label-width="100px" size="mini">
      <el-form-item :label="input.label" :required="!Boolean(input.allowBlank)">
        <el-input v-if="input.ctype === 'textfield'" v-model="inputData[input.field]"/>
        <el-date-picker v-else-if="input.ctype === 'dateTimeField'" v-model="inputData[input.field]" type="datetime"/>
        <el-select v-else-if="input.ctype === 'comboBox'" v-model="inputData[input.field].toString()" filterable>
          <el-option v-for="item in input.enumModel.items" :key="item.value" :label="item.label" :value="item.value"/>
        </el-select>
        <el-input v-else-if="input.ctype === 'numberfield'" v-model="inputData[input.field]" type="number"/>
        <el-select v-else-if="input.ctype === 'remoteComboBox'" v-model="inputData[input.field]" :remote-method="remoteMethod" multiple filterable remote reserve-keyword>
          <el-option v-for="item in options4" :key="item.value" :label="item.label" :value="item.value"/>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  props: {
    type: {
      type: String,
      default: 'textfield'
    },
    inputs: {
      type: Array,
      default: []
    },
    inputData: {
      type: Array,
      default: []
    },
  },
}
</script>

