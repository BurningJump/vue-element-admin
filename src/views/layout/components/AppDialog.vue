<template>
  <section class="app-dialog">
    <el-dialog :title="dialogTitle"
                :visible.sync="dialogVisible"
                :width = "dialogWidth"
                :higth = "dialogHigth"
                :close-on-click-modal = false
                >
      <!-- <transition name="dialog-fade-transform" mode="out-in">
        <router-view name='appDialog'  :key="key" />
      </transition> -->
      <!-- <div class="app-dialog-container">
        {{dialogContent}}
      </div> -->

      <component :is="dialogComponentName"></component>

    </el-dialog>
  </section>
</template>

<script>
export default{
  name: 'AppDialog',
  components: {
    com_epower_am_operation_SelectList: () => import('@/views/com/epower/am/operation/SelectList'),
  },
  data() {
    return {
      dialogVisible: false,
      dialogTitle: '',
      dialogContent: '',
      dialogWidth:'300px',
      dialogHigth:'600px',
      dialogComponentName: 'teamDialog',
    };
  },
  computed: {
    key() {
      return this.$route.fullPath
    }
  },
  mounted() {
    this.$bus.on('showAppDialog', data => {
      this.dialogVisible = true
      this.dialogTitle = data.title
      this.dialogComponentName =   data.component.replace(/\./g, '_')
    })
  }
}
</script>

<style scoped>
.app-dialog {
  /*84 = navbar + tags-view = 50 +34 */
  /* height: calc(100vh - 84px);
  width: 100%; */
  position: relative;
  overflow: auto;
}
</style>

