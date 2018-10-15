import axios from 'axios'
import { Loading, Message } from 'element-ui'
import router from '../router'
import i18n from "../i18n"
import global_ from '../Global'

let base = process.env.API_ROOT;
axios.defaults.timeout = 60*1000; //响应时间
//axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'; //配置请求头
//axios.defaults.baseURL = process.env.API_ROOT;   //配置接口地址

function getUserToken() {
    let user = sessionStorage.getItem('user');
    let userToken = "";
    if (user) {
        user = JSON.parse(user);
        userToken = user.token || '';
    }
    return userToken;
}

axios.interceptors.request.use(
    config => {
        let userToken = getUserToken();
        config.headers['x-access-token'] = userToken;
        config.headers['x-access-type'] = 'web';
        return config;
    },
    err => {
        return Promise.reject(err)
    });


axios.interceptors.response.use((res) =>{
    //console.log(JSON.stringify(res));
    if(res.status !== 200){
        Message.error({
            message: i18n.t("message.errorRequest") + " : " + res.status
        });
        return Promise.reject(res);
    } else {
        processResponseData(res.data);
    }
    return res;

}, (error) => {
    //console.log(JSON.stringify(error));
    let hintStr = i18n.t("message.errorNetwork");
    if ((error) && (error.response) && (error.response.status)) {
        hintStr += ":" + error.response.status;
    }
    Message.error({
        message: hintStr
    });
    return Promise.reject(error);
});

export function getUploadImgUrl() {
    return process.env.API_ROOT + '/file/uploadImgNormal?token=' + getUserToken();
}

export function getUploadAvatarUrl() {
    return process.env.API_ROOT + '/file/uploadImgAvatar?token=' + getUserToken();
}

export function getUploadGoodsUrl() {
    return process.env.API_ROOT + '/file/uploadImgGoods?token=' + getUserToken();
}
//业务图片上传
export function getUploadBusinessUrl() {
    return process.env.API_ROOT + '/file/uploadImgBusiness?token=' + getUserToken();
}
//普通图片上传
export function uploadVideo() {
    return process.env.API_ROOT + '/file/uploadVideo?token=' + getUserToken();
}
//普通视频上传
export function getUploadOthersUrl() {
    return process.env.API_ROOT + '/file/uploadOthers?token=' + getUserToken();
}
//导出兑换码
export function exportRedeemCode(params) {
    return process.env.API_ROOT + '/redeemCode/export?token=' + getUserToken() + params;
}

//导出会员信息
export function exportMember(params) {
    return process.env.API_ROOT + '/member/export?token=' + getUserToken() + params;
}

//导出自营订单信息
export function exportSelfOrderTotal(params) {
    return process.env.API_ROOT + '/finance/exportSelfOrderTotal?token=' + getUserToken() + params;
}

//导出库存信息
export function exportStock(params) {
    return process.env.API_ROOT + '/stock/export?token=' + getUserToken() + params;
}

/**
 * 获取验证码地址
 */
export function getCaptchaUrl(uuid) {
    return process.env.API_ROOT + `/sys/captcha?uuid=` + uuid;
}


/**
 * 打开打印单
 */
export function getBillUrl(path) {
    window.open(process.env.API_ROOT + path + ((path ? "&" : "?")  + "token=" + getUserToken()),"_blank");
}

export function processResponseData(data) {
    if (data.code === global_.RESP_CODE.AUTHFAIL) { //授权失败
        sessionStorage.removeItem('user')
        router.replace({
            path: 'login',
            query: {redirect: router.currentRoute.fullPath}
        })
    } else if (data.code === global_.RESP_CODE.ERROR) { //错误

        Message.error(data.message);
    } else if (data.code === global_.RESP_CODE.VALIDFAIL) { //验证失败
        let vaildStr = "";
        if ((data.data) && (data.data.fieldErrors)) {
            let fieldErrors = data.data.fieldErrors;
            fieldErrors.forEach(function(value,index,array) {
                vaildStr +=  ' ' + value.message;
            });
        }
        Message.error(vaildStr);
    } else if (data.code === global_.RESP_CODE.UPDATEVER) { //版本过期
        Message.error(i18n.t("message.upateVer"));
    } else if (data.code === global_.RESP_CODE.NOTPOPEDOM) { //无权限
        Message.error("[" + data.data + "]" + i18n.t("message.notPopedom"));
    } else if (data.code === global_.RESP_CODE.NOT_DATA_POPEDOM) { //无数据权限
        Message.error("[" + data.data + "]" + i18n.t("message.notDataPopedom"));
    }
}

export function isUploadSuccess(data) {
    if (data.flag) {
        if (data.flag === 1) {
            return true;
        } else {
            let msgStr = "";
            switch(data.flag) {
                case 2: msgStr = i18n.t("fileUpload.errorVerifyCode"); break;
                case 3: msgStr = i18n.t("fileUpload.notStorageDir"); break;
                case 4: msgStr = i18n.t("fileUpload.uploadFieldNotExists"); break;
                case 5: msgStr = i18n.t("fileUpload.errorUploadType"); break;
                case 6: msgStr = i18n.t("fileUpload.errorFileType"); break;
                default: msgStr += i18n.t("fileUpload.uploadFailure") + data.flag;
            }

            Message.error({
                message: msgStr
            });
            return false;
        }
    } else {
        Message.error({
            message:  i18n.t("fileUpload.uploadError")
        });
        return false;
    }
}

//用户登录退出
export const requestLogin = params => { return axios.post(`${base}/sys/login`, params).then(res => res.data); };
export const requestLogout  = params => { return axios.post(`${base}/sys/logout`, params).then(res => res.data); };
//动态更新用户权限
export const dynamicUpdatePerms  = params => { return axios.post(`${base}/sys/dynamicUpdatePerms`, params).then(res => res.data); };

// -------用户管理-------
// -------用户列表-------
export const getUserList = params => { return axios.post(`${base}/user/list`,  params).then(res => res.data); };
export const removeUser = params => { return axios.post(`${base}/user/remove`, params ).then(res => res.data); };
export const batchRemoveUser = params => { return axios.post(`${base}/user/batchRemove`, params ).then(res => res.data); };
export const editUser = params => { return axios.post(`${base}/user/edit`, params ).then(res => res.data); };
export const addUser = params => { return axios.post(`${base}/user/add`,  params ).then(res => res.data); };
export const getRoleByUserId = params => { return axios.post(`${base}/user/getRoleByUserId`,  params ).then(res => res.data); };
export const getDataRoleByUserId = params => { return axios.post(`${base}/user/getDataRoleByUserId`,  params ).then(res => res.data); };
export const getOrgByUserId = params => { return axios.post(`${base}/user/getOrgByUserId`,  params ).then(res => res.data); };
export const editUserStatus = params => { return axios.post(`${base}/user/editStatus`,  params ).then(res => res.data); };
export const updatePwd = params => { return axios.post(`${base}/user/updatePwd`,  params).then(res => res.data); };
export const resetPassword = params => { return axios.post(`${base}/user/resetPwd`,  params).then(res => res.data); };
export const getRepertoryList = params => { return axios.get(`${base}/storeInfo/status`, {params: params}).then(res => res.data); };

// -------菜单管理-------
export const getMenuList = params => { return axios.post(`${base}/menu/list`,  params).then(res => res.data); };
export const getMenuNoButton = params => { return axios.post(`${base}/menu/getMenuNoButton`,  params).then(res => res.data); };
export const getMenuSelectList = params => { return axios.post(`${base}/menu/getMenuSelectList`,  params).then(res => res.data); };
export const getMenuListByDataFlag = params => { return axios.post(`${base}/menu/getMenuListByDataFlag`,  params).then(res => res.data); };
export const removeMenu = params => { return axios.post(`${base}/menu/remove`, params ).then(res => res.data); };
export const batchRemoveMenu = params => { return axios.get(`${base}/menu/batchRemove`, params ).then(res => res.data); };
export const editMenu = params => { return axios.post(`${base}/menu/edit`, params ).then(res => res.data); };
export const addMenu = params => { return axios.post(`${base}/menu/add`,  params ).then(res => res.data); };
export const editMenuStatus = params => { return axios.post(`${base}/menu/editStatus`,  params ).then(res => res.data); };
export const getMenuIdList = params => { return axios.post(`${base}/menu/getMenuIdList`,  params ).then(res => res.data); };
// -------角色管理-------
// -------功能角色管理-------
export const getRoleList = params => { return axios.post(`${base}/role/list`,  params).then(res => res.data); };
export const getRoleListByStatus = params => { return axios.post(`${base}/role/getRoleListByStatus`,  params).then(res => res.data); };
export const removeRole = params => { return axios.post(`${base}/role/remove`, params ).then(res => res.data); };
export const batchRemoveRole = params => { return axios.post(`${base}/role/batchRemove`, params ).then(res => res.data); };
export const editRole = params => { return axios.post(`${base}/role/edit`, params ).then(res => res.data); };
export const addRole = params => { return axios.post(`${base}/role/add`,  params ).then(res => res.data); };
export const getMenuByRoleId = params => { return axios.post(`${base}/role/getMenuByRoleId`,  params ).then(res => res.data); };
export const editRoleStatus = params => { return axios.post(`${base}/role/editStatus`,  params ).then(res => res.data); };

