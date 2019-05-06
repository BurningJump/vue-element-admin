<template>
  <section class="app-dialog">
    <el-dialog :title="dialogTitle"
                :visible.sync="dialogVisible"
                :width="dialogWidth"
                :height = "dialogHeight"
                :close-on-click-modal = false
                >
      <!--
      <div class="app-dialog-container">
        {{dialogContent}}
      </div> -->

      <component :is="dialogComponentName"
                 :content="content" >
        </component>
      <!--
        <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitFun">确 定</el-button>
        </span>
      -->
    </el-dialog>
  </section>
</template>

<script>
export default{
  name: 'AppDialog',
  components: {
    com_epower_abd_abdworkteam_AbdWorkTeamList:() => import('@/views/com/epower/abd/abdworkteam/AbdWorkTeamList'),
    com_epower_abd_material_MaterialList:() => import('@/views/com/epower/abd/material/MaterialList'),
  },
  data() {
    return {
      dialogVisible: false,
      dialogTitle: '',
      dialogWidth:'850px',
      dialogHeight:'400px',
      dialogComponentName: '',
      content:null
    };
  },
  mounted() {
    this.$bus.on('showAppDialog', data => {
      console.log(data, 'dialog data')
      this.dialogVisible = true
      this.dialogComponentName = data.componentName
      this.content = data.content
      var  formMeta = data.content.formMeta
      this.dialogTitle=formMeta.label
      this.dialogWidth = formMeta.width > 1 ? formMeta.width + 'px' : formMeta.width*100 + '%'
      this.dialogHeight = formMeta.height > 1 ? formMeta.height + 'px' : formMeta.height*100 + '%'
    })

    this.$bus.on('closeAppDialog', data => {
      console.log(data, 'dialog data')
      this.dialogVisible = false
       this.dialogComponentName= ''
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

