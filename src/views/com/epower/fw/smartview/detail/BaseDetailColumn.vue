<template>
  <div class="column">
    <el-main>
      <el-form v-for="input in inputs" :key="input.label" :style="{width: input.width*100 + '%'}" class="demo-ruleForm" label-width="100px" size="mini">
        <el-form-item :label="input.label" :required="!Boolean(input.allowBlank)">
          <el-input v-if="input.ctype === 'textfield'"/>
          <el-checkbox v-else-if="input.ctype === 'checkboxField'"/>
          <el-date-picker v-else-if="input.ctype === 'dateTimeField'"/>
          <el-select v-else-if="input.ctype === 'valuelistField'" filterable>
            <el-option v-for="item in input.valueList" :key="item.value" :label="item.label" :value="item.value"/>
          </el-select>
          <el-select v-else-if="input.ctype === 'comboBox'" filterable>
            <el-option v-for="item in input.enumModel.items" :key="item.value" :label="item.label" :value="item.value"/>
          </el-select>
          <el-input v-else-if="input.ctype === 'numberfield'" type="number"/>
          <el-select v-else-if="input.ctype === 'remoteComboBox'" v-model="value9" :remote-method="remoteMethod" multiple filterable remote reserve-keyword>
            <el-option v-for="item in options4" :key="item.value" :label="item.label" :value="item.value"/>
          </el-select>
        </el-form-item>
      </el-form>
    </el-main>
  </div>
</template>

<script>
export default {
  name: 'com.epower.fw.smartview.detail.BaseDetailColumn',
  data() {
    return {}
  },
  props: ['inputs']
}
</script>