// -------数据角色管理-------
export const getDataRoleList = params => { return axios.post(`${base}/dataRole/list`,  params).then(res => res.data); };
export const getDataRoleListByStatus = params => { return axios.post(`${base}/dataRole/getDataRoleListByStatus`,  params).then(res => res.data); };
export const removeDataRole = params => { return axios.post(`${base}/dataRole/remove`, params ).then(res => res.data); };
export const batchRemoveDataRole = params => { return axios.post(`${base}/dataRole/batchRemove`, params ).then(res => res.data); };
export const editDataRole = params => { return axios.post(`${base}/dataRole/edit`, params ).then(res => res.data); };
export const addDataRole = params => { return axios.post(`${base}/dataRole/add`,  params ).then(res => res.data); };
export const editDataRoleStatus = params => { return axios.post(`${base}/dataRole/editStatus`,  params ).then(res => res.data); };
export const getBusinessTypeByDataRoleId = params => { return axios.post(`${base}/dataRole/getBusinessTypeByDataRoleId`,  params).then(res => res.data); };
//------- 组织
export const getOrgList = params => { return axios.post(`${base}/org/list`,  params).then(res => res.data); };
export const removeOrg = params => { return axios.post(`${base}/org/remove`, params ).then(res => res.data); };
export const editOrg = params => { return axios.post(`${base}/org/edit`, params ).then(res => res.data); };
export const addOrg = params => { return axios.post(`${base}/org/add`,  params ).then(res => res.data); };
export const editOrgStatus = params => { return axios.post(`${base}/org/editStatus`,  params ).then(res => res.data); };
export const getOrgListNoChildren = params => { return axios.post(`${base}/org/getOrgListNoChildren`,  params).then(res => res.data); };
export const getOrgListByType = params => { return axios.post(`${base}/org/getOrgListByType`,  params).then(res => res.data); };
//------  部门管理
export const getDeptList = params => { return axios.post(`${base}/dept/list`,  params).then(res => res.data); };
export const getDeptSelectList = params => { return axios.get(`${base}/dept/getDeptSelectList`,  params).then(res => res.data); };
export const removeDept = params => { return axios.post(`${base}/dept/remove`, params ).then(res => res.data); };
export const batchRemoveDept = params => { return axios.post(`${base}/dept/batchRemove`, params ).then(res => res.data); };
export const editDept = params => { return axios.post(`${base}/dept/edit`, params ).then(res => res.data); };
export const addDept = params => { return axios.post(`${base}/dept/add`,  params ).then(res => res.data); };

//商户端员工
export const getShopAccountList = params => { return axios.post(`${base}/shopAccount/list`, params).then(res => res.data); };
export const getAccountChaParameterList = params => { return axios.get(`${base}/shopAccount/listChaParameter`, { params: params }).then(res => res.data); };
export const getShopAccountDetail = params => { return axios.get(`${base}/shopAccount/detail`, { params: params }).then(res => res.data); };
export const shopAccountDelete = params => { return axios.get(`${base}/shopAccount/delete`, { params: params }).then(res => res.data); };
export const shopAccountEditStatus = params => { return axios.post(`${base}/shopAccount/changeStatus`, params).then(res => res.data); };
export const getCascaderTree = params => { return axios.get(`${base}/shopAccount/getCascaderTree`, { params: params }).then(res => res.data); };
export const shopAccountAdd = params => { return axios.post(`${base}/shopAccount/add`, params).then(res => res.data); };
export const shopAccountEdit = params => { return axios.post(`${base}/shopAccount/edit`, params).then(res => res.data); };
export const shopAccountEditView = params => { return axios.get(`${base}/shopAccount/editView`, { params: params }).then(res => res.data); };




//-------- 库存管理
export const getStockList = params => { return axios.post(`${base}/stock/list`,  params).then(res => res.data); };
export const getStockRetainList = params => { return axios.post(`${base}/stock/retain`,  params).then(res => res.data); };
export const getStockUnitPrice = params => { return axios.post(`${base}/stock/getUnitPrice`,  params).then(res => res.data); };
export const stockSearchGoods = params => { return axios.post(`${base}/stock/search`,  params).then(res => res.data); };
export const getAnalysis = params => { return axios.post(`${base}/stock/analysis`,  params).then(res => res.data); };
export const getAnalysisStatistics = params => { return axios.post(`${base}/stock/analysisStatistics`,  params).then(res => res.data); };

export const addTransferStock = params => { return axios.post(`${base}/transferStock/insert`,  params).then(res => res.data); };
export const storeList = params => { return axios.get(`${base}/storeInfo/status?status=1`,  params).then(res => res.data); };
export const getTransferList = params => { return axios.post(`${base}/transferStock/list`,  params).then(res => res.data); };
export const delTransfer = params => { return axios.post(`${base}/transferStock/delete`,  params).then(res => res.data); };
export const getTransfer = params => { return axios.get(`${base}/transferStock/query?id=`+params).then(res => res.data); };
export const saveTransfer = params => { return axios.post(`${base}/transferStock/save`,  params).then(res => res.data); };
export const commitTransfer = params => { return axios.post(`${base}/transferStock/commit`,  params).then(res => res.data); };
export const examineTransfer = params => { return axios.post(`${base}/transferStock/examine`,  params).then(res => res.data); };
export const rejectTransfer = params => { return axios.post(`${base}/transferStock/reject`,  params).then(res => res.data); };

//----------地区管理
export const getRegion = params => { return axios.post(`${base}/region/getListByUpperRegion`,  params).then(res => res.data); };
export const getListByLevel = params => { return axios.get(`${base}/region/getListByLevel`,  { params: params }).then(res => res.data); };
// 省市区 组件使用
export const getListCodeByRegionName = params => { return axios.post(`${base}/region/getListCodeByRegionName`,  params).then(res => res.data); };
export const regionTree = params => { return axios.post(`${base}/region/tree`,  params).then(res => res.data); };

//----------供应商管理----------
export const getSupplierList = params => { return axios.post(`${base}/supplier/list`,  params).then(res => res.data); };
export const addSupplier = params => { return axios.post(`${base}/supplier/insert`,  params ).then(res => res.data); };
export const editSupplier = params => { return axios.post(`${base}/supplier/update`,  params ).then(res => res.data); };
export const updateFlagOpenClose = params => { return axios.post(`${base}/supplier/updateFlagOpenClose`,  params ).then(res => res.data); };
export const updateFlagDel = params => { return axios.post(`${base}/supplier/updateFlagDel`,  params ).then(res => res.data); };


// -------订单管理-------

export const addOrder = params => { return axios.post(`${base}/orderSelf/insert`,  params).then(res => res.data); };
export const addOrderReclaim = params => { return axios.post(`${base}/orderRecycling/add`,  params).then(res => res.data); };
export const getOrderRecyclingList = params => { return axios.post(`${base}/orderRecycling/list`,  params).then(res => res.data); };
export const queryRecyclingById = params => { return axios.get(`${base}/orderRecycling/queryDetail`, { params: params }).then(res => res.data); };
export const orderRecyclingCountFun  = params => { return axios.get(`${base}/orderRecycling/count`,  { params: params } ).then(res => res.data); };
export const getOrderConsignmentReturnList = params => { return axios.post(`${base}/orderConsignmentReturn/list`,  params).then(res => res.data); };
export const orderConsignmentReturnCountFun  = params => { return axios.get(`${base}/orderConsignmentReturn/count`,  { params: params } ).then(res => res.data); };
export const queryConsignmentReturnById = params => { return axios.get(`${base}/orderConsignmentReturn/queryDetail`, { params: params }).then(res => res.data); };
export const updateConsignmentOrderStatus = params => { return axios.post(`${base}/orderConsignmentReturn/refuseReturn`, params ).then(res => res.data); };

export const addConsignmentOrder = params => { return axios.post(`${base}/orderConsignment/insert`,  params).then(res => res.data); };
export const getConsignmentOrderList = params => { return axios.post(`${base}/orderConsignment/list`,  params).then(res => res.data); };
export const getConsignmentOrderDetail = params => { return axios.post(`${base}/orderConsignment/detail`,  params).then(res => res.data); };
export const getConsignmentOrderCount = params => { return axios.get(`${base}/orderConsignment/count`,  params).then(res => res.data); };
export const getConsignmentOrderstatusFinish = params => { return axios.post(`${base}/orderConsignment/statusFinish`,  params).then(res => res.data); };
export const getConsignmentOrderReturn = params => { return axios.post(`${base}/orderConsignment/returnOrder`,  params).then(res => res.data); };
//同意退货
export const consignmentOrderupdateStatus = params => { return axios.post(`${base}/orderConsignmentReturn/agreeReturn`,  params).then(res => res.data); };

//--------会员管理-------
export const modifyActivity = params => { return axios.post(`${base}/member/registerActivity/modify`,params).then(res => res.data); };
export const queryActivities = params => { return axios.get(`${base}/member/registerActivity/queryAll`,params).then(res => res.data); };
export const queryMemberInfos = params => { return axios.post(`${base}/member/list`,params).then(res => res.data); };
export const modifySinterCurrency = params => { return axios.post(`${base}/member/modifyCurrency`,params).then(res => res.data); };
export const modifyMemberInfo = params => { return axios.post(`${base}/member/modify`,params).then(res => res.data); };
export const queryMemberAddresses = params => { return axios.post(`${base}/member/addressList`,params).then(res => res.data); };
export const modifyMemberAddressInfo = params => { return axios.post(`${base}/member/modifyAddress`,params).then(res => res.data); };
export const getIntegralAndSinter = params => { return axios.post(`${base}/member/getIntegralAndSinter`,params).then(res => res.data); };


export const getMemberSinterCount = params => { return axios.post(`${base}/member/getMemberSinterCount`,params).then(res => res.data); };
export const getMemberSinterInfo = params => { return axios.post(`${base}/member/getMemberSinterInfo`,params).then(res => res.data); };
export const getMemberSinterExpend = params => { return axios.post(`${base}/member/getMemberSinterExpend`,params).then(res => res.data); };
export const refundUpdateCurrency = params => { return axios.post(`${base}/member/refundUpdateCurrency`,params).then(res => res.data); };


