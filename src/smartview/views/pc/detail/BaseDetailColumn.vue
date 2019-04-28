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
        :key="componentSet.componentName"
        class="demo-ruleForm"
        label-width="100px"
        size="mini"
      >
        <el-form-item
                v-for="component in componentSet.children"
                :key="component.componentName"
                :style="{width:component.width*100 + '%'}"
                :label="component.label"
                :required="!component.allowBlank"
                :label-width="component.labelWidth+'px'"
                      >
          <el-checkbox v-if="component.ctype === 'checkboxField'"
            v-model="component.inputValue" :disabled="!component.enable "
            @change = "component.saveInputValue()" />

          <el-date-picker v-else-if="component.ctype === 'dateField'"
              v-model="component.inputValue" type="date"
              :disabled="!component.enable"  @blur = "component.saveInputValue()" />

          <el-date-picker v-else-if="component.ctype === 'dateTimeField'"
                v-model="component.inputValue" type="datetime"
                :disabled="!component.enable"
                @blur = "component.saveInputValue()"/>

          <el-input v-else-if="component.ctype === 'numberfield'"
                v-model="component.inputValue" type="number"
                :disabled="!component.enable"    @blur = "component.saveInputValue()" />

          <el-select v-else-if="component.ctype === 'comboBox'"
              v-model="component.inputValue" filterable :disabled="!component.enable"
              @blur = "component.saveInputValue()"  >
            <el-option v-for="item in component.enumModel.items"
            :key="item.name" :label="item.label" :value="item.value"/>
          </el-select>

          <remote-combox v-else-if="component.ctype === 'remoteComboBox'"
              :input="component" :bandValue="component.inputValue"
            :allowcreate="component.allowcreate" :multiple="component.multiple"
            :disabled="!component.enable"
            :readonly="component.readOnly" 
            :clearable="component.clearable">
          </remote-combox>

          <value-list v-else-if="component.ctype === 'valuelistField'"
                :input="component" :bandValue="component.inputValue"
                :allowcreate="component.allowcreate" :multiple="component.multiple"
                :disabled="!component.enable" 
                :readonly="component.readOnly"
                :clearable="component.clearable">
          </value-list>

          <el-input v-else
              v-model="component.inputValue"
              :disabled="!component.enable"
              :readonly="component.readOnly"  clearable
              @change = "component.saveInputValue()"
               :key="component.fieldName" />

        </el-form-item>
      </el-form>
    </el-main>
  </el-container>
</template>

<script>
import RemoteCombox from "../components/RemoteCombox";
import ValueList from "../components/ValueList";
export default {
  name: "com-epower-fw-smartview-detail-BaseDetailColumn",
  data() {
    return {
    };
  },
  components: {
    RemoteCombox,
    ValueList
  },
  computed:{
      componentSet:function(){
        return this.page.findChild(this.pageModel.componentSetModel.name)
      },

      toolbar:function(){
        return this.page.findChild(this.pageModel.toolbarModel.name)
      }

  },
  methods: {
    onClickButton:function(button){
       this.$emit('onButtonClick',{component:button});  //使用$emit()引入父组件中的方法
    }
   },
  props: ["pageModel", "page"]
};
</script>

