import GLOBAL from "../../Global";
import {  Message } from 'element-ui'
//寄卖订单状态-----------
const   CON_STATUS ={
        SUCCESS: 0
        , SELLING: 50
        , SELLING_FINISH: 60
    };
//寄卖订单权限
const   CON_PRIVILEGE ={
    INSERT: 'mpys:order:consignment:insert',
    DELETE: 'mpys:order:consignment:delete',
    UPDATE: 'mpys:order:consignment:update',
    VIEW: 'mpys:order:consignment:view',
};



export default {
    data: function () {
        return {
            CON_STATUS,
            CON_PRIVILEGE
        };
    },
    /**
     *
     * @param res   返回的结果
     * @param success 成功回调函数
     * @param fail  失败回调函数
     * @param isSuccessDialog 成功时候是否弹框显示msg,默认true弹框
     * @param isFailDialog  失败时候是否弹框显示msg,默认true弹框
     */
    handleResult: function(res,success,fail,isSuccessDialog = true,isFailDialog = true) {
        try {
            if (GLOBAL.isResonseSuccess(res)) {
                if( success){
                    success();
                }
                if(isSuccessDialog) {
                    Message.success( "操作成功" );
                }
            }else {
                if(fail){
                    fail();
                }
                console.log(11111);
                let msg =res.message;
                if(msg!=undefined){
                    if(msg=="Error"){
                        msg=res.data;
                    }
                }
                if(isFailDialog){
                    Message.warning( msg );
                }
            }
        }catch (e) {
            console.error(e);
            Message.error( "error_程序有误" );
        }
    },
    //时间格式化
    commonDateFormat: function (row, column) {
        var time = row[column.property];
        var fmt ="yyyy-MM-dd hh:mm:ss";
        // return util.formatDate.dateFormat(fmt, time);

        if (time == undefined) {
            return "";
        }
        var date = new Date(time);


        var o = {
            "M+" : date.getMonth()+1,                 //月份
            "d+" : date.getDate(),                    //日
            "h+" : date.getHours(),                   //小时
            "m+" : date.getMinutes(),                 //分
            "s+" : date.getSeconds(),                 //秒
            "q+" : Math.floor((date.getMonth()+3)/3), //季度
            "S"  : date.getMilliseconds()             //毫秒
        };
        if(/(y+)/.test(fmt))
            fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));
        for(var k in o)
            if(new RegExp("("+ k +")").test(fmt))
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
        return fmt;
    },
    //寄卖订单状态-----------

    formatStatus: function(row, column) {
       return this.formatStatusByCode(row.orderStatus);
    },
    formatStatusByCode: function(orderStatus) {
        switch (orderStatus) {
            case 10:
                return '待处理';
                break;
            case 20:
                return '待确认寄送';
                break;
            case 30:
                return '待鉴定';
                break;
            case 40:
                return '待调价';
                break;
            case 50:
                return '寄卖中';
                break;
            case 60:
                return '寄卖完成';
                break;
            case 70:
                return '退货申请';
                break;
            case 80:
                return '已退货';
                break;
            case 90:
                return '已关闭';
                break;

            default:
                return '未知状态:'+orderStatus;
        }
    },
};