//--------仓储管理-------
export const getStoreImportConfirmList = params => { return axios.post(`${base}/storeImportConfirm/list`,  params).then(res => res.data); };
export const identify = params => { return axios.post(`${base}/storeImportConfirm/identify`,  params).then(res => res.data); };
export const getCount = params => { return axios.post(`${base}/storeImportConfirm/getCount`,  params).then(res => res.data); };
export const cancelAppraisal = params => { return axios.post(`${base}/storeImportConfirm/cancelAppraisal`,  params).then(res => res.data); };
export const confirmImportStore = params => { return axios.post(`${base}/storeImportConfirm/confirmImportStore`,  params).then(res => res.data); };
export const toStoreImportIdentifyDetailList = params => { return axios.post(`${base}/storeImportIdentifyDetail/toList`,  params).then(res => res.data); };
export const getStoreImportIdentifyDetailList = params => { return axios.post(`${base}/storeImportIdentifyDetail/list`,  params).then(res => res.data); };
export const getStoreImportIdentifyDetailAllList = params => { return axios.post(`${base}/storeImportIdentifyDetail/getAllList`,  params).then(res => res.data); };
export const getDetailBaseData = params => { return axios.post(`${base}/storeImportIdentifyDetail/getDetailBaseData`,  params).then(res => res.data); };
export const getInventoryBarcodeList = params => { return axios.post(`${base}/storeInventoryBarcode/list`,  params).then(res => res.data); };

export const queryStoreExportMains = params => { return axios.post(`${base}/storeExportMain/list`,params).then(res => res.data); };
export const identifyOver = params => { return axios.post(`${base}/storeImportIdentifyDetail/identifyOver`,  params).then(res => res.data); };
export const queryOneExportMainByExpNo = params => { return axios.get(`${base}/storeExportMain/one`,{ params: params }).then(res => res.data); };
export const queryExportDetailsByExpNo = (expNo, params) => { return axios.post(`${base}/storeExportDetail/list?expNo=`+expNo,params).then(res => res.data); };
export const printStoreExportOrder = expNo => { return axios.post(`${base}/storeExportOrder/print?expNo=`+expNo).then(res => res.data); };
export const recheckStoreExportDetail = params => { return axios.post(`${base}/storeExportDetail/recheck`,params).then(res => res.data); };
export const shippedStoreExportOrder = params => { return axios.post(`${base}/storeExportOrder/shipped`,params).then(res => res.data); };
export const closeStoreExportOrder = expNo => { return axios.post(`${base}/storeExportOrder/close?expNo=`+expNo).then(res => res.data); };
export const countEachOrderStatus = () => { return axios.get(`${base}/exportOrderStatus/count`).then(res => res.data); };
export const getStoreList = params => { return axios.post(`${base}/storeInfo/storeList`,params).then(res => res.data); };
export const addStore = params => { return axios.post(`${base}/storeInfo/insert`,params).then(res => res.data); };
export const editStore = params => { return axios.post(`${base}/storeInfo/update`,params).then(res => res.data); };
export const updateState = params => { return axios.post(`${base}/storeInfo/updateState`,params).then(res => res.data); };
export const flagDelete = params => { return axios.post(`${base}/storeInfo/flagDel`,params).then(res => res.data); };
export const queryArea = params => { return axios.get(`${base}/sysDict/queryByCode`,{ params: params }).then(res => res.data); };
export const getStoreGoodsList = params => { return axios.post(`${base}/storeGoods/list`,params).then(res => res.data); };
export const queryBarCodesByStoreAndSkuCode = params => { return axios.post(`${base}/storeGoods/barCodes`,params).then(res => res.data); };
export const queryStoreImportMains = params => { return axios.post(`${base}/storeImport/mainList`,params).then(res => res.data); };
export const countEachImOrderStatus = params => { return axios.get(`${base}/storeImport/count`,params).then(res => res.data); };
export const queryImportDetailsByImportNo = params => { return axios.get(`${base}/storeImport/detList`,{ params: params }).then(res => res.data); };
export const signImportOrder = params => { return axios.get(`${base}/storeImport/update`,{ params: params }).then(res => res.data); };
export const closeImportOrder = params => { return axios.get(`${base}/storeImport/close`,{ params: params }).then(res => res.data); };
export const cancelImportOrder = params => { return axios.get(`${base}/storeImport/cancle`,{ params: params }).then(res => res.data); };
//获取商品品质
export const qualityList = params => { return axios.post(`${base}/goods/quality/list`,params).then(res => res.data); };
//获取损坏部位
export const damageListByClassId = params => { return axios.post(`${base}/goods/damage/listByClassId`,params).then(res => res.data); };

//--------门店管理-------
export const getShopList = params => { return axios.post(`${base}/shopInfo/list`,  params).then(res => res.data); };
export const getAvailableStores = params => { return axios.get(`${base}/storeInfo/status`, {params: params}).then(res => res.data); };
export const getAllStores = params => { return axios.post(`${base}/storeInfo/stores`,params).then(res => res.data); };
export const getAvailableServices = params => { return axios.post(`${base}/serviceInfo/onServiceList`, params).then(res => res.data); };
export const getAllServices = params => { return axios.post(`${base}/serviceInfo/services`, params).then(res => res.data); };
export const addShopInfo = params => { return axios.post(`${base}/shopInfo/add`,  params).then(res => res.data); };
export const editShopInfo = params => { return axios.post(`${base}/shopInfo/edit`,  params).then(res => res.data); };
export const removeShopInfo = params => { return axios.post(`${base}/shopInfo/remove`,  params).then(res => res.data); };
export const updateShopStatus = params => { return axios.post(`${base}/shopInfo/updateStatus`,  params).then(res => res.data); };
export const getServiceList = params => { return axios.post(`${base}/serviceInfo/list`, params).then(res => res.data); };
export const updateServiceState = params => { return axios.post(`${base}/serviceInfo/updateStatus`, params).then(res => res.data); };
export const deleteService = params => { return axios.post(`${base}/serviceInfo/remove`, params).then(res => res.data); };
export const addService = params => { return axios.post(`${base}/serviceInfo/add`, params).then(res => res.data); };
export const editService = params => { return axios.post(`${base}/serviceInfo/edit`, params).then(res => res.data); };

//--------态奢门店列表-------
export const getLuxuryShopList = params => { return axios.post(`${base}/luxuryShop/list`,  params).then(res => res.data); };
export const addLuxuryShopInfo = params => { return axios.post(`${base}/luxuryShop/add`,  params).then(res => res.data); };
export const editLuxuryShopInfo = params => { return axios.post(`${base}/luxuryShop/edit`,  params).then(res => res.data); };

//--------遇界门店列表-------
export const getMeetWorldShopList = params => { return axios.post(`${base}/meetWorldShop/list`,  params).then(res => res.data); };
export const addMeetWorldShopInfo = params => { return axios.post(`${base}/meetWorldShop/add`,  params).then(res => res.data); };
export const editMeetWorldShopInfo = params => { return axios.post(`${base}/meetWorldShop/edit`,  params).then(res => res.data); };
export const removeMeetWorldShop = params => { return axios.post(`${base}/meetWorldShop/remove`,  params).then(res => res.data); };
export const updateMeetWorldShop = params => { return axios.post(`${base}/meetWorldShop/updateStatus`,  params).then(res => res.data); };
//--------门店管理----end---

//获取当前登入用户仓库列表
export const getUserStoreList = params => { return axios.post(`${base}/user/getStoreInfoById`,  params).then(res => res.data); };

//--------运营管理-------
export const getBannerList = params => { return axios.post(`${base}/bannerInfo/list`, params).then(res => res.data); };
export const updateBannerState = params => { return axios.post(`${base}/bannerInfo/updateStatus`, params).then(res => res.data); };
export const deleteBanner = params => { return axios.post(`${base}/bannerInfo/remove`, params).then(res => res.data); };
export const addBanner = params => { return axios.post(`${base}/bannerInfo/add`, params).then(res => res.data); };
export const editBanner = params => { return axios.post(`${base}/bannerInfo/edit`, params).then(res => res.data); };
//兑换码管理
export const getExchangeCodeFun = params => { return axios.post(`${base}/redeemCode/exchangeCode`,   params ).then(res => res.data); };
/*获取门店列表*/
export const getShop = params => { return axios.post(`${base}/servicePoint/listNoPage`,params ).then(res => res.data); };
//营销活动
export const getMarketingList = params => { return axios.post(`${base}/marketingInfo/list`,  params).then(res => res.data); };
export const getMarketingOne = params => { return axios.get(`${base}/marketingInfo/query`,  { params: params }).then(res => res.data); };
export const addMarketing = params => { return axios.post(`${base}/marketingInfo/insert`,  params ).then(res => res.data); };
export const updateMarketing = params => { return axios.post(`${base}/marketingInfo/update`, params ).then(res => res.data); };
export const deleteMarketing = params => { return axios.post(`${base}/marketingInfo/delete`, params ).then(res => res.data); };
export const enableMarketing = params => { return axios.post(`${base}/marketingInfo/editStatus`,  params ).then(res => res.data); };
//获取营销活动商品
export const getMarketingGoodsList = params => { return axios.post(`${base}/marketingProduct/list`,  params).then(res => res.data); };
export const getGoodsList = params => { return axios.post(`${base}/productSku/searchSkuList`,  params).then(res => res.data); };
export const addMarketingGoods = params => { return axios.get(`${base}/marketingProduct/insert`,  { params: params }).then(res => res.data); };
export const deleteMarketingGoods = params => { return axios.post(`${base}/marketingProduct/delete`, params ).then(res => res.data); };
//横幅管理
export const getIndexBannerList = params => { return axios.post(`${base}/bannerInfo/list`,  params).then(res => res.data); };
export const getIndexBannerOne = params => { return axios.get(`${base}/bannerInfo/query`,  { params: params }).then(res => res.data); };
export const addIndexBanner = params => { return axios.post(`${base}/bannerInfo/insert`,  params ).then(res => res.data); };
export const updateIndexBanner = params => { return axios.post(`${base}/bannerInfo/update`, params ).then(res => res.data); };
export const deleteIndexBanner = params => { return axios.post(`${base}/bannerInfo/delete`, params ).then(res => res.data); };
export const enableIndexBanner = params => { return axios.post(`${base}/bannerInfo/editStatus`,  params ).then(res => res.data); };
//热门品牌
export const getHotBrandList = params => { return axios.post(`${base}/hotBrand/list`,  params).then(res => res.data); };
export const getHotBrandOne = params => { return axios.get(`${base}/hotBrand/query`,  { params: params }).then(res => res.data); };
export const addHotBrand = params => { return axios.post(`${base}/hotBrand/insert`,  params ).then(res => res.data); };
export const updateHotBrand = params => { return axios.post(`${base}/hotBrand/update`, params ).then(res => res.data); };
export const deleteHotBrand = params => { return axios.post(`${base}/hotBrand/delete`, params ).then(res => res.data); };
export const enableHotBrand = params => { return axios.post(`${base}/hotBrand/editStatus`,  params ).then(res => res.data); };

