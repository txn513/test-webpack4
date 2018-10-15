const RESP_CODE ={
    SUCCESS: 1
    ,ERROR: 2
    ,AUTHFAIL: 3
    ,VALIDFAIL: 4
    ,UPDATEVER: 5
    ,NOTPOPEDOM: 6
    ,NOT_DATA_POPEDOM: 7
};
const CONSTANT_DATA = {
    PAGESIZE: 20,
}


function isResonseSuccess (data) {
   return data.code === RESP_CODE.SUCCESS;
}

function deepCopy(obj) {
    return JSON.parse(JSON.stringify(obj));
}

function getImgUrl(urlRelativePath) {
    return process.env.IMG_URL + urlRelativePath;
}
function getImgRelativeUrl(urlRelativePath) {
    return urlRelativePath;
}

export default
{
    RESP_CODE,
    CONSTANT_DATA,
    isResonseSuccess,
    getImgUrl,
    getImgRelativeUrl,
    deepCopy
}