<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <keep-alive :include="cachedViews">
        <router-view :key="key"/>
      </keep-alive>
    </transition>
  </section>
</template>

<script>
import  * as UID  from '@/smartview/util/uuid.js';

export default {
  name: 'AppMain',
  computed: {
    cachedViews() {
      return this.$store.state.tagsView.cachedViews
    },
    key() {
       var akey = new UID.UUID().toString()
      return this.$route.fullPath +'/'+  akey
    }
  }
}
</script>

<style scoped>
.app-main {
  /*84 = navbar + tags-view = 50 +34 */
  height: calc(100vh - 84px);
  width: 100%;
  position: relative;
  overflow: auto;
}
</style>

