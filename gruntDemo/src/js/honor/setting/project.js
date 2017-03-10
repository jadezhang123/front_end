/**
 * Created by zjw on 2016/10/10.
 */

$(function () {
    jQuery.validator.addMethod('gtZero', function (value, element) {
        return this.optional(element) || value > 0;
    }, '必须大于0');
});

var settingProjectVM = null;
avalon.ready(function () {
    settingProjectVM = avalon.define({
        $id: 'settingProject',
        degrees: [],
        id: 0,
        name: '',
        score: 1,
        degreeCode: '',
        remark: '',
        creatorName: '',
        createDate: 0,
        lastModifierName: '',
        lastModDate: 0,
        status: '0',
        editState: false,
        $formValidator: null,
        init: function () {
            settingProjectVM.id = getParam('id') || 0;
            if (settingProjectVM.id !== 0) {
                settingProjectVM.editState = true;
            }
            settingProjectVM.initValidator();
            settingProjectVM.queryDegrees();
        },

        initValidator: function () {
            settingProjectVM.$formValidator = $("#projectForm").validate({
                rules: {
                    name: {required: true, maxlength: 18},
                    score: {required: true, number: true, max: 100, gtZero:true},
                    degreeCode: {required: true},
                    remark: {maxlength: 100}
                },
                messages: {
                    name: {required: "必填", maxlength: "最大长度为18个字符"},
                    score: {required: "必填", number: "必须为数字", max: '最大值100',gtZero:'必须大于0'},
                    degreeCode: {required: "必填"},
                    remark: {maxlength: '最大长度为100个字符'}
                },
                focusInvalid: true,
                errorPlacement: errorPlacement,
                success: "valid"
            });
        },

        queryDegrees: function () {
            openLoading();
            $.ajaxFun({
                url: '/grow/honor/degree/list',
                type: 'get',
                dataType: 'json',
                onSuccess: function (result) {
                    avalon.log(result);
                    if (isSuccess(result)) {
                        settingProjectVM.degrees = result.bizData;
                        if (settingProjectVM.editState) {
                            settingProjectVM.queryDetail();
                        }
                    }
                    closeLoading();
                }
            });
        },

        queryDetail: function () {
            openLoading();
            $.ajaxFun({
                url: '/grow/honor/project/detail',
                type: 'post',
                dataType: 'json',
                data: {
                    id: settingProjectVM.id
                },
                onSuccess: function (result) {
                    avalon.log(result);
                    if (isSuccess(result)) {
                        var project = result.bizData;
                        settingProjectVM.name = project.name;
                        settingProjectVM.score = project.score;
                        settingProjectVM.degreeCode = project.degreeCode;
                        settingProjectVM.remark = project.remark;
                        settingProjectVM.creatorName = project.creatorName;
                        settingProjectVM.createDate = project.createDate;
                        settingProjectVM.lastModifierName = project.lastModifierName;
                        settingProjectVM.lastModDate = project.lastModDate;
                        //settingProjectVM.status = '' + project.status;
                    }
                    closeLoading();
                }
            });
        },

        save: function () {
            if (settingProjectVM.$formValidator.form()) {
                var url = '';
                if (settingProjectVM.editState) {
                    url = '/grow/honor/project/update';
                } else {
                    url = '/grow/honor/project/add';
                }
                $.ajaxFun({
                    url: url,
                    type: 'post',
                    dataType: 'json',
                    data: {
                        id: settingProjectVM.id,
                        name: $('#projectName').val(),
                        score: settingProjectVM.score,
                        degreeCode: settingProjectVM.degreeCode,
                        remark: $('#projectRemark').val(),
                        status: settingProjectVM.status,
                    },
                    onSuccess: function (result) {
                        avalon.log(result);
                        if (!isSuccess(result)){
                            layer.alert(result.msg);
                            return;
                        }
                        if (result.bizData.success) {
                            settingProjectVM.clear();
                            layer.alert(result.bizData.msg, function (index) {
                                layer.close(index);
                                settingVM.queryPage(1);
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
            settingProjectVM.editState = false;
            settingProjectVM.name = '';
            settingProjectVM.score = 0;
            settingProjectVM.degreeCode = '';
            settingProjectVM.remark = '';
            settingProjectVM.status = '0';
        },

        cancel: function () {
            settingProjectVM.clear();
            layerClose();
        }

    });

});