//城市管理
export const getCityList = params => { return axios.post(`${base}/city/list`, params).then(res => res.data); };
export const addCity = params => { return axios.post(`${base}/city/add`, params).then(res => res.data); };
export const editCity = params => { return axios.post(`${base}/city/edit`, params).then(res => res.data); };
export const updateStatus = params => { return axios.post(`${base}/city/updateStatus`, params).then(res => res.data); };
//取件方式活动管理
export const getPickupDiscountListFun = params => { return axios.post(`${base}/pickupDiscount/list`,  params ).then(res => res.data); };
export const getAllCityFun = params => { return axios.post(`${base}/pickupDiscount/getAllCity`,  params ).then(res => res.data); };
export const addOrUpdatePickupDiscountFun = params => { return axios.post(`${base}/pickupDiscount/addOrUpdate`,  params ).then(res => res.data); };
export const getPickupDiscountById = params => { return axios.get(`${base}/pickupDiscount/getById`,  { params: params } ).then(res => res.data); };
export const enablePickupDiscountFun = params => { return axios.get(`${base}/pickupDiscount/enable`,  { params: params } ).then(res => res.data); };
//------------自营订单----------------
export const orderSelfListFun  = params => { return axios.post(`${base}/orderSelf/list`,  params ).then(res => res.data); };
export const orderSelfCountFun  = params => { return axios.get(`${base}/orderSelf/count`,  { params: params } ).then(res => res.data); };
export const orderSelfDetailFun  = params => { return axios.get(`${base}/orderSelf/queryDetailById`,  { params: params } ).then(res => res.data); };
export const orderSelfQueryConsigneeFun  = params => { return axios.get(`${base}/orderSelf/queryConsigneeInfo`,  { params: params } ).then(res => res.data); };
export const orderSelfUpdateConsigneeFun  = params => { return axios.post(`${base}/orderSelf/updateConsigneeInfo`,   params  ).then(res => res.data); };
export const orderSelfQueryInvoiceFun  = params => { return axios.get(`${base}/orderInvoice/queryByOrderId`,  { params: params } ).then(res => res.data); };
export const orderSelfUpdateInvoiceFun  = params => { return axios.post(`${base}/orderInvoice/update`,  params  ).then(res => res.data); };
export const orderReturnsInsertFun  = params => { return axios.post(`${base}/orderReturns/insert`,  params  ).then(res => res.data); };
export const ensureDeliveryFun  = params => { return axios.post(`${base}/orderSelf/ensureDelivery`,   params  ).then(res => res.data); };
export const orderReturnList  = params => { return axios.post(`${base}/orderReturns/list`,  params ).then(res => res.data); };
export const orderReturnCount  = params => { return axios.get(`${base}/orderReturns/count`,  { params: params } ).then(res => res.data); };
export const searchOrderReturnDetail = params => { return axios.get(`${base}/orderReturns/queryWaitOrder`,  { params: params } ).then(res => res.data); };
export const agreeOrderReturn  = params => { return axios.post(`${base}/orderReturns/agreeOrderReturn`,  params ).then(res => res.data); };
export const refuseOrderReturn  = params => { return axios.post(`${base}/orderReturns/refuseOrderReturn`,  params ).then(res => res.data); };
export const searchOrderReturnDeal = params => { return axios.get(`${base}/orderReturns/queryDealOrder`,  { params: params } ).then(res => res.data); };
export const confirmOrderReturn  = params => { return axios.post(`${base}/orderReturns/confirmOrderReturn`,  params ).then(res => res.data); };
export const searchOrderReturnComplete = params => { return axios.get(`${base}/orderReturns/queryCompleteOrder`,  { params: params } ).then(res => res.data); };
export const queryOrderFun = params => { return axios.get(`${base}/orderSelf/queryOrderById`,  { params: params } ).then(res => res.data); };
export const updateOrderFun  = params => { return axios.post(`${base}/orderSelf/updateOrderById`,  params  ).then(res => res.data); };

export const queryProductImgFun = params => { return axios.post(`${base}/orderSelf/queryOrderProductImg`, params ).then(res => res.data); };

// -------采购管理-------
export const getStoreInfoList = params => { return axios.post(`${base}/storeInfo/onStoreList`,  params).then(res => res.data); };
export const addPurchaseOrder = params => { return axios.post(`${base}/purchaseOrder/insert`,  params).then(res => res.data); };
export const getpurchaseOrderList = params => { return axios.post(`${base}/purchaseOrder/list`,  params).then(res => res.data); };


//------------商品管理----------------
//1. 获取商品品牌列表
export const getProductBrandList = params => { return axios.post(`${base}/goods/brand/list`,  params).then(res => res.data); };
//2. 商品品质列表
export const getProductQualityList = params => { return axios.post(`${base}/goods/quality/list`,  params).then(res => res.data); };
//3. 商品分类列表
export const getProductClassList = params => { return axios.post(`${base}/goods/class/tree`,  params).then(res => res.data); };
// 商品分类---根据id查询指定商品分类数据
export const getProductClass = params => { return axios.post(`${base}/productClass/query`,  params).then(res => res.data); };
//获取商品sku列表(商品搜索)
export const getSkuList = params => { return axios.post(`${base}/goods/sku/list`,  params).then(res => res.data); };
//获取商品wiki列表
export const getWikiList = params => { return axios.post(`${base}/goods/wiki/list`,  params).then(res => res.data); };


export const productSpuListFun  = params => { return axios.post(`${base}/productSpu/list`,  params ).then(res => res.data); };
export const productSpuPrepareFun  = params => { return axios.post(`${base}/productSpu/prepare`,  params ).then(res => res.data); };
export const productSpuListAttrsByClassIdFun  = params => { return axios.post(`${base}/productSpu/listAttrsByClassId`,  params ).then(res => res.data); };
export const productSpuDetailFun  = params => { return axios.post(`${base}/productSpu/detail`,  params ).then(res => res.data); };
export const productSpuDetailEditFun  = params => { return axios.post(`${base}/productSpu/prepareEdit`,  params ).then(res => res.data); };
export const productSpuInsertFun  = params => { return axios.post(`${base}/productSpu/insert`,  params ).then(res => res.data); };
export const productSpuUpdateFun  = params => { return axios.post(`${base}/productSpu/update`,  params ).then(res => res.data); };
export const productSpuAuditFun  = params => { return axios.post(`${base}/productSpu/listAuditBySkuId`,  params ).then(res => res.data); };
export const productSpuAuditSkuIdFun  = params => { return axios.post(`${base}/productSpu/auditSkuId`,  params ).then(res => res.data); };
export const productSpuDeleteBySkuIdFun  = params => { return axios.post(`${base}/productSpu/deleteBySkuId`,  params ).then(res => res.data); };
export const productSpuDeleteBySpuIdFun  = params => { return axios.post(`${base}/productSpu/deleteBySpuId`,  params ).then(res => res.data); };

export const productSkuChangeSaleFun  = params => { return axios.post(`${base}/productSku/changeSaleStatus`,  params ).then(res => res.data); };
export const productSkuCountFun  = params => { return axios.post(`${base}/productSku/queryCount`,  params ).then(res => res.data); };
export const productSkuListFun  = params => { return axios.post(`${base}/productSku/list`,  params ).then(res => res.data); };
export const productSkuDetailEditFun  = params => { return axios.post(`${base}/productSku/prepareEdit`,  params ).then(res => res.data); };
export const productSkuUpdateFun  = params => { return axios.post(`${base}/productSku/update`,  params ).then(res => res.data); };

export const PriductCityPriceList  = params => { return axios.post(`${base}/productServicePrice/list`,  params ).then(res => res.data); };
export const PriductCityPriceUpdate  = params => { return axios.post(`${base}/productServicePrice/update`,  params ).then(res => res.data); };
export const PriductCityPriceInsert  = params => { return axios.post(`${base}/productServicePrice/insert`,  params ).then(res => res.data); };
export const PriductCityPriceClear  = params => { return axios.post(`${base}/productServicePrice/clearPrice`,  params ).then(res => res.data); };


export const productAttrRelListFun  = params => { return axios.post(`${base}/productAttrRel/list`,  params ).then(res => res.data); };
export const productAttrRelInsertFun  = params => {return axios.post(`${base}/productAttrRel/insert`,  params ).then(res => res.data);};
export const productAttrRelDeleteFun  = params => {return axios.post(`${base}/productAttrRel/delete`,  params ).then(res => res.data);};
export const productAttrRelByIdFun  = params => {return axios.post(`${base}/productAttrRel/queryById`,  params ).then(res => res.data);};
export const productAttrRelUpdateFun  = params => {return axios.post(`${base}/productAttrRel/update`,  params ).then(res => res.data);};

