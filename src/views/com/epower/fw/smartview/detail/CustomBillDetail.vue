<template>
    <BaseBillDetail :form = "form"  >
    </BaseBillDetail>
</template>

<script>
import BaseBillDetail from "@/views/com/epower/fw/smartview/detail/BaseBillDetail";
import VBaseDetailForm from "@/smartview/bizform/VBaseDetailForm.js";

export default {
  name: 'com.epower.fw.smartview.detail.CustomBillDetail',
  components:{BaseBillDetail},
  data() {
    return {
      UiLoaded: false, // UI获取完成
      UIMeta: "",
      dataLoaded: false, // 数据获取完成
      dataPackageResp: "",
      form: null //add by max
    };
  },
  created(){
     this.getUIMeta().then(() => {
        this.getDetailData().then(() => {
          this.form.loadDataByPackage(this.dataPackageResp.dataPackage); //add by max
          this.form.show();
          this.$bus.emit('getSetting')
      });
    });
  },
  methods: {
    getBizForm(formMeta) {
      return new VBaseDetailForm(this, formMeta);
    },

    getUIMeta() {
      return new Promise((resolve, reject) => {
        this.$http
          .get(
            `/api/getDetailUIMeta/${this.$options.name}`
          )
          .then(res => {
            this.UIMeta = res.data;
            this.form = this.getBizForm(res.data.detailViewModel)//add by max
            resolve("ok");
          });
      });
    },

    getDetailData() {
      return new Promise((resolve, reject) => {
        if (this.UIMeta.detailViewModel.actionUrl) {
          this.$http.get(`/api/${this.UIMeta.detailViewModel.actionUrl}`).then(res => {
            this.dataPackageResp = res.data;
            this.dataLoaded = true;
            resolve("ok");
          });
        }
      });
    }
  }
};
</script>
