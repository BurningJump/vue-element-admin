import VDBComponent from './VDBComponent.js'
import { basicConstant } from '../VBasicConstant.js'

export default class VRemoteCombox extends VDBComponent {
    allowcreate=false;// ：是否允许用户自定义选项，即新增系统中不存在的选项
    multiple=false;// 是否支持多选
    clearable=false;// 是否支持一键清空，仅单选模式下生效
      
    fetchInTime = false; //是否实时远程获取数据

    selectform=true; //是否弹窗供用户选择
    fromJsclass='/com/epower/am/operation/SelectList'; //弹出窗口ID 
    // disabled;是否不可用

    fromAction;// 远程数据请求地址
    valueField;// 数据存储的字段
    valueFieldType;// ：//数据存储字段的类型
    displayField;// ：前端显示字段
    displayFieldType;// ：前端显示字段的类型

    maps;       //数组，valuelist maps
    inputField; //编辑时显示值
  // 远程combox的配置
    // remoteComboBoxModel;

    saveField;  //valuelist 对象用于的保存字段
    targetField;  //保存到哪个字段
    constructor(parent) {
      super(parent)
      this.ctype = basicConstant.CMP_REMOTECOMBOX
    }
 /**
   * 装载数据
   * @param {*} aValue
   */
  loadData(aValue) {
    super.loadData(aValue);
    if(this.multiple){
      this.inputValue = [].concat(aValue)
    }else{
      this.inputValue =aValue
    }
    this.value = aValue
  }
}