export const productClassTreeFun  = params => { return axios.post(`${base}/productClass/getTree`,  params ).then(res => res.data); };
export const productClassTreeByBusinessFun  = params => { return axios.post(`${base}/productClass/getTreeByBusiness`,  params ).then(res => res.data); };
export const productClassListFun  = params => { return axios.post(`${base}/productClass/list`,  params ).then(res => res.data); };
export const productClassInsertFun  = params => { return axios.post(`${base}/productClass/insert`,  params ).then(res => res.data); };
export const productClassUpdateFun  = params => { return axios.post(`${base}/productClass/update`,  params ).then(res => res.data); };
export const productClassGetFun  = params => { return axios.post(`${base}/productClass/query`,  params ).then(res => res.data); };
export const productClassDeleteFun  = params => { return axios.post(`${base}/productClass/delete`,  params ).then(res => res.data); };
export const productClassBindAttrFun  = params => { return axios.post(`${base}/productClass/bindClassAndAttr`,  params ).then(res => res.data); };
export const productClassPrepareBindAttrFun  = params => { return axios.post(`${base}/productClass/prepareBindClassAndAttr`,  params ).then(res => res.data); };
export const productClassPrepareBindBrandFun  = params => { return axios.post(`${base}/productClass/prepareBindClassAndBrand`,  params ).then(res => res.data); };
export const productClassBindBrandFun  = params => { return axios.post(`${base}/productClass/bindClassAndBrand`,  params ).then(res => res.data); };

export const productAccessoriesListFun  = params => {return axios.post(`${base}/productAccessories/list`,  params ).then(res => res.data);};
export const productAccessoriesDeleteFun  = params => {return axios.post(`${base}/productAccessories/delete`,  params ).then(res => res.data);};
export const productAccessoriesByIdFun  = params => {return axios.post(`${base}/productAccessories/queryByClass`,  params ).then(res => res.data);};
export const productAccessoriesInsertFun  = params => {return axios.post(`${base}/productAccessories/insert`,  params ).then(res => res.data);};
export const productAccessoriesUpdateFun  = params => {return axios.post(`${base}/productAccessories/update`,  params ).then(res => res.data);};

export const productDamageListFun  = params => {return axios.post(`${base}/productDamage/list`,  params ).then(res => res.data);};
export const productDamageDeleteFun  = params => {return axios.post(`${base}/productDamage/delete`,  params ).then(res => res.data);};
export const productDamageByIdFun  = params => {return axios.post(`${base}/productDamage/queryByClass`,  params ).then(res => res.data);};
export const productDamageInsertFun  = params => {return axios.post(`${base}/productDamage/insert`,  params ).then(res => res.data);};
export const productDamageUpdateFun  = params => {return axios.post(`${base}/productDamage/update`,  params ).then(res => res.data);};


export const productQualityListFun  = params => {return axios.post(`${base}/productQuality/list`,  params ).then(res => res.data);};
export const productQualityDeleteFun  = params => {return axios.post(`${base}/productQuality/delete`,  params ).then(res => res.data);};
export const productQualityAddFun  = params => {return axios.post(`${base}/productQuality/insert`,  params ).then(res => res.data);};
export const productQualityByIdFun  = params => {return axios.post(`${base}/productQuality/query`,  params ).then(res => res.data);};
export const productQualityUpdateFun  = params => {return axios.post(`${base}/productQuality/update`,  params ).then(res => res.data);};

export const productProtectionListFun  = params => {return axios.post(`${base}/productProtection/list`,  params ).then(res => res.data);};
export const productProtectionDeleteFun  = params => {return axios.post(`${base}/productProtection/delete`,  params ).then(res => res.data);};
export const productProtectionAddFun  = params => {return axios.post(`${base}/productProtection/insert`,  params ).then(res => res.data);};
export const productProtectionByIdFun  = params => {return axios.post(`${base}/productProtection/query`,  params ).then(res => res.data);};
export const productProtectionUpdateFun  = params => {return axios.post(`${base}/productProtection/update`,  params ).then(res => res.data);};

export const productBrandListFun  = params => {return axios.post(`${base}/productBrand/list`,  params ).then(res => res.data);};
export const productBrandDeleteFun  = params => {return axios.post(`${base}/productBrand/delete`,  params ).then(res => res.data);};
export const productBrandAddFun  = params => {return axios.post(`${base}/productBrand/insert`,  params ).then(res => res.data);};
export const productBrandByIdFun  = params => {return axios.post(`${base}/productBrand/query`,  params ).then(res => res.data);};
export const productBrandUpdateFun  = params => {return axios.post(`${base}/productBrand/update`,  params ).then(res => res.data);};
export const productBrandListByBusinessFun  = params => { return axios.post(`${base}/productBrand/listByBusiness`,  params ).then(res => res.data); };
export const productBrandListByBusinessIdFun  = params => { return axios.post(`${base}/productBrand/listByBusinessId`,  params ).then(res => res.data); };

// -------物流管理-------
// -------物流跟踪-------
export const getLogisticsTrackList = params => { return axios.post(`${base}/logisticsTrack/list`,  params).then(res => res.data); };
export const getLogisticsTrackDetail = params => { return axios.get(`${base}/logisticsTrack/query`,  { params: params } ).then(res => res.data); };

// -------物流运费-------
export const getLogisticsFreightList = params => { return axios.post(`${base}/logisticsFreight/list`,  params).then(res => res.data); };
export const removeLogisticsFreight = params => { return axios.post(`${base}/logisticsFreight/delete`, params ).then(res => res.data); };
export const batchRemoveLogisticsFreight = params => { return axios.post(`${base}/logisticsFreight/batchRemove`, params ).then(res => res.data); };
export const editLogisticsFreight = params => { return axios.post(`${base}/logisticsFreight/update`, params ).then(res => res.data); };
export const addLogisticsFreight = params => { return axios.post(`${base}/logisticsFreight/insert`,  params ).then(res => res.data); };
export const editLogisticsFreightEnable = params => { return axios.post(`${base}/logisticsFreight/editStatus`,  params ).then(res => res.data); };

// -------产品保价-------
export const getPremiumList = params => { return axios.post(`${base}/premium/list`,  params).then(res => res.data); };
export const removePremium = params => { return axios.post(`${base}/premium/delete`, params ).then(res => res.data); };
export const batchRemovePremium = params => { return axios.post(`${base}/premium/batchRemove`, params ).then(res => res.data); };
export const editPremium = params => { return axios.post(`${base}/premium/update`, params ).then(res => res.data); };
export const addPremium = params => { return axios.post(`${base}/premium/insert`,  params ).then(res => res.data); };
export const editPremiumEnable = params => { return axios.post(`${base}/premium/editStatus`,  params ).then(res => res.data); };

// -------物流公司-------
export const getLogisticsCompanyList = params => { return axios.post(`${base}/logisticsCompany/list`,  params).then(res => res.data); };
export const getAllLogisticsCompanyList = params => { return axios.post(`${base}/logisticsCompany/queryList`,  params).then(res => res.data); };
export const removeLogisticsCompany = params => { return axios.post(`${base}/logisticsCompany/delete`, params ).then(res => res.data); };
export const batchRemoveLogisticsCompany = params => { return axios.post(`${base}/logisticsCompany/batchRemove`, params ).then(res => res.data); };
export const editLogisticsCompany = params => { return axios.post(`${base}/logisticsCompany/update`, params ).then(res => res.data); };
export const addLogisticsCompany = params => { return axios.post(`${base}/logisticsCompany/insert`,  params ).then(res => res.data); };
export const editLogisticsCompanyEnable = params => { return axios.post(`${base}/logisticsCompany/editStatus`,  params ).then(res => res.data); };

// -------业务类型-------
export const getBusinessTypeList = params => { return axios.post(`${base}/businessType/list`,  params).then(res => res.data); };
export const getAllBusinessTypeList = params => { return axios.post(`${base}/businessType/queryList`,  params).then(res => res.data); };
export const removeBusinessType = params => { return axios.post(`${base}/businessType/delete`, params ).then(res => res.data); };
export const batchRemoveBusinessType = params => { return axios.post(`${base}/businessType/batchRemove`, params ).then(res => res.data); };
export const editBusinessType = params => { return axios.post(`${base}/businessType/update`, params ).then(res => res.data); };
export const addBusinessType = params => { return axios.post(`${base}/businessType/insert`,  params ).then(res => res.data); };
export const editBusinessTypeEnable = params => { return axios.post(`${base}/businessType/editStatus`,  params ).then(res => res.data); };

// -------采购管理-------
export const getStoreInfoById = params => { return axios.get(`${base}/storeInfo/query`, { params: params } ).then(res => res.data); };
export const getOrderInfoById = params => { return axios.get(`${base}/purchaseOrder/query`, { params: params } ).then(res => res.data); };
export const getSelectGoodsList = params => { return axios.post(`${base}/purchaseOrder/skuList`,  params).then(res => res.data); };
export const deleteOrderData = params => { return axios.post(`${base}/purchaseOrder/delete`,  params).then(res => res.data); };
export const getQualityList = params => { return axios.post(`${base}/purchaseOrder/qualityList`,  params).then(res => res.data); };
export const deleteOrderGoodsData = params => { return axios.post(`${base}/purchaseGoodsDetail/remove`,  params).then(res => res.data); };
export const submitConfirmPurchaseOrder = params => { return axios.post(`${base}/purchaseOrder/submitConfirm`,  params).then(res => res.data); };
export const getPurchaseSupplierList = params => { return axios.post(`${base}/supplier/getSupplierForPurchase`,  params).then(res => res.data); };
export const purchaseOrderCountFun = params => { return axios.post(`${base}/purchaseOrder/count`,  params).then(res => res.data); };
export const overruleFun = params => { return axios.post(`${base}/purchaseOrder/overrule`,  params).then(res => res.data); };
export const saveSupplierInfoFun = params => { return axios.post(`${base}/purchaseOrder/saveSupplierInfo`,  params).then(res => res.data); };
export const checkPurchaseOrder = params => { return axios.post(`${base}/purchaseOrder/check`,  params).then(res => res.data); };
export const orderReturnFun = params => { return axios.post(`${base}/purchaseOrder/retreat`,  params).then(res => res.data); };
export const purchaseReturnOrderListFun = params => { return axios.post(`${base}/purchaseReturn/list`,  params).then(res => res.data); };
export const purchaseReturnOrderCountFun = params => { return axios.post(`${base}/purchaseReturn/count`,  params).then(res => res.data); };
export const saveConfirmPurchaseOrder = params => { return axios.post(`${base}/purchaseOrder/saveConfirm`,  params).then(res => res.data); };
// -------申请管理-------
//1. 申请列表
export const getConsignmentApplyList = params => { return axios.post(`${base}/apply/list`,  params).then(res => res.data); };
export const getRecyclingApplyList = params => { return axios.post(`${base}/applyRecycling/list`,  params).then(res => res.data); };
export const getAppraisalApplyList = params => { return axios.post(`${base}/applyAppraisal/list`,  params).then(res => res.data); };
export const getLeaseApplyList = params => { return axios.post(`${base}/applyLease/list`,  params).then(res => res.data); };
export const getPledgeApplyList = params => { return axios.post(`${base}/applyPledge/list`,  params).then(res => res.data); };
export const getSubstitutionApplyList = params => { return axios.post(`${base}/applySubstitution/list`,  params).then(res => res.data); };

