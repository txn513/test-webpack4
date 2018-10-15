/**
 * Created by Huangj on 2018/5/3.
 * 自定义js，处理仓储模块涉及的枚举类型
 */


// 解析配送方式  key:配送方式的key值
 function parseDeliveryTypeFun(key) {
    switch(key){
        case 0:
            return '派件上门';
            break;
        case 1:
            return '到店自取';
            break;
        case 2:
            return '到柜自取';
            break;
        case 3:
            return '快递配送';
            break;
        default:
            return '未知配送方式';
    }
}

// 解析订单状态  key:订单状态的key值
function parseOrderStatusFun(key) {
    switch(key){
        case 0:
            return '待处理';
            break;
        case 10:
            return '拣货中';
            break;
        case 20:
            return '复核完成';
            break;
        case 30:
            return '已发运';
            break;
        case 40:
            return '已取消';
            break;
        case 50:
            return '已关闭';
            break;
        default:
            return '未知订单状态';
    }
}

// 解析出库类型  key:出库类型的key值
function parseExpTypeFun(key) {
    switch(key){
        case 0:
            return '销售出库';
            break;
        case 1:
            return '调拨出库';
            break;
        case 2:
            return '采购退回';
            break;
        case 3:
            return '寄卖退回';
            break;
        default:
            return '未知出库类型';
    }
}

// 解析复核状态  key:复核状态的key值
function parseRecheckStatusFun(key) {
    switch(key){
        case 0:
            return '未复核';
            break;
        case 10:
            return '已复核';
            break;
        default:
            return '未知复核类型';
    }
}

//入库模块枚举
//解析入库订单状态   key:订单状态的key值
function parseImOrderStatusFun(key) {
    switch(key){
        case 0:
            return '待收货';
            break;
        case 10:
            return '部分收货';
            break;
        case 20:
            return '完全收货';
            break;
        case 30:
            return '已取消';
            break;
        case 40:
            return '已关闭';
            break;
        default:
            return '未知订单状态';
    }
}
//解析解析入库类型   key:入库类型的key值
function parseImOrderStypeFun(key) {
    switch(key){
        case 0:
            return '采购入库';
            break;
        case 1:
            return '调拨入库';
            break;
        case 2:
            return '退货入库';
            break;
        case 3:
            return '回收入库';
            break;
        case 4:
            return '寄卖入库';
            break;
        default:
            return '未知入库类型';
    }
}

// 解析订单来源  key:订单来源 的key值
function parseOrderSourseFun(key) {
    switch(key){
        case 1:
            return '京东';
            break;
        case 2:
            return '淘宝';
            break;
        case 3:
            return '门店';
            break;
        default:
            return null;
    }
}

export default {parseDeliveryTypeFun,parseOrderStatusFun,parseExpTypeFun,parseRecheckStatusFun,parseImOrderStatusFun,parseImOrderStypeFun,parseOrderSourseFun}

















