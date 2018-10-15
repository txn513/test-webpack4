/**
 * Created by Huangj on 2018/9/7.
 * 自定义js
 */

// 解析业务类型  key:业务类型编码
 function getBusinessTypeName(key) {
    switch (key) {
        case 1:
            return '森特尔洗护';
            break;
        case 2:
            return '名品易手';
            break;
        case 4:
            return '态奢';
            break;
        default:
            return '未知业务类型';
    }
}


export default {getBusinessTypeName}

