// -------特惠活动-------
export const getSpecialList = params => { return axios.post(`${base}/special/list`,  params).then(res => res.data); };
export const removeSpecial = params => { return axios.post(`${base}/special/delete`, params ).then(res => res.data); };
export const editSpecial = params => { return axios.post(`${base}/special/update`, params ).then(res => res.data); };
export const addSpecial = params => { return axios.post(`${base}/special/insert`,  params ).then(res => res.data); };
export const editSpecialEnable = params => { return axios.post(`${base}/special/editStatus`,  params ).then(res => res.data); };
//1. 申请详情
export const getRecyclingInfoById = params => { return axios.post(`${base}/apply/query`,  params ).then(res => res.data); };
export const passOrRefuseSubmitFun = params => { return axios.post(`${base}/apply/check`,  params ).then(res => res.data); };
export const confirmSubmitFun = params => { return axios.post(`${base}/apply/affirmGuestItem`,  params ).then(res => res.data); };
export const closeSubmitFun = params => { return axios.post(`${base}/apply/close`,  params ).then(res => res.data); };
export const appraisalPassSubmitFun = params => { return axios.post(`${base}/apply/authenticate`,  params ).then(res => res.data); };
export const modifySubmitFun = params => { return axios.post(`${base}/apply/updateRecyclingPrice`,  params ).then(res => res.data); };
export const returnSubmitFun = params => { return axios.post(`${base}/apply/returnGoods`,  params ).then(res => res.data); };
export const makeMoneySubmitFun = params => { return axios.post(`${base}/apply/remittance`,  params ).then(res => res.data); };
export const alreadyConsignment = params => { return axios.post(`${base}/apply/alreadyConsignment`,  params ).then(res => res.data); };
export const confirmCusGetFun = params => { return axios.post(`${base}/apply/confirmCusGet`,  params ).then(res => res.data); };
export const modifyCommissionFun = params => { return axios.post(`${base}/apply/modifyCommission`,  params ).then(res => res.data); };
export const saveAppMoneyFun = params => { return axios.post(`${base}/apply/saveAppMoney`,  params ).then(res => res.data); };
export const confirmReturnFun = params => { return axios.post(`${base}/apply/confirmReturn`,  params ).then(res => res.data); };
export const saveAppFireFun = params => { return axios.post(`${base}/apply/saveAppFire`,  params ).then(res => res.data); };
export const getSelectSKUList = params => { return axios.post(`${base}/apply/skuList`,  params ).then(res => res.data); };
export const saveSubstitutionPriceIntervalFun = params => { return axios.post(`${base}/apply/saveSubstitutionPriceInterval`,  params ).then(res => res.data); };
export const saveSkuIdFun = params => { return axios.post(`${base}/apply/saveSkuId`,  params ).then(res => res.data); };
export const makeDifPriceSubmitFun = params => { return axios.post(`${base}/apply/makeDifPrice`,  params ).then(res => res.data); };
export const sendGoodsSubmitFun = params => { return axios.post(`${base}/apply/sendGoods`,  params ).then(res => res.data); };
export const saveRemitAccountInfoFun = params => { return axios.post(`${base}/apply/saveRemitAccountInfo`,  params ).then(res => res.data); };
export const confirmCusGetMoneyFun = params => { return axios.post(`${base}/apply/confirmCusGetMoney`,  params ).then(res => res.data); };
export const inputPledgeMoneyFun = params => { return axios.post(`${base}/apply/inputPledgeMoney`,  params ).then(res => res.data); };
export const makePledgeMoneyFun = params => { return axios.post(`${base}/apply/makePledgeMoney`,  params ).then(res => res.data); };
export const financeReceiveMoneyFun = params => { return axios.post(`${base}/apply/financeReceiveMoney`,  params ).then(res => res.data); };
export const pledgeGoodsReturnFun = params => { return axios.post(`${base}/apply/pledgeGoodsReturn`,  params ).then(res => res.data); };
export const expireNotPayment = params => { return axios.post(`${base}/apply/expireNotPayment`,  params ).then(res => res.data); };
export const toPurchaseInStorageFun = params => { return axios.post(`${base}/apply/toPurchaseInStorage`,  params ).then(res => res.data); };
export const firstTrialPassFun = params => { return axios.post(`${base}/apply/firstTrialPass`,  params ).then(res => res.data); };
export const getMoneyFun = params => { return axios.post(`${base}/apply/getMoney`,  params ).then(res => res.data); };
export const confirmSendGoodsFun = params => { return axios.post(`${base}/apply/confirmSendGoods`,  params ).then(res => res.data); };
export const cusCollectGoodsFun = params => { return axios.post(`${base}/apply/cusCollectGoods`,  params ).then(res => res.data); };
export const confirmCollectGoodsFun = params => { return axios.post(`${base}/apply/confirmCollectGoods`,  params ).then(res => res.data); };
export const returnDepositMoneyFun = params => { return axios.post(`${base}/apply/returnDepositMoney`,  params ).then(res => res.data); };
//----------业务管理-----------
export const getBusinessList = params => { return axios.post(`${base}/business/list`,  params).then(res => res.data); };
export const editBusiness = params => { return axios.post(`${base}/business/edit`,  params).then(res => res.data); };
export const getBusinessGeneralList = params => { return axios.post(`${base}/business/generalList`,  params).then(res => res.data); };

export const getServiceTypeList = params => { return axios.post(`${base}/city/list`,  params).then(res => res.data); };
export const getCityListData = params => { return axios.post(`${base}/city/getCityList`,  params).then(res => res.data); };
//----------渠道管理-----------
//1.推广列表
export const getSpreadChannelPage = params => { return axios.post(`${base}/spreadManage/getSpreadChannelList`,  params ).then(res => res.data); };
export const shopSpreadChannelList = params => { return axios.post(`${base}/spreadManage/shop/list`,  params ).then(res => res.data); };
export const getQrImage = params => { return axios.get(`${base}/image/createQrcodeImage`,  params ).then(res => res.data); };
//门店管理
//1.获取门店列表
export const getShopListPage = params => { return axios.post(`${base}/shop/getShopListForSpread`,  params ).then(res => res.data); };
//2.禁用门店
export const enableShop = params => { return axios.get(`${base}/shop/enableShopByShopId`,  { params: params } ).then(res => res.data); };
//3.获取推广参数
export const getChaParameter = params => { return axios.get(`${base}/shop/getChaParameter`, { params: params }).then(res => res.data); };
//4.将门店信息同步至渠道参数
export const synchronizationChaParameter = params => { return axios.get(`${base}/shop/synchronizationChaParameter`, { params: params }).then(res => res.data); };
//员工推广列表
export const employeeSpreadChannelList = params => { return axios.post(`${base}/spreadManage/employee/list`,  params ).then(res => res.data); };

//2.禁用该渠道
export const enableSpreadChannel = params => { return axios.post(`${base}/spreadManage/enableSpreadChannel`,   params ).then(res => res.data); };
export const enableSpreadChannelForAccount = params => { return axios.post(`${base}/spreadManage/enableSpreadChannelForAccount`,   params ).then(res => res.data); };
export const enableSpreadChannelInfo = params => { return axios.post(`${base}/spreadManage/enableSpreadChannelInfo`,  params ).then(res => res.data); };
export const enableSpreadChannelInfoForAccount = params => { return axios.post(`${base}/spreadManage/enableSpreadChannelInfoForAccount`,  params ).then(res => res.data); };
//3.获取该渠道的所有渠道信息
export const getSpreadChannelInfoList = params => { return axios.get(`${base}/spreadManage/getSpreadChannelInfoList`,  { params: params } ).then(res => res.data); };
export const getSpreadChannelInfoListForAccount = params => { return axios.get(`${base}/spreadManage/getSpreadChannelInfoListForAccount`,  { params: params } ).then(res => res.data); };
//4.新增渠道
export const addSpreadChannelBase = params => { return axios.post(`${base}/spreadManage/addSpreadChannelBase`,  params ).then(res => res.data); };
export const addSpreadChannelInfo = params => { return axios.post(`${base}/spreadManage/addSpreadChannelInfo`,  params ).then(res => res.data); };
export const addSpreadChannelInfoForAccount = params => { return axios.post(`${base}/spreadManage/addSpreadChannelInfoForAccount`,  params ).then(res => res.data); };
export const synchronizationSpreadChannel = params => { return axios.post(`${base}/spreadManage/synchronizationSpreadChannel`,  { params: params } ).then(res => res.data); };
export const syncAccountToSpreadChannel = params => { return axios.post(`${base}/spreadManage/syncAccountToSpreadChannel`,  { params: params } ).then(res => res.data); };

