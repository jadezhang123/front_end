/*! gruntDemo 10-03-2017 */
$(function(){jQuery.validator.addMethod("gtZero",function(a,b){return this.optional(b)||a>0},"必须大于0")});var settingProjectVM=null;avalon.ready(function(){settingProjectVM=avalon.define({$id:"settingProject",degrees:[],id:0,name:"",score:1,degreeCode:"",remark:"",creatorName:"",createDate:0,lastModifierName:"",lastModDate:0,status:"0",editState:!1,$formValidator:null,init:function(){settingProjectVM.id=getParam("id")||0,0!==settingProjectVM.id&&(settingProjectVM.editState=!0),settingProjectVM.initValidator(),settingProjectVM.queryDegrees()},initValidator:function(){settingProjectVM.$formValidator=$("#projectForm").validate({rules:{name:{required:!0,maxlength:18},score:{required:!0,number:!0,max:100,gtZero:!0},degreeCode:{required:!0},remark:{maxlength:100}},messages:{name:{required:"必填",maxlength:"最大长度为18个字符"},score:{required:"必填",number:"必须为数字",max:"最大值100",gtZero:"必须大于0"},degreeCode:{required:"必填"},remark:{maxlength:"最大长度为100个字符"}},focusInvalid:!0,errorPlacement:errorPlacement,success:"valid"})},queryDegrees:function(){openLoading(),$.ajaxFun({url:"/grow/honor/degree/list",type:"get",dataType:"json",onSuccess:function(a){avalon.log(a),isSuccess(a)&&(settingProjectVM.degrees=a.bizData,settingProjectVM.editState&&settingProjectVM.queryDetail()),closeLoading()}})},queryDetail:function(){openLoading(),$.ajaxFun({url:"/grow/honor/project/detail",type:"post",dataType:"json",data:{id:settingProjectVM.id},onSuccess:function(a){if(avalon.log(a),isSuccess(a)){var b=a.bizData;settingProjectVM.name=b.name,settingProjectVM.score=b.score,settingProjectVM.degreeCode=b.degreeCode,settingProjectVM.remark=b.remark,settingProjectVM.creatorName=b.creatorName,settingProjectVM.createDate=b.createDate,settingProjectVM.lastModifierName=b.lastModifierName,settingProjectVM.lastModDate=b.lastModDate}closeLoading()}})},save:function(){if(settingProjectVM.$formValidator.form()){var a="";a=settingProjectVM.editState?"/grow/honor/project/update":"/grow/honor/project/add",$.ajaxFun({url:a,type:"post",dataType:"json",data:{id:settingProjectVM.id,name:$("#projectName").val(),score:settingProjectVM.score,degreeCode:settingProjectVM.degreeCode,remark:$("#projectRemark").val(),status:settingProjectVM.status},onSuccess:function(a){if(avalon.log(a),!isSuccess(a))return void layer.alert(a.msg);a.bizData.success?(settingProjectVM.clear(),layer.alert(a.bizData.msg,function(a){layer.close(a),settingVM.queryPage(1)}),layerClose()):layer.alert(a.bizData.msg)}})}},clear:function(){settingProjectVM.editState=!1,settingProjectVM.name="",settingProjectVM.score=0,settingProjectVM.degreeCode="",settingProjectVM.remark="",settingProjectVM.status="0"},cancel:function(){settingProjectVM.clear(),layerClose()}})});