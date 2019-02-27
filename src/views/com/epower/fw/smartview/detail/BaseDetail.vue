<template>
  <div class="base-bill-detail-container">
    <slot name="header"></slot>
    <base-detail-column
      :tab="form.formMeta.masterPage"
      :page ="form.getComponent(form.formMeta.masterPage.name)"
      @onButtonClick = "handleButtonClick"
    />
    <el-tabs v-model="activeTab" type="card" @tab-click="handleTabClick">
      <el-tab-pane
        v-for="(tab,tabIndex) in form.formMeta.detailPages"
        :key="tab.name"
        :name="tab.name"
      >
        <span slot="label">
          <svg-icon :icon-class="`${tab.iconcls}`"/>
          {{tab.label}}
        </span>
        <div class="base-detail-container">
          <base-detail-grid
            v-if="tab.componentSetModel.style === 'grid'"
            :tab="tab"
            :dataLoaded="true"
            :activeTab="activeTab"
            :height="height"
            :componentSet="form.getComponent(tab.componentSetModel.name)"
          />
          <base-detail-a-grid
            v-else-if="tab.componentSetModel.style === 'aGrid'"
            :url="form.formMeta.datasetInfo.datasets[tabIndex].actionMethod"
            :tab="tab"
            :activeTab="activeTab"
            :listLoading="listLoading"
            :height="height"
            :componentSet="form.getComponent(tab.componentSetModel.name)"
          />

          <base-detail-column
            v-else-if="tab.componentSetModel.style === 'column'"
            :tab="tab"
            :activeTab="activeTab"
            :page ="form.getComponent(tab.name)"
            @buttonOnClick = "handleButtonClick"
          />
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>

import BaseDetailAGrid from "@/views/com/epower/fw/smartview/detail/BaseDetailAGrid";
import BaseDetailColumn from "@/views/com/epower/fw/smartview/detail/BaseDetailColumn";
import BaseDetailGrid from "@/views/com/epower/fw/smartview/detail/BaseDetailGrid";
import VBaseDetailForm from "@/smartview/bizform/VBaseDetailForm.js";
import * as cf from "@/smartview/util/commonFun.js";

export default {
  data() {
    return {
      listLoading: false,
      // UiLoaded: false, // UI获取完成
    //  dataLoaded: true, // 数据获取完成
      height: 600, // 表头高度
      // UIMeta: "",
      // dataPackageResp: "",
      activeTab:"",
      // tab: Object,
      // form: null //add by max
    };
  },
  props: ['form'],
  components: {
    BaseDetailAGrid,
    BaseDetailColumn,
    BaseDetailGrid
  },
  watch: {
    'form.formMeta'(val) {
      if (val) {
        this.activeTab = val.detailPages[0].name
      }
    }
  },
  mounted() {
    this.calcTableHeight();
  },
  methods: {
    calcTableHeight() {
      setTimeout(() => {
        this.height =
          window.innerHeight -
          parseInt(
            window.getComputedStyle(document.getElementById("qconHeader"), null)
              .height
          ) -
          190;
        // this.height = (window.innerHeight - parseInt(window.getComputedStyle(document.getElementById('qconHeader'), null).height) - 100) + 'px'
      });
    },
    // getBizForm(formMeta){
    //    return new VBaseDetailForm(this,formMeta)
    // },
    // getUIMeta() {
    //   return new Promise((resolve, reject) => {
    //     this.$http
    //       .get(
    //         `/api/getDetailUIMeta/${this.$options.name}`
    //       )
    //       .then(res => {
    //         this.UIMeta = res.data;
    //         this.activeTab = this.UIMeta.detailViewModel.detailPages[0].name;
    //         this.form = this.getBizForm(res.data.detailViewModel)//add by max
    //         this.UiLoaded = true;
    //         resolve("ok");
    //       });
    //   });
    // },

    // getDetailData() {
    //   return new Promise((resolve, reject) => {
    //     if (this.UIMeta.detailViewModel.actionUrl) {
    //       this.$http.get(`/api/${this.UIMeta.detailViewModel.actionUrl}`).then(res => {
    //         this.dataPackageResp = res.data;
    //         this.dataLoaded = true;
    //         resolve("ok");
    //       });
    //     }
    //   });
    // },
    remoteMethod() {},
    handleTabClick() {},
    handleButtonClick(params){
        console.log(params.component.fun);
        var btnFun	= cf.parseFunctionName(params.component.fun);
				var params= cf.parseFunctionParams(params.component.fun);
        if (this.form.hasOwnProperty(params.component.fun)){
          this.form[params.component.fun](params);
        }
    }
  },
};
</script>

<style lang="scss">
.base-bill-detail-container {
  .el-header {
    padding: 0;
    border-bottom: 1px solid #e4e7ed;
    .el-button-group {
      margin-bottom: 2px;
    }
  }
  .el-main {
    display: flex;
    flex-wrap: wrap;
    padding: 5px;
  }
  .el-form-item {
    margin-bottom: 3px;
  }
  .el-form-item,
  .el-select,
  .el-input {
    width: 100%;
  }
  .el-input__inner {
    height: 22px;
    line-height: 22px;
  }
  .el-form-item__label {
    font-size: 12px;
    font-weight: normal;
  }
  .el-tabs {
    width: 100%;
  }
  .el-tabs__item {
    height: 32px;
    line-height: 32px;
  }
  .el-tabs__header {
    margin: 0 0 3px;
  }
}
.base-detail-container {
  width: 100%;
}
</style>