//---------智能柜管理-----------
export const getSiteList = params => { return axios.post(`${base}/site/list`,  params ).then(res => res.data); };
export const siteIsDelete = params => { return axios.post(`${base}/site/siteIsDelete`,  params ).then(res => res.data); };
export const editSiteCityCode = params => { return axios.post(`${base}/site/editSiteCode`,  params ).then(res => res.data); };
export const siteSynchronous = params => { return axios.post(`${base}/site/siteSynchronous`,  params ).then(res => res.data); };
export const getShopIdByCode = params => { return axios.get(`${base}/servicePoint/getServicePointByAreaCode`,  { params: params } ).then(res => res.data); };
export const getByShopId = params => { return axios.get(`${base}/servicePoint/servicePointInfo`,  { params: params } ).then(res => res.data); };

//会员订单统计
export const getPerNumberPage = params => { return axios.post(`${base}/total/perNumber`,  params ).then(res => res.data); };
export const getAveragePricePage = params => { return axios.post(`${base}/total/averagePrice`,  params ).then(res => res.data); };
export const getPayAveragePricePage = params => { return axios.post(`${base}/total/payAveragePrice`,  params ).then(res => res.data); };
export const getPayAgainPage = params => { return axios.post(`${base}/total/payAgain`,  params ).then(res => res.data); };

//充值管理
export const getRechargeBaseListFun = params => { return axios.post(`${base}/rechargeBase/list`,  params ).then(res => res.data); };
export const deleteRechargeBaseFun = params => { return axios.post(`${base}/rechargeBase/delete`,  params ).then(res => res.data); };
export const addRechargeBaseFun = params => { return axios.post(`${base}/rechargeBase/insert`,  params ).then(res => res.data); };
export const getRechargeActivityFun = params => { return axios.post(`${base}/rechargeActivity/list`,  params ).then(res => res.data); };
export const getById = params => { return axios.get(`${base}/rechargeActivity/query`,  { params: params } ).then(res => res.data); };
export const addOrUpdateFun = params => { return axios.post(`${base}/rechargeActivity/addOrUpdate`,  params ).then(res => res.data); };
export const enableRechargeActivityFun = params => { return axios.post(`${base}/rechargeActivity/editStatus`,  params ).then(res => res.data); };
export const getRechargeListFun = params => { return axios.post(`${base}/getRechargeList`,  params ).then(res => res.data); };
export const getRechargeTotalFun = params => { return axios.post(`${base}/getRechargeTotal`,  params ).then(res => res.data); };


//----------加工厂管理-----------
export const getPlantList = params => { return axios.post(`${base}/plantInfo/list`,  params).then(res => res.data); };
export const updatePlantInfo = params => { return axios.post(`${base}/plantInfo/update`,  params).then(res => res.data); };
export const updatePlantInfoStatus = params => { return axios.post(`${base}/plantInfo/updateStatus`,  params).then(res => res.data); };
export const logicDeletePlantInfo = params => { return axios.post(`${base}/plantInfo/logicDelete`,  params).then(res => res.data); };
export const addPlantInfo = params => { return axios.post(`${base}/plantInfo/add`,  params).then(res => res.data); };

// 获取服务站点列表
export const getServiceStationsFun = params => { return axios.get(`${base}/serviceStation/list`, { params: params } ).then(res => res.data); };
// 获取分区设置列表
export const getServicePartitionsFun = params => { return axios.get(`${base}/servicepartition/list`,  { params: params } ).then(res => res.data); };
// 保存分区
export const savePartitionsFun = params => { return axios.post(`${base}/servicepartition/save`,  params ).then(res => res.data); };
// 删除指定分区
export const deletePartitionsFun = params => { return axios.get(`${base}/servicepartition/delete`,  { params: params } ).then(res => res.data); };
// 获取服务点信息
export const getStationDetailFun = params => { return axios.get(`${base}/servicePoint/servicePointInfo`,  { params: params } ).then(res => res.data); };

//----------服务点管理-----------
export const getServicePointList = params => { return axios.post(`${base}/servicePoint/list`,  params).then(res => res.data); };
export const getServicePointInfoById = params => { return axios.get(`${base}/servicePoint/servicePointInfo`,  { params: params }).then(res => res.data); };
export const updateServicePoint = params => { return axios.post(`${base}/servicePoint/update`,  params).then(res => res.data); };
export const getOrgListByTypeAndBusinessType = params => { return axios.post(`${base}/org/getOrgListByTypeAndBusinessType`,  params).then(res => res.data); };
export const addServicePoint = params => { return axios.post(`${base}/servicePoint/add`,  params).then(res => res.data); };
export const getMachiningCenterListFun = params => { return axios.get(`${base}/servicePoint/getPlantList`,  { params: params } ).then(res => res.data); };
export const getReassignServicePointFun = params => { return axios.get(`${base}/servicePoint/getServicePointList`, { params: params }).then(res => res.data); };
export const updateServicePointStatus = params => { return axios.post(`${base}/servicePoint/updateStatus`,  params).then(res => res.data); };
//统计模块
export const getCountRegFun = params => { return axios.post(`${base}/memberTotal/countReg`,  params ).then(res => res.data); };
export const getRetentionRatePage = params => { return axios.post(`${base}/memberTotal/retentionRate`,  params ).then(res => res.data); };
export const getRegMapFun = params => { return axios.post(`${base}/memberTotal/regMap`,  params ).then(res => res.data); };
export const getCityListFun = params => { return axios.post(`${base}/memberTotal/cityList`,  params ).then(res => res.data); };
export const getRegMemberFun = params => { return axios.post(`${base}/memberTotal/regMember`,  params ).then(res => res.data); };
export const getBusyMemberFun = params => { return axios.post(`${base}/memberTotal/busyMember`,  params ).then(res => res.data); };

//推广统计
export const getSpreadChannelFun = params => { return axios.post(`${base}/memberTotal/spreadChannel`,  params ).then(res => res.data); };
export const getSpreadChannelInfoFun = params => { return axios.post(`${base}/memberTotal/spreadChannelInfo`,  params ).then(res => res.data); };
export const getSpreadChannelUserInfoFun = params => { return axios.post(`${base}/memberTotal/spreadChannelUserInfo`,  params ).then(res => res.data); };

//----------会员等级管理-----------
export const getWealthRecordList = params => { return axios.post(`${base}/rule/getWealthRecordList`,  params).then(res => res.data); };
export const editWealthRecord = params => { return axios.post(`${base}/rule/editWealthRecord`,  params).then(res => res.data); };
export const getRuleListForIntegralLevel = params => { return axios.post(`${base}/rule/getRuleList`,  params).then(res => res.data); };
export const insertRule = params => { return axios.post(`${base}/rule/insert`,  params).then(res => res.data); };
export const updateRule = params => { return axios.post(`${base}/rule/update`,  params).then(res => res.data); };

//财务管理
export const getFinanceFun = params => { return axios.post(`${base}/finance/list`,  params ).then(res => res.data); };
export const getSelfOrderTotalFun = params => { return axios.post(`${base}/finance/selfOrderTotal`,  params ).then(res => res.data); };
export const getTurnoverFun = params => { return axios.post(`${base}/finance/turnover`,  params ).then(res => res.data); };
export const getTurnoverTotalInfoFun = params => { return axios.post(`${base}/finance/getTurnoverTotalInfo`,  params ).then(res => res.data); };
export const exportFinanceFun = params => { return axios.post(`${base}/finance/exportFinance`,  params ).then(res => res.data); };
//支付账单
export const getBillFun = params => { return axios.post(`${base}/bill/getList`,  params ).then(res => res.data); };

//配送员调度
export const getOrderAssignPage = params => { return axios.post(`${base}/order/orderAssign`,  params ).then(res => res.data); };
export const getServicePointListFun = params => { return axios.get(`${base}/servicePoint/getServicePointList`,  {params:params} ).then(res => res.data); };
export const getDispatchListPage = params => { return axios.post(`${base}/servicePoint/getDispatchList`,  params ).then(res => res.data); };
export const orderDispatchFun = params => { return axios.post(`${base}/order/orderDispatch`,  params ).then(res => res.data); };

export const orderDispatchShopFun = params => { return axios.post(`${base}/order/orderDispatchShop`,  params ).then(res => res.data); };
export const getOrderReassignFun = params => { return axios.post(`${base}/order/orderReassign`,  params ).then(res => res.data); };

//-------- 版本管理
export const getVersionList = params => { return axios.post(`${base}/version/list`,  params).then(res => res.data); };
export const addVersion = params => { return axios.post(`${base}/version/add`,  params).then(res => res.data); };
export const enableVersion = params => { return axios.post(`${base}/version/enable?id=`+params,  params).then(res => res.data); };
export const disableVersion = params => { return axios.post(`${base}/version/disable?id=`+params,  params).then(res => res.data); };
export const delVersion = params => { return axios.post(`${base}/version/delete?id=`+params, params).then(res => res.data); };
export const versionTypeList = params => { return axios.post(`${base}/version/typeList`, params).then(res => res.data); };
export const getVersion = params => { return axios.post(`${base}/version/get?id=`+params).then(res => res.data); };
export const editVersion = params => { return axios.post(`${base}/version/edit`,  params).then(res => res.data); };

//服务设置
export const getFeedBackList = params => { return axios.post(`${base}/feedback/list`,  params ).then(res => res.data); };
export const deleteFeedBackFun = params => { return axios.post(`${base}/feedback/remove`,  params ).then(res => res.data); };
export const getProlemList = params => { return axios.post(`${base}/problem/list`,  params ).then(res => res.data); };
export const deleteProblemFun = params => { return axios.post(`${base}/problem/remove`,  params ).then(res => res.data); };
export const addProblemFun = params => { return axios.post(`${base}/problem/add`,  params ).then(res => res.data); };
export const editProblemFun = params => { return axios.post(`${base}/problem/edit`,  params ).then(res => res.data); };
export const addServiceIntroduce = params => { return axios.post(`${base}/serIntroduce/add`,  params ).then(res => res.data); };
export const getServiceIntroduceList = params => { return axios.post(`${base}/serIntroduce/list`,  params ).then(res => res.data); };
export const editServiceIntroduce = params => { return axios.post(`${base}/serIntroduce/edit`,  params ).then(res => res.data); };
export const isUse = params => { return axios.post(`${base}/serIntroduce/changStatus`,  params ).then(res => res.data); };
export const deleteServiceIntroduceFun = params => { return axios.post(`${base}/serIntroduce/remove`,  params ).then(res => res.data); };

