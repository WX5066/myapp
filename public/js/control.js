var cv = {
    doLogin: function () {
        $("#loginButton").attr("disabled", true).text("登录中...");
        if ($("#loginForm").validate().form()) {
            var data = $("#loginForm").serialize();
            data = decodeURIComponent(data);//防止中文乱码
            var json = DataDeal.formToJson(data);
            $.ajax({
                url: "/api/admin/loginWithUsername",
                data: json,
                type: "post",
                contentType: 'application/json',
                success: function (data) {     //ajax返回的数据
                    swal("成功!", "登录成功", "success");
                    setTimeout(function () {
                        window.location.replace("/admin");
                        return false;
                    }, 1500);
                },
                error: function (error) {
                    swal("失败!", error.responseJSON.err_message, "error");
                    $("#loginButton").attr("disabled", false).text("登录");
                    return false;
                }
            });
        } else {
            $("#loginButton").attr("disabled", false).text("登录");
            return false;
        }
    },

    getpage: function (obj) {
        $('#myModal').modal('show');
        var url = $(obj).attr("url");
        $('#content').load(url, function (responseTxt, statusTxt, xhr) {
            if (statusTxt == 'success') {
                $(".selectpicker").selectpicker();
                $('#myModal').modal('hide');
            } else {
                $('#myModal').modal('hide');
                $.notify({
                    icon: 'pe-7s-bell',
                    message: "<b>加载失败!</b> 请刷新重试."
                }, {
                    type: 'danger',
                    timer: 1000,
                    placement: {
                        from: 'top',
                        align: 'center'
                    }
                });
                return;
            }
        });
    },

    saveAuthMenu: function (obj) {
        var $table = $("#editAuthTable");
        var role = $(obj).attr('data-id');
        var menu = {};
        menu.roleId = role;
        var menuNodes = $table.bootstrapTable('getAllSelections');
        menuNodes.forEach(function (row, index) {
            $childRow = $("#" + row.objectId);
            menuNodes[index].childMenu = [];
            var selectChild = $childRow.bootstrapTable('getAllSelections');
            $.each(selectChild, function (key, value) {
                menuNodes[index].childMenu.push(value.objectId);
            });
            if (index == (menuNodes.length - 1)) {
                menu.menuNodes = menuNodes;
                var json = JSON.stringify(menu);
                $('#myModal').modal('show');
                $.ajax({
                    url: "/api/admin/role/authority",
                    type: "post",
                    contentType: "application/json;charset=utf-8",
                    data: json,
                    success: function (success) {
                        $('#myModal').modal('hide');
                        swal("成功!", "添加完成", "success");
                    },
                    error: function (err) {
                        $('#myModal').modal('hide');
                        alert(err.responseText.err_message);
                    },
                    complete: function () {
                        $('#myModal').modal('hide');
                    }
                });
            }
        });
    },
    /*
    function pladd() {
        $.ajax({
            url: "/api/admin/plAddRole",
            type: "get",
            success: function (success) {     //ajax返回的数据
                $('#myModal').modal('show');
                swal("成功!", success.responseJson.status, "success");
            },
            error: function (error) {
                $('#myModal').modal('hide');
                swal("失败!", error.responseJSON.err_message, "error");
            },
            complete: function (data) {
                $('#myModal').modal('hide');
            }
        });
    }

    function confirmRole() {
        $.ajax({
            url: "/api/admin/confirmRole",
            type: "get",
            dataType: 'application/json',
            success: function (success) {     //ajax返回的数据
                $('#myModal').modal('show');
                swal("成功!", success.responseJson.status, "success");
            },
            error: function (error) {
                $('#myModal').modal('hide');
                swal("失败!", error.responseJSON.err_message, "error");
            },
            complete: function (data) {
                $('#myModal').modal('hide');
            }
        });
    }*/
   addRoleModle:function(){
		$('#addRoleModal').modal('show');
	},

    addRole: function () {
        $('#myModal').modal('show');
        if ($("#addRoleForm").validate().form()) { //表单验证，有效则返回true，否则返回false
            var data = $("#addRoleForm").serialize();
            var roleFollower = $("#followRole").val();
            data = decodeURIComponent(data);//防止中文乱码
            var json = DataDeal.formToJson(data);
            var params = {roleNameSet: 'roleNameSet-', roleSet: 'roleSet-'};
            json = DataDeal.jsonToRoleJson(json, roleFollower, params);
            $.ajax({
                url: "/api/admin/role/add",
                data: json,
                type: "post",
                contentType: 'application/json',
                success: function (success) {     //ajax返回的数据
                    $('#myModal').modal('hide');
                    swal("成功!", "添加完成", "success");

                },
                error: function (error) {
                    $('#myModal').modal('hide');
                    swal("失败!", error.responseJSON.err_message, "error");
                },
                complete: function (data) {
                    $('#myModal').modal('hide');
                }
            });
        } else {
            $('#myModal').modal('hide');
            return false;
        }
    },

    addlogdevice: function () {
        var check = $("#sn").val();
        if (check == ''|| check == null) {
            alert("输入不能为空");
        }
        else{
            $('#myModal').modal('show');
         if ($("#addRoleForm").validate().form()) { //表单验证，有效则返回true，否则返回false
            var data = $("#addRoleForm").serialize();
            data = decodeURIComponent(data);//防止中文乱码
            var sn = DataDeal.formToJson(data);
            $.ajax({
                url: "/admin/uploadLogdata",
                data: sn,
                type: "post",
                contentType: 'application/json',
                success: function (success) {     //ajax返回的数据
                    $('#myModal').modal('hide');
                    swal("成功!", "添加完成", "success");

                },
                error: function (error) {
                    $('#myModal').modal('hide');
                    swal("失败!", error.responseJSON.err_message, "error");
                },
                complete: function (data) {
                    $('#myModal').modal('hide');
                }
            });
        } else {
            $('#myModal').modal('hide');
            return false;
        }
        }
    },
    delRole: function () {
        if ($("#delRoleForm").validate().form()) { //表单验证，有效则返回true，否则返回false
            swal({
                title: "确认删除?",
                text: "角色删除后不能恢复, 并且角色所属的用户将不再拥有这个角色!",
                type: "warning",
                showCancelButton: true,
                confirmButtonClass: "btn btn-danger btn-fill",
                confirmButtonText: "删除",
                cancelButtonClass: "btn btn-info btn-fill",
                cancelButtonText: "取消",
                closeOnConfirm: false,
            }, function () {
                $('#myModal').modal('show');
                var data = $("#delRoleForm").serialize();
                data = decodeURIComponent(data);//防止中文乱码
                var json = DataDeal.formToJson(data);
                $.ajax({
                    url: "/api/admin/delrole",
                    data: json,
                    type: "post",
                    contentType: 'application/json',
                    success: function (success) {     //ajax返回的数据
                        $('#myModal').modal('hide');
                        swal("成功!", "删除成功", "success");
                    },
                    error: function (error) {
                        $('#myModal').modal('hide');
                        swal("失败!", error.responseJSON.err_message, "error");
                    },
                    complete: function (data) {
                        $('#myModal').modal('hide');
                    }
                });

            });
        }
    },

    roleAddUser: function () {
        if ($("#roleAddUserForm").validate().form()) { //表单验证，有效则返回true，否则返回false
            swal({
                title: "确认?",
                text: "添加用户",
                type: "warning",
                showCancelButton: true,
                confirmButtonClass: "btn btn-success btn-fill",
                confirmButtonText: "添加",
                cancelButtonClass: "btn btn-info btn-fill",
                cancelButtonText: "取消",
                closeOnConfirm: false,
            }, function () {
                $('#myModal').modal('show');
                var data = $("#roleAddUserForm").serialize();
                data = decodeURIComponent(data);            //防止中文乱码
                var json = DataDeal.formToJson(data);
                $.ajax({
                    url: "/api/admin/role/adduser",
                    data: json,
                    type: "post",
                    contentType: 'application/json',
                    success: function (success) {           //ajax返回的数据
                        $('#myModal').modal('hide');
                        swal("成功!", "添加成功", "success");
                    },
                    error: function (error) {
                        $('#myModal').modal('hide');
                        swal("失败!", error.responseJSON.err_message, "error");
                    },
                    complete: function (data) {
                        $('#myModal').modal('hide');
                    }
                });

            });
        }
    },

    roleDelUser: function () {
        var $table = $("#sysUserTable");
        var selections = $table.bootstrapTable('getAllSelections');
        var users = selections.map(function (user, index) {
            return user.objectId;
        });
        var json = {
            roleName: $("#sysUserListModal").find('#btn_remove').attr('data-id'),
            users: users
        };
        json = JSON.stringify(json);
        swal({
            title: "确认删除?",
            text: "删除后用户账户存在,但不再包含此角色的权限!",
            type: "warning",
            showCancelButton: true,
            confirmButtonClass: "btn btn-danger btn-fill",
            confirmButtonText: "删除",
            cancelButtonClass: "btn btn-info btn-fill",
            cancelButtonText: "取消",
            closeOnConfirm: false
        }, function () {
            $.ajax({
                url: "/api/admin/role/deluser",
                data: json,
                type: "post",
                contentType: 'application/json',
                success: function (success) {     //ajax返回的数据
                    swal("成功!", "移除成功", "success");
                },
                error: function (error) {
                    swal("失败!", error.responseJSON.err_message, "error");
                },
                complete: function (data) {
                }
            });
        });
        /*        if ($("#roleDelUserForm").validate().form()) {
                    swal({
                        title: "确认删除?",
                        text: "删除后用户账户存在,但不再包含此角色的权限!",
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonClass: "btn btn-danger btn-fill",
                        confirmButtonText: "删除",
                        cancelButtonClass: "btn btn-info btn-fill",
                        cancelButtonText: "取消",
                        closeOnConfirm: false,
                    }, function () {
                        $('#myModal').modal('show');
                        var data = $("#roleDelUserForm").serialize();
                        data = decodeURIComponent(data);//防止中文乱码
                        var json = DataDeal.formToJson(data);
                        $.ajax({
                            url: "/api/admin/roledeluser",
                            data: json,
                            type: "post",
                            contentType: 'application/json',
                            success: function (success) {     //ajax返回的数据
                                $('#myModal').modal('hide');
                                swal("成功!", "删除成功", "success");
                            },
                            error: function (error) {
                                $('#myModal').modal('hide');
                                swal("失败!", error.responseJSON.err_message, "error");
                            },
                            complete: function (data) {
                                $('#myModal').modal('hide');
                            }
                        });

                    });
                }*/
    }
}
var DataDeal = {
    formToJson: function (data) {
        var array = data.split('&');

        data = data.replace(/&/g, "\",\"");
        data = data.replace(/=/g, "\":\"");
        data = "{\"" + data + "\"}";
        return data;
    },
    jsonToRoleJson: function (json, roleFollower, paramsArray) {
        var roleJson = {};
        json = JSON.parse(json);
        roleJson['roleName'] = json['roleName'];
        roleJson['roleNickName'] = json['roleNickName'];
        roleJson['parentRole'] = json['parentRole'];
        roleJson['roleACLArray'] = [];
        roleJson['roleFollower'] = [];
        if (typeof paramsArray['roleNameSet'] !== 'undefined' || paramsArray['roleNameSet'] !== '') {
            $.each(json, function (roleName, roleNameValue) {
                if (roleName.startsWith(paramsArray['roleNameSet'])) {
                    var num = Number(roleName.substr(roleName.indexOf('-') + 1, roleName.length - 1));
                    $.each(json, function (roleSetName, roleSetValue) {
                        if (typeof paramsArray['roleSet'] !== 'undefined' || paramsArray['roleSet'] !== '') {
                            if (roleSetName.startsWith(paramsArray['roleSet'] + num)) {
                                var roleACL = {};
                                roleACL['roleNameSet'] = roleNameValue;
                                roleACL['roleSet'] = roleSetValue;
                                roleJson['roleACLArray'].push(roleACL);
                            }
                        }
                    });
                }
            });
        }
        if (typeof roleFollower !== 'undefined' || roleFollower !== []) {
            roleJson['roleFollower'] = roleFollower;
        }
        return JSON.stringify(roleJson);
    }
};
var cvc = {
    /**
     * 增加角色权限控制选择
     */
    addRoleSelect: function (obj) {
        var count = $(obj).parent().parent().siblings().length + 1;
        var newNode = $(obj).parent().parent().clone(true);
        $(newNode).empty();
        $(newNode).attr("id", "row-" + count + 1);
        $(obj).parent().siblings().each(function (index, node) {

            var nodeCopy = $(node).clone(true);
            var selectNode;
            switch (index) {
                case 0:
                    $(newNode).append(nodeCopy);
                    break;
                case 1:
                    selectNode = $(nodeCopy).find("select")[0];
                    $(selectNode).attr('name', "roleNameSet-" + count);
                    $(nodeCopy).empty();
                    $(nodeCopy).append(selectNode);
                    $(newNode).append(nodeCopy);
                    break;
                case 2:
                    $(newNode).append(nodeCopy);
                    break;
                case 3:
                    selectNode = $(nodeCopy).find("select")[0];
                    $(selectNode).attr('name', "roleSet-" + count);
                    $(nodeCopy).empty();
                    $(nodeCopy).append(selectNode);
                    $(newNode).append(nodeCopy);
                    $(newNode).append($(obj).parent().clone(true));
                    break;
            }
        });
        $(obj).parent().parent().parent().append(newNode);
        $(newNode).find("select").selectpicker();
    },

    /**
     * 删除角色控制选择
     */
    delRoleSelect: function (obj) {
        var rowNode = $(obj).parent().parent();
        if ($(rowNode).attr("id") === 'row-0') {
            // $(rowNode).find("button").attr("title", "请选择");
            // $(rowNode).find("button").each(function (index, button) {
            //     $(button).find("span.filter-option").text("请选择");
            //     $(button).parent().find("div.dropdown-menu").find("li").attr("class", "");
            // });
            $(rowNode).find("select.selectpicker").selectpicker('val', '');
            $(rowNode).find("select.selectpicker").selectpicker('refresh');
        } else {
            var removeNode = obj.parentNode.parentNode;
            obj.parentNode.parentNode.parentNode.removeChild(removeNode);
        }
    }
}
$().ready(function () {
	 /**
     * 系统角色管理表
     * */
    $('#roleTable').bootstrapTable({
        url: '/api/admin/role/get',
        toolbar: '#toolbar',    //工具按钮用哪个容器
        striped: true,      //是否显示行间隔色
        cache: false,      //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
        pagination: true,     //是否显示分页（*）
        pageNumber: 1,      //初始化加载第一页，默认第一页
        pageSize: 10,      //每页的记录行数（*）
        pageList: [10, 25, 50, 100],  //可供选择的每页的行数（*）
        queryParamsType: '', //默认值为 'limit' ,在默认情况下 传给服务端的参数为：offset,limit,sort
                             // 设置为 ''  在这种情况下传给服务器的参数为：pageSize,pageNumber

        //queryParams: queryParams,//前端调用服务时，会默认传递上边提到的参数，如果需要添加自定义参数，可以自定义一个函数返回请求参
        sidePagination: "server",   //分页方式：client客户端分页，server服务端分页（*）
        search: true,      //是否显示表格搜索，此搜索是客户端搜索，不会进服务端，所以，个人感觉意义不大
        strictSearch: false,
        showColumns: true,     //是否显示所有的列
        showRefresh: true,     //是否显示刷新按钮
        minimumCountColumns: 2,    //最少允许的列数
        clickToSelect: false,    //是否启用点击选中行
        searchOnEnterKey: true,
        columns: [{
            checkbox: true
        }, {
            field: 'objectId',
            title: 'objectId',
            align: 'center',
            visible: false
        }, {
            field: 'name',
            title: '角色名称',
            align: 'center'
        }, {
            field: 'nickName',
            title: '角色昵称',
            align: 'center'
        }, {
            field: 'roleLevel',
            title: '角色等级',
            align: 'center'
        }, {
            title: '操作',
            field: 'objectId',
            align: 'center',
            formatter: function (value, row, index) {
                var html = [
                    '<a rel="tooltip" title="View" class="btn btn-simple btn-info btn-icon table-action role-view" href="javascript:void(0)">',
                    '<i class="fa fa-image"></i>',
                    '</a>',
                    '<a rel="tooltip" title="Edit" class="btn btn-simple btn-warning btn-icon table-action role-edit" href="javascript:void(0)">',
                    '<i class="fa fa-edit"></i>',
                    '</a>',
                    '<a rel="tooltip" title="删除该角色" class="btn btn-simple btn-danger btn-icon table-action role-remove" href="javascript:void(0)">',
                    '<i class="fa fa-remove"></i>',
                    '</a>'
                ].join('');
                return html;
            },
            events: {
                'click .role-view': function (e, value, row, index) {
                    info = JSON.stringify(row);

                    swal('You click view icon, row: ', info);
                },
                'click .role-edit': function (e, value, row, index) {
                    info = JSON.stringify(row);
                    swal('You click edit icon, row: ', info);
                    $("#EditModal").modal('show');
                },
                'click .role-remove': function (e, value, row, index) {
                    swal({
                        title: "确认删除?",
                        text: "角色删除后不能恢复, 并且角色所属的用户将不再拥有这个角色!",
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonClass: "btn btn-danger btn-fill",
                        confirmButtonText: "删除",
                        cancelButtonClass: "btn btn-info btn-fill",
                        cancelButtonText: "取消",
                        closeOnConfirm: false
                    }, function () {
                        $('#myModal').modal('show');
                        var json = JSON.stringify({
                            roleId: value
                        });
                        $.ajax({
                            url: "/api/admin/role/delete",
                            data: json,
                            type: "post",
                            contentType: 'application/json',
                            success: function () {
                                $('#roleTable').bootstrapTable('remove', {
                                    field: 'objectId',
                                    values: [row.objectId]
                                });
                                $('#myModal').modal('hide');
                                swal("成功!", "删除成功", "success");
                            },
                            error: function (error) {
                                $('#myModal').modal('hide');
                                swal("失败!", error.responseJSON.err_message, "error");
                            },
                            complete: function () {
                                $('#myModal').modal('hide');
                            }
                        });
                    });
                }
            }
        }]
    });

    /**
     * 权限管理表
     * */
    $('#roleAuthorityTable').bootstrapTable({
        url: '/api/admin/role/get',
        toolbar: '#toolbar',    //工具按钮用哪个容器
        striped: true,      //是否显示行间隔色
        cache: false,      //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
        pagination: true,     //是否显示分页（*）
        pageNumber: 1,      //初始化加载第一页，默认第一页
        pageSize: 10,      //每页的记录行数（*）
        pageList: [10, 25, 50, 100],  //可供选择的每页的行数（*）
        queryParamsType: '', //默认值为 'limit' ,在默认情况下 传给服务端的参数为：offset,limit,sort
                             // 设置为 ''  在这种情况下传给服务器的参数为：pageSize,pageNumber

        //queryParams: queryParams,//前端调用服务时，会默认传递上边提到的参数，如果需要添加自定义参数，可以自定义一个函数返回请求参
        sidePagination: "server",   //分页方式：client客户端分页，server服务端分页（*）
        search: true,      //是否显示表格搜索，此搜索是客户端搜索，不会进服务端，所以，个人感觉意义不大
        strictSearch: false,
        showColumns: true,     //是否显示所有的列
        showRefresh: true,     //是否显示刷新按钮
        minimumCountColumns: 2,    //最少允许的列数
        clickToSelect: false,    //是否启用点击选中行
        searchOnEnterKey: true,
        columns: [{
            checkbox: true
        }, {
            field: 'objectId',
            title: 'objectId',
            align: 'center',
            visible: false
        }, {
            field: 'name',
            title: '角色名称',
            align: 'center'
        }, {
            field: 'nickName',
            title: '角色昵称',
            align: 'center'
        }, {
            field: 'roleLevel',
            title: '角色等级',
            align: 'center'
        }, {
            title: '操作',
            field: 'objectId',
            align: 'center',
            formatter: function (value, row, index) {
                var html = [
                    '<a rel="tooltip" title="修改权限" class="btn btn-simple btn-warning btn-icon table-action role-edit" href="javascript:void(0)">',
                    '<i class="fa fa-edit"></i>',
                    '</a>'
                ].join('');
                return html;
            },
            events: {
                'click .role-edit': function (e, value, row, index) {
                    $("#EditModal").on('show.bs.modal', function () {
                        var modal = $(this);
                        modal.find('.modal-footer').find('#save').attr('data-id', value);
                        $("#editAuthTable").bootstrapTable({
                            url: '/api/admin/menu/getall?level=1',
                            pageSize: 30,
                            search: false,
                            detailView: true,
                            showRefresh: true,          //是否显示刷新按钮
                            minimumCountColumns: 2,     //最少允许的列数
                            clickToSelect: false,       //是否启用点击选中行
                            columns: [{
                                checkbox: true
                            }, {
                                field: 'objectId',
                                title: 'objectId',
                                align: 'center',
                                visible: false
                            }, {
                                field: 'menuName',
                                title: '菜单名称',
                                align: 'center'
                            }, {
                                field: 'menuNodeUrl',
                                title: '菜单路由',
                                align: 'center'
                            }, {
                                field: 'parentNode.menuName',
                                title: '父级菜单',
                                align: 'center'
                            }, {
                                field: 'nodeLevel',
                                title: '菜单级别',
                                align: 'center'
                            }],

                            onExpandRow: function (index, row, $detail) {
                                var cur_table = $detail.html('<table id="' + row.objectId + '" class="table"></table>').find('table');
                                $(cur_table).bootstrapTable({
                                    url: '/api/admin/menu/getall?level=2&parentId=' + row.objectId,
                                    pageSize: 30,
                                    search: false,
                                    cache: false,
                                    showRefresh: false,         //是否显示刷新按钮
                                    minimumCountColumns: 2,     //最少允许的列数
                                    clickToSelect: true,       //是否启用点击选中行
                                    columns: [{
                                        checkbox: true
                                    }, {
                                        field: 'objectId',
                                        title: 'objectId',
                                        align: 'center',
                                        visible: false
                                    }, {
                                        field: 'menuName',
                                        title: '菜单名称',
                                        align: 'center'
                                    }, {
                                        field: 'menuNodeUrl',
                                        title: '菜单路由',
                                        align: 'center'
                                    }, {
                                        field: 'parentNode.menuName',
                                        title: '父级菜单',
                                        align: 'center'
                                    }, {
                                        field: 'nodeLevel',
                                        title: '菜单级别',
                                        align: 'center'
                                    }]
                                });
                            }
                        });
                    });
                    $("#EditModal").on('hidden.bs.modal', function () {
                        $("#editAuthTable").bootstrapTable('destroy');
                    });

                    $("#EditModal").modal('show', value);
                }
            }
        }]
    });

    /*
    * 查看当前系统角色下的具体用户
    * */
    $("#sysUserTable").bootstrapTable({
        toolbar: '#toolbar',    //工具按钮用哪个容器
        striped: true,      //是否显示行间隔色
        cache: false,      //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
        pagination: true,     //是否显示分页（*）
        queryParamsType: '', //默认值为 'limit' ,在默认情况下 传给服务端的参数为：offset,limit,sort
                             // 设置为 ''  在这种情况下传给服务器的参数为：pageSize,pageNumber
        //queryParams: queryParams,//前端调用服务时，会默认传递上边提到的参数，如果需要添加自定义参数，可以自定义一个函数返回请求参
        sidePagination: "client",   //分页方式：client客户端分页，server服务端分页（*）
        search: true,      //是否显示表格搜索，此搜索是客户端搜索，不会进服务端，所以，个人感觉意义不大
        strictSearch: false,
        showRefresh: true,     //是否显示刷新按钮
        minimumCountColumns: 2,  //最少允许的列数
        clickToSelect: true,    //是否启用点击选中行
        searchOnEnterKey: true,
        columns: [{
            checkbox: true
        }, {
            field: 'objectId',
            title: 'objectId',
            align: 'center',
            visible: false
        }, {
            field: 'username',
            title: '用户名',
            align: 'center'
        }, {
            field: 'nickName',
            title: '用户昵称',
            align: 'center'
        }, {
            field: 'mobilePhoneNumber',
            title: '手机号',
            align: 'center'
        }, {
            field: 'province',
            title: '省份',
            align: 'center'
        }, {
            field: 'city',
            title: '市',
            align: 'center'
        }]
    });

    /**
     * 系统用户列表
     * */
    $('#sysUsersTable').bootstrapTable({
        url: '/api/admin/role/get',
        striped: true,      //是否显示行间隔色
        cache: false,      //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
        pagination: true,     //是否显示分页（*）
        pageNumber: 1,      //初始化加载第一页，默认第一页
        pageSize: 10,      //每页的记录行数（*）
        pageList: [10, 25, 50, 100],  //可供选择的每页的行数（*）
        queryParamsType: '', //默认值为 'limit' ,在默认情况下 传给服务端的参数为：offset,limit,sort
                             // 设置为 ''  在这种情况下传给服务器的参数为：pageSize,pageNumber

        //queryParams: queryParams,//前端调用服务时，会默认传递上边提到的参数，如果需要添加自定义参数，可以自定义一个函数返回请求参
        sidePagination: "server",   //分页方式：client客户端分页，server服务端分页（*）
        search: true,      //是否显示表格搜索，此搜索是客户端搜索，不会进服务端，所以，个人感觉意义不大
        strictSearch: false,
        showColumns: true,     //是否显示所有的列
        showRefresh: true,     //是否显示刷新按钮
        minimumCountColumns: 2,  //最少允许的列数
        clickToSelect: false,    //是否启用点击选中行
        searchOnEnterKey: true,
        columns: [{
            field: 'objectId',
            title: 'objectId',
            align: 'center',
            visible: false
        }, {
            field: 'name',
            title: '角色名称',
            align: 'center'
        }, {
            field: 'nickName',
            title: '角色昵称',
            align: 'center'
        }, {
            field: 'roleLevel',
            title: '角色等级',
            align: 'center'
        }, {
            title: '操作',
            field: 'objectId',
            align: 'center',
            formatter: function (value, row, index) {
                var html = [
                    '<a rel="tooltip" title="查看用户" class="btn btn-simple btn-info btn-icon table-action role-view" href="javascript:void(0)">',
                    '<i class="fa fa-group"></i>',
                    '</a>',
                    '<a rel="tooltip" title="添加用户" class="btn btn-simple btn-warning btn-icon table-action role-add" href="javascript:void(0)">',
                    '<i class="fa fa-user-plus"></i>',
                    '</a>'
                ].join('');
                return html;
            },
            events: {
                'click .role-view': function (e, value, row, index) {
                    var url = '/api/admin/user/getall?roleId=' + value;
                    $("#sysUserTable").bootstrapTable('refresh', {url: url});
                    $("#sysUserListModal").on('hide.bs.modal', function () {
                        $("#sysUserTable").bootstrapTable('removeAll');
                    });
                    $("#sysUserListModal").find("#btn_remove").attr('data-id', row.name);
                    $("#sysUserListModal").modal('show');
                },
                'click .role-add': function (e, value, row, index) {
                    $('input[name="roleName"]').val(row.name);
                    $('input[name="roleNickName"]').val(row.nickName);
                    $('input[name="username"]').val('');
                    $("#sysUserAddModal").modal('show');
                }
            }
        }]
    });

    /*
     * 用户管理_用户列表
     */

    //监听下拉菜单，更改输入框提示
	$('#userSearchMenu').on('changed.bs.select', function(e) {
		if(e.target.value == "searchBan"){
			$('#userSearchInp').val('')
			$('#userSearchInp').attr('placeholder', '请输入是或否，默认为是')
		}else if(e.target.value == "searchWechat"){
			$('#userSearchInp').val('')
			$('#userSearchInp').attr('placeholder', '请输入是或否，默认为是')
		}else if(e.target.value == "searchGender"){
			$('#userSearchInp').val('')
			$('#userSearchInp').attr('placeholder', '请输入男或女')
		}else{
			$('#userSearchInp').val('')
			$('#userSearchInp').attr('placeholder', '请输入关键词')
		}
	})
    //用户列表搜索功能
	$('#userSearchBt').on('click',function(){
        var txt;
		var val = $('#userSearchMenu').val();//获取下拉菜单项
		if(val == ''){
			swal({
                title: "请先选择搜索条件",
                type: "warning",
                confirmButtonClass: "btn btn-danger btn-fill",
                confirmButtonText: "确定",
            });
			return;
        }
        if(val == 'searchBan') {
            txt = 'true';
        } else if(val == 'searchWechat') {
            txt = 'true';
        } else {
            txt = $('#userSearchInp').val();//获取输入框搜索词
        }
		$('#myModal').modal('show');
		var param = val+"="+txt;
		var url= '/api/admin/user/get?'+param
		$('#usersTable').bootstrapTable('refresh',{url:url});
	});
	//键盘回车快捷搜索
	$('#userSearchInp').keydown(function(e){
		if(e.keyCode==13){
            var txt;
             var val = $('#userSearchMenu').val();//获取下拉菜单项
             if(val == 'searchBan') {
                txt = 'true';
             } else if(val == 'searchWechat') {
                txt = 'true';
             } else {
                txt = $('#userSearchInp').val();//获取输入框搜索词
             }
			var param = val+"="+txt;
			var url= '/api/admin/user/get?'+param
			$('#usersTable').bootstrapTable('refresh',{url:url});
		}
	});
    //表格数据
    $('#usersTable').bootstrapTable({
        url: '/api/admin/user/get',
        toolbar: '#toolbar',    //将顶部下拉菜单和输入框数据融入表格
        striped: true,      //是否显示行间隔色
        cache: false,      //是否使用缓存，默认为true
        pagination: true,     //是否显示分页（*）
        pageNumber: 1,      //初始化加载第一页，默认第一页
        pageSize: 10,      //每页的记录行数（*）
        pageList: [10, 25, 50, 100],  //可供选择的每页的行数（*）
        queryParamsType: '', //默认值为 'limit' ,在默认情况下 传给服务端的参数为：offset,limit,sort
                             // 设置为 ''  在这种情况下传给服务器的参数为：pageSize,pageNumber

        //queryParams: queryParams,//前端调用服务时，会默认传递上边提到的参数，如果需要添加自定义参数，可以自定义一个函数返回请求参
        sidePagination: "server",   //分页方式：client客户端分页，server服务端分页（*）
        search: false,      //是否显示表格搜索，此搜索是客户端搜索，不会进服务端
        strictSearch: false,
        showColumns: true,     //是否显示所有的列
        showRefresh: true,     //是否显示刷新按钮
        minimumCountColumns: 2,  //最少允许的列数
        clickToSelect: false,    //是否启用点击选中行
        searchOnEnterKey: true,
        columns: [{
            field: 'objectId',
            title: 'objectId',
            align: 'center',
            visible: false
        }, {
            field: 'username',
            title: '用户名称',
            align: 'center'
        }, {
            field: 'nickName',
            title: '用户昵称',
            align: 'center'
        },{
            title: '性别',
            align: 'center',
            formatter: function (value, row, index) {
	            if(row.gender == 1){
	            	return '男'
	            }else if(row.gender == 2){
	            	return '女'
	            }
            }
        },{
            field: 'email',
            title: '邮箱',
            align: 'center'
        }, {
            title: '手机验证',
            align: 'center',
            formatter: function (value, row, index) {
	            if(row.mobilePhoneVerified == true){
	            	return '已验证'
	            }else if(row.mobilePhoneVerified == false){
	            	return '未验证'
	            }
            }
        }, {
            title: '邮箱验证',
            align: 'center',
            formatter: function (value, row, index) {
	            if(row.emailVerified == true){
	            	return '已验证'
	            }else if(row.emailVerified == false){
	            	return '未验证'
	            }
            }
        },{
            title: '操作',
            field: 'objectId',
            align: 'center',
            formatter: function (value, row, index){
                if(row.isActive == 1 ){
                    var html = [
                            '<a rel="tooltip" title="用户状态正常，可封禁" class="btn  btn-simple btn-info btn-icon table-action user-ban" href="javascript:void(0)">',
                            '<i class="fa fa-ban" ></i>',
                            '</a>',
                    ].join('');
                    return html;
                }else if(row.isActive == 0){
                    var html = [
                            '<a rel="tooltip" title="用户被封禁，可解封" class="btn  btn-simple btn-info btn-icon table-action user-unban" href="javascript:void(0)">',
                            '<i class="fa fa-ban" style="color:red"></i>',
                            '</a>',
                    ].join('');
                    return html;
                }
            },
            events: {
                'click .user-ban': function (e, value, row, index) {
                    swal({
                        title: "要封禁该用户吗?",
                        text: "",   //说明性提示
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonClass: "btn btn-danger btn-fill",
                        confirmButtonText: "确定",
                        cancelButtonClass: "btn btn-info btn-fill",
                        cancelButtonText: "取消",
                        closeOnConfirm: false
                    }, function () {
                        $('#myModal').modal('show');
                        var json = JSON.stringify({
                           userId:row.objectId
                        });
                        $.ajax({
                            url: "/api/admin/user/ban",
                            data: json,
                            type: "post",
                            contentType: 'application/json',
                            success: function () {
                                $('#usersTable').bootstrapTable('refresh');//刷新
                                $('#myModal').modal('hide');
                                swal("OK!", "封禁成功", "success");
                            },
                            error: function (error) {
                                $('#myModal').modal('hide');
                                swal("发生未知错误,请稍后重试!", error.responseJSON.err_message);
                            },
                            complete: function () {
                                $('#myModal').modal('hide');
                            }
                        })

                   })
                },
                'click .user-unban': function (e, value, row, index) {
                    swal({
                        title: "要解封该用户吗?",
                        text: "",   //说明性提示
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonClass: "btn btn-danger btn-fill",
                        confirmButtonText: "确定",
                        cancelButtonClass: "btn btn-info btn-fill",
                        cancelButtonText: "取消",
                        closeOnConfirm: false
                    }, function () {
                        $('#myModal').modal('show');
 						var json = JSON.stringify({
                           userId:row.objectId
                        });
                        $.ajax({
                            url: "/api/admin/user/unban",
                            data: json,
                            type: "post",
                            contentType: 'application/json',
                            success: function () {
                                $('#usersTable').bootstrapTable('refresh');//刷新
                                $('#myModal').modal('hide');
                                swal("OK!", "解封成功", "success");
                            },
                            error: function (error) {
                                $('#myModal').modal('hide');
                                swal("发生未知错误,请稍后重试!", error.responseJSON.err_message);
                            },
                            complete: function () {
                                $('#myModal').modal('hide');
                            }
                        })
                    })
                }
            }
        }]
    });
     /**
     * 用户管理_会员列表
     * */
    $('#vipsTable').bootstrapTable({
       // url: '/api/admin/getvips',
        striped: false,      //是否显示行间隔色
        cache: false,      //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
        pagination: true,     //是否显示分页（*）
        pageNumber: 1,      //初始化加载第一页，默认第一页
        pageSize: 10,      //每页的记录行数（*）
        pageList: [10, 25, 50, 100],  //可供选择的每页的行数（*）
        queryParamsType: '', //默认值为 'limit' ,在默认情况下 传给服务端的参数为：offset,limit,sort
                             // 设置为 ''  在这种情况下传给服务器的参数为：pageSize,pageNumber

        //queryParams: queryParams,//前端调用服务时，会默认传递上边提到的参数，如果需要添加自定义参数，可以自定义一个函数返回请求参
        sidePagination: "server",   //分页方式：client客户端分页，server服务端分页（*）
        search: false,      //是否显示表格搜索，此搜索是客户端搜索，不会进服务端，所以，个人感觉意义不大
        strictSearch: false,
        showColumns: true,     //是否显示所有的列
        showRefresh: true,     //是否显示刷新按钮
        minimumCountColumns: 2,  //最少允许的列数
        clickToSelect: false,    //是否启用点击选中行
        searchOnEnterKey: true,
        columns: [{
            field: 'objectId',
            title: 'objectId',
            align: 'center',
            visible: false
        }, {
            field: 'name',
            title: '角色名称',
            align: 'center'
        }, {
            field: 'nickName',
            title: '角色昵称',
            align: 'center'
        }, {
            field: 'roleLevel',
            title: '角色等级',
            align: 'center'
        }, {
            title: '操作',
            field: 'objectId',
            align: 'center',
            formatter: function (value, row, index) {
                var html = [
                    '<a rel="tooltip" title="查看会员用户" class="btn btn-simple btn-info btn-icon table-action users-view" href="javascript:void(0)">',
                    '<i class="fa fa-group"></i>',
                    '</a>',
                    '<a rel="tooltip" title="添加会员用户" class="btn btn-simple btn-warning btn-icon table-action users-add" href="javascript:void(0)">',
                    '<i class="fa fa-user-plus"></i>',
                    '</a>'
                ].join('');
                return html;
            },
            events: {
                'click .users-view': function (e, value, row, index) {
                  //  var url = '/api/admin/getvips?roleId=' + value;
                    $("#vipTable").bootstrapTable('refresh', {url: url});
                    $("#vipListModal").on('hide.bs.modal', function () {
                        $("#vipTable").bootstrapTable('removeAll');
                    });
                    $("#vipListModal").find("#btn_remove").attr('data-id', value);
                    $("#vipListModal").modal('show');
                },
                'click .users-add': function (e, value, row, index) {

                }
            }
        }]
    });

    /**
     * 商品管理_库存管理
     */

    //库存列表搜索功能
	$('#storageSearchBtn').on('click',function(){
		var val = $('#storageSearchMenu').val();//获取下拉菜单项
		if(val == ''){
			swal({
                  title: "请先选择搜索条件",
                  type: "warning",
                  confirmButtonClass: "btn btn-danger btn-fill",
                  confirmButtonText: "确定",
            });
			return;
		}
		$('#myModal').modal('show');
		var txt = $('#storageSearchInp').val();//获取输入框搜索词
		var param = val+"="+txt;
		//var url= '/api/admin/device/get?'+param
		$('#storageTable').bootstrapTable('refresh',{url:url});
	});

	$('#storageSearchInp').keydown(function(e){//键盘回车快捷搜索
		if(e.keyCode==13){
		 	var val = $('#storageSearchMenu').val();//获取下拉菜单项
			$('#myModal').modal('show');
			var txt = $('#storageSearchInp').val();//获取输入框搜索词
			var param = val+"="+txt;
			//var url= '/api/admin/device/get?'+param
			$('#storageTable').bootstrapTable('refresh',{url:url});
		}
	});
    //表格数据
    $('#storageTable').bootstrapTable({
        url: '/api/admin/device/get',
        toolbar: '#toolbar',    //将顶部下拉菜单和输入框数据融入表格
        striped: true,      //是否显示行间隔色
        cache: false,      //是否使用缓存，默认为true
        pagination: true,     //是否显示分页（*）
        pageNumber: 1,      //初始化加载第一页，默认第一页
        pageSize: 10,      //每页的记录行数（*）
        pageList: [10, 25, 50, 100],  //可供选择的每页的行数（*）
        queryParamsType: '', //默认值为 'limit' ,在默认情况下 传给服务端的参数为：offset,limit,sort
                             // 设置为 ''  在这种情况下传给服务器的参数为：pageSize,pageNumber
        //queryParams: queryParams,//前端调用服务时，会默认传递上边提到的参数，如果需要添加自定义参数，可以自定义一个函数返回请求参
        sidePagination: "server",   //分页方式：client客户端分页，server服务端分页（*）
        search: false,      //是否显示表格搜索，此搜索是客户端搜索，不会进服务端，所以，个人感觉意义不大
        strictSearch: false,
        showColumns: true,     //是否显示所有的列
        showRefresh: true,     //是否显示刷新按钮
        minimumCountColumns: 2,  //最少允许的列数
        clickToSelect: false,    //是否启用点击选中行
        searchOnEnterKey: true,
        columns: [{
            field: 'objectId',
            title: 'objectId',
            align: 'center',
            visible: false
        }, {
            field: 'deviceSN',
            title: '设备序列号',
            align: 'center'
        }, {
            field: 'deviceIMEI',
            title: 'IMEI号',
            align: 'center',
            formatter: function (value, row, index) {
            	if(row.deviceIMEI == null){
                 	return '暂无'
                }else if(row.deviceIMEI !== null){
                 	return row.deviceIMEI
                }
            }
        }, {
            field: '',
            title: 'MAC地址',
            align: 'center',
            formatter: function (value, row, index) {
            	if(row.deviceMAC == null){
                 	return '暂无'
                }else if(row.deviceMAC !== null){
                 	return row.deviceMAC
                }
            }
        }, {
            title: '设备状态',
            align: 'center',
            formatter: function (value, row, index) {
	            if(row.status == 0){
	            	return '入库'
	            }else if(row.status == 1){
	            	return '--'
	            }else if(row.status == 2){
	            	return '--'
	            }
            }
        },{
            title: '设备使用状态',
            align: 'center',
            formatter: function (value, row, index) {
	            if(row.isActive == 1){
	            	return '正常'
	            }else if(row.isActive == 0){
	            	return '故障'
	            }
            }
        },{
            title: '创建时间',
            align: 'center',
            formatter: function (value, row, index) {
				var now = new Date(row.createdAt),
				y = now.getFullYear(),
				m = now.getMonth() + 1,
				d = now.getDate();
				return y + "年" + (m < 10 ? "0" + m : m) + "月" + (d < 10 ? "0" + d : d) +"日"+ "    " + now.toTimeString().substr(0, 8);
            }
        },{
            title: '更新时间',
            align: 'center',
            formatter: function (value, row, index) {
	           var now = new Date(row.updatedAt),
				y = now.getFullYear(),
				m = now.getMonth() + 1,
				d = now.getDate();
				return y + "年" + (m < 10 ? "0" + m : m) + "月" + (d < 10 ? "0" + d : d) +"日"+ "   " + now.toTimeString().substr(0, 8);
            }
        },{
            title: '操作',
            field: 'objectId',
            align: 'center',
            formatter: function (value, row, index) {
                var html = [
                    '<a rel="tooltip" title="指定代理商" class="btn btn-simple btn-warning btn-icon table-action device-revise" href="javascript:void(0)">',
                    '<i class="fa fa-user-plus"></i>',
                    '</a>'
                ].join('');
                return html;
           },
            events: {
                 'click .device-revise': function (e, value, row, index) {
                 	var isActiveFn = function(){
                 		if(row.isActive == 1){
			            	return '正常'
			            }else if(row.isActive == 0){
			            	return '故障'
			            }
                 	}
                 	var imei = function(){
                 		if(row.deviceIMEI == null){
                 			return '暂无'
                 		}else if(row.deviceIMEI !== null){
                 			return row.deviceIMEI
                 		}
                 	}
                 	var mac = function(){
                 		if(row.deviceMAC == null){
		                 	return '暂无'
		                }else if(row.deviceMAC !== null){
		                 	return row.deviceMAC
		                }
                 	}
                 	$('input[name="sn"]').val(row.deviceSN);
                    $('input[name="device"]').val(isActiveFn);
                    $('input[name="mac"]').val(mac);
                    $('input[name="imei"]').val(imei);
                 	$("#appointedAgentsModal").modal('show');
                       /* var json = JSON.stringify({
                           userId:row.objectId
                        });
                        $.ajax({
                           // url: "/api/admin/user/ban",
                            data: json,
                            type: "post",
                            contentType: 'application/json',
                            success: function () {
                                $('#storageTable').bootstrapTable('refresh');//刷新
                                $('#myModal').modal('hide');
                                swal("OK!", "封禁成功", "success");
                            },
                            error: function (error) {
                                $('#myModal').modal('hide');
                                swal("发生未知错误,请稍后重试!", error.responseJSON.err_message);
                            },
                            complete: function () {
                                $('#myModal').modal('hide');
                            }
                        })*/
                },
            }
        }]
    });


    /**
    * 代理商列表
    */

    //代理商列表搜索功能
	$('#agentsSearchBtn').on('click',function(){
		var val = $('#agentsSearchMenu').val();//获取下拉菜单项
		if(val == ''){
			swal({
                  title: "请先选择搜索条件",
                  type: "warning",
                  confirmButtonClass: "btn btn-danger btn-fill",
                  confirmButtonText: "确定",
            });
			return;
		}
		$('#myModal').modal('show');
		var txt = $('#agentsSearchInp').val();//获取输入框搜索词
		var param = val+"="+txt;
		//var url= '/api/admin/device/get?'+param
		$('#agentsTable').bootstrapTable('refresh',{url:url});
	});

	$('#agentsSearchInp').keydown(function(e){//键盘回车快捷搜索
		if(e.keyCode==13){
		 	var val = $('#agentsSearchMenu').val();//获取下拉菜单项
			$('#myModal').modal('show');
			var txt = $('#agentsSearchInp').val();//获取输入框搜索词
			var param = val+"="+txt;
			//var url= '/api/admin/device/get?'+param
			$('#agentsTable').bootstrapTable('refresh',{url:url});
		}
	});

    //表格数据
    $('#agentsTable').bootstrapTable({
       // url: '/api/admin/agents/get',
        toolbar: '#toolbar',    //将顶部下拉菜单和输入框数据融入表格
        striped: true,      //是否显示行间隔色
        cache: false,      //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
        pagination: true,     //是否显示分页（*）
        pageNumber: 1,      //初始化加载第一页，默认第一页
        pageSize: 10,      //每页的记录行数（*）
        pageList: [10, 25, 50, 100],  //可供选择的每页的行数（*）
        queryParamsType: '', //默认值为 'limit' ,在默认情况下 传给服务端的参数为：offset,limit,sort
                             // 设置为 ''  在这种情况下传给服务器的参数为：pageSize,pageNumber
        //queryParams: queryParams,//前端调用服务时，会默认传递上边提到的参数，如果需要添加自定义参数，可以自定义一个函数返回请求参
        sidePagination: "server",   //分页方式：client客户端分页，server服务端分页（*）
        search: false,      //是否显示表格搜索，此搜索是客户端搜索，不会进服务端，所以，个人感觉意义不大
        strictSearch: false,
        showColumns: true,     //是否显示所有的列
        showRefresh: true,     //是否显示刷新按钮
        minimumCountColumns: 2,  //最少允许的列数
        clickToSelect: false,    //是否启用点击选中行
        searchOnEnterKey: true,
        columns: [{
            field: 'objectId',
            title: 'objectId',
            align: 'center',
            visible: false
        }, {
            field: 'name',
            title: '角色名称',
            align: 'center'
        }, {
            field: 'nickName',
            title: '角色昵称',
            align: 'center'
        }, {
            field: 'roleLevel',
            title: '角色等级',
            align: 'center'
        }, {
            title: '操作',
            field: 'objectId',
            align: 'center',
            formatter: function (value, row, index) {
                var html = [
                    '<a rel="tooltip" title="查看代理商" class="btn btn-simple btn-info btn-icon table-action agents-view" href="javascript:void(0)">',
                    '<i class="fa fa-group"></i>',
                    '</a>',
                    '<a rel="tooltip" title="添加代理商" class="btn btn-simple btn-warning btn-icon table-action agents-add" href="javascript:void(0)">',
                    '<i class="fa fa-user-plus"></i>',
                    '</a>'
                ].join('');
                return html;
            },
            events: {
                'click .agents-view': function (e, value, row, index) {
                   // var url = '/api/admin/agents/get?roleId=' + value;
                    $("#agentTable").bootstrapTable('refresh', {url: url});
                    $("#agentListModal").on('hide.bs.modal', function () {
                        $("#agentTable").bootstrapTable('removeAll');
                    });
                    $("#agentListModal").find("#btn_remove").attr('data-id', value);
                    $("#agentListModal").modal('show');
                },
                'click .agents-add': function (e, value, row, index) {

                }
            }
        }]
    });





});


