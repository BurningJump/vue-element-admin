import VDBComponent from './VDBComponent.js'
import { basicConstant } from '../VBasicConstant.js'

export default class VRemoteCombox extends VDBComponent {
    allowcreate=false;// ：是否允许用户自定义选项，即新增系统中不存在的选项
    multiple=false;// 是否支持多选
    clearable=true;// 是否支持一键清空，仅单选模式下生效
    // disabled;是否不可用
    fromAction;// 远程数据请求地址
    valueField;// 数据存储的字段
    valueFieldType;// ：//数据存储字段的类型
    displayField;// ：前端显示字段
    displayFieldType;// ：前端显示字段的类型

      //远程combox的配置
    //remoteComboBoxModel;

    constructor(parent) {
      super(parent)
      this.ctype = basicConstant.CMP_REMOTECOMBOX
    }

}

