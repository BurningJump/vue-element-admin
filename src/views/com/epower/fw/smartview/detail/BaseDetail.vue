<template>
  <div class="base-detail-container">
    <base-detail-grid v-if="type === 'grid'" :settings="settings" :height="height"/>
    <base-detail-a-grid v-else-if="type === 'aGrid'" :agridData="agridData" :headers="headers" :height="height"/>
    <base-detail-column v-else-if="type === 'column'" :inputs="inputs"/>
  </div>
</template>

<script>
import BaseDetailAGrid from '@/views/com/epower/fw/smartview/detail/BaseDetailAGrid'
import BaseDetailColumn from '@/views/com/epower/fw/smartview/detail/BaseDetailColumn'
import BaseDetailGrid from '@/views/com/epower/fw/smartview/detail/BaseDetailGrid'
export default {
  data() {
    return {}
  },
  props: {
    type: String,
    settings: Object,
    height: [Number, String],
    inputs: Array,
    headers: Array,
    agridData: Array,
  },
  components: {
    BaseDetailAGrid,
    BaseDetailColumn,
    BaseDetailGrid,
  },
}
</script>

<style lang="scss">
.base-detail-container {
  width: 100%;
}
</style>

