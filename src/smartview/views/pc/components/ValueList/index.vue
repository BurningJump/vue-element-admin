// 远程异步数据获取并选择组件
// 配置如下
// allowcreate：是否允许用户自定义选项，即新增系统中不存在的选项
// multiple：是否支持多选
// disabled：是否不可用
// clearable：是否支持一键清空，仅单选模式下生效
// fromAction：远程数据请求地址
// valueField：数据存储的字段
// valueFieldType：数据存储字段的类型
// displayField：前端显示字段
// displayFieldType：前端显示字段的类型
<template>
  <div class="remotecombox-contain">
  <el-select
    v-model="newValue"
    :multiple="multiple"
    :disabled="disabled"
    :clearable="clearable"
    :loading-text="loadingtext"
    default-first-option
    :allow-create="allowcreate"
    filterable
    remote
    reserve-keyword
    placeholder="请输入关键词"
    :remote-method="remoteMethod"
    :loading="loading"
    @remove-tag="fireRemoveTagEvent"
    @focus="fireFocusEvent"
    @blur="fireBlurEvent"
    >
    <el-option
      v-for="item in filterList"
      :key=getObjectValueByKey(item,input.valueField)
      :label=getObjectValueByKey(item,input.displayField)
      :value=item>
      <span style="float: left" class="option_coloum">{{getObjectValueByKey(item,input.displayField)}}</span>
      <span style="float: left" class="option_coloum">{{getObjectValueByKey(item,input.displayField)}}</span>
      <span style="float: right; color: #8492a6; font-size: 13px">{{getObjectValueByKey(item,input.valueField)}}</span>
    </el-option>
  </el-select>
  <el-button v-if="input.selectform" icon="el-icon-search" class="remotecombox-search" @click="callValueListFrom"></el-button>
  </div>
</template>

