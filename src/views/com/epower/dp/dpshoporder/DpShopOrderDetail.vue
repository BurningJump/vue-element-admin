  <!-- <div class="app-container">
    <el-container v-if="UiLoaded&&dataLoaded">
      <el-header height="auto">
        <el-button-group>
          <el-button v-for="btn in buttons" v-if="!btn.isMore" :key="btn.label" size="mini">
            <svg-icon :icon-class="`${btn.iconcls}`"/>
            {{ btn.label }}
          </el-button>
          <el-dropdown v-if="UIMeta.detailViewModel.masterPage.toolbarModel.showMoreButton" trigger="click" placement="bottom" szie="mini">
            <el-button size="mini">
              更多<i class="el-icon-arrow-down el-icon--right" style="margin-left:0;"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-for="btn in buttons" v-if="btn.isMore">
                <svg-icon :icon-class="`${btn.iconcls}`"/>
                {{btn.label}}
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-button-group>
      </el-header>
      <el-main>
        <el-form v-for="input in masterPageInputs" :key="input.label" :style="{width: input.width*100 + '%'}" class="demo-ruleForm" label-width="100px" size="mini">
          <el-form-item :label="input.label" :required="!Boolean(input.allowBlank)">
            <el-input v-if="input.ctype === 'textfield'" v-model="masterPageData[input.field]"/>
            <el-date-picker v-else-if="input.ctype === 'dateField'" v-model="masterPageData[input.field]" type="date"/>
            <el-date-picker v-else-if="input.ctype === 'dateTimeField'" v-model="masterPageData[input.field]" type="datetime"/>
            <el-select v-else-if="input.ctype === 'comboBox'" v-model="masterPageData[input.field].toString()" filterable>
              <el-option v-for="item in input.enumModel.items" :key="item.value" :label="item.label" :value="item.value"/>
            </el-select>
            <el-input v-else-if="input.ctype === 'numberfield'" v-model="masterPageData[input.field]" type="number"/>
            <el-select v-else-if="input.ctype === 'remoteComboBox'" v-model="masterPageData[input.field]" :remote-method="remoteMethod" multiple filterable remote reserve-keyword>
              <el-option v-for="item in options4" :key="item.value" :label="item.label" :value="item.value"/>
            </el-select>
          </el-form-item>
        </el-form>
      </el-main>
    </el-container>
    <el-tabs v-if="UiLoaded&&dataLoaded" v-model="activeTab" type="card" @tab-click="handleClick">
      <el-tab-pane v-for="(tab,tabIndex) in detailPagesTabs" :key="tab.name" :name="tab.name">
        <span slot="label">
          <svg-icon :icon-class="`${tab.iconcls}`"/>
          {{tab.label}}
        </span>
        <base-detail :url="UIMeta.detailViewModel.datasetInfo.datasets[tabIndex].actionMethod" :tab="tab" :activeTab="activeTab" :type="tab.componentSetModel.style" :settings="detailpageSettings" :tableHeight="tableHeight" :agridData="aGridList[tabIndex]"/>
      </el-tab-pane>
    </el-tabs>
  </div> -->
<script>
// import { HotTable } from '@handsontable/vue'
// import BaseDetail from '@/views/com/epower/fw/smartview/detail/BaseDetail'
import BaseBillDetail from '@/views/com/epower/fw/smartview/detail/BaseBillDetail';
export default {
  name: 'com.epower.dp.dpshoporder.DpShopOrderDetail',
  extends: BaseBillDetail,
  data() {
    return {
      UIapi: `http://root.yiuser.com:3001/getDetailUIMeta/${this.$options.name}`
    }
  },
}
</script>