//系统信息
export const addUserAgreementFun = params => { return axios.post(`${base}/sysInfo/add`,  params ).then(res => res.data); };
export const updateUserAgreementFun = params => { return axios.post(`${base}/sysInfo/edit`,  params ).then(res => res.data); };
export const getSysInfoList = params => { return axios.post(`${base}/sysInfo/list`,  params ).then(res => res.data); };
export const getSysListFun = params => { return axios.post(`${base}/sysInfo/list`,  params ).then(res => res.data); };
export const addSysFun = params => { return axios.post(`${base}/sysInfo/add`,  params ).then(res => res.data); };
export const editSysFun = params => { return axios.post(`${base}/sysInfo/edit`,  params ).then(res => res.data); };
export const deleteSysFun = params => { return axios.post(`${base}/sysInfo/remove`,  params ).then(res => res.data); };
export const seeFun = params => { return axios.get(`${base}/sysInfo/see`,  {params:params} ).then(res => res.data); };
//普通图片上传
export const uploadOthers = params => { return axios.post(`${base}/file/uploadOthers`,  params ).then(res => res.data); };
//短信推送
export const getMsgCityList = params => { return axios.post(`${base}/msg/cityList`,  params ).then(res => res.data); };
export const sendMsg = params => { return axios.post(`${base}/msg/sendList`,  params ).then(res => res.data); };
export const getMsgUserList = params => { return axios.post(`${base}/msg/userList`,  params ).then(res => res.data); };

//活动渠道管理
export const getChannelTypeList = params => { return axios.post(`${base}/channelType/list`,  params ).then(res => res.data); };
export const addChannelType = params => { return axios.post(`${base}/channelType/add`,  params ).then(res => res.data); };
export const updateChannelTypeStatus = params => { return axios.post(`${base}/channelType/updateStatus`,  params ).then(res => res.data); };

//优惠券管理
export const getCouponList = params => { return axios.post(`${base}/couponType/list`,  params ).then(res => res.data); };
export const addCoupon = params => { return axios.post(`${base}/couponType/add`,  params ).then(res => res.data); };
export const editCoupon = params => { return axios.post(`${base}/couponType/edit`,  params ).then(res => res.data); };
export const deleteCoupon = params => { return axios.post(`${base}/couponType/flagDel`,  params ).then(res => res.data); };

//优惠券活动接口
/*活动列表数据*/
export const getCouponActivityList = params => { return axios.post(`${base}/couponActivity/list`,  params ).then(res => res.data); };
/*统计数量数据*/
export const getAllCount = params => { return axios.post(`${base}/couponActivity/getAllCount`,  params ).then(res => res.data); };
/*获取渠道类型*/
export const getChannel = params => { return axios.post(`${base}/channelType/listNoPage`,  params ).then(res => res.data); };
/*新增活动列表*/
export const addCouponActivity = params => { return axios.post(`${base}/couponActivity/add`,  params ).then(res => res.data); };
//优惠券类型和id
export const getCouponType = params => { return axios.post(`${base}/couponType/couponContent`,  params ).then(res => res.data); };
//根据id获取当前数据
export const getCouponActivityById = params => { return axios.post(`${base}/couponActivity/query`,  params ).then(res => res.data); };
//审核接口
export const checkActivity = params => { return axios.post(`${base}/couponActivity/check`,  params ).then(res => res.data); };
//编辑接口
export const editActivity = params => { return axios.post(`${base}/couponActivity/edit`,  params ).then(res => res.data); };
//删除接口
export const removeActivity = params => { return axios.post(`${base}/couponActivity/remove`,  params ).then(res => res.data); };
//终止接口
export const forbidActivity = params => { return axios.post(`${base}/couponActivity/forbid`,  params ).then(res => res.data); };


//兑换码管理

/*查询兑换码列表*/
export const getRedeemCode = params => { return axios.post(`${base}/redeemCode/list`,  params ).then(res => res.data); };
/*获取未过期活动*/
export const getEffectiveActivity = params => { return axios.post(`${base}/couponActivity/getActivityList`,  params ).then(res => res.data); };
/*获取所有活动*/
export const getAllActivityList = params => { return axios.post(`${base}/couponActivity/getAllActivityList`,  params ).then(res => res.data); };
/*新增兑换码*/
export const addRedeemCode = params => { return axios.post(`${base}/redeemCode/add`,  params ).then(res => res.data); };
/*查询兑换码*/
export const getRedeemCodeById = params => { return axios.post(`${base}/redeemCode/query`,  params ).then(res => res.data); };
/*删除兑换码*/
export const removeRedeemCode = params => { return axios.post(`${base}/redeemCode/remove`,  params ).then(res => res.data); };
export const exportCount = params => { return axios.post(`${base}/redeemCode/exportCount`,  params ).then(res => res.data); };

//优惠券信息导出
export const couponInfoExport = params => { return axios.post(`${base}/couponInfo/export`,  params ).then(res => res.data); };
//优惠券信息数目
export const couponInfoCount = params => { return axios.post(`${base}/couponInfo/count`,  params ).then(res => res.data); };
//优惠券信息列表
export const couponInfoList = params => { return axios.post(`${base}/couponInfo/listAuto`,  params ).then(res => res.data); };
//优惠券信息列表2
export const couponInfoListSelf = params => { return axios.post(`${base}/couponInfo/listSelf`,  params ).then(res => res.data); };

//统计数据接口
export const getActivityCountList = params => { return axios.post(`${base}/couponActivity/getCountList`,  params ).then(res => res.data); };


//兑换码列表
export const getRedeemCodeCountList = params => { return axios.post(`${base}/redeemCodeCount/list`,  params ).then(res => res.data); };

export const getActivityInfo = params => { return axios.post(`${base}/redeemCodeCount/getActivityInfo`,  params ).then(res => res.data); };
export const getCityNameList = params => { return axios.post(`${base}/redeemCodeCount/getCityName`,  params ).then(res => res.data); };
export const getExportCount = params => { return axios.post(`${base}/redeemCodeCount/exportCount`,  params ).then(res => res.data); };
//获取信息类别接口
export const getInfoTypelist = params => { return axios.post(`${base}/sysInfo/getInfoTypelist`,  params ).then(res => res.data); };


//商品销售统计
export const getGoodsSaleList = params => { return axios.post(`${base}/goodsale/list`,  params ).then(res => res.data); };
export const getGoodsSaleCount = params => { return axios.post(`${base}/goodsale/count`,  params ).then(res => res.data); };
export const getCityName = params => { return axios.post(`${base}/goodsale/getCityName`,  params ).then(res => res.data); };

//商品分析统计
export const getGoodsAnalysisList = params => { return axios.post(`${base}/goodsAnalysis/list`,  params ).then(res => res.data); };
export const getGoodsAnalysisCount = params => { return axios.post(`${base}/goodsAnalysis/count`,  params ).then(res => res.data); };

//销售周期配置管理
export const getPeriod = params => { return axios.post(`${base}/productAnalysis/list`,  params ).then(res => res.data); };
export const updatePeriod = params => { return axios.post(`${base}/productAnalysis/update`,  params ).then(res => res.data); };

// 支付方式管理
export const getPayMannerList = params => { return axios.post(`${base}/payManner/list`,  params).then(res => res.data); };
export const removePayManner = params => { return axios.post(`${base}/payManner/remove`, params ).then(res => res.data); };
export const editPayManner = params => { return axios.post(`${base}/payManner/edit`, params ).then(res => res.data); };
export const addPayManner = params => { return axios.post(`${base}/payManner/add`,  params ).then(res => res.data); };
export const updatePayMannerStatus = params => { return axios.post(`${base}/payManner/updatePayMannerStatus`,  params ).then(res => res.data); };
//内容管理
export const getContentCategoryListFun = params => { return axios.post(`${base}/contentCategory/list`,  params ).then(res => res.data); };
export const getSelectListFun = params => { return axios.post(`${base}/contentCategory/selectList`,  params ).then(res => res.data); };
export const addContentCategoryFun = params => { return axios.post(`${base}/contentCategory/add`,  params ).then(res => res.data); };
export const queryContentCategoryById = params => { return axios.post(`${base}/contentCategory/query`,  params ).then(res => res.data); };
export const editContentCategoryFun = params => { return axios.post(`${base}/contentCategory/edit`,  params ).then(res => res.data); };
export const removeContentCategoryFun = params => { return axios.post(`${base}/contentCategory/remove`,  params ).then(res => res.data); };
export const getContentCategoryFun = params => { return axios.post(`${base}/contentCategory/getListByTypeId`,  params ).then(res => res.data); };
  //内容管理----应用管理
export const getAppList = params => { return axios.post(`${base}/contentAppSet/list`,  params ).then(res => res.data); };
export const getDisable = params => { return axios.post(`${base}/contentAppSet/disable`,  params ).then(res => res.data); };
export const addIndex = params => { return axios.post(`${base}/contentAppSet/add`,  params ).then(res => res.data); };
export const updateIndex = params => { return axios.post(`${base}/contentAppSet/edit`,  params ).then(res => res.data); };
//内容管理----文章信息管理
export const getContentListFun = params => { return axios.post(`${base}/contentInfo/list`,  params ).then(res => res.data); };
export const addContentFun = params => { return axios.post(`${base}/contentInfo/add`,  params ).then(res => res.data); };
export const editContentFun = params => { return axios.post(`${base}/contentInfo/edit`,  params ).then(res => res.data); };
export const updateContentFun = params => { return axios.post(`${base}/contentInfo/updateState`,  params ).then(res => res.data); };
export const getContentCategoryListForDictFun = params => { return axios.post(`${base}/contentCategory/getContentCategoryListForDict`,  params ).then(res => res.data); };