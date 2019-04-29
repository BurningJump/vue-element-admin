<template>
  <section class="app-dialog">
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" >
      <!-- <transition name="dialog-fade-transform" mode="out-in">
        <router-view :key="key"/>
      </transition> -->
      <div class="app-dialog-container">
        {{dialogContent}}
      </div>
    </el-dialog>
  </section>
</template>

<script>
export default{
  name: 'AppDialog',
  data() {
    return {
      dialogVisible: false,
      dialogTitle: '',
      dialogContent: ''
    };
  },
  // computed: {
  //   key() {
  //     return this.$route.fullPath
  //   }
  // },
  mounted() {
    this.$bus.on('showAppDialog', data => {
      this.dialogVisible = true
      this.dialogTitle = data.title
      this.dialogContent = data.content
    })
  }
}
</script>

<style scoped>
.app-dialog {
  /*84 = navbar + tags-view = 50 +34 */
  height: calc(100vh - 84px);
  width: 100%;
  position: relative;
  overflow: auto;
}
</style>

