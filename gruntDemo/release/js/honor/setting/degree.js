/*! gruntDemo 10-03-2017 */
var settingDegreeVM=null;avalon.ready(function(){settingDegreeVM=avalon.define({$id:"settingDegree",id:0,name:"",remark:"",creatorName:"",createDate:0,lastModifierName:"",lastModDate:0,status:"0",editState:!1,$formValidator:null,init:function(){settingDegreeVM.id=getParam("id")||0,0!==settingDegreeVM.id&&(settingDegreeVM.editState=!0,settingDegreeVM.queryDetail()),settingDegreeVM.initValidator()},initValidator:function(){settingDegreeVM.$formValidator=$("#degreeForm").validate({rules:{name:{required:!0,maxlength:18},remark:{maxlength:45}},messages:{name:{required:"必填",maxlength:"最大长度为18个字符"},remark:{maxlength:"最大长度为45个字符"}},focusInvalid:!0,errorPlacement:errorPlacement,success:"valid"})},queryDetail:function(){openLoading(),$.ajaxFun({url:"/grow/honor/degree/detail",type:"post",dataType:"json",data:{id:settingDegreeVM.id},onSuccess:function(a){if(avalon.log(a),isSuccess(a)){var b=a.bizData;settingDegreeVM.name=b.name,settingDegreeVM.remark=b.remark,settingDegreeVM.creatorName=b.creatorName,settingDegreeVM.createDate=b.createDate,settingDegreeVM.lastModifierName=b.lastModifierName,settingDegreeVM.lastModDate=b.lastModDate}closeLoading()}})},save:function(){if(settingDegreeVM.$formValidator.form()){var a="";a=settingDegreeVM.editState?"/grow/honor/degree/update":"/grow/honor/degree/add",$.ajaxFun({url:a,type:"post",dataType:"json",data:{id:settingDegreeVM.id,name:$("#degreeName").val(),remark:$("#degreeRemark").val(),status:settingDegreeVM.status},onSuccess:function(a){if(avalon.log(a),!isSuccess(a))return void layer.alert(a.msg);a.bizData.success?(settingDegreeVM.clear(),layer.alert(a.bizData.msg,function(a){settingVM.queryPage(1),layer.close(a)}),layerClose()):layer.alert(a.bizData.msg)}})}},clear:function(){settingDegreeVM.editState=!1,settingDegreeVM.name="",settingDegreeVM.remark="",settingDegreeVM.status="0"},cancel:function(){settingDegreeVM.clear(),layerClose()}})});