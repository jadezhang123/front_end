/**
 * Created by zjw on 2016/10/10.
 */
var settingDegreeVM = null;
avalon.ready(function () {
    settingDegreeVM = avalon.define({
        $id:'settingDegree',
        id:0,
        name:'',
        remark:'',
        creatorName: '',
        createDate: 0,
        lastModifierName: '',
        lastModDate: 0,
        status: '0',
        editState: false,
        $formValidator: null,
        init: function () {
            settingDegreeVM.id = getParam('id') || 0;
            if (settingDegreeVM.id !== 0) {
                settingDegreeVM.editState = true;
                settingDegreeVM.queryDetail();
            }
            settingDegreeVM.initValidator();
        },

        initValidator: function () {
            settingDegreeVM.$formValidator = $("#degreeForm").validate({
                rules: {
                    name: {required: true, maxlength: 18},
                    remark: {maxlength: 45}
                },
                messages: {
                    name: {required: "必填", maxlength: "最大长度为18个字符"},
                    remark: {maxlength: '最大长度为45个字符'}
                },
                focusInvalid: true,
                errorPlacement: errorPlacement,
                success: "valid"
            });
        },

        queryDetail: function () {
            openLoading();
            $.ajaxFun({
                url: '/grow/honor/degree/detail',
                type: 'post',
                dataType: 'json',
                data: {
                    id: settingDegreeVM.id
                },
                onSuccess: function (result) {
                    avalon.log(result);
                    if (isSuccess(result)) {
                        var degree = result.bizData;
                        settingDegreeVM.name = degree.name;
                        settingDegreeVM.remark = degree.remark;
                        settingDegreeVM.creatorName = degree.creatorName;
                        settingDegreeVM.createDate = degree.createDate;
                        settingDegreeVM.lastModifierName = degree.lastModifierName;
                        settingDegreeVM.lastModDate = degree.lastModDate;
                        //settingDegreeVM.status = '' + degree.status;
                    }
                    closeLoading();
                }
            });
        },

        save: function () {
            if (settingDegreeVM.$formValidator.form()) {
                var url = '';
                if (settingDegreeVM.editState) {
                    url = '/grow/honor/degree/update';
                }else {
                    url = '/grow/honor/degree/add';
                }
                $.ajaxFun({
                    url: url,
                    type: 'post',
                    dataType: 'json',
                    data: {
                        id: settingDegreeVM.id,
                        name: $('#degreeName').val(),
                        remark: $('#degreeRemark').val(),
                        status: settingDegreeVM.status,
                    },
                    onSuccess: function (result) {
                        avalon.log(result);

                        if (!isSuccess(result)){
                            layer.alert(result.msg);
                            return;
                        }

                        if (result.bizData.success) {
                            settingDegreeVM.clear();
                            layer.alert(result.bizData.msg,function(index){
                                settingVM.queryPage(1);
                                layer.close(index);
                            });
                            layerClose();
                        } else {
                            layer.alert(result.bizData.msg);
                        }
                    }
                });
            }
        },

        clear: function () {
            settingDegreeVM.editState = false;
            settingDegreeVM.name = '';
            settingDegreeVM.remark = '';
            settingDegreeVM.status = '0';
        },

        cancel: function () {
            settingDegreeVM.clear();
            layerClose();
        }
    });

});