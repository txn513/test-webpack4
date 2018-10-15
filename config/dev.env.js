var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
    NODE_ENV: '"development"'
    ,API_ROOT: '"http://192.168.1.132:6001/scm/api/v1"'
    ,TEST_USERNAME: '"admin"'
    ,TEST_PASSWORD: '"123456"'
    ,API_FLAGSTRING: '"-dev"'
    ,DEMO_MENU: true
    ,IMG_URL: '"http://test.sinter.cn/upload_scloud"'
    ,APP_QRCode : '"http://test.sinter.cn/appchannel/appchannel.html?chid="'
})

