/**
 * Created by zjw on 2016/10/10.
 */
var settingVM = null;
avalon.ready(function () {
    settingVM = avalon.define({
        $id: 'setting',
        PAGE_DEGREE: 0,
        PAGE_PROJECT: 1,
        data: [],
        dataStatus: ['是', '否'],
        allChecked: false,
        currPage: 0,
        pageNo: 1,              //页码
        total: 1,               //总页数
        records: 0,            //总计记录数
        init: function () {
            settingVM.queryPage(1);
        },

        changeContent: function (page) {
            settingVM.currPage = page;
            settingVM.allChecked = false;
            settingVM.queryPage(1);
        },

        //等待页面渲染完全后设置权限
        setAuth:function (tmpHtml) {
            var $tmpHtml = $(tmpHtml);
            $tmpHtml.find('.judge_table th[ac-authCode],td[ac-authCode],a[ac-authCode]').authController();
            return $tmpHtml.html();
        },

        queryPage: function (pageNo) {
            if (pageNo > settingVM.total || pageNo < 1) {
                return;
            }
            settingVM.allChecked = false;
            settingVM.pageNo = pageNo;
            if (settingVM.currPage == settingVM.PAGE_DEGREE) {
                settingVM.queryList('/grow/honor/degree/paging');
            } else if (settingVM.currPage == settingVM.PAGE_PROJECT) {
                settingVM.queryList('/grow/honor/project/paging');
            }
        },

        queryList: function (url) {
            openLoading();
            $.ajaxFun({
                url: url,
                type: 'post',
                dataType: 'json',
                data: {
                    pageNo: settingVM.pageNo
                },
                onSuccess: function (result) {
                    avalon.log(result);
                    if (isSuccess(result)) {
                        settingVM.pageNo = result.bizData.page;
                        settingVM.records = result.bizData.records;
                        settingVM.total = result.bizData.total;
                        avalon.each(result.bizData.rows, function (index, item) {
                            item.checked = false;
                        });
                        settingVM.data = [];
                        settingVM.data = result.bizData.rows;
                        if (settingVM.data.length == 0) {
                            $("#noDataTip_honor_setting").show();
                        } else {
                            $("#noDataTip_honor_setting").hide();
                        }
                    }
                    closeLoading();
                }
            });
        },

        checkAll: function () {
            if (settingVM.currPage == settingVM.PAGE_DEGREE) {
                //系统定义荣誉级别不可删除
                var notSystem;
                settingVM.data.forEach(function (el) {
                    notSystem = el.type == 1;
                    if (notSystem) {
                        el.checked = settingVM.allChecked;
                    }
                });
            } else if (settingVM.currPage == settingVM.PAGE_PROJECT) {
                //项目列表页面
                settingVM.data.forEach(function (el) {
                    el.checked = settingVM.allChecked;
                });
            }
        },

        checkOne: function () {
            if (!this.checked) {
                settingVM.allChecked = false;
            } else {
                if (settingVM.currPage == settingVM.PAGE_DEGREE) {
                    settingVM.allChecked = true;
                    for (var index = 0, length = settingVM.data.length, item; index < length; index++) {
                        item = settingVM.data[index];
                        if (item.type == 1 && !item.checked) {
                            settingVM.allChecked = false;
                            break;
                        }
                    }
                } else if (settingVM.currPage == settingVM.PAGE_PROJECT) {
                    //项目列表页面
                    settingVM.allChecked = settingVM.data.every(function (el) {
                        return el.checked;
                    });
                }
            }
        },

        popDegreeAdd: function () {
            layerOpen('./degree/degree.html', '新增荣誉级别', {}, '550px', 'auto', null, function () {
                settingVM.queryPage(1);
            }, function () {
                //窗口创建完成后回调
                avalon.scan($('#setting_degree')[0], settingDegreeVM);
                settingDegreeVM.init();
            });
        },

        popDegreeEdit: function (id) {
            layerOpen('./degree/degree.html', '编辑荣誉级别', {id: id}, '550px', 'auto', null, null, function () {
                //窗口创建完成后回调
                avalon.scan($('#setting_degree')[0], settingDegreeVM);
                settingDegreeVM.init();
            });
        },

        popProjectAdd: function () {
            layerOpen('./project/project.html', '新增荣誉项目', {}, '550px', 'auto', null, null, function () {
                //窗口创建完成后回调
                avalon.scan($('#setting_project')[0], settingProjectVM);
                settingProjectVM.init();
            });
        },

        popProjectEdit: function (id) {
            layerOpen('./project/project.html', '编辑荣誉项目', {id: id}, '550px', 'auto', null, null, function () {
                //窗口创建完成后回调
                avalon.scan($('#setting_project')[0], settingProjectVM);
                settingProjectVM.init();
            });
        },


        batchDeleteDegrees: function () {
            var param = settingVM.packingParam();
            if (param.delIds.length == 0) {
                layer.alert("请选择删除项！");
                return;
            }
            settingVM.doBatchDelete({
                checkURL: '/grow/honor/degree/batchCheckDeletableDegree',
                checkItem: '荣誉项目',
                deleteURL: '/grow/honor/degree/batchDelete'
            }, param);
        },

        batchDeleteProjects: function () {
            var param = settingVM.packingParam();
            if (param.delIds.length == 0) {
                layer.alert("请选择删除项！");
                return;
            }
            settingVM.doBatchDelete({
                checkURL: '/grow/honor/project/batchCheckDeletableProject',
                checkItem: '荣誉记录',
                deleteURL: '/grow/honor/project/batchDelete'
            }, param);
        },

        //将被选中的数据组装
        packingParam: function () {
            var delCodes = [];
            var delIds = [];
            settingVM.data.forEach(function (el) {
                if (el.checked) {
                    delIds.push(el.id);
                    delCodes.push(el.code);
                }
            });
            return {
                delCodes: delCodes,
                delIds: delIds
            };
        },

        doBatchDelete: function (data, param) {
            layer.confirm('确定要删除选中的' + param.delCodes.length + '项？', function () {
                openLoading();
                //请求检测：能否删除
                $.ajaxFun({
                    url: data.checkURL,
                    type: 'post',
                    dataType: 'json',
                    data: {
                        codesJSONStr: JSON.stringify(param.delCodes)
                    },
                    onSuccess: function (result) {
                        avalon.log(result);
                        if (isSuccess(result)) {
                            if (result.bizData.length > 0) {
                                //提示无法删除
                                layer.alert('待删除项中第' + result.bizData + '条数据已关联' + data.checkItem + '，无法删除！');

                            } else {
                                //执行删除操作
                                $.ajaxFun({
                                    url: data.deleteURL,
                                    type: 'post',
                                    dataType: 'json',
                                    data: {
                                        idsJSONStr: JSON.stringify(param.delIds)
                                    },
                                    onSuccess: function (result) {
                                        settingVM.afterDelete(result);
                                    }
                                });
                            }
                        } else {
                            layer.alert(result.msg);
                        }
                        closeLoading();
                    }
                });
                layerClose();
            });
        },

        deleteDegree: function (id, code) {
            settingVM.doDelete({
                checkURL: '/grow/honor/degree/checkDeletableDegree',
                alertMsg: '该级别下已关联荣誉项目，无法删除！',
                deleteURL: '/grow/honor/degree/delete'
            }, {
                id: id,
                code: code
            });
        },

        deleteProject: function (id, code) {
            settingVM.doDelete({
                checkURL: '/grow/honor/project/checkDeletableProject',
                alertMsg: '该项目下已关联荣誉记录，无法删除！',
                deleteURL: '/grow/honor/project/delete'
            }, {
                id: id,
                code: code
            });
        },

        doDelete: function (data, param) {
            layer.confirm('确定要删除选中项？', function () {
                openLoading();
                $.ajaxFun({
                    url: data.checkURL,
                    type: 'post',
                    dataType: 'json',
                    data: {
                        code: param.code
                    },
                    onSuccess: function (result) {
                        avalon.log(result);
                        if (isSuccess(result)) {
                            if (result.bizData) {
                                layer.alert(data.alertMsg);
                            } else {
                                $.ajaxFun({
                                    url: data.deleteURL,
                                    type: 'post',
                                    dataType: 'json',
                                    data: {
                                        id: param.id
                                    },
                                    onSuccess: function (result) {
                                        settingVM.afterDelete(result);
                                    }
                                });
                            }
                        } else {
                            layer.alert(result.msg);
                        }
                        closeLoading();
                    }
                });
                layerClose();
            });
        },


        afterDelete: function (result) {
            avalon.log(result);

            if (!isSuccess(result)) {
                layer.alert(result.msg);
                return;
            }

            if (result.bizData.success) {
                layer.alert(result.bizData.msg, function (index) {
                    layer.close(index);
                    settingVM.queryPage(1);
                });
            } else {
                layer.alert(result.bizData.msg);
            }
        },

        goBack: function () {
            window.location.href = 'listHonorAdmin.html';
        }

    });

    avalon.scan($('#setting')[0], settingVM);
    settingVM.init();
});