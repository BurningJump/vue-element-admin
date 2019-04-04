<template>
  <el-container class="base-detail-column-container">
    <el-header
      v-if="toolbar.children.length > 0 "
      height="35px"
    >
      <el-button-group v-if="toolbar.children.length > 0">
        <el-button
          v-for="btn in toolbar.children"
          v-if=" !btn.hidden && !btn.isMore"
          :key="btn.componentName"
          :disabled="!btn.enable"
          @click="onClickButton(btn)"
          size="mini"
        >
          <svg-icon :icon-class="`${btn.iconcls}`"/>
          {{ btn.label }}
        </el-button>

        <el-dropdown
          v-if="toolbar.showMoreButton"
          trigger="click"
          placement="bottom"
          szie="mini"
        >
          <el-button size="mini">更多
            <i class="el-icon-arrow-down el-icon--right" style="margin-left:0;"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-for="btn in toolbar.children" v-if="btn.isMore">
              <svg-icon :icon-class="`${btn.iconcls}`"/>
              {{btn.label}}
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-button-group>
    </el-header>
    <el-main>
      <el-form
        v-for="input in componentSet.children"
        :key="input.componentName"
        :style="{width: input.width*100 + '%'}"
        class="demo-ruleForm"
        label-width="100px"
        size="mini"
      >
        <el-form-item :label="input.label" :required="!input.allowBlank">
          <el-input
            v-if="input.ctype === 'textfield' "
            v-model="input.inputValue" :disabled="!input.enable"  :readonly="input.readOnly"  clearable
            @blur = "input.saveInputValue()"  />
          <el-checkbox v-else-if="input.ctype === 'checkboxField'" v-model="input.inputValue" :disabled="!input.enable "   @blur = "input.saveInputValue()" />
          <el-date-picker v-else-if="input.ctype === 'dateField'" v-model="input.inputValue" type="date" :disabled="!input.enable"  @blur = "input.saveInputValue()" />
          <el-date-picker v-else-if="input.ctype === 'dateTimeField'" v-model="input.inputValue" type="datetime" :disabled="!input.enable"    @blur = "input.saveInputValue()"/>
          <el-input v-else-if="input.ctype === 'numberfield'" v-model="input.inputValue" type="number" :disabled="!input.enable"    @blur = "input.saveInputValue()" />
          <el-select v-else-if="input.ctype === 'comboBox'" v-model="input.inputValue" filterable :disabled="!input.enable"  @blur = "input.saveInputValue()"  >
            <el-option v-for="item in input.enumModel.items" :key="item.name" :label="item.label" :value="item.value"/>
          </el-select>

          <remote-combox v-else-if="input.ctype === 'remoteComboBox'" :input="input" :bandValue="input.inputValue"
            :allowcreate="input.allowcreate" :multiple="input.multiple" :disabled="!input.enable" :clearable="input.clearable">
          </remote-combox>
          <value-list v-else-if="input.ctype === 'valuelistField'" :input="input" :bandValue="input.inputValue"
            :allowcreate="input.allowcreate" :multiple="input.multiple" :disabled="!input.enable" :clearable="input.clearable">
          </value-list>

        </el-form-item>
      </el-form>
    </el-main>
  </el-container>
</template>

<script>
import RemoteCombox from "@/components/RemoteCombox";
import ValueList from "@/components/ValueList";
export default {
  name: "com-epower-fw-smartview-detail-BaseDetailColumn",
  data() {
    return {
      componentSet:this.page.findChild(this.pageModel.componentSetModel.name),
      toolbar:this.page.findChild(this.pageModel.toolbarModel.name)
    };
  },
  components: {
    RemoteCombox,
    ValueList
  },
  computed:{
  },
  methods: {
    onClickButton:function(button){
       this.$emit('onButtonClick',{component:button});  //使用$emit()引入父组件中的方法
    }
   },
  props: ["pageModel", "page"]
};
</script>

