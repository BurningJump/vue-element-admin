<template>
  <div class="base-bill-detail-container">
    <base-detail-column
      v-if="UiLoaded&&dataLoaded"
      :tab="UIMeta.detailViewModel.masterPage"
      :componentSet="vDataView.getComponentSet(this.UIMeta.detailViewModel.masterPage.componentSetModel.name)"
    />
    <el-tabs v-if="UiLoaded&&dataLoaded" v-model="activeTab" type="card" @tab-click="handleClick">
      <el-tab-pane
        v-for="(tab,tabIndex) in UIMeta.detailViewModel.detailPages"
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
            :dataLoaded="dataLoaded"
            :activeTab="activeTab"
            :height="height"
            :componentSet="vDataView.getComponentSet(tab.componentSetModel.name)"
          />
          <base-detail-a-grid
            v-else-if="tab.componentSetModel.style === 'aGrid'"
            :url="UIMeta.detailViewModel.datasetInfo.datasets[tabIndex].actionMethod"
            :tab="tab"
            :activeTab="activeTab"
            :listLoading="listLoading"
            :height="height"
            :componentSet="vDataView.getComponentSet(tab.componentSetModel.name)"
          />

          <base-detail-column
            v-else-if="tab.componentSetModel.style === 'column'"
            :tab="tab"
            :activeTab="activeTab"
            :componentSet="vDataView.getComponentSet(tab.componentSetModel.name)"
          />
        </div>

      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { HotTable } from "@handsontable/vue";
import Handsontable from "handsontable";
import BaseDetailAGrid from "@/views/com/epower/fw/smartview/detail/BaseDetailAGrid";
import BaseDetailColumn from "@/views/com/epower/fw/smartview/detail/BaseDetailColumn";
import BaseDetailGrid from "@/views/com/epower/fw/smartview/detail/BaseDetailGrid";
import VDataView from "@/smartview/VDataView.js";
import VComponentSet from "@/smartview/VComponentSet.js";
export default {
  data() {
    return {
      UIapi: "",
     // options4: [],
      listLoading: false,
      // defaultProps: {
      //   children: "children",
      //   label: "label"
      // },
      UiLoaded: false, // UI获取完成
      dataLoaded: false, // 数据获取完成
      height: 600, // 表头高度
      UIMeta: "",
      dataPackageResp: "",
      activeTab: "",
      tab: Object,
      vDataView: VDataView //add by max
    };
  },
  components: {
    BaseDetailAGrid,
    BaseDetailColumn,
    BaseDetailGrid
  },
  mounted() {
    this.getUIMeta().then(() => {
      this.UiLoaded = true;
      this.getDetailData().then(() => {
        this.dataLoaded = true;
      });
    });
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
    getUIMeta() {
      return new Promise((resolve, reject) => {
        this.$http
          .get(
            `http://root.yiuser.com:3001/getDetailUIMeta/${this.$options.name}`
          )
          .then(res => {
            this.UIMeta = res.data;
            this.activeTab = this.UIMeta.detailViewModel.detailPages[0].name;
            this.vDataView = new VDataView(); //add by max
            this.vDataView.initByDetail(res.data.detailViewModel); //add by max
            resolve("ok");
          });
      });
    },
    // UIMeta.detailViewModel.datasetInfo.datasets.name = UIMeta.detailViewModel.detailPages.componentSetModel.dataset = dataPackageResp.dataPackage.dataSets.name
    // UIMeta.detailViewModel.detasetInfo.datasets.Datasource
    getDetailData() {
      return new Promise((resolve, reject) => {
        if (this.UIMeta.detailViewModel.actionUrl) {
          this.$http.get(this.UIMeta.detailViewModel.actionUrl).then(res => {
            this.dataPackageResp = res.data;
            this.vDataView.loadDataByPackage(this.dataPackageResp.dataPackage); //add by max
            this.vDataView.openAll(); //add by max
            resolve("ok");
          });
        }
      });
    },
    remoteMethod() {},
    handleClick() {}
  }
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

