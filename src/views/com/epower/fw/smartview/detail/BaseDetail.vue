<template>
  <div class="base-bill-detail-container" v-if="form">
    <slot name="header"></slot>
    <base-detail-column
      :pageModel="form.formMeta.masterPage"
      :page ="form.getComponent(form.formMeta.masterPage.name)"
      @onButtonClick = "handleButtonClick"
    />
    <el-tabs v-model="form.activeDetailPage" type="card" @tab-click="handleTabClick">
      <el-tab-pane
        v-for="(pageModel,pageIndex) in form.formMeta.detailPages"
        :key="pageModel.name"
        :name="pageModel.name"
      >
        <span slot="label">
          <svg-icon :icon-class="`${pageModel.iconcls}`"/>
          {{pageModel.label}}
        </span>
        <div class="base-detail-container">
          <base-detail-grid
            v-if="pageModel.componentSetModel.style === 'grid'"
            :activeTab="form.activeDetailPage"
            :pageModel="pageModel"
            :page ="form.getComponent(pageModel.name)"
            :height="height"
             @onButtonClick = "handleButtonClick"
          />
          <base-detail-a-grid
            v-else-if="pageModel.componentSetModel.style === 'aGrid'"
            :activeTab="form.activeDetailPage"
            :pageModel="pageModel"
            :page ="form.getComponent(pageModel.name)"
            :height="height"
          />
          <base-detail-column
            v-else-if="pageModel.componentSetModel.style === 'column'"
            :activeTab="form.activeDetailPage"
            :pageModel="pageModel"
            :page ="form.getComponent(pageModel.name)"
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

export default {
  name: 'com-epower-fw-smartview-detail-BaseDetail',
  data() {
    return {
      listLoading: false,
      height: 600, // 表头高度
    };
  },
  props: ['form'],
  components: {
    BaseDetailAGrid,
    BaseDetailColumn,
    BaseDetailGrid
  },
  mounted() {
    this.calcTableHeight();
  },
  methods: {
    calcTableHeight() {
      setTimeout(() => {
        // this.height =
        //   window.innerHeight -
        //   parseInt(
        //     window.getComputedStyle(document.getElementById("qconHeader"), null)
        //       .height
        //   ) -
        //   190;
        // this.height = (window.innerHeight - parseInt(window.getComputedStyle(document.getElementById('qconHeader'), null).height) - 100) + 'px'
      });
    },
    remoteMethod() {},
    handleTabClick() {},
    handleButtonClick(params){
      params['form'] = this.form;
      var button = params.component;
        button.fire('click',params)
        console.log(params.component.fun);
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

