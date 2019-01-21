<template>
  <el-container class="base-detail-column-container">
    <el-header
      v-if="tab.toolbarModel.buttons.length > 0 || tab.componentSetModel.style === 'aGrid'"
      height="35px"
    >
      <el-button-group v-if="tab.toolbarModel.buttons.length > 0">
        <el-button
          v-for="btn in tab.toolbarModel.buttons"
          v-if="tab.toolbarModel.buttons.length > 0 && !btn.isMore"
          :key="btn.label"
          size="mini"
        >
          <svg-icon :icon-class="`${btn.iconcls}`"/>
          {{ btn.label }}
        </el-button>
        <el-dropdown
          v-if="tab.toolbarModel.showMoreButton"
          trigger="click"
          placement="bottom"
          szie="mini"
        >
          <el-button size="mini">更多
            <i class="el-icon-arrow-down el-icon--right" style="margin-left:0;"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-for="btn in tab.toolbarModel.buttons" v-if="btn.isMore">
              <svg-icon :icon-class="`${btn.iconcls}`"/>
              {{btn.label}}
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-button-group>
    </el-header>
    <el-main>
      <el-form
        v-for="input in componentSet.components"
        :key="input.componentName"
        :style="{width: input.width*100 + '%'}"
        class="demo-ruleForm"
        label-width="100px"
        size="mini"
      >
        <el-form-item :label="input.label" :required="!Boolean(input.allowBlank)">
          <el-input
            v-if="input.ctype === 'textfield' || input.ctype === 'valuelistField' ||input.ctype === 'remoteComboBox' "
            v-model="input.inputValue" :disabled="!input.enable"  :readonly="input.readOnly"  clearable
            @blur = "input.saveInputValue()"
          />
          <el-checkbox v-else-if="input.ctype === 'checkboxField'" v-model="input.value" :disabled="!input.enable"   />
          <el-date-picker v-else-if="input.ctype === 'dateField'" v-model="input.value" type="date" :disabled="!input.enable"  />
          <el-date-picker v-else-if="input.ctype === 'dateTimeField'" v-model="input.value" type="datetime" :disabled="!input.enable"   />
          <el-input v-else-if="input.ctype === 'numberfield'" v-model="input.value" type="number" :disabled="!input.enable"   />

          <el-select v-else-if="input.ctype === 'comboBox'" v-model="input.value" filterable :disabled="!input.enable"  >
            <el-option v-for="item in input.enumModel.items" :key="item.name" :label="item.label" :value="item.value"/>
          </el-select>

        </el-form-item>
      </el-form>
    </el-main>
  </el-container>
</template>

<script>
export default {
  name: "com.epower.fw.smartview.detail.BaseDetailColumn",
  data() {
    return {};
  },
  props: ["tab", "componentSet"]
};
</script>

