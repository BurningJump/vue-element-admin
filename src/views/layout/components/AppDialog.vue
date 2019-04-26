<template>
  <section class="app-dialog">
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" >
        <transition name="dialog-fade-transform" mode="out-in">
              <router-view :key="key"/>
        </transition>
    </el-dialog>
  </section>
</template>

<script>

export default {
  name: 'AppDialog',
  data() {
    return {
      dialogVisible: false,
    };
  },
  computed: {
    key() {
      return this.$route.fullPath
    }
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