<script>
  // import router from '@/router'  //临时代码
  import {vsmartview} from '@/smartview/VSmartView.js'

  export default {
    name: 'ValueList',
    data() {
      return {
        fullList: [],    //远程获取的结果
        filterList: [],  //过滤后的结果
        // comValue: [],    //保存用户选择的结果
        loading: false,
        editing: false,
        //TODO 当用户输入停顿1秒，无新的输入，再远程获取数据
        inputOldValue:'',      //用户输入内容
        inputBeginTime:'',     //用户输入开始时间
        inputIntervalTime: ''  //用户输入间隔时长
      }
    },
    props: {input:{},
            multiple:true,
            bandValue:'',
            extraFilter:'', //业务人员在前端自定义的过滤条件
            disabled:false,
            clearable:true,
            allowcreate:false,
            loadingtext:'拼命加载中...'},
    computed: {
      newValue:{
        get: function(){
          // if()
          // return this.bandValue['projectName'];
          if((this.bandValue) != void 0){
            if(this.editing){
              return this.bandValue[this.input.inputField];
            }else{
              return this.bandValue[this.input.displayField];
            }


          }else{
            return '';
          }

        },
        set: function(value){
          this.input.saveInputValue(value);

          //保存数据
          this.input.datasource.updateFieldValue(this.input.targetField,value[this.input.saveField]);

          let maps=this.input.maps;
          let form = this.input.form;
          for(let m of maps){
            form.setCmpValue(m['toComponent'],value[m['fromField']]);
          }
        }
      }
    },
    mounted() {
      //初始值显示
      // console.log('input:'+this.input);
      // if(!this.multiple){
      //   this.comValue = this.input.inputValue;
      // }else{
      //   this.comValue.push(this.input.inputValue);
      // }
      // this.filterList.push(this.newValue);
      //实时远程抓取数据
      // if(!this.input.fetchInTime)
      //   this.loadRemoteData('',2);
    },
    methods: {
      //调用valueList窗口
      callValueListFrom(){
       //  let formJsPath = (this.input.fromJsclass||'').replace(/\./g, '/')
           vsmartview.callSelectForm(this.input.fromJsclass,'single',this.callValueListFromRefeed)
          // this.$router.push({
          //       path:formJsPath,
          //       query:{
          //         selectType:this.multiple?'multi':'single',
          //         callValueListFromRefeed: this.callValueListFromRefeed}
          // })
      },
      //调用valueList窗口回调函数，1.填充bandValue，2.filterList，3.保存结果到datapackage
      callValueListFromRefeed(resData){
        console.log('callValueListFromRefeed:'+resData);
        if((resData||'')=='')
          return;
        let selectValues=[];
        this.filterList = [];
        if(!this.multiple){
          selectValues=resData[0];
        }else{
          for(let item of resData){
            selectValues.push(item);
          }
        }
        this.filterList = resData;
        this.fullList = resData;

        this.newValue = selectValues;
        this.input.saveInputValue(this.selectValues);
        // this.fireChangeEvent();
      },

      fireRemoveTagEvent(){
        //console.log('fireRemoveTagEvent:');
        // 多选模式下移除tag时触发;
      },
      fireFocusEvent(){
        this.editing = true;
        this.defaultIndex=this.selectedIndex;
      },
      fireBlurEvent(){
        this.editing = false;
        this.selectedIndex=this.defaultIndex;
      },
      // fireChangeEvent(){
      //   console.log('--fireChangeEvent:'+this.bandValue+';--filterList:'+this.filterList);
      //   this.input.saveInputValue(this.comValue);
      // },
      //获取远程数据
      getRomteData(param){
        return new Promise((resolve, reject) => {
        this.$http.get(`http://root.yiuser.com:3001/`+this.input.fromAction,{
              params:param
            },{
              emulateJSON: true
            })
          .then(res => {
            resolve(res.data.resultList);
          });
        });
      },
      async loadRemoteData(query,initFlag) {
        //无值及空值时不远程请求
          this.loading = true;

          //拼接过滤条件
          let filterStr = ' ';
          // let fieldType = 'string';
          if(initFlag==1){
            filterStr = this.getFilterStr(this.input.valueFieldType===void 0?'string':this.input.valueFieldType,'=',this.input.valueField,query);
          }else if(initFlag==2){

          }else{
            filterStr = this.getFilterStr(this.input.valueFieldType===void 0?'string':this.input.valueFieldType,'like',this.input.displayField,query);
          }
          filterStr=this.extraFilter + filterStr;

          this.fullList =await this.getRomteData({filter:filterStr});
          this.filterList=this.fullList;
          this.loading = false;
      },

      remoteMethod(query,initFlag) {
        //无值及空值时全列表可选
        if ( (query||'').trim() !== '') {

          // if(query.trim() !== this.inputOldValue.trim()){

          // }

          //实时远程抓取数据
          // if(this.input.fetchInTime)
            this.loadRemoteData(query,1);;

          this.filterList = this.fullList.filter(item => {
            let itemValue ='';
            if(initFlag==1){
              itemValue = (this.getObjectValueByKey(item,this.input.valueField));
            }else{
              itemValue = (this.getObjectValueByKey(item,this.input.displayField));
            }
            return itemValue.indexOf(query.toLowerCase()) > -1;
          });
        } else {
          this.filterList = this.fullList;
        }
      },
      // getObjectValueByKey(){

      // },
      //根据配置属性，获取对象属性对应的值
      getObjectValueByKey(item,k) {
        let v = '';
        if((item||'')!='')
          v=item[k];
        if((v||'')!='')
          v=v.replace(/<[^>]+>/g,""); //去除字符串中所有html标签及&nbsp符号
        return v;
      },
      //拼接过滤条件
      getFilterStr(datatype,filteroperation,filterfield,datavalue){
        let operation = filteroperation;
        let aValue = datavalue;
        let filter = '';
        switch (datatype.toLocaleLowerCase()) {
          case 'int':
			    		filter = filterfield + operation + aValue ;
			    		break;
			    	case 'string':
			    		if ( operation == "like" )
			    			aValue =  "%" + aValue.replace(/(^\s*)|(\s*$)/g, "") +"%";

			    		if (aValue.indexOf("%")>=0)
			    			operation = "like" ;

		    			filter =filterfield + " " + operation +  " \'" + aValue +"\'";
			    		break;
			    	case 'date':
			    		if( basicConstant.DB_DIALECT==DbConstant.ORACLE){
			    			filter = "to_char(" + filterfield + ",\'YYYY-MM-dd\') " +operation + " \'" + Ext.Date.format(aValue, 'Y-m-d') +"\'";

			    		}else if( basicConstant.DB_DIALECT==DbConstant.MYSQL){
			    			filter = "date(" + filterfield + ") " +operation + " \'" + Ext.Date.format(aValue, 'Y-m-d') +"\'";

			    		}else{
			    			filter = "date(" + filterfield + ") " +operation + " \'" + Ext.Date.format(aValue, 'Y-m-d') +"\'";
			    		}
			    		break;
			    	case 'datetime':
			    		if( basicConstant.DB_DIALECT==DbConstant.ORACLE){
			    			filter =  filterfield +operation + " " + "to_date(\'" +  Ext.Date.format(aValue, 'Y-m-d H:i:s')+"\'" + ",\'YYYY-MM-dd hh24:mi:ss\') " +"";

			    		}else{
			    			filter =  filterfield + operation + " \'" + Ext.Date.format(aValue, 'Y-m-d H:i:s') +"\'";
			    		}

			    		break;

			    	default:
			    		filter = filterfield + operation +  "\'" + aValue +"\'";
		    			break;
        }
        return filter;
      }
    }
  }
</script>



<style>
  .remotecombox-contain{
    white-space:nowrap;
  }
  .remotecombox-search{
    padding-left: 0px;
    width:5px;
    border:0px;
  }

  .option_coloum{
    margin-right: 10px;
  }
</style>
