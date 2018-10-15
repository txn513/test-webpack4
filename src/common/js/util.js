
var SIGN_REGEXP = /([yMdhsm])(\1*)/g;
var DEFAULT_PATTERN = 'yyyy-MM-dd';
function padding(s, len) {
    var len = len - (s + '').length;
    for (var i = 0; i < len; i++) { s = '0' + s; }
    return s;
};
function getCookie(name,defaultValue) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg))
        return unescape(arr[2]);
    else
        return defaultValue;
};

export default {
    getCookie,
    getUUID,
    getQueryStringByName: function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        var context = "";
        if (r != null)
            context = r[2];
        reg = null;
        r = null;
        return context == null || context == "" || context == "undefined" ? "" : context;
    },
    //格式化商品
    formatGoodsName: function (code) {
      let result = [];
        if(code==-1){
            result.push('通用');
        }else if(code==''){
            result = [];
        }else{
            let businessList = JSON.parse(sessionStorage.getItem("businessList"));
            let codeResult = [];
            for (let item of businessList){
                codeResult.push(code&parseInt(item.code));
            }
            for(let item of codeResult){
                for(let item1 of businessList){
                    if(item==item1.code){
                        result.push(item1.name);
                    }
                }
            }
        }
      return result.join("，");
    },
    formatDate: {
        format: function (date, pattern) {
            pattern = pattern || DEFAULT_PATTERN;
            return pattern.replace(SIGN_REGEXP, function ($0) {
                switch ($0.charAt(0)) {
                    case 'y': return padding(date.getFullYear(), $0.length);
                    case 'M': return padding(date.getMonth() + 1, $0.length);
                    case 'd': return padding(date.getDate(), $0.length);
                    case 'w': return date.getDay() + 1;
                    case 'h': return padding(date.getHours(), $0.length);
                    case 'm': return padding(date.getMinutes(), $0.length);
                    case 's': return padding(date.getSeconds(), $0.length);
                }
            });
        },
        parse: function (dateString, pattern) {
            var matchs1 = pattern.match(SIGN_REGEXP);
            var matchs2 = dateString.match(/(\d)+/g);
            if (matchs1.length == matchs2.length) {
                var _date = new Date(1970, 0, 1);
                for (var i = 0; i < matchs1.length; i++) {
                    var _int = parseInt(matchs2[i]);
                    var sign = matchs1[i];
                    switch (sign.charAt(0)) {
                        case 'y': _date.setFullYear(_int); break;
                        case 'M': _date.setMonth(_int - 1); break;
                        case 'd': _date.setDate(_int); break;
                        case 'h': _date.setHours(_int); break;
                        case 'm': _date.setMinutes(_int); break;
                        case 's': _date.setSeconds(_int); break;
                    }
                }
                return _date;
            }
            return null;
        }
    },
    //格式化时间戳(毫秒)
    dateFormat:function (fmt,date) { //author: meizz
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
    //格式化金额
    moneyFormat:function (s, n)   {
        n = n > 0 && n <= 20 ? n : 2;
        s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
        var l = s.split(".")[0].split("").reverse(),
            r = s.split(".")[1];
        var t = "";
        for(var i = 0; i < l.length; i ++ ) {
            t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
        }
        return t.split("").reverse().join("") + "." + r;
    },
    //将营业时间或高峰时间转成json串,存入
    arrToJson(arr){
        if(!arr || arr.length == 0){
            return '';
        }
        var tempArr = [];
        var days='周一,周二,周三,周四,周五,周六,周日';
        var weekend='周六,周日';
        var workday='周一,周二,周三,周四,周五';

        for(var i=0;i<arr.length;i++){
            if(arr[i].value1 && arr[i].value2 && arr[i].value3){
                var value1='';//周期
                for(var n=0;n<arr[i].value1.length;n++){
                    value1+=arr[i].value1[n]+',';
                }
                if(arr[i].value4 === true ){
                    arr[i].value4=1;
                }else{
                    arr[i].value4=0;
                }
                value1=value1.substring(0,value1.length-1);
                //周日,工作日,每日转换
                if(value1.length==days.length){
                    value1='每天';
                }else if(value1.length==weekend.length){
                    if(value1.indexOf('周六')>=0&&value1.indexOf('周日')>=0) {
                        value1 = '周末';
                    }
                }else if(value1.length==workday.length){
                    if(value1.indexOf('周一')>=0&&value1.indexOf('周二')>=0&&value1.indexOf('周三')>=0&&value1.indexOf('周四')>=0&&value1.indexOf('周五')>=0) {
                        value1 = '工作日';
                    }
                }

                arr[i].value1=value1;
                tempArr.push(arr[i]);
            }
        }
        //console.log(JSON.stringify(tempArr)+"#");
        return tempArr.length>0?JSON.stringify(tempArr):'';
    },

    //将json串转成营业时间或高峰时间的对象,取出
    jsonToArr(json){
        if(json ==''){
            return '';
        }

        var arr = JSON.parse(json);

        var days='周一,周二,周三,周四,周五,周六,周日';
        var weekend='周六,周日';
        var workday='周一,周二,周三,周四,周五';

        var tempArr = [];
        for(var i=0;i<arr.length;i++){
            if(arr[i].value1 && arr[i].value2 && arr[i].value3){

                //周日,每日,工作日转换
                if(arr[i].value1=='每天'){
                    arr[i].value1=days;
                }
                if(arr[i].value1=='周末'){
                    arr[i].value1=weekend;
                }
                if(arr[i].value1=='工作日'){
                    arr[i].value1=workday;
                }

                if(arr[i].value4){
                    arr[i].value4=true;
                }else{
                    arr[i].value4=false;
                }
                var value1=arr[i].value1.split(',');//周期
                arr[i].value1=value1;
                tempArr.push(arr[i]);
            }
        }

        //console.log(JSON.stringify(tempArr));
        return tempArr;
    },

    //处理城市(重庆市->重庆)
    getCity:function(cityName){
        if(cityName!==null){
            var index =  cityName.indexOf('市');
            if(index>=0){
                cityName=cityName.substring(0,cityName.length-1);
            }
        }
        return cityName;
    },
    //订单所有状态
    getOrderStatus:function(status) {
        var arr = [];
        arr[0] = '订单提交状态';
        arr[10] = '申请取消';
        arr[20] = '待发货';
        arr[30] = '待收货';
        arr[40] = '智能柜预约中';
        arr[50] = '智能柜预约失败';
        arr[60] = '智能柜预约成功';
        arr[70] = '用户已将货物存柜';
        arr[80] = '门店已分配收件员';
        arr[90] = '收件员确认前往';
        arr[100] = '收件员从柜中取件';
        arr[110] = '已关联订单';
        arr[120] = '门店收到客户的货物';
        arr[130] = '加工中心收货员从门店收货';
        arr[140] = '加工中心已收货';
        arr[150] = '清洗中';
        arr[160] = '清洗完成';
        arr[170] = '送回门店';
        arr[180] = '门店确认收货';
        arr[190] = '门店分配派件员';
        arr[200] = '派件员配送中';
        arr[210] = '派件员已存入柜中';
        arr[220] = '已签收';
        arr[230] = '用户确认已收货/已完成';
        arr[240] = '用户评价';
        arr[250] = '商家回收';
        arr[260] = '客户紧急取走';
        arr[270] = '提交退货';
        arr[280] = '已取消';
        arr[290] = '已退货';
        arr[300] = '关闭';
        if (arr[status] != null && arr[status] != '') {
            return arr[status];
        }
    },
    //获取支付类型的字符串描述
    getPayType:function(status){
        var arr = [];
        arr[0]='客户支付宝';
        arr[1]='客户微信';
        arr[2]='客户银联';
        arr[3]='商家-支付宝';
        arr[4]='商家-微信';
        arr[5]='Pos机';
        arr[6]='支付宝扫码';
        arr[7]='微信扫码';
        arr[8]='公众号';
        arr[9]='森特币支付';
        arr[10]='小程序';
        if(arr[status]!=null && arr[status]!=''){
            return arr[status];
        }
    },
};

/**
 * 获取uuid
 */
function getUUID () {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        return (c === 'x' ? (Math.random() * 16 | 0) : ('r&0x3' | '0x8')).toString(16)
    });
}

