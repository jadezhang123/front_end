/**
 * Created by zjw on 2016/10/11.
 */
var auditStatusVM = null;
avalon.ready(function () {
    auditStatusVM = avalon.define({
        $id: 'auditStatus',
        AUDIT_STATUS_NOT_SUBMITTED: 0,   // 未提交
        AUDIT_STATUS_AUDITING: 1,        //审核中
        AUDIT_STATUS_PASS: 2,            //通过
        AUDIT_STATUS_REJECTED: 3,        //不通过
        QUERY_PARAM_CACHE_KEY: 'cacheQueryParam_status',
        queryAuditStatus: 1,
        uid: '',
        honorRecords: [],
        schoolTerms: [],
        grades: [],
        classes: [],
        termCode: "",
        gradeCode: "",
        classCode: "",
        pageNo: 1,              //页码
        total: 1,               //总页数
        records: 0,            //总计记录数
        queryParam: {},         //分页查询时的查询参数
        rejectedMsg: '',
        isBack: false,
        termDone:false,     // 学期异步查询完成
        gradeDone:false,    // 年级异步查询完成
        init: function () {
            auditStatusVM.uid = getLocalValue("account", "uid");
            //获取返回的key，从而决定显示哪个页面
            var backKey = getQueryString('backKey');
            if (backKey) {
                backKey = parseInt(backKey, 10);
                auditStatusVM.queryAuditStatus = isNaN(backKey) ? 1 : backKey;
                auditStatusVM.isBack = true;
            }
            auditStatusVM.setQueryParamByUserType();
            auditStatusVM.querySchoolTerms();
        },

        setQueryParamByUserType: function () {
            if (vmHeaderPage.userType === tagNameAndNum.教师) {
                auditStatusVM.queryGradesAndClasses();
                auditStatusVM.queryParam = {
                    pageNo: 1,
                    termCode: '',
                    gradeCode: '',
                    classCode: '',
                    creator: auditStatusVM.uid,
                    auditStatus: auditStatusVM.queryAuditStatus
                };
            } else if (vmHeaderPage.userType === tagNameAndNum.学生) {
                auditStatusVM.queryParam = {
                    pageNo: 1,
                    termCode: '',
                    creator: auditStatusVM.uid,
                    studentId: auditStatusVM.uid,
                    auditStatus: auditStatusVM.queryAuditStatus
                };
            }
        },

        querySchoolTerms: function () {
            $.ajaxFun({
                url: "/grow/eval/getSchoolTermList",
                type: "get",
                dataType: "json",
                onSuccess: function (result) {
                    avalon.log(result);
                    if (isSuccess(result)) {
                        auditStatusVM.schoolTerms = result.bizData;
                        if (auditStatusVM.schoolTerms.length > 0) {
                            if (auditStatusVM.isBack) {
                                auditStatusVM.termDone = true;
                                auditStatusVM.termCode = getLocalValue(auditStatusVM.QUERY_PARAM_CACHE_KEY, 'termCode');
                            } else {
                                auditStatusVM.termCode = auditStatusVM.schoolTerms[0].code;
                            }
                        }
                    }
                }
            });
        },

        queryGradesAndClasses: function () {
            $.ajaxFun({
                url: "/grow/eval/getGradeAndClassBySchool",
                type: "get",
                dataType: "json",
                onSuccess: function (result) {
                    avalon.log(result);
                    if (isSuccess(result)) {
                        auditStatusVM.grades = result.bizData;
                        if (auditStatusVM.isBack) {
                            auditStatusVM.gradeDone = true;
                            auditStatusVM.gradeCode = getLocalValue(auditStatusVM.QUERY_PARAM_CACHE_KEY, 'gradeCode') || '';
                        }
                    }
                }
            });
        },

        queryClassesByGrade: function (gradeCode) {
            for (var index = 0, length = auditStatusVM.grades.length, grade; index < length; index++) {
                grade = auditStatusVM.grades[index];
                if (grade.code == auditStatusVM.gradeCode) {
                    auditStatusVM.classes = grade.classes;
                    if (auditStatusVM.classes.length > 0) {
                        if (auditStatusVM.isBack) {
                            auditStatusVM.classCode = getLocalValue(auditStatusVM.QUERY_PARAM_CACHE_KEY, 'classCode') || '';
                        } else {
                            auditStatusVM.classCode = auditStatusVM.classes[0].code;
                        }
                    }
                    break;
                }
            }
        },

        changeQueryStatus: function (status) {
            auditStatusVM.queryAuditStatus = status;
            auditStatusVM.queryParam.auditStatus = status;
            auditStatusVM.queryPage(1);
        },

        queryPage: function (pageNo) {
            if (auditStatusVM.termCode == '' || pageNo > auditStatusVM.total || pageNo < 1) {
                return;
            }

            auditStatusVM.pageNo = pageNo;
            auditStatusVM.queryParam.pageNo = pageNo;
            auditStatusVM.honorRecords = [];
            auditStatusVM.queryHonorRecords();

        },

        queryHonorRecords: function () {
            openLoading();
            $.ajaxFun({
                url: "/grow/honor/record/pagingHonorRecords",
                type: "post",
                dataType: "json",
                data: auditStatusVM.queryParam.$model,
                onSuccess: function (result) {
                    avalon.log(result);
                    if (isSuccess(result)) {
                        setLocalValue(auditStatusVM.QUERY_PARAM_CACHE_KEY, auditStatusVM.queryParam);
                        auditStatusVM.pageNo = result.bizData.page;
                        auditStatusVM.records = result.bizData.records;
                        auditStatusVM.total = result.bizData.total;
                        auditStatusVM.honorRecords = result.bizData.rows;
                        if (auditStatusVM.honorRecords.length === 0) {
                            $('#noDataTip_honor_auditStatus').show();
                        } else {
                            $('#noDataTip_honor_auditStatus').hide();
                        }
                    }
                    closeLoading();
                }
            });
        },

        seeRejectedMsg: function (msg) {
            auditStatusVM.rejectedMsg = msg;
            layer.open({
                type: 1,
                title: '提示',
                content: $('#rejected')
            });
        },

        deleteRecord: function (recordCode) {
            layer.confirm('确定要删除该记录？', function () {
                $.ajaxFun({
                    url: '/grow/honor/record/delete',
                    type: 'post',
                    dataType: 'json',
                    data: {
                        recordCode: recordCode
                    },
                    onSuccess: function (result) {
                        avalon.log(result);
                        if (isSuccess(result)){
                            if (result.bizData.success) {
                                layer.alert(result.bizData.msg, function (index) {
                                    layer.close(index);
                                    auditStatusVM.queryPage(1);
                                });
                            } else {
                                layer.alert(result.bizData.msg);
                            }
                        }else {
                            layer.alert(result.msg);
                        }
                    }
                });
                layerClose();
            });
        },

        //编辑未提交或重新申报
        editHonorRecord: function (recordCode, backKey) {
            if (vmHeaderPage.userType === tagNameAndNum.教师) {
                window.location.href = 'recordHonorAdmin.html?recordCode=' + recordCode + '&backKey=' + backKey;
            } else if (vmHeaderPage.userType === tagNameAndNum.学生) {
                window.location.href = 'recordHonorStu.html?recordCode=' + recordCode + '&backKey=' + backKey;
            }
        },

        closeLayer: function () {
            layerClose();
        },

        //改变返回状态标识，当term异步查询和grade异步查询均结束才切换
        changeBackState:function () {
            if (auditStatusVM.isBack && auditStatusVM.termDone && auditStatusVM.gradeDone){
                auditStatusVM.isBack = false;
            }
        },

        goBack: function () {
            auditStatusVM.isBack = false;
            setLocalValue(auditStatusVM.QUERY_PARAM_CACHE_KEY, null);
            if (vmHeaderPage.userType === tagNameAndNum.教师) {
                window.location.href = 'listHonorAdmin.html';
            } else if (vmHeaderPage.userType === tagNameAndNum.学生) {
                window.location.href = 'listHonorStu.html';
            }
        }

    });

    //监听termCode，执行分页查询；返回状态时不需要即时查询
    auditStatusVM.$watch('termCode', function (value) {
        auditStatusVM.queryParam.termCode = value;
        if(auditStatusVM.isBack){
            if(vmHeaderPage.userType == tagNameAndNum.学生){
                auditStatusVM.queryPage(1);
            }else {
                if (auditStatusVM.termDone && auditStatusVM.gradeDone){
                    auditStatusVM.isBack = false;
                    auditStatusVM.queryPage(1);
                }else if(auditStatusVM.termDone && !auditStatusVM.gradeDone){
                    auditStatusVM.gradeCode = null;
                }
            }
            return;
        }
        auditStatusVM.queryPage(1);
    });

    //监听gradeCode属性，同步切换classes
    auditStatusVM.$watch('gradeCode', function (value) {
        auditStatusVM.queryParam.gradeCode = value;
        if (value == '') {
            auditStatusVM.classes = [];
            if (auditStatusVM.classCode == '') {
                //当 classCode == '' ,主动触发监听函数
                auditStatusVM.$fire('classCode', '');
            } else {
                auditStatusVM.classCode = '';
            }
            return;
        }
        auditStatusVM.queryClassesByGrade();
    });

    //监听classCode，执行分页查询
    auditStatusVM.$watch('classCode', function (value) {
        auditStatusVM.queryParam.classCode = value;
        auditStatusVM.changeBackState();
        auditStatusVM.queryPage(1);
    });

    avalon.scan($('#auditStatus')[0], auditStatusVM);
    auditStatusVM.init();
});