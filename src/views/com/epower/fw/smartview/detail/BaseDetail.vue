<template>
  <div class="base-detail-container">
    <base-detail-grid v-if="tab.componentSetModel.style === 'grid'" :tab="tab" :activeTab="activeTab" :settings="settings" :tableHeight="tableHeight"/>
    <base-detail-a-grid v-else-if="tab.componentSetModel.style === 'aGrid'" :url="url" :tab="tab" :activeTab="activeTab" :listLoading="listLoading" :agridData="agridData" :height="tableHeight"/>
    <base-detail-column v-else-if="tab.componentSetModel.style === 'column'" :tab="tab" :activeTab="activeTab"/>
  </div>
</template>

<script>
import BaseDetailAGrid from '@/views/com/epower/fw/smartview/detail/BaseDetailAGrid'
import BaseDetailColumn from '@/views/com/epower/fw/smartview/detail/BaseDetailColumn'
import BaseDetailGrid from '@/views/com/epower/fw/smartview/detail/BaseDetailGrid'
export default {
  data() {
    return {
      defaultProps: {
        children: 'children',
        label: 'label'
      },
    }
  },
  props: {
    url: String,
    tab: Object,
    activeTab: String,
    settings: Object,
    tableHeight: [Number, String],
    agridData: Array,
    treeHeight: [Number, String],
  },
  components: {
    BaseDetailAGrid,
    BaseDetailColumn,
    BaseDetailGrid,
  },
  methods: {
    
  }
}
</script>

<style lang="scss">
.base-detail-container {
  width: 100%;
}
</style>

