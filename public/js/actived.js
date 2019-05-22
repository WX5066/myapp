$().ready(function () {

    //监听下拉菜单，更改输入框提示
    $('#activedSearchMenu').on('changed.bs.select', function(e) {
        
    })    

    //用户列表搜索功能
    $('#activedSearchBt').on('click',function(){
        var txt;
        var val = $('#activedSearchMenu').val();
        txt = $('#activedSearchInp').val();//获取输入框搜索词
        if(val == ''){
            swal({
                title: "请先选择搜索条件",
                type: "warning",
                confirmButtonClass: "btn btn-danger btn-fill",
                confirmButtonText: "确定",
            });
            return;
        }
        if(txt == ''){
            swal({
                title: "请输入搜索关键词",
                type: "warning",
                confirmButtonClass: "btn btn-danger btn-fill",
                confirmButtonText: "确定",
            });
            return;
        }
        $('#myModal').modal('show');
        var param = val+"="+txt;		
        var url= '/api/admin/taihe/actived?'+param
        $('#activedTable').bootstrapTable('refresh',{url:url});
    });

    //键盘回车快捷搜索
    $('#activedSearchInp').keydown(function(e){
        if(e.keyCode==13){
            var val = $('#activedSearchMenu').val();//获取下拉菜单项
            var txt = $('#activedSearchInp').val();//获取输入框搜索词
            if(val == ''){
                swal({
                    title: "请先选择搜索条件",
                    type: "warning",
                    confirmButtonClass: "btn btn-danger btn-fill",
                    confirmButtonText: "确定",
                });
                return;
            }
            if(txt == ''){
                swal({
                    title: "请输入搜索关键词",
                    type: "warning",
                    confirmButtonClass: "btn btn-danger btn-fill",
                    confirmButtonText: "确定",
                });
                return;
            }
            var param = val+"="+txt;
            var url= '/api/admin/taihe/actived?'+param
            $('#activedTable').bootstrapTable('refresh',{url:url});
        }
    });

    //表格数据
    $('#activedTable').bootstrapTable({
        url: '/api/admin/taihe/actived',
        toolbar: '#toolbar',
        striped: true,
        cache: false,
        pagination: true,
        pageNumber: 1,
        pageSize: 15,
        pageList: [15, 25, 50, 100],
        queryParamsType: '',
        sidePagination: "server",
        search: false,
        strictSearch: false,
        showColumns: true,
        showRefresh: true,
        minimumCountColumns: 2,
        clickToSelect: false,
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
        },{
            field: 'installation',
            title: 'InstallationID',
            align: 'center',
        },{
            field: 'userId.username',
            title: '用户名',
            align: 'center'
        }, {
            field: 'createdAt',
            title: '激活时间',
            align: 'center',
            formatter: function (value, row, index) {
                if(value){
                    return moment(value).format('YYYY-MM-DD HH:mm:ss');
                }
            },
        }, {
            field: 'endTime',
            title: '结束时间',
            align: 'center',
        }]
    });
});